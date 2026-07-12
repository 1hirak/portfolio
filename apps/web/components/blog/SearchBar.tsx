"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

export function SearchBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [value, setValue] = useState(searchParams.get("q") || "")

  const debouncedSearch = useCallback(
    debounce((term: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (term) {
        params.set("q", term)
      } else {
        params.delete("q")
      }
      params.set("page", "1")
      router.push(`/blog?${params.toString()}`)
    }, 300),
    [searchParams, router]
  )

  useEffect(() => {
    if (value !== searchParams.get("q")) {
      debouncedSearch(value)
    }
  }, [value, debouncedSearch, searchParams])

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder="Search articles..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="pl-10"
      />
    </div>
  )
}

function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null
  return (...args: Parameters<T>) => {
    if (timeoutId) clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}
