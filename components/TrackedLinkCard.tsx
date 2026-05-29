"use client"

import { ExternalLink } from "lucide-react"

import { getFaviconUrl } from "@/Data/links"
import { Card } from "@/components/ui/card"

interface TrackedLinkCardProps {
  userId: string
  linkId: string
  title: string
  url: string
  cardClass: string
  primaryText: string
  accentText: string
}

export default function TrackedLinkCard({
  userId,
  linkId,
  title,
  url,
  cardClass,
  primaryText,
  accentText,
}: TrackedLinkCardProps) {
  const faviconUrl = getFaviconUrl(url, 64)

  const recordClick = async () => {
    try {
      const response = await fetch("/api/links/click", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, linkId }),
      })

      if (!response.ok) {
        console.error("Click count failed:", await response.text())
      }
    } catch (error) {
      console.error("Click count failed:", error)
    }
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => {
        void recordClick()
      }}
      className="group block w-full"
    >
      <Card
        className={`flex flex-row items-center gap-3.5 rounded-2xl p-4 shadow-xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 ${cardClass}`}
      >
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border border-white/20 bg-white/95 p-2.5 shadow-inner">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={faviconUrl} alt="" className="h-7 w-7 object-contain" />
        </div>

        <div className="min-w-0 flex-1 text-left">
          <h2 className={`truncate text-sm font-black ${primaryText}`}>
            {title || "제목 없는 링크"}
          </h2>
          <p className="mt-1 truncate text-xs font-medium text-zinc-500">
            {url.replace(/^https?:\/\/(www\.)?/, "")}
          </p>
        </div>

        <ExternalLink
          className={`h-4 w-4 flex-shrink-0 transition-transform group-hover:translate-x-0.5 ${accentText}`}
        />
      </Card>
    </a>
  )
}
