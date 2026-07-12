import Link from "next/link"
import { Badge } from "@/components/ui/badge"

interface CategoryBadgeProps {
  name: string
  slug: string
  active?: boolean
}

export function CategoryBadge({ name, slug, active }: CategoryBadgeProps) {
  return (
    <Link href={`/blog/category/${slug}`}>
      <Badge variant={active ? "default" : "secondary"} className="cursor-pointer">
        {name}
      </Badge>
    </Link>
  )
}
