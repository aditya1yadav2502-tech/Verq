import { GitHubRepo, RepoDetails } from "./github";
import { GoogleGenerativeAI } from "@google/generative-ai";

export interface ScoreBreakdown {
  code_quality: number;
  project_complexity: number;
  commit_consistency: number;
  documentation: number;
  deployment: number;
  overall: number;
  recommended_projects?: { title: string; description: string }[];
}

const WEIGHTS = {
  code_quality: 0.2,
  project_complexity: 0.25,
  commit_consistency: 0.25,
  documentation: 0.15,
  deployment: 0.15,
};

function clamp(value: number, min = 0, max = 100): number {
  return Math.round(Math.max(min, Math.min(max, value)));
}

/**
 * Code Quality — measures language diversity, repo sizes, and community validation (stars)
 */
function scoreCodeQuality(
  repos: GitHubRepo[],
  repoDetails: RepoDetails[]
): number {
  if (repos.length === 0) return 0;

  // Language diversity: how many unique languages across all repos
  const allLanguages = new Set<string>();
  for (const detail of repoDetails) {
    for (const lang of Object.keys(detail.languages)) {
      allLanguages.add(lang);
    }
  }
  // 1 lang = 10, 3 = 30, 5+ = 50 (max 50 pts for diversity)
  const langScore = Math.min(allLanguages.size * 10, 50);

  // Stars: social validation of code quality
  const totalStars = repos.reduce((s, r) => s + r.stargazers_count, 0);
  // 0 stars = 0, 5 = 15, 10+ = 25 (max 25 pts)
  const starScore = Math.min(totalStars * 5, 25);

  // Repo size: non-trivial projects (avg size > 100KB is solid)
  const avgSize = repos.reduce((s, r) => s + r.size, 0) / repos.length;
  // Scale: 0-50KB = 5, 50-200KB = 15, 200KB+ = 25 (max 25 pts)
  const sizeScore =
    avgSize > 200 ? 25 : avgSize > 50 ? 15 : avgSize > 10 ? 5 : 0;

  return clamp(langScore + starScore + sizeScore);
}

/**
 * Project Complexity — measures depth and breadth of projects
 */
function scoreProjectComplexity(
  repos: GitHubRepo[],
  repoDetails: RepoDetails[]
): number {
  if (repos.length === 0) return 0;

  // Number of non-fork repos (having multiple projects shows builder mentality)
  // 1 repo = 10, 3 = 25, 5 = 35, 10+ = 45 (max 45 pts)
  const repoCountScore =
    repos.length >= 10
      ? 45
      : repos.length >= 5
        ? 35
        : repos.length >= 3
          ? 25
          : 10;

  // Per-repo language count (multi-language repos are more complex)
  const avgLangsPerRepo =
    repoDetails.reduce((s, d) => s + Object.keys(d.languages).length, 0) /
    repoDetails.length;
  // 1 lang = 5, 2 = 15, 3+ = 30 (max 30 pts)
  const langComplexity =
    avgLangsPerRepo >= 3 ? 30 : avgLangsPerRepo >= 2 ? 15 : 5;

  // Forks received (others forking your project = complex and useful)
  const totalForks = repos.reduce((s, r) => s + r.forks_count, 0);
  // 0 = 0, 2 = 10, 5+ = 25 (max 25 pts)
  const forkScore = Math.min(totalForks * 5, 25);

  return clamp(repoCountScore + langComplexity + forkScore);
}

/**
 * Commit Consistency — measures regular coding activity over the past 90 days
 */
function scoreCommitConsistency(repoDetails: RepoDetails[]): number {
  // Gather all commits across repos from last 90 days
  const allCommits = repoDetails.flatMap((d) => d.recentCommits);
  const totalCommits = allCommits.length;

  if (totalCommits === 0) return 0;

  // Total commit volume: 10 = 15, 30 = 35, 60+ = 50 (max 50 pts)
  const volumeScore =
    totalCommits >= 60
      ? 50
      : totalCommits >= 30
        ? 35
        : totalCommits >= 10
          ? 15
          : 5;

  // Weekly spread: how many distinct weeks had commits (out of ~13 weeks in 90 days)
  const weeks = new Set<string>();
  for (const commit of allCommits) {
    const date = new Date(commit.commit.author.date);
    const weekKey = `${date.getFullYear()}-W${getWeekNumber(date)}`;
    weeks.add(weekKey);
  }
  // Spread across weeks: 1 week = 5, 4 = 15, 8 = 30, 12+ = 50 (max 50 pts)
  const spreadScore =
    weeks.size >= 12
      ? 50
      : weeks.size >= 8
        ? 30
        : weeks.size >= 4
          ? 15
          : 5;

  return clamp((volumeScore + spreadScore));
}

