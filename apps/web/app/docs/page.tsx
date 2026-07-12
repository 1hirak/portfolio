import { redirect } from "next/navigation"
import { getDocCollections } from "@/lib/api"

export default async function DocsPage() {
  const collectionsData = await getDocCollections()
  const collections = collectionsData?.data || []

  if (collections.length > 0) {
    const firstCollection = collections[0]
    const articles = firstCollection.attributes.articles || []
    const topLevelArticles = articles.filter((a) => !a.attributes.doc_parent)
    const sorted = topLevelArticles.sort((a, b) => (a.attributes.nav_order || 0) - (b.attributes.nav_order || 0))
    if (sorted.length > 0) {
      redirect(`/docs/${firstCollection.attributes.slug}/${sorted[0].attributes.slug}`)
    }
  }

  return (
    <div className="container py-16 text-center">
      <h1 className="text-4xl font-bold mb-4">Documentation</h1>
      <p className="text-muted-foreground">No documentation available yet.</p>
    </div>
  )
}
