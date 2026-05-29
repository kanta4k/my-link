"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Link2, MousePointerClick } from "lucide-react"
import { collection, doc, onSnapshot, orderBy, query } from "firebase/firestore"

import Header from "@/components/Header"
import { Card } from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { LinkItem } from "@/Data/links"
import { db } from "@/lib/firebase"
import { useAuth } from "@/context/AuthContext"

const chartConfig = {
  clicks: {
    label: "클릭수",
    color: "var(--status-chart-color)",
  },
} satisfies ChartConfig

interface ThemePreset {
  id: string
  name: string
  bgClass: string
  auraClass1: string
  auraClass2: string
  cardClass: string
  cardHoverGlow: string
  primaryText: string
  accentText: string
  primaryBg: string
  badgeBg: string
  tagBg: string
  isDark: boolean
  chartColor: string
}

const themePresets: ThemePreset[] = [
  {
    id: "cyberpunk",
    name: "Cyberpunk Neo",
    bgClass: "bg-radial from-violet-950 via-slate-950 to-neutral-950 text-slate-100",
    auraClass1: "from-fuchsia-500/20 via-purple-500/5 to-transparent",
    auraClass2: "from-cyan-500/10 via-blue-500/0 to-transparent",
    cardClass: "backdrop-blur-xl bg-slate-900/40 border border-fuchsia-500/20 shadow-[0_0_20px_rgba(240,46,170,0.05)]",
    cardHoverGlow: "hover:border-fuchsia-500/60 hover:shadow-[0_0_25px_rgba(240,46,170,0.25)]",
    primaryText: "text-fuchsia-400",
    accentText: "text-cyan-400",
    primaryBg: "bg-gradient-to-r from-fuchsia-500 to-cyan-500",
    badgeBg: "bg-fuchsia-500/15 border border-fuchsia-500/30 text-fuchsia-300",
    tagBg: "bg-slate-800/80 border border-cyan-500/20 text-cyan-300",
    isDark: true,
    chartColor: "#d946ef",
  },
  {
    id: "emerald",
    name: "Midnight Teal",
    bgClass: "bg-radial from-emerald-950 via-zinc-950 to-neutral-950 text-emerald-50",
    auraClass1: "from-emerald-500/20 via-teal-500/5 to-transparent",
    auraClass2: "from-lime-500/10 via-emerald-500/0 to-transparent",
    cardClass: "backdrop-blur-xl bg-zinc-900/40 border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.05)]",
    cardHoverGlow: "hover:border-emerald-400/60 hover:shadow-[0_0_25px_rgba(16,185,129,0.25)]",
    primaryText: "text-emerald-400",
    accentText: "text-teal-400",
    primaryBg: "bg-gradient-to-r from-emerald-500 to-teal-500",
    badgeBg: "bg-emerald-500/15 border border-emerald-500/30 text-emerald-300",
    tagBg: "bg-zinc-800/80 border border-teal-500/20 text-teal-300",
    isDark: true,
    chartColor: "#10b981",
  },
  {
    id: "sunset",
    name: "Sunset Glow",
    bgClass: "bg-radial from-amber-950 via-rose-950 to-neutral-950 text-rose-50",
    auraClass1: "from-orange-500/20 via-rose-500/5 to-transparent",
    auraClass2: "from-violet-500/10 via-purple-500/0 to-transparent",
    cardClass: "backdrop-blur-xl bg-rose-950/20 border border-orange-500/20 shadow-[0_0_20px_rgba(249,115,22,0.05)]",
    cardHoverGlow: "hover:border-orange-400/60 hover:shadow-[0_0_25px_rgba(249,115,22,0.25)]",
    primaryText: "text-orange-400",
    accentText: "text-rose-400",
    primaryBg: "bg-gradient-to-r from-orange-500 to-rose-500",
    badgeBg: "bg-orange-500/15 border border-orange-500/30 text-orange-300",
    tagBg: "bg-rose-900/40 border border-rose-500/20 text-rose-300",
    isDark: true,
    chartColor: "#f97316",
  },
  {
    id: "minimal",
    name: "Minimal Slate",
    bgClass: "bg-radial from-slate-900 via-slate-950 to-zinc-950 text-slate-100",
    auraClass1: "from-slate-500/15 via-zinc-500/5 to-transparent",
    auraClass2: "from-indigo-500/10 via-slate-500/0 to-transparent",
    cardClass: "backdrop-blur-xl bg-slate-900/60 border border-slate-700/40 shadow-xl",
    cardHoverGlow: "hover:border-slate-400/80 hover:shadow-2xl",
    primaryText: "text-slate-200",
    accentText: "text-indigo-400",
    primaryBg: "bg-gradient-to-r from-slate-600 to-indigo-600",
    badgeBg: "bg-slate-800 border border-slate-700 text-slate-300",
    tagBg: "bg-slate-800 border border-slate-700 text-slate-300",
    isDark: true,
    chartColor: "#6366f1",
  },
  {
    id: "glass-light",
    name: "Glass Emerald (Light)",
    bgClass: "bg-radial from-emerald-50 via-zinc-100 to-slate-100 text-slate-900",
    auraClass1: "from-emerald-500/10 via-teal-500/5 to-transparent",
    auraClass2: "from-lime-500/10 via-emerald-500/0 to-transparent",
    cardClass: "backdrop-blur-xl bg-white/70 border border-emerald-500/15 shadow-[0_8px_30px_rgb(0,0,0,0.04)]",
    cardHoverGlow: "hover:border-emerald-500/40 hover:shadow-[0_8px_30px_rgb(16,185,129,0.12)]",
    primaryText: "text-emerald-700",
    accentText: "text-teal-600",
    primaryBg: "bg-gradient-to-r from-emerald-500 to-teal-500",
    badgeBg: "bg-emerald-500/10 border border-emerald-500/20 text-emerald-700",
    tagBg: "bg-white/90 border border-slate-200 text-slate-700",
    isDark: false,
    chartColor: "#059669",
  },
]

