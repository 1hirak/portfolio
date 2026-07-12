"use client"

import { useEffect, useState } from "react"
import { X } from "lucide-react"
import Link from "next/link"

export function DraftModeBanner() {
  const [isDraftMode, setIsDraftMode] = useState(false)

  useEffect(() => {
    setIsDraftMode(document.cookie.includes("__prerender_bypass"))
  }, [])

  if (!isDraftMode) return null

  return (
    <div className="fixed bottom-4 left-4 z-50 rounded-lg border bg-amber-50 px-4 py-3 text-amber-900 shadow-lg dark:bg-amber-950 dark:text-amber-100">
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium">Draft Mode</span>
        <Link
          href="/api/exit-draft"
          className="text-sm underline underline-offset-2 hover:no-underline"
        >
          Exit
        </Link>
        <button
          onClick={() => setIsDraftMode(false)}
          className="ml-2 text-amber-700 hover:text-amber-900 dark:text-amber-300 dark:hover:text-amber-100"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
