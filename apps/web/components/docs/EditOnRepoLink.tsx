import { ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

interface EditOnRepoLinkProps {
  slug: string
  repoUrl?: string
}

export function EditOnRepoLink({
  slug,
  repoUrl = "https://github.com/hirak/portfolio",
}: EditOnRepoLinkProps) {
  const editUrl = `${repoUrl}/edit/main/apps/cms/database/seed.js`

  return (
    <Button variant="ghost" size="sm" asChild>
      <a href={editUrl} target="_blank" rel="noopener noreferrer">
        <ExternalLink className="h-3.5 w-3.5 mr-1" />
        Edit on GitHub
      </a>
    </Button>
  )
}