export default function StatusPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [links, setLinks] = useState<LinkItem[]>([])
  const [themeId, setThemeId] = useState("glass-light")

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/")
    }
  }, [loading, router, user])

  useEffect(() => {
    if (!user) return

    const userDocRef = doc(db, "users", user.uid)
    const unsubscribeUser = onSnapshot(
      userDocRef,
      (snapshot) => {
        const nextThemeId = snapshot.data()?.themeId
        if (typeof nextThemeId === "string") {
          setThemeId(nextThemeId)
        }
      },
      (error) => {
        console.error("Status theme sync error:", error)
      }
    )

    const linksRef = collection(db, "users", user.uid, "links")
    const linksQuery = query(linksRef, orderBy("createdAt", "desc"))
    const unsubscribeLinks = onSnapshot(
      linksQuery,
      (snapshot) => {
        setLinks(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            title: doc.data().title || "",
            url: doc.data().url || "",
            clickCount:
              typeof doc.data().clickCount === "number" ? doc.data().clickCount : 0,
          }))
        )
      },
      (error) => {
        console.error("Status links sync error:", error)
      }
    )

    return () => {
      unsubscribeUser()
      unsubscribeLinks()
    }
  }, [user])

  const sortedLinks = useMemo(
    () => [...links].sort((a, b) => (b.clickCount || 0) - (a.clickCount || 0)),
    [links]
  )
  const totalClickCount = useMemo(
    () => links.reduce((total, link) => total + (link.clickCount || 0), 0),
    [links]
  )
  const chartData = sortedLinks.map((link) => ({
    title: link.title || "제목 없는 링크",
    clicks: link.clickCount || 0,
  }))
  const activePreset =
    themePresets.find((preset) => preset.id === themeId) || themePresets[4]
  const mutedText = activePreset.isDark ? "text-zinc-400" : "text-slate-500"
  const subtleText = activePreset.isDark ? "text-zinc-500" : "text-slate-500"
  const rowClass = activePreset.isDark
    ? "border-white/5 bg-zinc-950/30"
    : "border-emerald-500/10 bg-white/70"

  if (loading || !user) {
    return (
      <main className="flex min-h-svh items-center justify-center bg-zinc-950 text-white">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-emerald-400 border-t-transparent" />
      </main>
    )
  }

  return (
    <main
      className={`relative min-h-svh overflow-hidden px-4 pb-16 pt-28 transition-all duration-700 ${activePreset.bgClass}`}
      style={{ "--status-chart-color": activePreset.chartColor } as React.CSSProperties}
    >
      <Header activePreset={activePreset} isDashboard />

      <div className={`pointer-events-none absolute top-0 left-1/4 -z-10 h-96 w-96 rounded-full bg-gradient-to-b ${activePreset.auraClass1} blur-3xl`} />
      <div className={`pointer-events-none absolute top-40 right-1/4 -z-10 h-[500px] w-[500px] rounded-full bg-gradient-to-b ${activePreset.auraClass2} blur-3xl`} />

      <div className="mx-auto flex w-full max-w-5xl flex-col gap-5">
        <header className="flex flex-col gap-2">
          <p className={`text-xs font-bold uppercase tracking-widest ${activePreset.accentText}`}>
            Status Dashboard
          </p>
          <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
            링크 클릭 통계
          </h1>
          <p className={`max-w-xl text-xs leading-relaxed ${mutedText}`}>
            퍼블릭 링크 페이지에서 발생한 클릭 흐름을 링크별로 확인합니다.
          </p>
        </header>

        <section className="grid gap-4 sm:grid-cols-[0.9fr_1.4fr]">
          <Card className={`rounded-2xl p-5 ${activePreset.cardClass}`}>
            <div className={`flex items-center gap-2 ${mutedText}`}>
              <MousePointerClick className={`h-4 w-4 ${activePreset.primaryText}`} />
              <span className="text-xs font-bold">총 클릭수</span>
            </div>
            <p className="mt-5 text-4xl font-black tracking-tight sm:text-5xl">
              총 {totalClickCount.toLocaleString()} 클릭
            </p>
            <p className={`mt-3 text-xs leading-relaxed ${subtleText}`}>
              현재 등록된 모든 링크의 클릭수를 합산한 값입니다.
            </p>
            <div className={`mt-5 inline-flex rounded-full px-3 py-1 text-[10px] font-black ${activePreset.badgeBg}`}>
              {links.length.toLocaleString()}개 링크 추적 중
            </div>
          </Card>

          <Card className={`rounded-2xl p-5 ${activePreset.cardClass}`}>
            <div className="mb-4 flex items-center gap-2">
              <Link2 className={`h-4 w-4 ${activePreset.accentText}`} />
              <h2 className="text-sm font-bold">링크별 클릭 차트</h2>
            </div>
            <ChartContainer config={chartConfig} className="h-[280px] w-full">
              <BarChart data={chartData} margin={{ left: -20, right: 8 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.35} />
                <XAxis
                  dataKey="title"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  interval={0}
                  tickFormatter={(value) =>
                    value.length > 10 ? `${value.slice(0, 10)}...` : value
                  }
                />
                <YAxis tickLine={false} axisLine={false} allowDecimals={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="clicks"
                  fill="var(--color-clicks)"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </Card>
        </section>

        <Card className={`rounded-2xl p-5 ${activePreset.cardClass}`}>
          <h2 className="mb-4 text-sm font-bold">클릭 많은 순</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {sortedLinks.length > 0 ? (
              sortedLinks.map((link) => (
                <div
                  key={link.id}
                  className={`flex items-center justify-between gap-3 rounded-2xl border px-3.5 py-3 ${rowClass}`}
                >
                  <div className="min-w-0">
                    <p className="truncate text-xs font-extrabold">
                      {link.title || "제목 없는 링크"}
                    </p>
                    <p className={`mt-0.5 truncate text-[10px] ${subtleText}`}>
                      {link.url.replace(/^https?:\/\/(www\.)?/, "")}
                    </p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-black ${activePreset.badgeBg}`}>
                    {(link.clickCount || 0).toLocaleString()}
                  </span>
                </div>
              ))
            ) : (
              <div className={`rounded-2xl border border-dashed px-4 py-8 text-center text-xs sm:col-span-2 ${activePreset.isDark ? "border-white/10 text-zinc-500" : "border-emerald-500/20 text-slate-500"}`}>
                통계를 표시할 링크가 없습니다.
              </div>
            )}
          </div>
        </Card>
      </div>
    </main>
  )
}
