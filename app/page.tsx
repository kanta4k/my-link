import Link from "next/link"
import {
  ArrowRight,
  BarChart3,
  GitBranch,
  Link2,
  MousePointerClick,
  Sparkles,
  UserRound,
} from "lucide-react"

import Header from "@/components/Header"
import { Card } from "@/components/ui/card"

const features = [
  {
    title: "링크 관리",
    description: "자주 쓰는 링크를 한곳에 모으고 제목과 주소를 빠르게 편집합니다.",
    icon: Link2,
  },
  {
    title: "클릭 통계",
    description: "링크별 클릭수와 전체 클릭 흐름을 통계 페이지에서 확인합니다.",
    icon: BarChart3,
  },
  {
    title: "개인 URL",
    description: "나만의 username으로 공유 가능한 공개 링크 페이지를 만듭니다.",
    icon: UserRound,
  },
]

const previewLinks = [
  { title: "Portfolio", clicks: 128 },
  { title: "GitHub", clicks: 74 },
  { title: "Tech Blog", clicks: 32 },
]

export default function LandingPage() {
  return (
    <main className="min-h-svh overflow-hidden bg-radial from-emerald-50 via-zinc-100 to-slate-100 text-slate-950">
      <Header
        activePreset={{
          id: "glass-light",
          name: "Glass Emerald (Light)",
          bgClass: "bg-radial from-emerald-50 via-zinc-100 to-slate-100 text-slate-900",
          auraClass1: "from-emerald-500/10 via-teal-500/5 to-transparent",
          auraClass2: "from-lime-500/10 via-emerald-500/0 to-transparent",
          cardClass: "backdrop-blur-xl bg-white/70 border border-emerald-500/15 shadow-[0_8px_30px_rgb(0,0,0,0.04)]",
          cardHoverGlow: "hover:border-emerald-500/40 hover:shadow-[0_8px_30px_rgb(16,185,129,0.12)]",
          primaryText: "text-emerald-700 group-hover:text-emerald-600",
          accentText: "text-teal-600",
          primaryBg: "bg-gradient-to-r from-emerald-500 to-teal-500",
          badgeBg: "bg-emerald-500/10 border border-emerald-500/20 text-emerald-700",
          tagBg: "bg-white/90 border border-slate-200 text-slate-700",
          isDark: false,
        }}
      />

      <section className="relative flex min-h-[calc(100svh-24px)] items-center px-4 pb-14 pt-28 sm:px-6 sm:pt-32">
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-10 h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-emerald-300/20 blur-3xl" />
          <div className="absolute bottom-10 right-[-120px] h-[420px] w-[420px] rounded-full bg-teal-300/20 blur-3xl" />
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-emerald-300/60 to-transparent" />
        </div>

        <div className="mx-auto grid w-full max-w-6xl items-center gap-10 lg:grid-cols-[1fr_0.9fr]">
          <div className="max-w-2xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-white/70 px-3 py-1.5 text-xs font-black text-emerald-700 shadow-sm backdrop-blur-xl">
              <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
              SELC 링크 프로필 빌더
            </div>

            <h1 className="text-5xl font-black leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
              마이링크
            </h1>
            <p className="mt-5 max-w-xl text-base font-semibold leading-relaxed text-slate-600 sm:text-lg">
              흩어진 링크를 하나의 세련된 프로필로 정리하고, 클릭 흐름까지 확인하는 개인 링크 허브입니다.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/mypage"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-3 text-sm font-black text-white shadow-lg shadow-emerald-500/20 transition hover:brightness-110"
              >
                시작하기
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/status"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-500/20 bg-white/75 px-5 py-3 text-sm font-black text-slate-800 shadow-sm backdrop-blur-xl transition hover:border-emerald-500/40 hover:bg-white"
              >
                통계 보기
                <MousePointerClick className="h-4 w-4 text-emerald-600" />
              </Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md">
            <div className="absolute -inset-5 rounded-[2rem] bg-gradient-to-r from-emerald-400/20 to-teal-400/20 blur-2xl" />
            <div className="relative overflow-hidden rounded-[1.75rem] border border-white/80 bg-white/75 p-4 shadow-2xl shadow-emerald-900/10 backdrop-blur-2xl">
              <div className="rounded-[1.25rem] border border-emerald-500/10 bg-slate-950 p-4 text-white">
                <div className="flex items-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-lg font-black">
                    JU
                  </div>
                  <div>
                    <p className="text-sm font-black">정운학</p>
                    <p className="text-xs text-zinc-400">@juh3571</p>
                  </div>
                </div>
                <div className="mt-5 flex flex-col gap-3">
                  {previewLinks.map((link) => (
                    <div
                      key={link.title}
                      className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-3.5 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-emerald-700">
                          <Link2 className="h-4 w-4" />
                        </span>
                        <span className="text-xs font-black">{link.title}</span>
                      </div>
                      <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-[10px] font-black text-emerald-300">
                        {link.clicks} 클릭
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-7 flex flex-col gap-2">
            <p className="text-xs font-black uppercase tracking-widest text-emerald-700">
              Features
            </p>
            <h2 className="text-2xl font-black tracking-tight sm:text-3xl">
              필요한 기능만 단정하게
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon

              return (
                <Card
                  key={feature.title}
                  className="rounded-2xl border border-emerald-500/15 bg-white/75 p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl transition hover:border-emerald-500/35"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-700">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-base font-black">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {feature.description}
                  </p>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6">
        <div className="mx-auto grid max-w-6xl items-center gap-8 rounded-[1.75rem] border border-emerald-500/15 bg-white/65 p-5 shadow-[0_20px_80px_rgba(16,185,129,0.12)] backdrop-blur-xl sm:p-8 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-teal-700">
              Preview
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
              공유할 때는 단순하게, 관리할 때는 명확하게
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-600">
              공개 페이지는 방문자가 링크에 집중하도록 구성하고, 관리자는 마이페이지와 통계 페이지에서 성과를 빠르게 확인합니다.
            </p>
            <Link
              href="/mypage"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-black text-white shadow-lg transition hover:bg-slate-800"
            >
              내 페이지 만들기
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-950 p-4 text-white shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-xs font-black text-zinc-300">mylink.app/juh3571</span>
              <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-[10px] font-black text-emerald-300">
                LIVE
              </span>
            </div>
            <div className="grid gap-3">
              <div className="h-28 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 p-4">
                <p className="text-sm font-black">오늘의 클릭</p>
                <p className="mt-3 text-4xl font-black">234</p>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="h-16 rounded-xl bg-white/10" />
                <div className="h-16 rounded-xl bg-white/10" />
                <div className="h-16 rounded-xl bg-white/10" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-emerald-500/10 px-4 py-8 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-slate-500 sm:flex-row">
          <p className="font-bold">SELC 정운학</p>
          <a
            href="https://github.com/kanta4k/my-link"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-black text-slate-700 transition hover:text-emerald-700"
          >
            <GitBranch className="h-4 w-4" />
            GitHub
          </a>
        </div>
      </footer>
    </main>
  )
}
