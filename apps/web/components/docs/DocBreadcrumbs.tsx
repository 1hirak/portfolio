import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"

type StrapiRecord = Record<string, unknown>

interface DocBreadcrumbsProps {
  page: StrapiRecord
}

export function DocBreadcrumbs({ page }: DocBreadcrumbsProps) {
  const attrs = (page.attributes || page) as Record<string, unknown>
  const {
    title,
    slug,
    doc_collection,
    doc_parent,
  } = attrs as {
    title: string
    slug: string
    doc_collection?: { id: number; name: string; slug: string }
    doc_parent?: { id: number; title: string; slug: string } | null
  }

  const crumbs: { title: string; href: string }[] = []

  if (doc_collection?.slug) {
    crumbs.push({
      title: doc_collection.name,
      href: `/docs/${doc_collection.slug}`,
    })
  }

  if (doc_parent) {
    crumbs.push({
      title: doc_parent.title,
      href: `/docs/${doc_collection?.slug}/${doc_parent.slug}`,
    })
  }

  crumbs.push({
    title: title,
    href: `/docs/${doc_collection?.slug}/${slug}`,
  })

  return (
    <nav className="flex items-center gap-1 text-sm text-muted-foreground">
      <Link
        href="/docs"
        className="hover:text-foreground transition-colors"
      >
        <Home className="h-3.5 w-3.5" />
        <span className="sr-only">Docs home</span>
      </Link>
      {crumbs.map((crumb, i) => (
        <span key={crumb.href} className="flex items-center gap-1">
          <ChevronRight className="h-3.5 w-3.5" />
          {i < crumbs.length - 1 ? (
            <Link
              href={crumb.href}
              className="hover:text-foreground transition-colors"
            >
              {crumb.title}
            </Link>
          ) : (
            <span className="text-foreground font-medium">{crumb.title}</span>
          )}
        </span>
      ))}
    </nav>
  )
}
