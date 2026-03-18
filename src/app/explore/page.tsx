import { createClient } from "@/lib/supabase/server"
import ExploreClient from "./ExploreClient"

export const metadata = {
  title: "Explore Builders — Verq",
  description: "Search and filter verified student builders by score, skills, and college.",
}

export default async function ExplorePage() {
  const supabase = await createClient()

  const { data: students } = await supabase
    .from("students")
    .select("name, email, college, github_url, verq_score, score_code_quality, score_project_complexity, score_commit_consistency, score_documentation, score_deployment")
    .not("verq_score", "is", null)
    .order("verq_score", { ascending: false })
    .limit(100)

  return <ExploreClient initialStudents={students || []} />
}
