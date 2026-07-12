import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getArticles, getTags } from "@/lib/api"
import { ArticleList } from "@/components/blog/ArticleList"
import { Pagination } from "@/components/blog/Pagination"

interface TagPageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ page?: string }>
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { slug } = await params
  return {
    title: `Tag: #${slug}`,
    description: `Articles tagged with #${slug}.`,
  }
}

export default async function TagPage({ params, searchParams }: TagPageProps) {
  const { slug } = await params
  const { page: pageParam } = await searchParams
  const page = Number(pageParam) || 1

  const [articlesData, tagsData] = await Promise.all([
    getArticles({ page, pageSize: 9, tag: slug }),
    getTags(),
  ])

  if (!articlesData?.data && !tagsData?.data) {
    notFound()
  }

  const articles = articlesData?.data || []
  const pagination = articlesData?.meta?.pagination
  const tag = tagsData?.data?.find((t) => t.attributes.slug === slug)

  return (
    <div className="container py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight mb-2">
          #{tag?.attributes.name || slug}
        </h1>
        <p className="text-muted-foreground">
          Articles tagged with #{tag?.attributes.name || slug}.
        </p>
      </div>

      <ArticleList articles={articles} />

      {pagination && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.pageCount}
          basePath={`/blog/tag/${slug}`}
        />
      )}
    </div>
  )
}
