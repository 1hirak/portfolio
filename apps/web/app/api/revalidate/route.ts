import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"

const REVALIDATION_SECRET = process.env.REVALIDATION_SECRET || ""

interface StrapiWebhookPayload {
  event: string
  model: string
  entry?: {
    id: number
    slug?: string
    publishedAt?: string | null
    [key: string]: unknown
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("x-revalidation-secret")
    if (authHeader !== REVALIDATION_SECRET) {
      return NextResponse.json({ error: "Invalid secret" }, { status: 401 })
    }

    const payload: StrapiWebhookPayload = await request.json()
    const { model, entry } = payload

    const pathsToRevalidate: string[] = ["/"]

    switch (model) {
      case "article":
        pathsToRevalidate.push("/blog")
        if (entry?.slug) {
          pathsToRevalidate.push(`/blog/${entry.slug}`)
          if (entry.publishedAt) {
            pathsToRevalidate.push("/")
          }
          // Also revalidate docs if article has a doc_collection
          pathsToRevalidate.push("/docs")
        }
        break

      case "project":
        pathsToRevalidate.push("/projects")
        if (entry?.slug) {
          pathsToRevalidate.push(`/projects/${entry.slug}`)
          if (entry.publishedAt) {
            pathsToRevalidate.push("/")
          }
        }
        break

      case "homepage":
        pathsToRevalidate.push("/")
        break

      case "category":
      case "tag":
        pathsToRevalidate.push("/blog")
        break

      case "site-setting":
      case "navigation":
        pathsToRevalidate.push("/", "/blog", "/projects", "/docs")
        break

      default:
        pathsToRevalidate.push("/")
    }

    for (const path of [...new Set(pathsToRevalidate)]) {
      revalidatePath(path)
    }

    return NextResponse.json({
      revalidated: true,
      paths: [...new Set(pathsToRevalidate)],
      timestamp: Date.now(),
    })
  } catch (error) {
    console.error("Revalidation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
