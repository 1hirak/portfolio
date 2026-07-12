import type { MetadataRoute } from "next"
import { getArticles, getProjects, getDocCollections } from "@/lib/api"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://portfolio.hirak.tech"

  const staticPages = [
    { url: siteUrl, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 1 },
    { url: `${siteUrl}/blog`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.8 },
    { url: `${siteUrl}/projects`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${siteUrl}/docs`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.6 },
  ]

  const articlesData = await getArticles({ pageSize: 100 })
  const articlePages = (articlesData?.data || []).map((article) => ({
    url: `${siteUrl}/blog/${article.attributes.slug}`,
    lastModified: new Date(article.attributes.updatedAt || article.attributes.publishedAt),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }))

  const projectsData = await getProjects()
  const projectPages = (projectsData?.data || []).map((project) => ({
    url: `${siteUrl}/projects/${project.attributes.slug}`,
    lastModified: new Date(project.attributes.publishedAt || project.attributes.createdAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }))

  const collectionsData = await getDocCollections()
  const docPages: MetadataRoute.Sitemap = []
  if (collectionsData?.data) {
    for (const collection of collectionsData.data) {
      const articles = collection.attributes.articles || []
      for (const article of articles) {
        if (article.attributes?.slug) {
          docPages.push({
            url: `${siteUrl}/docs/${collection.attributes.slug}/${article.attributes.slug}`,
            lastModified: new Date(),
            changeFrequency: "weekly" as const,
            priority: 0.5,
          })
        }
      }
    }
  }

  return [...staticPages, ...articlePages, ...projectPages, ...docPages]
}
