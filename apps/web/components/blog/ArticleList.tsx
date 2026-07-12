import type { StrapiData, ArticleAttributes } from "@/lib/api"
import { ArticleCard } from "./ArticleCard"

interface ArticleListProps {
  articles: (StrapiData<ArticleAttributes>)[]
}

export function ArticleList({ articles }: ArticleListProps) {
  if (!articles?.length) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No articles found.
      </div>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {articles.map((article) => (
        <ArticleCard
          key={article.id}
          article={{
            id: article.id,
            title: article.attributes.title,
            slug: article.attributes.slug,
            description: article.attributes.description,
            cover: article.attributes.cover,
            publishedAt: article.attributes.publishedAt,
            category: article.attributes.category,
            tags: article.attributes.tags,
            reading_time: article.attributes.reading_time,
          }}
        />
      ))}
    </div>
  )
}
