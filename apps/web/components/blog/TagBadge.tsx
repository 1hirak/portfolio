import Link from "next/link"
import { Badge } from "@/components/ui/badge"

interface TagBadgeProps {
  name: string
  slug: string
  active?: boolean
}

export function TagBadge({ name, slug, active }: TagBadgeProps) {
  return (
    <Link href={`/blog/tag/${slug}`}>
      <Badge
        variant={active ? "default" : "outline"}
        className="cursor-pointer"
      >
        #{name}
      </Badge>
    </Link>
  )
}
