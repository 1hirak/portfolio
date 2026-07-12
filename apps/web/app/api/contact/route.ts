import { NextRequest, NextResponse } from "next/server"
import { contactFormSchema } from "@/lib/validations"

const rateLimitMap = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT_WINDOW = 60 * 1000
const RATE_LIMIT_MAX = 5

const STRAPI_URL = process.env.STRAPI_INTERNAL_URL || "http://cms:1337"
const API_TOKEN = process.env.STRAPI_API_TOKEN || ""

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"

  const now = Date.now()
  const rateData = rateLimitMap.get(ip)
  if (rateData) {
    if (now < rateData.resetTime) {
      rateData.count++
      if (rateData.count > RATE_LIMIT_MAX) {
        return NextResponse.json(
          { error: "Too many requests. Please try again later." },
          { status: 429 }
        )
      }
    } else {
      rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
    }
  } else {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
  }

  try {
    const body = await request.json()

    if (body.honeypot && body.honeypot.length > 0) {
      return NextResponse.json({ success: true })
    }

    const validation = contactFormSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      )
    }

    const { name, email, subject, message } = validation.data

    const strapiResponse = await fetch(`${STRAPI_URL}/api/contact-submissions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(API_TOKEN ? { Authorization: `Bearer ${API_TOKEN}` } : {}),
      },
      body: JSON.stringify({
        data: { name, email, subject, message },
      }),
    })

    if (!strapiResponse.ok) {
      console.error("Failed to store contact submission in Strapi")
    }

    return NextResponse.json(
      { success: true, message: "Message sent successfully!" },
      { status: 200 }
    )
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
