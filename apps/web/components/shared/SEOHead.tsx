import type { SEOSection } from "@/lib/api"

interface SEOHeadProps {
  seo: SEOSection | null | undefined
  defaultTitle?: string
}

export function generateJsonLd(seo: SEOSection | null | undefined) {
  if (!seo) return null

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: seo.meta_title,
    description: seo.meta_description,
    ...(seo.canonical_url ? { url: seo.canonical_url } : {}),
  }
}
