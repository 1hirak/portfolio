"use client"

import React, { useEffect, useRef, useState } from "react"
import { Calendar, Clock, User } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ImageWithFallback } from "@/components/shared/ImageWithFallback"
import { CopyButton } from "@/components/shared/CopyButton"
import { ReadingProgress } from "@/components/shared/ReadingProgress"
import { formatDate, readingTime } from "@/lib/utils"
import type { ArticleAttributes, RichText, RichTextNode } from "@/lib/api"

interface ArticleContentProps {
  article: ArticleAttributes
}

interface TOCItem {
  id: string
  text: string
  level: number
}

function getHeadingText(node: RichTextNode): string {
  if (node.type === "text") return node.text || ""
  return node.children?.map(getHeadingText).join("") || ""
}

function extractTOC(content: RichText): TOCItem[] {
  const items: TOCItem[] = []
  const nodes = Array.isArray(content) ? content : content.children
  if (!nodes) return items

  const walk = (nodes: RichTextNode[]) => {
    for (const node of nodes) {
      if (node.type === "heading" && node.level && node.level >= 1 && node.level <= 4) {
        const text = getHeadingText(node)
        const id = text.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-")
        items.push({ id, text, level: node.level })
      }
      if (node.children) walk(node.children)
    }
  }

  walk(nodes)
  return items
}

function renderRichText(nodes: RichTextNode[]): React.ReactNode[] {
  const walk = (nodes: RichTextNode[], depth = 0): React.ReactNode[] => {
    return nodes.map((node, i) => {
      const key = `${depth}-${i}`
      if (node.type === "text") {
        let text = node.text || ""
        if (node.bold) return <strong key={key}>{text}</strong>
        if (node.italic) return <em key={key}>{text}</em>
        if (node.underline) return <u key={key}>{text}</u>
        if (node.code) return <code key={key} className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono">{text}</code>
        return text
      }
      if (node.type === "paragraph") {
        return <p key={key} className="mb-4 leading-relaxed">{node.children?.map((c, j) => walk([c], j))}</p>
      }
      if (node.type === "heading") {
        const level = node.level || 1
        const text = node.children?.map(n => n.type === "text" ? n.text : "").join("") || ""
        const id = text.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-")
        const Tag = `h${level}` as keyof React.JSX.IntrinsicElements
        const sizeClasses: Record<number, string> = {
          1: "text-3xl font-bold mt-8 mb-4 scroll-mt-24",
          2: "text-2xl font-bold mt-6 mb-3 scroll-mt-24",
          3: "text-xl font-semibold mt-5 mb-3 scroll-mt-24",
          4: "text-lg font-semibold mt-4 mb-2 scroll-mt-24",
        }
        return (
          <Tag key={key} id={id} className={sizeClasses[level] || sizeClasses[1]}>
            <a href={`#${id}`} className="no-underline hover:underline">{node.children?.map((c, j) => walk([c], j))}</a>
          </Tag>
        )
      }
      if (node.type === "list") {
        const Tag = node.format === "ordered" ? "ol" : "ul"
        return (
          <Tag key={key} className="mb-4 pl-6 space-y-1 [&_ul]:mt-1 [&_ol]:mt-1">
            {node.children?.map((c, j) => walk([c], j))}
          </Tag>
        )
      }
      if (node.type === "list-item") {
        return <li key={key} className="list-disc">{node.children?.map((c, j) => walk([c], j))}</li>
      }
      if (node.type === "quote") {
        return (
          <blockquote key={key} className="border-l-4 border-primary pl-4 italic my-4 text-muted-foreground">
            {node.children?.map((c, j) => walk([c], j))}
          </blockquote>
        )
      }
      if (node.type === "code") {
        const codeText = node.children?.map(n => n.type === "text" ? n.text : "").join("") || ""
        return (
          <div key={key} className="relative group my-4">
            <pre className="overflow-x-auto rounded-lg border bg-muted p-4 text-sm">
              <code>{codeText}</code>
            </pre>
            <CopyButton text={codeText} />
          </div>
        )
      }
      if (node.type === "image") {
        return (
          <figure key={key} className="my-6">
            <img src={node.image?.url || ""} alt={node.image?.alternativeText || ""} className="rounded-lg w-full" />
            {node.caption && (
              <figcaption className="mt-2 text-center text-sm text-muted-foreground">{node.caption}</figcaption>
            )}
          </figure>
        )
      }
      if (node.type === "link") {
        return (
          <a key={key} href={node.url} target="_blank" rel="noopener noreferrer" className="font-medium underline underline-offset-4">
            {node.children?.map((c, j) => walk([c], j))}
          </a>
        )
      }
      return null
    })
  }

  return walk(nodes)
}

export function ArticleContent({ article }: ArticleContentProps) {
  const toc = extractTOC(article.content)
  const [activeId, setActiveId] = useState<string>("")
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        }
      },
      { rootMargin: "-80px 0px -80% 0px" }
    )

    const headings = contentRef.current?.querySelectorAll("h1, h2, h3, h4")
    headings?.forEach((h) => observer.observe(h))

    return () => observer.disconnect()
  }, [])

  const contentNodes = Array.isArray(article.content) ? article.content : article.content?.children

  return (
    <article>
      <ReadingProgress />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_250px] gap-10">
        <div>
          <header className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              {article.category && (
                <Badge variant="secondary">{article.category.name}</Badge>
              )}
            </div>

            <h1 className="text-4xl font-bold tracking-tight mb-4">
              {article.title}
            </h1>

            <p className="text-lg text-muted-foreground mb-4">
              {article.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              {article.author && (
                <span className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {article.author.name}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formatDate(article.publishedAt)}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {article.reading_time || readingTime(JSON.stringify(article.content))} min read
              </span>
            </div>
          </header>

          {article.cover && (
            <div className="relative aspect-video mb-8 rounded-lg overflow-hidden">
              <ImageWithFallback
                src={article.cover.url || '/placeholder.svg'}
                alt={article.cover.alternativeText || ''}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          <Separator className="mb-8" />

          <div ref={contentRef} className="prose max-w-none">
            {contentNodes && renderRichText(contentNodes)}
          </div>

          {article.tags && article.tags.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <Badge key={tag.id} variant="outline">
                  #{tag.name}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {toc.length > 0 && (
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                On this page
              </h4>
              <nav className="space-y-1">
                {toc.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className={`block text-sm py-1 transition-colors hover:text-foreground ${
                      activeId === item.id
                        ? "text-foreground font-medium"
                        : "text-muted-foreground"
                    }`}
                    style={{ paddingLeft: `${(item.level - 1) * 12}px` }}
                  >
                    {item.text}
                  </a>
                ))}
              </nav>
            </div>
          </aside>
        )}
      </div>
    </article>
  )
}
