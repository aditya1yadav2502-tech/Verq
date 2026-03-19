import { NextRequest, NextResponse } from "next/server";
import { fetchUserRepos, fetchRepoDetails } from "@/lib/github";
import { calculateScores } from "@/lib/scoring";
import { createClient } from "@/lib/supabase/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Initialize Redis and Ratelimit only if URLs are provided (graceful fallback)
let ratelimit: Ratelimit | null = null;
if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
  
  // Create a new ratelimiter that allows 3 requests per 1 minute per IP
  ratelimit = new Ratelimit({
    redis: redis,
    limiter: Ratelimit.slidingWindow(3, "1 m"),
  });
}

export async function POST(request: NextRequest) {
  try {
    // Production Rate limit check
    if (ratelimit) {
      const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
      const { success } = await ratelimit.limit(`ratelimit_${ip}`);
      if (!success) {
        return NextResponse.json(
          { error: "Too many scoring requests. Please try again in 1 minute." },
          { status: 429 }
        );
      }
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

    // 3. Calculate scores via AI
    const scores = await calculateScores(topRepos, repoDetails);

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
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user || !user.email) {
      return NextResponse.json({ error: "Unauthorized. Please log in to score your GitHub." }, { status: 401 });
    }

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
        languages,
        recommended_projects: scores.recommended_projects || []
      })
      .eq("email", user.email);

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
