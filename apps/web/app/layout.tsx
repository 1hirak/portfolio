import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/layout/ThemeProvider"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "Hirak - Portfolio",
    template: "%s | Hirak",
  },
  description: "Full-stack developer, building things and writing about it.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://portfolio.hirak.tech"),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Hirak Portfolio",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
