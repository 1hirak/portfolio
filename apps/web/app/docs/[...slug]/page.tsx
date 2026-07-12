import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getDocArticle, getDocCollections } from "@/lib/api"
import { DocSidebar } from "@/components/docs/DocSidebar"
import { DocContent } from "@/components/docs/DocContent"

interface DocSlugPageProps {
  params: Promise<{ slug: string[] }>
}

type StrapiRecord = Record<string, unknown>

export async function generateMetadata({ params }: DocSlugPageProps): Promise<Metadata> {
  const { slug } = await params
  const pageSlug = slug[slug.length - 1]
  const pageData = await getDocArticle(pageSlug)
  const page = pageData?.data

  if (!page) return {}

  const { title, seo_title, seo_description } = page.attributes

  return {
    title: seo_title || title,
    description: seo_description || `${title} - Documentation`,
  }
}

export default async function DocSlugPage({ params }: DocSlugPageProps) {
  const { slug } = await params
  const pageSlug = slug[slug.length - 1]

  const [pageData, collectionsData] = await Promise.all([
    getDocArticle(pageSlug),
    getDocCollections(),
  ])

  if (!pageData?.data) {
    notFound()
  }

  const page = pageData.data
  const collections = (collectionsData?.data || []).map((c) => ({
    id: c.id,
    attributes: {
      name: c.attributes.name,
      slug: c.attributes.slug,
      description: c.attributes.description,
      pages: c.attributes.articles,
    },
  })) as unknown as StrapiRecord[]

  const allPages: StrapiRecord[] = []
  for (const c of collections) {
    const pages = (c.attributes as { pages: StrapiRecord[] }).pages || []
    if (Array.isArray(pages)) allPages.push(...pages as StrapiRecord[])
  }

  return (
    <div className="container py-12">
      <div className="flex gap-10">
        <DocSidebar collections={collections as unknown as StrapiRecord[]} />
        <div className="flex-1 min-w-0 max-w-4xl">
          <DocContent page={page as unknown as StrapiRecord} allPages={allPages} />
        </div>
      </div>
    </div>
  )
}
