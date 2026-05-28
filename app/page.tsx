"use client"

import React, { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { Sun, Moon, ExternalLink, Sparkles } from "lucide-react"
import { dummyLinks, getFaviconUrl } from "@/Data/links"
import { Card } from "@/components/ui/card"

export default function Page() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Hydration mismatch 방지
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <main className="relative flex min-h-svh w-full flex-col items-center justify-start overflow-x-hidden bg-radial from-slate-50 via-zinc-100 to-slate-100 px-4 py-16 dark:from-zinc-900 dark:via-neutral-950 dark:to-zinc-950 transition-colors duration-500">
      {/* 플로팅 테마 토글 버튼 */}
      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="fixed top-6 right-6 z-50 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-foreground/10 bg-card/75 shadow-lg backdrop-blur-md hover:bg-accent hover:scale-105 active:scale-95 transition-all text-foreground"
        aria-label="화면 테마 변경"
        id="theme-toggle-btn"
      >
        {theme === "dark" ? (
          <Sun className="h-5 w-5 animate-pulse text-amber-500" />
        ) : (
          <Moon className="h-5 w-5 text-indigo-600" />
        )}
      </button>

      {/* 상단 장식 그라데이션 오라 */}
      <div className="pointer-events-none absolute top-0 left-1/2 -z-10 h-72 w-full max-w-lg -translate-x-1/2 rounded-full bg-gradient-to-b from-indigo-500/10 via-purple-500/5 to-transparent blur-3xl dark:from-indigo-500/5 dark:via-purple-500/2 dark:to-transparent" />

      <div className="flex w-full max-w-md flex-col items-center gap-8">
        {/* 프로필 영역 */}
        <header className="flex flex-col items-center text-center animate-fade-in">
          <div className="relative group">
            {/* 프로필 외곽 글로우 효과 */}
            <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 opacity-60 blur-md group-hover:opacity-100 group-hover:blur-lg transition duration-500" />
            <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 text-3xl font-extrabold text-white shadow-xl border-2 border-background">
              ML
            </div>
            <span className="absolute bottom-0 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground border border-background shadow-md">
              <Sparkles className="h-3 w-3 animate-spin-[spin_3s_linear_infinite]" />
            </span>
          </div>

          <h1 className="mt-5 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            My Links
          </h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-xs">
            나의 즐겨찾기와 포트폴리오를 한눈에 볼 수 있는 퍼스널 링크 허브입니다.
          </p>
        </header>

        {/* 링크 목록 영역 */}
        <section className="flex w-full flex-col gap-4" id="links-container">
          {dummyLinks.map((link, index) => {
            const faviconUrl = getFaviconUrl(link.url, 64)
            return (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group w-full transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animationFillMode: "both",
                }}
                id={`link-item-${link.id}`}
              >
                <Card className="flex items-center gap-4 p-4 border border-foreground/10 bg-card/60 hover:bg-card/95 dark:bg-card/30 dark:hover:bg-card/70 shadow-sm hover:shadow-md backdrop-blur-md transition-all duration-300">
                  {/* 파비콘 아이콘 컨테이너 */}
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-white dark:bg-zinc-800 p-2 shadow-inner border border-foreground/5 transition-transform duration-300 group-hover:scale-105">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={faviconUrl}
                      alt={`${link.title} favicon`}
                      className="h-7 w-7 object-contain"
                      loading="lazy"
                      onError={(e) => {
                        // 기본 파비콘 로드 에러 시 텍스트 첫 글자 아이콘 대체
                        const target = e.currentTarget
                        target.style.display = "none"
                        const parent = target.parentElement
                        if (parent) {
                          const fallback = document.createElement("div")
                          fallback.className = "flex h-full w-full items-center justify-center text-sm font-semibold text-indigo-500 dark:text-indigo-400"
                          fallback.innerText = link.title.substring(0, 1)
                          parent.appendChild(fallback)
                        }
                      }}
                    />
                  </div>

                  {/* 링크 타이틀 & URL 정보 */}
                  <div className="flex-grow text-left">
                    <h2 className="text-base font-semibold text-foreground leading-tight group-hover:text-primary transition-colors">
                      {link.title}
                    </h2>
                    <p className="mt-1 text-xs text-muted-foreground truncate max-w-[220px] sm:max-w-[280px]">
                      {link.url.replace(/^https?:\/\/(www\.)?/, "")}
                    </p>
                  </div>

                  {/* 우측 화살표 아이콘 */}
                  <div className="flex-shrink-0 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-300 pr-1">
                    <ExternalLink className="h-4.5 w-4.5" />
                  </div>
                </Card>
              </a>
            )
          })}
        </section>

        {/* 푸터 영역 */}
        <footer className="mt-6 text-center text-xs text-muted-foreground/60 select-none">
          <p>© {new Date().getFullYear()} My Link. All rights reserved.</p>
        </footer>
      </div>
    </main>
  )
}

