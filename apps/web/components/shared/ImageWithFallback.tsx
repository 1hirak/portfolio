"use client"

import Image from "next/image"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface ImageWithFallbackProps {
  src: string
  alt: string
  width?: number
  height?: number
  fill?: boolean
  className?: string
  priority?: boolean
  sizes?: string
}

export function ImageWithFallback({
  src,
  alt,
  width,
  height,
  fill,
  className,
  priority,
  sizes,
}: ImageWithFallbackProps) {
  const [error, setError] = useState(false)
  const fallbackSrc = "/placeholder.svg"

  if (error) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-muted text-muted-foreground",
          className
        )}
        style={{ width: fill ? undefined : width, height: fill ? undefined : height }}
      >
        <span className="text-sm">{alt?.[0] || "?"}</span>
      </div>
    )
  }

  const imgProps = {
    src,
    alt,
    className,
    onError: () => setError(true),
    priority,
    sizes,
  }

  if (fill) {
    return <Image {...imgProps} fill />
  }

  return <Image {...imgProps} width={width} height={height} />
}
