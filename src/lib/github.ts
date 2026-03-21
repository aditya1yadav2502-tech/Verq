const GITHUB_API = "https://api.github.com";

function getHeaders(): HeadersInit {
  const headers: HeadersInit = {
    Accept: "application/vnd.github.v3+json",
  };
  const token = process.env.GITHUB_TOKEN;
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

export interface GitHubRepo {
  name: string;
  full_name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  size: number; // KB
  has_pages: boolean;
  homepage: string | null;
  updated_at: string;
  pushed_at: string;
  fork: boolean;
}

export interface RepoCommit {
  sha: string;
  commit: {
    message: string;
    author: {
      date: string;
    };
  };
}

export interface RepoDetails {
  languages: Record<string, number>;
  recentCommits: RepoCommit[];
  hasReadme: boolean;
  readmeLength: number;
  deploymentFiles: string[];
}

function extractUsername(githubUrl: string): string {
  const url = githubUrl.replace(/\/+$/, "");
  const parts = url.split("/");
  return parts[parts.length - 1];
}

async function ghFetch<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${GITHUB_API}${path}`, {
      headers: getHeaders(),
      next: { revalidate: 0 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function fetchUserRepos(
  githubUrl: string
): Promise<GitHubRepo[]> {
  const username = extractUsername(githubUrl);
  const repos = await ghFetch<GitHubRepo[]>(
    `/users/${username}/repos?sort=pushed&per_page=30&type=owner`
  );
  if (!repos) return [];
  // Filter out forks to focus on original work
  return repos.filter((r) => !r.fork);
}

export async function fetchRepoDetails(
  fullName: string
): Promise<RepoDetails> {
  const [languages, commits, readmeRes, contentsRes] = await Promise.all([
    ghFetch<Record<string, number>>(`/repos/${fullName}/languages`),
    ghFetch<RepoCommit[]>(
      `/repos/${fullName}/commits?per_page=100&since=${ninetyDaysAgo()}`
    ),
    checkReadme(fullName),
    ghFetch<Array<{ name: string }>>(
      `/repos/${fullName}/contents`
    ),
  ]);

  const deploymentFileNames = [
    "Dockerfile",
    "docker-compose.yml",
    "docker-compose.yaml",
    "vercel.json",
    "netlify.toml",
    "fly.toml",
    "render.yaml",
    "Procfile",
    "app.yaml",
    "app.json",
    ".github/workflows",
    "railway.json",
    "amplify.yml",
  ];

  const foundFiles = (contentsRes || [])
    .map((f) => f.name)
    .filter((name) =>
      deploymentFileNames.some(
        (df) => name.toLowerCase() === df.toLowerCase()
      )
    );

  return {
    languages: languages || {},
    recentCommits: commits || [],
    hasReadme: readmeRes.exists,
    readmeLength: readmeRes.length,
    deploymentFiles: foundFiles,
  };
}

async function checkReadme(
  fullName: string
): Promise<{ exists: boolean; length: number }> {
  try {
    const res = await fetch(`${GITHUB_API}/repos/${fullName}/readme`, {
      headers: getHeaders(),
      next: { revalidate: 0 },
    });
    if (!res.ok) return { exists: false, length: 0 };
    const data = await res.json();
    // size is in bytes (base64 encoded content)
    return { exists: true, length: data.size || 0 };
  } catch {
    return { exists: false, length: 0 };
  }
}

function ninetyDaysAgo(): string {
  const d = new Date();
  d.setDate(d.getDate() - 90);
  return d.toISOString();
}

export { extractUsername };
