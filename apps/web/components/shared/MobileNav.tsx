"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface NavItem {
  title: string
  url: string
}

interface MobileNavProps {
  items: NavItem[]
  currentPath?: string
}

export function MobileNav({ items, currentPath }: MobileNavProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {open && (
        <div className="fixed inset-0 z-50">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-background p-6 shadow-lg">
            <div className="flex items-center justify-between mb-8">
              <span className="text-lg font-semibold">Menu</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <nav className="flex flex-col gap-4">
              {items.map((item) => (
                <Link
                  key={item.url}
                  href={item.url}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "text-lg font-medium transition-colors hover:text-primary",
                    currentPath === item.url
                      ? "text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {item.title}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </div>
  )
}
