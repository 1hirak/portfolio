import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ContactCTAProps {
  title?: string
  description?: string
  buttonText?: string
}

export function ContactCTA({
  title = "Let's Work Together",
  description = "Have a project in mind? Let's discuss how we can bring your ideas to life.",
  buttonText = "Get in Touch",
}: ContactCTAProps) {
  return (
    <section className="py-16 md:py-24 bg-muted/50">
      <div className="container text-center">
        <h2 className="text-3xl font-bold tracking-tight mb-4">{title}</h2>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8">
          {description}
        </p>
        <Button size="lg" asChild>
          <Link href="/contact">
            {buttonText}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </div>
    </section>
  )
}
