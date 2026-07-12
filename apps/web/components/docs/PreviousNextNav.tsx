import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"

type StrapiRecord = Record<string, unknown>

interface PreviousNextNavProps {
  prev: StrapiRecord | null
  next: StrapiRecord | null
}

function getHref(page: StrapiRecord): string {
  const attrs = (page.attributes || page) as Record<string, unknown>
  const collectionSlug = (attrs.doc_collection as { slug?: string })?.slug || ""
  return `/docs/${collectionSlug}/${attrs.slug}`
}

function getTitle(page: StrapiRecord): string {
  const attrs = (page.attributes || page) as Record<string, unknown>
  return (attrs.title as string) || ""
}

export function PreviousNextNav({ prev, next }: PreviousNextNavProps) {
  if (!prev && !next) return null

  return (
    <nav className="mt-12 flex items-center justify-between border-t pt-8">
      <div>
        {prev && (
          <Link
            href={getHref(prev)}
            className="group flex flex-col"
          >
            <span className="text-xs text-muted-foreground mb-1">Previous</span>
            <span className="flex items-center gap-1 text-sm font-medium group-hover:text-primary">
              <ChevronLeft className="h-4 w-4" />
              {getTitle(prev)}
            </span>
          </Link>
        )}
      </div>
      <div>
        {next && (
          <Link
            href={getHref(next)}
            className="group flex flex-col text-right"
          >
            <span className="text-xs text-muted-foreground mb-1">Next</span>
            <span className="flex items-center gap-1 text-sm font-medium group-hover:text-primary">
              {getTitle(next)}
              <ChevronRight className="h-4 w-4" />
            </span>
          </Link>
        )}
      </div>
    </nav>
  )
}
