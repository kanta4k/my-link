"use client"

import React, { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { 
  Sparkles, LogOut, Settings, Eye, User, Mail, 
  Link2, Share2, Palette, ChevronDown, ChevronUp, Activity
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { db } from "@/lib/firebase"
import { collection, onSnapshot, doc } from "firebase/firestore"

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

interface HeaderProps {
  activePreset?: ThemePreset
  isDashboard?: boolean
}

export default function Header({ activePreset, isDashboard = false }: HeaderProps) {
  const router = useRouter()
  const { user, loading, loginWithGoogle, logout } = useAuth()

  // 드롭다운 메뉴 상태 관리
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // 실시간 통계 상태 관리
  const [linkCount, setLinkCount] = useState(0)
  const [activeSocialCount, setActiveSocialCount] = useState(0)
  const [userThemeId, setUserThemeId] = useState("glass-light")
  const [customProfileName, setCustomProfileName] = useState("")

  // 기본 프리셋 백업 (테마 미지정 시)
  const primaryBg = activePreset?.primaryBg || "bg-gradient-to-r from-fuchsia-500 to-cyan-500"
  const isDark = activePreset ? activePreset.isDark : true

  // Firestore 실시간 데이터 구독
  useEffect(() => {
    if (!user) {
      setLinkCount(0)
      setActiveSocialCount(0)
      setUserThemeId("glass-light")
      setCustomProfileName("")
      return
    }

    // 1. 사용자 프로필(이름 및 테마 ID) 실시간 구독
    const profileDocRef = doc(db, "users", user.uid)
    const unsubscribeProfile = onSnapshot(profileDocRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data()
        if (data.profile?.displayName) {
          setCustomProfileName(data.profile.displayName)
        }
        if (data.themeId) {
          setUserThemeId(data.themeId)
        }
      }
    }, (error) => {
      console.error("Header profile snapshot error:", error)
    })

    const profileSubDocRef = doc(db, "users", user.uid, "profile", "main")
    const unsubscribeProfileSubDoc = onSnapshot(profileSubDocRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data()
        if (data.displayName) {
          setCustomProfileName(data.displayName)
        }
      }
    }, (error) => {
      console.error("Header profile subdoc snapshot error:", error)
    })

    // 2. 등록된 링크 총 개수 실시간 구독
    const linksRef = collection(db, "users", user.uid, "links")
    const unsubscribeLinks = onSnapshot(linksRef, (snapshot) => {
      setLinkCount(snapshot.size)
    }, (error) => {
      console.error("Header links count error:", error)
    })

    // 3. 활성화된 소셜 채널 총 개수 실시간 구독
    const socialsRef = collection(db, "users", user.uid, "socials")
    const unsubscribeSocials = onSnapshot(socialsRef, (snapshot) => {
      let count = 0
      snapshot.docs.forEach((doc) => {
        const data = doc.data()
        if (data.active === true && data.url) {
          count++
        }
      })
      setActiveSocialCount(count)
    }, (error) => {
      console.error("Header socials count error:", error)
    })

    return () => {
      unsubscribeProfile()
      unsubscribeProfileSubDoc()
      unsubscribeLinks()
      unsubscribeSocials()
    }
  }, [user])

  // 드롭다운 외부 영역 클릭 감지 닫기
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isDropdownOpen])

  // 현재 매핑된 프리셋 정보 구하기
  const currentPreset = themePresets.find(p => p.id === userThemeId) || themePresets[0]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 py-3 sm:px-6">
      <div className={`mx-auto max-w-4xl flex items-center justify-between px-4 py-2.5 sm:px-6 rounded-2xl border transition-all duration-500 backdrop-blur-xl ${
        isDark 
          ? "bg-zinc-950/40 border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.4)]" 
          : "bg-white/60 border-slate-200/80 shadow-[0_4px_30px_rgba(16,185,129,0.03)]"
      }`}>
        
        {/* 1. 로고 브랜드 (좌측) */}
        <div 
          onClick={() => router.push("/")}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className={`relative flex h-8 w-8 items-center justify-center rounded-xl bg-zinc-950/80 border border-white/10 shadow-md transition-transform duration-300 group-hover:scale-110`}>
            <div className={`absolute -inset-0.5 rounded-xl ${primaryBg} opacity-40 blur-xs group-hover:opacity-85 transition-opacity duration-300`} />
            <Sparkles className={`relative h-4.5 w-4.5 text-amber-400 group-hover:rotate-12 transition-transform duration-500`} />
          </div>
          <span className={`text-sm font-black tracking-wider transition-all duration-300 bg-clip-text text-transparent bg-gradient-to-r ${
            isDark ? "from-white via-zinc-100 to-zinc-400" : "from-slate-900 to-slate-700"
          }`}>
            마이링크
          </span>
        </div>

        {/* 2. 유저 인증 상태 컨트롤 (우측) */}
        <div className="flex items-center gap-2" ref={dropdownRef}>
          {loading ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-t-transparent border-fuchsia-500" />
          ) : !user ? (
            // 비로그인 상태: 구글 로그인 버튼
            <Button
              onClick={loginWithGoogle}
              variant="outline"
              size="lg"
              className={`relative flex items-center gap-2 rounded-xl text-xs font-extrabold transition-all duration-300 hover:scale-105 active:scale-[0.98] cursor-pointer shadow-md ${
                isDark 
                  ? "bg-zinc-900/60 border-white/10 hover:border-fuchsia-500/40 hover:bg-zinc-950 text-white" 
                  : "bg-white border-slate-200 hover:border-emerald-500/40 hover:bg-slate-50 text-slate-700"
              }`}
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.54 15.02 0 12 0 7.35 0 3.37 2.67 1.48 6.56l3.89 3.02c.9-2.73 3.44-4.54 6.63-4.54z"
                />
                <path
                  fill="#4285F4"
                  d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.43c-.28 1.44-1.1 2.67-2.33 3.49l3.63 2.81c2.12-1.95 3.36-4.82 3.36-8.45z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.37 14.54c-.24-.72-.37-1.49-.37-2.29s.13-1.57.37-2.29L1.48 6.93C.53 8.88 0 11.08 0 13.41c0 2.33.53 4.53 1.48 6.48l3.89-3.02c-.24-.72-.37-1.49-.37-2.29z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.63-2.81c-1.01.68-2.31 1.09-3.8 1.09-3.19 0-5.73-1.81-6.63-4.54L1.98 17.85C3.87 21.33 7.85 24 12 24z"
                />
              </svg>
              <span>구글로 시작하기</span>
            </Button>
          ) : (
            // 로그인 상태: 프로필 드롭다운 트리거 아바타 영역
            <div className="relative">
              <div 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl border cursor-pointer select-none transition-all duration-300 active:scale-[0.98] ${
                  isDropdownOpen
                    ? isDark 
                      ? "bg-zinc-900 border-fuchsia-500/50 shadow-[0_0_12px_rgba(240,46,170,0.15)]"
                      : "bg-slate-100 border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.1)]"
                    : isDark 
                      ? "bg-black/20 border-white/5 hover:border-white/20 hover:bg-zinc-900/60" 
                      : "bg-slate-100 border-slate-200/80 hover:border-slate-300 hover:bg-slate-200/50"
                }`}
              >
                {user.photoURL ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img 
                    src={user.photoURL} 
                    alt="유저 프로필" 
                    className="h-5.5 w-5.5 rounded-full border border-white/10 shadow-sm" 
                  />
                ) : (
                  <div className="flex h-5.5 w-5.5 items-center justify-center rounded-full bg-zinc-700 text-[10px] font-black text-white">
                    {(customProfileName || user.displayName || "U").substring(0, 1).toUpperCase()}
                  </div>
                )}
                <span className={`text-[11px] font-extrabold max-w-[80px] truncate ${
                  isDark ? "text-zinc-200" : "text-slate-800"
                }`}>
                  {customProfileName || user.displayName || "사용자"}
                </span>
                {isDropdownOpen ? (
                  <ChevronUp className="h-3 w-3 text-zinc-400" />
                ) : (
                  <ChevronDown className="h-3 w-3 text-zinc-400" />
                )}
              </div>

              {/* 3. 프로필 드롭다운 메뉴 (고품격 프리미엄 카드 디자인) */}
              {isDropdownOpen && (
                <div className={`absolute right-0 mt-2.5 w-72 rounded-2xl border backdrop-blur-2xl shadow-2xl p-4 transition-all duration-300 animate-in fade-in slide-in-from-top-3 ${
                  isDark 
                    ? "bg-zinc-950/95 border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] text-white" 
                    : "bg-white/95 border-slate-200/90 shadow-[0_20px_50px_rgba(0,0,0,0.08)] text-slate-800"
                }`}>
                  
                  {/* 상단 앰비언트 백라이트 장식 (드롭다운 내) */}
                  <div className={`absolute -top-10 left-10 -z-10 h-32 w-32 rounded-full opacity-20 blur-2xl ${
                    isDark ? "bg-fuchsia-500" : "bg-emerald-400"
                  }`} />
                  <div className={`absolute -bottom-10 right-10 -z-10 h-32 w-32 rounded-full opacity-10 blur-2xl ${
                    isDark ? "bg-cyan-500" : "bg-teal-400"
                  }`} />

                  {/* A. 상세 유저 프로필 영역 */}
                  <div className="flex items-center gap-3 pb-3.5 border-b border-white/10 dark:border-white/5">
                    {user.photoURL ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img 
                        src={user.photoURL} 
                        alt="유저 대형 프로필" 
                        className="h-11 w-11 rounded-full border border-white/20 shadow-md" 
                      />
                    ) : (
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-tr from-fuchsia-600 to-cyan-500 text-sm font-black text-white shadow-md">
                        {(customProfileName || user.displayName || "U").substring(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-black tracking-wide truncate">
                        {customProfileName || user.displayName || "사용자"}
                      </span>
                      <span className="text-[10px] text-zinc-400 truncate flex items-center gap-1 mt-0.5">
                        <Mail className="h-3 w-3 shrink-0" />
                        {user.email || "이메일 없음"}
                      </span>
                    </div>
                  </div>

                  {/* B. 실시간 서비스 통계 정보 */}
                  <div className="grid grid-cols-2 gap-2.5 py-3">
                    <div className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition-colors ${
                      isDark ? "bg-zinc-900/40 border-white/5" : "bg-slate-50 border-slate-100"
                    }`}>
                      <div className="flex items-center gap-1.5 text-zinc-400 mb-1">
                        <Link2 className={`h-3.5 w-3.5 ${isDark ? "text-fuchsia-400" : "text-emerald-600"}`} />
                        <span className="text-[9px] font-bold">링크 카드</span>
                      </div>
                      <span className="text-sm font-extrabold tracking-tight">
                        {linkCount} <span className="text-[10px] text-zinc-500 font-medium">개</span>
                      </span>
                    </div>

                    <div className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition-colors ${
                      isDark ? "bg-zinc-900/40 border-white/5" : "bg-slate-50 border-slate-100"
                    }`}>
                      <div className="flex items-center gap-1.5 text-zinc-400 mb-1">
                        <Share2 className={`h-3.5 w-3.5 ${isDark ? "text-cyan-400" : "text-teal-600"}`} />
                        <span className="text-[9px] font-bold">소셜 채널</span>
                      </div>
                      <span className="text-sm font-extrabold tracking-tight">
                        {activeSocialCount} <span className="text-[10px] text-zinc-500 font-medium">개</span>
                      </span>
                    </div>
                  </div>

                  {/* C. 현재 적용된 비주얼 테마 정보 요약 */}
                  <div className={`flex items-center justify-between px-3 py-2 rounded-xl border text-[10px] mb-3 transition-all ${
                    isDark 
                      ? "bg-zinc-900/60 border-white/5 text-zinc-300" 
                      : "bg-slate-100/80 border-slate-200/50 text-slate-700"
                  }`}>
                    <span className="font-bold flex items-center gap-1.5">
                      <Palette className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                      비주얼 테마
                    </span>
                    <div className="flex items-center gap-1.5 font-extrabold">
                      {/* 미니 테마 도트 서클 */}
                      <span className={`h-2.5 w-2.5 rounded-full ${currentPreset.primaryBg} shadow-sm animate-pulse`} />
                      <span className={isDark ? "text-zinc-200" : "text-slate-800"}>
                        {currentPreset.name}
                      </span>
                    </div>
                  </div>

                  {/* D. 퀵 내비게이션 메뉴 */}
                  <div className="flex flex-col gap-1">
                    {isDashboard ? (
                      <button
                        onClick={() => {
                          setIsDropdownOpen(false)
                          router.push("/")
                        }}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-[11px] font-extrabold transition-all hover:scale-[1.01] active:scale-[0.99] text-white ${primaryBg} shadow-md hover:brightness-110 cursor-pointer`}
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>내 퍼블릭 페이지 보기</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setIsDropdownOpen(false)
                          router.push("/mypage")
                        }}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-[11px] font-extrabold transition-all hover:scale-[1.01] active:scale-[0.99] text-white ${primaryBg} shadow-md hover:brightness-110 cursor-pointer`}
                      >
                        <Settings className="h-3.5 w-3.5" />
                        <span>마이페이지</span>
                      </button>
                    )}
                  </div>

                  {/* E. 구분선 및 로그아웃 */}
                  <div className="my-3 border-t border-white/10 dark:border-white/5" />

                  <button
                    onClick={() => {
                      setIsDropdownOpen(false)
                      logout()
                    }}
                    className={`w-full flex items-center justify-center gap-2 py-2 rounded-xl text-[11px] font-extrabold transition-all cursor-pointer hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/35 border border-red-500/15 ${
                      isDark 
                        ? "bg-zinc-900/60 text-red-300/90" 
                        : "bg-white text-red-600"
                    }`}
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>안전하게 로그아웃</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
