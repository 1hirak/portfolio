import Link from "next/link"
import { ArrowRight, Calendar, Clock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ImageWithFallback } from "@/components/shared/ImageWithFallback"
import { formatDate, readingTime } from "@/lib/utils"
import type { StrapiData, ArticleAttributes } from "@/lib/api"

interface LatestArticlesProps {
  articles: StrapiData<ArticleAttributes>[]
}

export function LatestArticles({ articles }: LatestArticlesProps) {
  if (!articles?.length) return null

  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Latest Articles</h2>
            <p className="text-muted-foreground mt-2">
              Thoughts, tutorials, and insights
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/blog">
              View all articles
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => {
            const a = article.attributes
            return (
              <Link key={article.id} href={`/blog/${a.slug}`}>
                <Card className="h-full overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
                  <div className="relative aspect-video">
                    <ImageWithFallback
                      src={a.cover?.url || '/placeholder.svg'}
                      alt={a.cover?.alternativeText || ''}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      {a.category && (
                        <Badge variant="secondary" className="text-xs">
                          {a.category.name}
                        </Badge>
                      )}
                    </div>
                    <h3 className="font-semibold mb-2 line-clamp-2">{a.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {a.description}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(a.publishedAt)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {a.reading_time || readingTime(a.description || a.title)} min read
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
