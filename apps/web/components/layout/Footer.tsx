import Link from "next/link"
import { SocialLinks } from "@/components/shared/SocialLinks"

const footerNav = [
  { title: "Home", url: "/" },
  { title: "Projects", url: "/projects" },
  { title: "Blog", url: "/blog" },
  { title: "Docs", url: "/docs" },
]

const socialLinks = [
  { platform: "github", url: "https://github.com/hirak" },
  { platform: "linkedin", url: "https://linkedin.com/in/hirak" },
  { platform: "twitter", url: "https://twitter.com/hirak" },
]

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <h3 className="text-lg font-semibold mb-3">Portfolio</h3>
            <p className="text-sm text-muted-foreground">
              Building things and writing about it.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-3 uppercase tracking-wider text-muted-foreground">
              Navigation
            </h3>
            <nav className="flex flex-col gap-2">
              {footerNav.map((item) => (
                <Link
                  key={item.url}
                  href={item.url}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {item.title}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-3 uppercase tracking-wider text-muted-foreground">
              Connect
            </h3>
            <SocialLinks links={socialLinks} />
          </div>
        </div>

        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Hirak. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
