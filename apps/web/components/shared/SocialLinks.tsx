import { Github, Linkedin, Twitter, Globe, Mail } from "lucide-react"
import { cn } from "@/lib/utils"

interface SocialLink {
  platform: string
  url: string
}

interface SocialLinksProps {
  links: SocialLink[]
  className?: string
  size?: "sm" | "md" | "lg"
}

const iconMap: Record<string, React.ElementType> = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  website: Globe,
  email: Mail,
}

const sizeMap = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
}

export function SocialLinks({ links, className, size = "md" }: SocialLinksProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      {links.map((link) => {
        const Icon = iconMap[link.platform.toLowerCase()] || Globe
        return (
          <a
            key={link.url}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Icon className={sizeMap[size]} />
            <span className="sr-only">{link.platform}</span>
          </a>
        )
      })}
    </div>
  )
}
