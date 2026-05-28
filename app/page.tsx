"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { 
  ExternalLink, Sparkles, Settings, Globe, Mail, 
  ArrowRight, LayoutTemplate
} from "lucide-react"
import { dummyLinks, dummySocials, defaultTags, getFaviconUrl, LinkItem, SocialItem } from "@/Data/links"

// 테마 프리셋 인터페이스 정의
interface ThemePreset {
  id: string;
  name: string;
  bgClass: string;
  auraClass1: string;
  auraClass2: string;
  cardClass: string;
  cardHoverGlow: string;
  primaryText: string;
  accentText: string;
  primaryBg: string;
  badgeBg: string;
  tagBg: string;
  isDark: boolean;
}

// 5가지 프리미엄 컬러 프리셋 테마
const themePresets: ThemePreset[] = [
  {
    id: "cyberpunk",
    name: "Cyberpunk Neo",
    bgClass: "bg-radial from-violet-950 via-slate-950 to-neutral-950 text-slate-100",
    auraClass1: "from-fuchsia-500/20 via-purple-500/5 to-transparent",
    auraClass2: "from-cyan-500/10 via-blue-500/0 to-transparent",
    cardClass: "backdrop-blur-xl bg-slate-900/40 border border-fuchsia-500/20 shadow-[0_0_20px_rgba(240,46,170,0.05)]",
    cardHoverGlow: "hover:border-fuchsia-500/60 hover:shadow-[0_0_25px_rgba(240,46,170,0.25)]",
    primaryText: "text-fuchsia-400 group-hover:text-fuchsia-300",
    accentText: "text-cyan-400",
    primaryBg: "bg-gradient-to-r from-fuchsia-500 to-cyan-500",
    badgeBg: "bg-fuchsia-500/15 border border-fuchsia-500/30 text-fuchsia-300",
    tagBg: "bg-slate-800/80 border border-cyan-500/20 text-cyan-300",
    isDark: true,
  },
  {
    id: "emerald",
    name: "Midnight Teal",
    bgClass: "bg-radial from-emerald-950 via-zinc-950 to-neutral-950 text-emerald-50",
    auraClass1: "from-emerald-500/20 via-teal-500/5 to-transparent",
    auraClass2: "from-lime-500/10 via-emerald-500/0 to-transparent",
    cardClass: "backdrop-blur-xl bg-zinc-900/40 border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.05)]",
    cardHoverGlow: "hover:border-emerald-400/60 hover:shadow-[0_0_25px_rgba(16,185,129,0.25)]",
    primaryText: "text-emerald-400 group-hover:text-emerald-300",
    accentText: "text-teal-400",
    primaryBg: "bg-gradient-to-r from-emerald-500 to-teal-500",
    badgeBg: "bg-emerald-500/15 border border-emerald-500/30 text-emerald-300",
    tagBg: "bg-zinc-800/80 border border-teal-500/20 text-teal-300",
    isDark: true,
  },
  {
    id: "sunset",
    name: "Sunset Glow",
    bgClass: "bg-radial from-amber-950 via-rose-950 to-neutral-950 text-rose-50",
    auraClass1: "from-orange-500/20 via-rose-500/5 to-transparent",
    auraClass2: "from-violet-500/10 via-purple-500/0 to-transparent",
    cardClass: "backdrop-blur-xl bg-rose-950/20 border border-orange-500/20 shadow-[0_0_20px_rgba(249,115,22,0.05)]",
    cardHoverGlow: "hover:border-orange-400/60 hover:shadow-[0_0_25px_rgba(249,115,22,0.25)]",
    primaryText: "text-orange-400 group-hover:text-orange-300",
    accentText: "text-rose-400",
    primaryBg: "bg-gradient-to-r from-orange-500 to-rose-500",
    badgeBg: "bg-orange-500/15 border border-orange-500/30 text-orange-300",
    tagBg: "bg-rose-900/40 border border-rose-500/20 text-rose-300",
    isDark: true,
  },
  {
    id: "minimal",
    name: "Minimal Slate",
    bgClass: "bg-radial from-slate-900 via-slate-950 to-zinc-950 text-slate-100",
    auraClass1: "from-slate-500/15 via-zinc-500/5 to-transparent",
    auraClass2: "from-indigo-500/10 via-slate-500/0 to-transparent",
    cardClass: "backdrop-blur-xl bg-slate-900/60 border border-slate-700/40 shadow-xl",
    cardHoverGlow: "hover:border-slate-400/80 hover:shadow-2xl",
    primaryText: "text-slate-200 group-hover:text-white",
    accentText: "text-indigo-400",
    primaryBg: "bg-gradient-to-r from-slate-600 to-indigo-600",
    badgeBg: "bg-slate-800 border border-slate-700 text-slate-300",
    tagBg: "bg-slate-800 border border-slate-700 text-slate-300",
    isDark: true,
  },
  {
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
  }
];

