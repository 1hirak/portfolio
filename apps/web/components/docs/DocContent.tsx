import { RichTextRenderer } from "@/components/shared/RichTextRenderer"
import { DocBreadcrumbs } from "./DocBreadcrumbs"
import { TableOfContents } from "./TableOfContents"
import { PreviousNextNav } from "./PreviousNextNav"
import { EditOnRepoLink } from "./EditOnRepoLink"

type StrapiRecord = Record<string, unknown>

interface DocContentProps {
  page: StrapiRecord
  allPages: StrapiRecord[]
}

export function DocContent({ page, allPages }: DocContentProps) {
  const pageAttrs = (page.attributes || page) as Record<string, unknown>
  const {
    title,
    slug,
    content,
    nav_order,
    seo_title,
    seo_description,
    doc_collection,
    doc_parent,
    children,
  } = pageAttrs as {
    title: string
    slug: string
    content: Record<string, unknown>
    nav_order: number
    seo_title?: string
    seo_description?: string
    doc_collection?: { id: number; name: string; slug: string }
    doc_parent?: { id: number; title: string; slug: string } | null
    children?: StrapiRecord[]
  }

  const sortedPages = [...allPages].sort((a, b) => {
    const aAttrs = (a.attributes || a) as Record<string, unknown>
    const bAttrs = (b.attributes || b) as Record<string, unknown>
    return ((aAttrs.nav_order as number) || 0) - ((bAttrs.nav_order as number) || 0)
  })
  const currentIndex = sortedPages.findIndex((p) => p.id === page.id)
  const prev = currentIndex > 0 ? sortedPages[currentIndex - 1] : null
  const next = currentIndex < sortedPages.length - 1 ? sortedPages[currentIndex + 1] : null

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_200px] gap-10">
      <div>
        <DocBreadcrumbs page={page} />

        <article className="mt-4">
          <h1 className="text-4xl font-bold tracking-tight mb-6">
            {title}
          </h1>

          <div className="prose max-w-none">
            <RichTextRenderer content={content as never} />
          </div>
        </article>

        <div className="mt-12 flex items-center justify-between">
          <EditOnRepoLink slug={slug} />
        </div>

        <PreviousNextNav prev={prev} next={next} />
      </div>

      <aside className="hidden lg:block">
        <div className="sticky top-20">
          <TableOfContents content={content as never} />
        </div>
      </aside>
    </div>
  )
}
