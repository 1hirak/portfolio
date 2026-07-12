"use client"

import { useEffect, useState } from "react"
import type { RichText, RichTextNode } from "@/lib/api"

interface TOCItem {
  id: string
  text: string
  level: number
}

function extractHeadings(content: RichText): TOCItem[] {
  const items: TOCItem[] = []
  const nodes = Array.isArray(content) ? content : content.children
  if (!nodes) return items

  const walk = (nodes: RichTextNode[]) => {
    for (const node of nodes) {
      if (node.type === "heading" && node.level && node.level >= 2 && node.level <= 4) {
        const text = node.children
          ?.map((c) => (c.type === "text" ? c.text : ""))
          .join("") || ""
        const id = text.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-")
        items.push({ id, text, level: node.level })
      }
      if (node.children) walk(node.children)
    }
  }

  walk(nodes)
  return items
}

interface TableOfContentsProps {
  content: RichText
}

export function TableOfContents({ content }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("")
  const headings = extractHeadings(content)

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

    const ids = headings.map((h) => document.getElementById(h.id)).filter(Boolean)
    ids.forEach((el) => el && observer.observe(el))

    return () => observer.disconnect()
  }, [headings])

  if (headings.length === 0) return null

  return (
    <div>
      <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
        On this page
      </h4>
      <nav className="space-y-1">
        {headings.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={`block text-sm py-1 transition-colors hover:text-foreground ${
              activeId === item.id
                ? "text-foreground font-medium"
                : "text-muted-foreground"
            }`}
            style={{ paddingLeft: `${(item.level - 2) * 12}px` }}
          >
            {item.text}
          </a>
        ))}
      </nav>
    </div>
  )
}
