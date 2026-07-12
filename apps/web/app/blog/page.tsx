import type { Metadata } from "next"
import { Suspense } from "react"
import { getArticles, getCategories, getTags } from "@/lib/api"
import { ArticleList } from "@/components/blog/ArticleList"
import { SearchBar } from "@/components/blog/SearchBar"
import { CategoryBadge } from "@/components/blog/CategoryBadge"
import { TagBadge } from "@/components/blog/TagBadge"
import { Pagination } from "@/components/blog/Pagination"

export const metadata: Metadata = {
  title: "Blog",
  description: "Articles about development, technology, and more.",
}

interface BlogPageProps {
  searchParams: Promise<{ page?: string; q?: string; category?: string; tag?: string }>
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams
  const page = Number(params.page) || 1
  const pageSize = 9

  const [articlesData, categoriesData, tagsData] = await Promise.all([
    getArticles({
      page,
      pageSize,
      category: params.category,
      tag: params.tag,
      search: params.q,
    }),
    getCategories(),
    getTags(),
  ])

  const articles = articlesData?.data || []
  const pagination = articlesData?.meta?.pagination
  const categories = categoriesData?.data || []
  const tags = tagsData?.data || []

  return (
    <div className="container py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight mb-2">Blog</h1>
        <p className="text-muted-foreground">
          Thoughts, tutorials, and insights about development.
        </p>
      </div>

      <div className="flex flex-col gap-6 mb-8">
        <Suspense>
          <SearchBar />
        </Suspense>

        {categories.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted-foreground mr-1">Categories:</span>
            {categories.map((cat) => (
              <CategoryBadge
                key={cat.id}
                name={cat.attributes.name}
                slug={cat.attributes.slug}
                active={params.category === cat.attributes.slug}
              />
            ))}
            {params.category && (
              <a
                href="/blog"
                className="text-xs text-muted-foreground hover:text-foreground ml-2 underline"
              >
                Clear filter
              </a>
            )}
          </div>
        )}

        {tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted-foreground mr-1">Tags:</span>
            {tags.map((tag) => (
              <TagBadge
                key={tag.id}
                name={tag.attributes.name}
                slug={tag.attributes.slug}
                active={params.tag === tag.attributes.slug}
              />
            ))}
            {params.tag && (
              <a
                href="/blog"
                className="text-xs text-muted-foreground hover:text-foreground ml-2 underline"
              >
                Clear filter
              </a>
            )}
          </div>
        )}
      </div>

      <ArticleList articles={articles} />

      {pagination && (
        <Suspense>
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.pageCount}
            basePath="/blog"
          />
        </Suspense>
      )}
    </div>
  )
}