export default function Page() {
  const router = useRouter()
  const { setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  
  const [activeThemeId, setActiveThemeId] = useState<string>("cyberpunk")
  
  // 프로필 정보 상태
  const [profile, setProfile] = useState({
    displayName: "정운학 (Unhak Jeong)",
    bio: "🚀 마이링크 프론트엔드 리디자인 연구원 | 멋진 인터랙션과 최상의 UX를 설계하는 제품 지향적 개발자입니다. React, Next.js, Rust에 푹 빠져있습니다.",
    avatarInitials: "JU"
  })

  // 데이터 목록 상태들
  const [links, setLinks] = useState<LinkItem[]>([])
  const [socials, setSocials] = useState<SocialItem[]>([])
  const [tags, setTags] = useState<string[]>([])

  // Hydration mismatch 방지 및 로컬스토리지 로딩
  useEffect(() => {
    setMounted(true)
    
    const savedProfile = localStorage.getItem("mylink_profile")
    const savedLinks = localStorage.getItem("mylink_links")
    const savedSocials = localStorage.getItem("mylink_socials")
    const savedTags = localStorage.getItem("mylink_tags")
    const savedThemeId = localStorage.getItem("mylink_theme_id")

    if (savedProfile) setProfile(JSON.parse(savedProfile))
    
    if (savedLinks) {
      setLinks(JSON.parse(savedLinks))
    } else {
      setLinks(dummyLinks)
    }

    if (savedSocials) {
      setSocials(JSON.parse(savedSocials))
    } else {
      setSocials(dummySocials)
    }

    if (savedTags) {
      setTags(JSON.parse(savedTags))
    } else {
      setTags(defaultTags)
    }

    if (savedThemeId) {
      setActiveThemeId(savedThemeId)
    }
  }, [])

  // 활성 프리셋 정보 로드
  const activePreset = themePresets.find(p => p.id === activeThemeId) || themePresets[0]

  // 테마 동기화 처리
  useEffect(() => {
    if (!mounted) return
    if (activePreset.isDark) {
      setTheme("dark")
    } else {
      setTheme("light")
    }
  }, [activeThemeId, activePreset, setTheme, mounted])

  // 소셜 위젯 플랫폼 아이콘 매퍼
  const renderSocialIcon = (platform: string, className = "h-5 w-5") => {
    switch (platform) {
      case 'github': 
        return (
          <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
            <path d="M9 18c-4.51 2-5-2-7-2" />
          </svg>
        );
      case 'linkedin': 
        return (
          <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
            <rect width="4" height="12" x="2" y="9" />
            <circle cx="4" cy="4" r="2" />
          </svg>
        );
      case 'twitter': 
        return (
          <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
          </svg>
        );
      case 'youtube': 
        return (
          <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17z" />
            <polygon points="10 15 15 12 10 9" fill="currentColor" />
          </svg>
        );
      case 'instagram': 
        return (
          <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
          </svg>
        );
      case 'email':
        return <Mail className={className} />;
      default:
        return <Globe className={className} />;
    }
  }

  if (!mounted) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-zinc-950 text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-r-2 border-fuchsia-500" />
          <p className="text-sm font-medium tracking-widest text-zinc-400">LOADING MYLINK...</p>
        </div>
      </div>
    )
  }

  return (
    <main className={`relative flex min-h-svh w-full flex-col items-center justify-start overflow-x-hidden p-4 pb-28 pt-12 sm:pt-20 transition-all duration-700 ease-in-out ${activePreset.bgClass}`}>
      
      {/* 1. 세련된 비침해적 플로팅 관리 페이지 기어 버튼 */}
      <div className="fixed top-6 right-6 z-50 flex items-center group">
        <button
          onClick={() => router.push("/mypage")}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-zinc-900/60 text-zinc-300 shadow-xl backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:border-emerald-500/40 hover:text-emerald-400 cursor-pointer"
          title="관리자 설정 페이지 이동"
        >
          <Settings className="h-5 w-5 transition-transform duration-500 group-hover:rotate-45" />
        </button>
        {/* 호버 시 툴팁 슬라이딩 */}
        <span className="pointer-events-none absolute right-14 scale-0 rounded-lg border border-white/5 bg-zinc-950 px-2.5 py-1 text-[10px] font-bold tracking-wider text-white shadow-2xl backdrop-blur-md transition-all duration-200 group-hover:scale-100 whitespace-nowrap">
          관리 페이지 이동
        </span>
      </div>

      {/* 2. 상단 장식 오라 백라이트 효과 */}
      <div className={`pointer-events-none absolute top-0 left-1/4 -z-10 h-96 w-96 rounded-full bg-gradient-to-b ${activePreset.auraClass1} blur-3xl`} />
      <div className={`pointer-events-none absolute top-40 right-1/4 -z-10 h-[500px] w-[500px] rounded-full bg-gradient-to-b ${activePreset.auraClass2} blur-3xl`} />

      {/* 3. 메인 링크트리 컨테이너 */}
      <div className="flex w-full max-w-md flex-col items-center gap-8 animate-fade-in">
        
        {/* 프로필 정보 섹션 */}
        <header className="flex flex-col items-center text-center w-full">
          <div className="relative group">
            {/* 프로필 외곽 다이내믹 그라데이션 광원 */}
            <div className={`absolute -inset-1 rounded-full ${activePreset.primaryBg} opacity-50 blur-md group-hover:opacity-95 group-hover:blur-xl transition duration-700`} />
            
            {/* 프로필 아바타 서클 */}
            <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-zinc-950 text-3xl font-black tracking-wider text-white shadow-2xl border-2 border-white/15 transition-transform duration-300 hover:scale-105">
              {profile.avatarInitials}
            </div>
          </div>

          {/* 프로필 이름 */}
          <h1 className="mt-5 text-xl font-black tracking-tight sm:text-2xl">
            {profile.displayName}
          </h1>

          {/* 프로필 Bio 자기소개 */}
          <div className="mt-3.5 w-full max-w-xs sm:max-w-sm">
            <p className="text-xs leading-relaxed text-zinc-400">
              {profile.bio}
            </p>
          </div>

          {/* 전문 관심 스택 배지 리스트 */}
          <div className="mt-5 flex flex-wrap justify-center gap-1.5 max-w-sm">
            {tags.map((tag) => (
              <span 
                key={tag} 
                className={`text-[10px] py-1 px-2.5 rounded-full font-bold select-none transition-transform hover:scale-105 ${activePreset.tagBg}`}
              >
                #{tag}
              </span>
            ))}
          </div>
        </header>

        {/* 4. 연결 링크 목록 섹션 (순수 뷰어 모드 & 글래스모피즘 디자인) */}
        <section className="flex w-full flex-col gap-4">
          {links.map((link, index) => {
            const faviconUrl = getFaviconUrl(link.url, 64)

            return (
              <div
                key={link.id}
                className="group relative w-full"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animationFillMode: "both",
                }}
              >
                {/* 엣지 글로우 라인 장식 */}
                <div className={`absolute -inset-0.5 rounded-2xl bg-gradient-to-r ${activePreset.primaryBg} opacity-0 group-hover:opacity-40 transition-opacity duration-300 blur-sm -z-10`} />

                {/* 링크 메인 카드 */}
                <div 
                  className={`flex items-center gap-3.5 p-4 rounded-2xl transition-all duration-300 ${activePreset.cardClass} ${activePreset.cardHoverGlow} cursor-pointer transform hover:-translate-y-1 hover:scale-[1.02] active:scale-[0.98]`}
                  onClick={() => {
                    window.open(link.url, "_blank", "noopener,noreferrer")
                  }}
                >
                  
                  {/* 파비콘 아이콘 컨테이너 */}
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-white/95 dark:bg-zinc-800/90 p-2.5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)] border border-white/20 transition-transform duration-300 group-hover:scale-105">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={faviconUrl}
                      alt={`${link.title} 파비콘`}
                      className="h-7 w-7 object-contain"
                      loading="lazy"
                      onError={(e) => {
                        const target = e.currentTarget
                        target.style.display = "none"
                        const parent = target.parentElement
                        if (parent) {
                          const existingFallback = parent.querySelector(".favicon-fallback")
                          if (existingFallback) existingFallback.remove()
                          
                          const fallback = document.createElement("div")
                          fallback.className = "favicon-fallback flex h-full w-full items-center justify-center text-base font-extrabold text-fuchsia-500 dark:text-cyan-400"
                          fallback.innerText = link.title ? link.title.substring(0, 1).toUpperCase() : "🔗"
                          parent.appendChild(fallback)
                        }
                      }}
                    />
                  </div>

                  {/* 텍스트 타이틀 & URL 정보 */}
                  <div className="flex-grow text-left overflow-hidden">
                    <h2 className={`text-[14px] sm:text-[15px] font-black leading-snug tracking-tight transition-colors ${activePreset.primaryText}`}>
                      {link.title}
                    </h2>
                    <p className="mt-1 text-[11px] truncate font-medium text-zinc-400/85 max-w-[210px] sm:max-w-[270px]">
                      {link.url.replace(/^https?:\/\/(www\.)?/, "")}
                    </p>
                  </div>

                  {/* 우측 앰비언트 액션 아이콘 */}
                  <div className="flex-shrink-0 flex items-center pl-1">
                    <span className={`text-zinc-400 transition-all duration-300 group-hover:translate-x-0.5 ${activePreset.accentText}`}>
                      <ExternalLink className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </section>

        {/* 푸터 영역 */}
        <footer className="mt-8 text-center text-[11px] text-zinc-500/85 select-none flex flex-col items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-zinc-500 animate-ping" />
            <p>Designed with High Aesthetics & Glassmorphism</p>
          </div>
          <p>© {new Date().getFullYear()} My Link. All rights reserved.</p>
        </footer>
      </div>

      {/* 5. 하단 고정형 세련된 소셜 미디어 독 */}
      <nav className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2 flex items-center gap-4 bg-zinc-900/70 dark:bg-black/40 border border-white/10 dark:border-white/5 backdrop-blur-xl px-5 py-2.5 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.4)] transition-transform duration-300 hover:scale-105">
        {socials.map((social) => (
          <a
            key={social.id}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className="relative group/social p-2 rounded-full text-zinc-400 hover:text-white dark:hover:text-cyan-400 hover:bg-white/5 transition-all duration-300"
          >
            {renderSocialIcon(social.platform)}
            
            {/* 호버 툴팁 */}
            <span className="absolute -top-9 left-1/2 -translate-x-1/2 scale-0 group-hover/social:scale-100 bg-zinc-950 border border-white/10 text-[9px] text-white px-2 py-1 rounded-md font-bold tracking-widest uppercase transition-all duration-300 shadow-2xl pointer-events-none whitespace-nowrap">
              {social.platform}
            </span>
          </a>
        ))}
      </nav>
    </main>
  )
}
