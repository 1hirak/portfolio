import Link from "next/link"
import { Calendar, Clock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ImageWithFallback } from "@/components/shared/ImageWithFallback"
import { formatDate, readingTime } from "@/lib/utils"
import type { ArticleAttributes, CategoryData } from "@/lib/api"

interface ArticleCardProps {
  article: {
    id: number
    title: string
    slug: string
    description: string
    cover: { url: string; alternativeText: string | null } | null
    publishedAt: string
    category: CategoryData | null
    tags?: { id: number; name: string; slug: string }[]
    content?: string
    reading_time?: number
  }
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Link href={`/blog/${article.slug}`}>
      <Card className="h-full overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
        <div className="relative aspect-video">
          <ImageWithFallback
            src={article.cover?.url || '/placeholder.svg'}
            alt={article.cover?.alternativeText || ''}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            {article.category && (
              <Badge variant="secondary" className="text-xs">
                {article.category.name}
              </Badge>
            )}
          </div>
          <h3 className="font-semibold mb-2 line-clamp-2">{article.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {article.description}
          </p>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatDate(article.publishedAt)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {article.reading_time || readingTime(article.description || article.title)} min read
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
