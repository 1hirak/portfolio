"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface PaginationProps {
  currentPage: number
  totalPages: number
  basePath: string
}

export function Pagination({ currentPage, totalPages, basePath }: PaginationProps) {
  const searchParams = useSearchParams()

  if (totalPages <= 1) return null

  function getPageUrl(page: number) {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", String(page))
    return `${basePath}?${params.toString()}`
  }

  const pages: (number | "...")[] = []
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
      pages.push(i)
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...")
    }
  }

  return (
    <nav className="flex items-center justify-center gap-1 mt-10">
      <Button
        variant="outline"
        size="icon"
        disabled={currentPage <= 1}
        asChild={currentPage > 1}
      >
        {currentPage > 1 ? (
          <Link href={getPageUrl(currentPage - 1)}>
            <ChevronLeft className="h-4 w-4" />
          </Link>
        ) : (
          <span>
            <ChevronLeft className="h-4 w-4" />
          </span>
        )}
      </Button>

      {pages.map((page, i) =>
        page === "..." ? (
          <span key={`ellipsis-${i}`} className="px-2 text-muted-foreground">
            ...
          </span>
        ) : (
          <Button
            key={page}
            variant={page === currentPage ? "default" : "outline"}
            size="icon"
            asChild
          >
            <Link href={getPageUrl(page)}>{page}</Link>
          </Button>
        )
      )}

      <Button
        variant="outline"
        size="icon"
        disabled={currentPage >= totalPages}
        asChild={currentPage < totalPages}
      >
        {currentPage < totalPages ? (
          <Link href={getPageUrl(currentPage + 1)}>
            <ChevronRight className="h-4 w-4" />
          </Link>
        ) : (
          <span>
            <ChevronRight className="h-4 w-4" />
          </span>
        )}
      </Button>
    </nav>
  )
}