/**
 * Documentation — measures README presence and quality
 */
function scoreDocumentation(repoDetails: RepoDetails[]): number {
  if (repoDetails.length === 0) return 0;

  // % of repos with a README
  const withReadme = repoDetails.filter((d) => d.hasReadme).length;
  const readmeRatio = withReadme / repoDetails.length;
  // 0% = 0, 50% = 25, 80% = 45, 100% = 60 (max 60 pts)
  const presenceScore =
    readmeRatio >= 1
      ? 60
      : readmeRatio >= 0.8
        ? 45
        : readmeRatio >= 0.5
          ? 25
          : readmeRatio > 0
            ? 10
            : 0;

  // Average README length (in bytes) — longer = more detailed
  const readmeLengths = repoDetails
    .filter((d) => d.hasReadme)
    .map((d) => d.readmeLength);
  const avgReadmeLength =
    readmeLengths.length > 0
      ? readmeLengths.reduce((s, l) => s + l, 0) / readmeLengths.length
      : 0;
  // < 200 bytes = 5, 200-1000 = 15, 1000-3000 = 25, 3000+ = 40 (max 40 pts)
  const qualityScore =
    avgReadmeLength >= 3000
      ? 40
      : avgReadmeLength >= 1000
        ? 25
        : avgReadmeLength >= 200
          ? 15
          : avgReadmeLength > 0
            ? 5
            : 0;

  return clamp(presenceScore + qualityScore);
}

/**
 * Deployment — measures if projects are actually shipped/deployed
 */
function scoreDeployment(
  repos: GitHubRepo[],
  repoDetails: RepoDetails[]
): number {
  if (repos.length === 0) return 0;

  // Repos with deployment config files
  const withDeploy = repoDetails.filter(
    (d) => d.deploymentFiles.length > 0
  ).length;
  const deployRatio = withDeploy / repoDetails.length;
  // 0% = 0, 20% = 20, 40% = 35, 60%+ = 50 (max 50 pts)
  const configScore =
    deployRatio >= 0.6
      ? 50
      : deployRatio >= 0.4
        ? 35
        : deployRatio >= 0.2
          ? 20
          : deployRatio > 0
            ? 10
            : 0;

  // Repos with homepage URL set (published somewhere)
  const withHomepage = repos.filter(
    (r) => r.homepage && r.homepage.trim() !== ""
  ).length;
  const homepageRatio = withHomepage / repos.length;
  // max 25 pts
  const homepageScore = Math.min(Math.round(homepageRatio * 50), 25);

  // GitHub Pages enabled
  const withPages = repos.filter((r) => r.has_pages).length;
  const pagesRatio = withPages / repos.length;
  // max 25 pts
  const pagesScore = Math.min(Math.round(pagesRatio * 50), 25);

  return clamp(configScore + homepageScore + pagesScore);
}

function getWeekNumber(d: Date): number {
  const start = new Date(d.getFullYear(), 0, 1);
  const diff = d.getTime() - start.getTime();
  return Math.ceil((diff / 86400000 + start.getDay() + 1) / 7);
}

/**
 * Fallback heuristic scoring function (used if Gemini is missing or fails)
 */
function calculateHeuristicScores(
  repos: GitHubRepo[],
  repoDetails: RepoDetails[]
): ScoreBreakdown {
  const code_quality = scoreCodeQuality(repos, repoDetails);
  const project_complexity = scoreProjectComplexity(repos, repoDetails);
  const commit_consistency = scoreCommitConsistency(repoDetails);
  const documentation = scoreDocumentation(repoDetails);
  const deployment = scoreDeployment(repos, repoDetails);

  const overall = clamp(
    Math.round(
      code_quality * WEIGHTS.code_quality +
        project_complexity * WEIGHTS.project_complexity +
        commit_consistency * WEIGHTS.commit_consistency +
        documentation * WEIGHTS.documentation +
        deployment * WEIGHTS.deployment
    )
  );

  // Generate smart fallback recommendations based on weakest dimensions
  const fallbackRecs: { title: string; description: string }[] = [];
  const dims = [
    { name: "Code quality", score: code_quality, fix: { title: "Improve code quality", description: `Your code quality score is ${code_quality}/100. Add TypeScript types, use ESLint, and write modular functions across your repos to push this above 70.` }},
    { name: "Project complexity", score: project_complexity, fix: { title: "Build a more complex project", description: `Your project complexity score is ${project_complexity}/100. Ship a full-stack app with auth, a database, and an API layer to demonstrate real engineering depth.` }},
    { name: "Commit consistency", score: commit_consistency, fix: { title: "Commit more consistently", description: `Your commit consistency score is ${commit_consistency}/100. Push at least 3-5 commits per week across your active repos to show a steady shipping cadence.` }},
    { name: "Documentation", score: documentation, fix: { title: "Write better READMEs", description: `Your documentation score is ${documentation}/100. Add detailed READMEs with setup instructions, architecture diagrams, and screenshots to your top 3 repos.` }},
    { name: "Deployment", score: deployment, fix: { title: "Deploy your projects live", description: `Your deployment score is ${deployment}/100. Add a working Vercel/Netlify deploy link and a CI/CD GitHub Action to your main repo to instantly boost this.` }},
  ];
  dims.sort((a, b) => a.score - b.score);
  for (let i = 0; i < 3 && i < dims.length; i++) {
    fallbackRecs.push(dims[i].fix);
  }

  return {
    code_quality,
    project_complexity,
    commit_consistency,
    documentation,
    deployment,
    overall,
    recommended_projects: fallbackRecs
  };
}

