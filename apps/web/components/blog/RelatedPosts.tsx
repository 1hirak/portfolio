import type { StrapiData, ArticleAttributes } from "@/lib/api"
import { ArticleCard } from "./ArticleCard"

interface RelatedPostsProps {
  articles: StrapiData<ArticleAttributes>[]
}

export function RelatedPosts({ articles }: RelatedPostsProps) {
  const filtered = articles.slice(0, 3)

  if (filtered.length === 0) return null

  return (
    <section className="mt-16">
      <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((article) => (
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
    </section>
  )
}
