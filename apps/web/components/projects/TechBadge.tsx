import { Badge } from "@/components/ui/badge"

interface TechBadgeProps {
  name: string
  icon?: string | null
  variant?: "default" | "secondary" | "outline"
}

export function TechBadge({ name, variant = "secondary" }: TechBadgeProps) {
  return (
    <Badge variant={variant} className="text-xs">
      {name}
    </Badge>
  )
}