/**
 * Main AI scoring function — dynamically grades the profile using Gemini 1.5
 */
export async function calculateScores(
  repos: GitHubRepo[],
  repoDetails: RepoDetails[],
  previousScore: number = 0
): Promise<ScoreBreakdown> {
  const heuristicScores = calculateHeuristicScores(repos, repoDetails);

  if (!process.env.GEMINI_API_KEY) {
    return heuristicScores;
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const profileSummary = repos.map((r, i) => {
      const details = repoDetails[i];
      return {
        name: r.name,
        description: r.description,
        stars: r.stargazers_count,
        language: r.language,
        languages: details ? Object.keys(details.languages) : [],
        hasReadme: details ? details.hasReadme : false,
        readmeSize: details ? details.readmeLength : 0,
        recentCommits: details ? details.recentCommits.length : 0,
        deployments: details ? details.deploymentFiles.length : 0,
      };
    });

    const prompt = `You are an elite, brutally strict senior engineering manager evaluating a candidate's GitHub profile. 
Based on their repository data below, grade their skill level from 0 to 100 on five distinct axes according to these rules:
- Code Quality: Reward diverse languages, architectural descriptions, and stars.
- Project Complexity: Reward deep, multi-file projects over shallow forks.
- AI Detection Penalty: If the repository data suggests heavy AI bootstrapping (very few, massive commits instead of natural iterative human workflows), severely penalize the overall score and code quality.
- Commit Consistency: Reward high commit volume across recent weeks.
- Documentation: Reward long, detailed READMEs.
- Deployment: Reward repos with homepages and github pages.
- Overall: Provide a realistic aggregate score.

CRITICAL CONTEXT: The candidate's previous Verqify score was ${previousScore}. They just clicked "Rescore" after making updates to their profile. You MUST evaluate their new data relative to this baseline. If they added new repositories, wrote more commits, or added READMEs/deployments, you MUST tangibly increase their overall score above ${previousScore} to reward their progress. Do not let the score stagnate if there is new activity!

CRITICAL: You must also analyze their weakest areas across the 5 dimensions. Instead of generic project ideas, generate exactly 3 highly specific, actionable steps the candidate should take right now to directly improve their score. For example: "Your deployment score is 25. Adding a working Vercel deploy link and a CI workflow to your main repo will bump it to 85."

Return ONLY a strictly valid JSON object exactly matching this interface (no markdown tags, no backticks):
{"code_quality": number, "project_complexity": number, "commit_consistency": number, "documentation": number, "deployment": number, "overall": number, "recommended_projects": [{"title": "String (e.g. 'Deploy main repo to Vercel')", "description": "String (1-2 sentences explaining exactly what to do and how it will improve their specific score)"}]}

Data: ${JSON.stringify(profileSummary).substring(0, 8000)}`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: "application/json" },
    });

    const text = result.response.text();
    const aiScores = JSON.parse(text) as ScoreBreakdown;
    
    return {
      code_quality: clamp(aiScores.code_quality),
      project_complexity: clamp(aiScores.project_complexity),
      commit_consistency: clamp(aiScores.commit_consistency),
      documentation: clamp(aiScores.documentation),
      deployment: clamp(aiScores.deployment),
      overall: clamp(aiScores.overall),
      recommended_projects: aiScores.recommended_projects || [],
    };
  } catch (err) {
    console.error("Gemini AI failed, falling back to heuristics:", err);
    return heuristicScores;
  }
}

export function getRelativeRanking(score: number, language?: string): string {
  const langStr = language ? ` in ${language}` : " overall";
  if (score >= 95) return `Top 1%${langStr}`;
  if (score >= 90) return `Top 5%${langStr}`;
  if (score >= 80) return `Top 12%${langStr}`;
  if (score >= 70) return `Top 25%${langStr}`;
  if (score >= 60) return `Top 40%${langStr}`;
  return `Building momentum${langStr}`;
}
