import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getArticle, getRelatedArticles } from "@/lib/api"
import { ArticleContent } from "@/components/blog/ArticleContent"
import { RelatedPosts } from "@/components/blog/RelatedPosts"

interface ArticlePageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params
  const articleData = await getArticle(slug)
  const article = articleData?.data

  if (!article) return {}

  const { title, description, seo_title, seo_description, cover } = article.attributes

  return {
    title: seo_title || title,
    description: seo_description || description,
    openGraph: {
      title: seo_title || title,
      description: seo_description || description,
      images: cover ? [{ url: cover.url }] : [],
    },
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params
  const articleData = await getArticle(slug)

  if (!articleData?.data) {
    notFound()
  }

  const article = articleData.data
  const relatedData = await getRelatedArticles(article.id)
  const relatedArticles = relatedData?.data || []

  return (
    <div className="container py-12 max-w-4xl">
      <ArticleContent article={article.attributes} />
      <RelatedPosts articles={relatedArticles} />
    </div>
  )
}
