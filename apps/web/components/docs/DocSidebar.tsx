"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { FileText, BookOpen } from "lucide-react"
import { cn } from "@/lib/utils"

type StrapiRecord = Record<string, unknown>

interface DocSidebarProps {
  collections: StrapiRecord[]
}

function PageLink({ page, currentPath }: { page: StrapiRecord; currentPath: string }) {
  const attrs = (page.attributes || page) as Record<string, unknown>
  const collectionSlug = (attrs.collection ?? attrs.doc_collection) as { slug?: string }
  const collSlug = typeof collectionSlug === 'object' && collectionSlug !== null
    ? (collectionSlug as Record<string, unknown>).slug as string || ''
    : ''
  const href = `/docs/${collSlug}/${attrs.slug}`
  const isActive = currentPath === href
  const children = (attrs.children || []) as StrapiRecord[]

  return (
    <li>
      <Link
        href={href}
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors",
          isActive
            ? "bg-accent text-accent-foreground font-medium"
            : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
        )}
      >
        <FileText className="h-3.5 w-3.5 shrink-0" />
        <span className="truncate">{attrs.title as string}</span>
      </Link>
      {children.length > 0 && (
        <ul className="ml-4 mt-1 space-y-0.5">
          {children.map((child: StrapiRecord) => (
            <PageLink key={child.id as number} page={child} currentPath={currentPath} />
          ))}
        </ul>
      )}
    </li>
  )
}

export function DocSidebar({ collections }: DocSidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="w-64 shrink-0 hidden lg:block">
      <div className="sticky top-20 overflow-y-auto max-h-[calc(100vh-6rem)] pr-4">
        <nav>
          <ul className="space-y-1">
            {collections?.map((collection: StrapiRecord) => {
              const collAttrs = (collection.attributes || collection) as Record<string, unknown>
              const pages = (collAttrs.pages || []) as StrapiRecord[]
              const topLevel = pages.filter((p: StrapiRecord) => {
                const attrs = (p.attributes || p) as Record<string, unknown>
                return !attrs.doc_parent && !attrs.parent
              })
              return (
                <li key={collection.id as number}>
                  <div className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                    <BookOpen className="h-3.5 w-3.5" />
                    {collAttrs.name as string || collAttrs.title as string}
                  </div>
                  {topLevel.length > 0 && (
                    <ul className="ml-2 space-y-0.5">
                      {topLevel.map((page: StrapiRecord) => (
                        <PageLink
                          key={page.id as number}
                          page={page}
                          currentPath={pathname}
                        />
                      ))}
                    </ul>
                  )}
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
    </aside>
  )
}
