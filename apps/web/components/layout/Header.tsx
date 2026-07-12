"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { ModeToggle } from "@/components/shared/ModeToggle"
import { MobileNav } from "@/components/shared/MobileNav"
import { useEffect, useState } from "react"

const navItems = [
  { title: "Home", url: "/" },
  { title: "Projects", url: "/projects" },
  { title: "Blog", url: "/blog" },
  { title: "Docs", url: "/docs" },
]

export function Header() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all",
        scrolled && "shadow-sm"
      )}
    >
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          Portfolio
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.url}
              href={item.url}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === item.url || (item.url !== "/" && pathname.startsWith(item.url))
                  ? "text-foreground"
                  : "text-muted-foreground"
              )}
            >
              {item.title}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ModeToggle />
          <MobileNav items={navItems} currentPath={pathname} />
        </div>
      </div>
    </header>
  )
}
