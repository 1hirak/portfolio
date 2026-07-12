import React from "react"
import type { RichText, RichTextNode } from "@/lib/api"

interface RichTextRendererProps {
  content: RichText | RichTextNode[]
  className?: string
}

function renderNode(node: RichTextNode, index: number): React.ReactNode {
  if (node.type === "text") {
    let text = node.text || ""
    if (node.bold) return <strong key={index}>{text}</strong>
    if (node.italic) return <em key={index}>{text}</em>
    if (node.underline) return <u key={index}>{text}</u>
    if (node.code) return <code key={index}>{text}</code>
    return text
  }

  if (node.type === "paragraph") {
    return (
      <p key={index} className="mb-4 leading-relaxed">
        {node.children?.map((child, i) => renderNode(child, i))}
      </p>
    )
  }

  if (node.type === "heading") {
    const level = node.level || 1
    const Tag = `h${level}` as keyof React.JSX.IntrinsicElements
    const sizeClasses: Record<number, string> = {
      1: "text-4xl font-bold mt-8 mb-4",
      2: "text-3xl font-bold mt-6 mb-3",
      3: "text-2xl font-semibold mt-5 mb-3",
      4: "text-xl font-semibold mt-4 mb-2",
      5: "text-lg font-medium mt-3 mb-2",
      6: "text-base font-medium mt-3 mb-2",
    }

    return (
      <Tag key={index} className={sizeClasses[level] || sizeClasses[1]}>
        {node.children?.map((child, i) => renderNode(child, i))}
      </Tag>
    )
  }

  if (node.type === "list") {
    const Tag = node.format === "ordered" ? "ol" : "ul"
    return (
      <Tag key={index} className="mb-4 pl-6 space-y-1">
        {node.children?.map((child, i) => (
          <li key={i} className={node.format === "ordered" ? "list-decimal" : "list-disc"}>
            {child.children?.map((grandchild, j) => renderNode(grandchild, j))}
          </li>
        ))}
      </Tag>
    )
  }

  if (node.type === "list-item") {
    return (
      <li key={index}>
        {node.children?.map((child, i) => renderNode(child, i))}
      </li>
    )
  }

  if (node.type === "quote") {
    return (
      <blockquote key={index} className="border-l-4 border-primary pl-4 italic my-4">
        {node.children?.map((child, i) => renderNode(child, i))}
      </blockquote>
    )
  }

  if (node.type === "code") {
    return (
      <pre key={index} className="relative group overflow-x-auto rounded-lg border bg-muted p-4 my-4 text-sm">
        <code>{node.children?.map((child, i) => renderNode(child, i))}</code>
      </pre>
    )
  }

  if (node.type === "image") {
    return (
      <figure key={index} className="my-6">
        <img
          src={node.image?.url || ""}
          alt={node.image?.alternativeText || ""}
          className="rounded-lg w-full"
        />
        {node.caption && (
          <figcaption className="mt-2 text-center text-sm text-muted-foreground">
            {node.caption}
          </figcaption>
        )}
      </figure>
    )
  }

  if (node.type === "link") {
    return (
      <a
        key={index}
        href={node.url}
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium underline underline-offset-4"
      >
        {node.children?.map((child, i) => renderNode(child, i))}
      </a>
    )
  }

  return null
}

export function RichTextRenderer({ content, className }: RichTextRendererProps) {
  if (!content) return null

  const nodes = Array.isArray(content) ? content : content.children

  if (!nodes?.length) return null

  return <div className={className}>{nodes.map((node, index) => renderNode(node, index))}</div>
}
