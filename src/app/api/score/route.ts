import { NextRequest, NextResponse } from "next/server";
import { fetchUserRepos, fetchRepoDetails } from "@/lib/github";
import { calculateScores } from "@/lib/scoring";
import { supabase } from "@/lib/supabase";

// Simple in-memory rate limiting
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5; // max requests
const WINDOW_MS = 60 * 1000; // per minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }

  if (entry.count >= RATE_LIMIT) {
    return false;
  }

  entry.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Rate limit check
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "unknown";
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again in a minute." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { github_url } = body;

    if (!github_url || typeof github_url !== "string") {
      return NextResponse.json(
        { error: "github_url is required" },
        { status: 400 }
      );
    }

    // 1. Fetch repos
    const repos = await fetchUserRepos(github_url);

    if (repos.length === 0) {
      return NextResponse.json(
        { error: "No public repositories found for this GitHub user" },
        { status: 404 }
      );
    }

    // 2. Fetch details for top 10 most recently pushed repos (to stay within rate limits)
    const topRepos = repos.slice(0, 10);
    const repoDetails = await Promise.all(
      topRepos.map((repo) => fetchRepoDetails(repo.full_name))
    );

    // 3. Calculate scores
    const scores = calculateScores(topRepos, repoDetails);

    // 4. Extract rich insights (Top Languages & Top Repos)
    const languageBytes: Record<string, number> = {};
    repoDetails.forEach(detail => {
      Object.entries(detail.languages).forEach(([lang, bytes]) => {
        languageBytes[lang] = (languageBytes[lang] || 0) + bytes;
      });
    });
    const languages = Object.entries(languageBytes)
      .sort((a, b) => b[1] - a[1]) // highest first
      .map(([name, bytes]) => ({ name, bytes }));

    const sortedRepos = [...topRepos].sort((a, b) => 
      (b.stargazers_count * 2 + b.forks_count) - (a.stargazers_count * 2 + a.forks_count)
    );
    const top_repos = sortedRepos.slice(0, 3).map(r => ({
      name: r.name,
      description: r.description,
      url: `https://github.com/${r.full_name}`,
      stars: r.stargazers_count,
      language: r.language
    }));

    // 5. Upsert into Supabase
    const { error: dbError } = await supabase
      .from("students")
      .update({
        verq_score: scores.overall,
        score_code_quality: scores.code_quality,
        score_project_complexity: scores.project_complexity,
        score_commit_consistency: scores.commit_consistency,
        score_documentation: scores.documentation,
        score_deployment: scores.deployment,
        scored_at: new Date().toISOString(),
        top_repos,
        languages
      })
      .eq("github_url", github_url);

    if (dbError) {
      console.error("Supabase update error:", dbError);
      return NextResponse.json({
        scores,
        warning: "Scores calculated but failed to save to database",
      });
    }

    return NextResponse.json({ scores });
  } catch (error) {
    console.error("Scoring error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
