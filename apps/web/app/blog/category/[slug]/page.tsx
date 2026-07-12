import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getArticles, getCategories } from "@/lib/api"
import { ArticleList } from "@/components/blog/ArticleList"
import { Pagination } from "@/components/blog/Pagination"

interface CategoryPageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ page?: string }>
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params
  return {
    title: `Category: ${slug}`,
    description: `Articles in the ${slug} category.`,
  }
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params
  const { page: pageParam } = await searchParams
  const page = Number(pageParam) || 1

  const [articlesData, categoriesData] = await Promise.all([
    getArticles({ page, pageSize: 9, category: slug }),
    getCategories(),
  ])

  if (!articlesData?.data && !categoriesData?.data) {
    notFound()
  }

  const articles = articlesData?.data || []
  const pagination = articlesData?.meta?.pagination
  const category = categoriesData?.data?.find((c) => c.attributes.slug === slug)

  return (
    <div className="container py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight mb-2 capitalize">
          {category?.attributes.name || slug}
        </h1>
        {category?.attributes.description && (
          <p className="text-muted-foreground">{category.attributes.description}</p>
        )}
      </div>

      <ArticleList articles={articles} />

      {pagination && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.pageCount}
          basePath={`/blog/category/${slug}`}
        />
      )}
    </div>
  )
}
