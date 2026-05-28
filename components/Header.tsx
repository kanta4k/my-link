"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { Sparkles, LogOut, Settings, Eye, Layout } from "lucide-react"

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

interface HeaderProps {
  activePreset?: ThemePreset
  isDashboard?: boolean
}

export default function Header({ activePreset, isDashboard = false }: HeaderProps) {
  const router = useRouter()
  const { user, loading, loginWithGoogle, logout } = useAuth()

  // 기본 프리셋 백업 (테마 미지정 시)
  const primaryText = activePreset?.primaryText || "text-fuchsia-400"
  const primaryBg = activePreset?.primaryBg || "bg-gradient-to-r from-fuchsia-500 to-cyan-500"
  const isDark = activePreset ? activePreset.isDark : true

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
        <div className="flex items-center gap-2">
          {loading ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-t-transparent border-fuchsia-500" />
          ) : !user ? (
            // 비로그인 상태: 구글 로그인 버튼
            <button
              onClick={loginWithGoogle}
              className={`relative flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-extrabold transition-all duration-300 cursor-pointer shadow-md hover:scale-105 active:scale-[0.98] ${
                isDark 
                  ? "bg-zinc-900/60 border-white/10 hover:border-fuchsia-500/40 hover:bg-zinc-950 text-white" 
                  : "bg-white border-slate-200 hover:border-emerald-500/40 hover:bg-slate-50 text-slate-700"
              }`}
            >
              {/* Google 아이콘 SVG */}
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
            </button>
          ) : (
            // 로그인 상태: 사용자 아바타 및 동작 버튼
            <div className="flex items-center gap-3">
              {/* 사용자 정보 배지 */}
              <div className="hidden sm:flex items-center gap-2 pl-2.5 pr-3 py-1 rounded-xl bg-black/10 dark:bg-white/5 border border-white/5">
                {user.photoURL ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img 
                    src={user.photoURL} 
                    alt="유저 프로필" 
                    className="h-5 w-5 rounded-full border border-white/10" 
                  />
                ) : (
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-zinc-700 text-[10px] font-black text-white">
                    {user.displayName ? user.displayName.substring(0,1).toUpperCase() : "U"}
                  </div>
                )}
                <span className={`text-[11px] font-extrabold max-w-[80px] truncate ${
                  isDark ? "text-zinc-200" : "text-slate-700"
                }`}>
                  {user.displayName || "사용자"}
                </span>
              </div>

              {/* 페이지 이동 퀵액션 */}
              {isDashboard ? (
                // 대시보드에서는 '내 페이지 보기' 버튼
                <button
                  onClick={() => router.push("/")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-extrabold text-white ${primaryBg} rounded-xl shadow-md hover:brightness-110 transition-all cursor-pointer hover:scale-105 active:scale-[0.98]`}
                  title="내 퍼블릭 링크 보러가기"
                >
                  <Eye className="h-4 w-4" />
                  <span className="hidden xs:inline">페이지 보기</span>
                </button>
              ) : (
                // 퍼블릭 페이지에서는 '관리자' 버튼
                <button
                  onClick={() => router.push("/mypage")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-extrabold text-white ${primaryBg} rounded-xl shadow-md hover:brightness-110 transition-all cursor-pointer hover:scale-105 active:scale-[0.98]`}
                  title="관리 센터 이동"
                >
                  <Settings className="h-4 w-4" />
                  <span className="hidden xs:inline">관리 센터</span>
                </button>
              )}

              {/* 로그아웃 버튼 */}
              <button
                onClick={logout}
                className={`p-2 rounded-xl border transition-all cursor-pointer hover:scale-105 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 ${
                  isDark 
                    ? "bg-zinc-900/60 border-white/10 text-zinc-400" 
                    : "bg-white border-slate-200 text-slate-500"
                }`}
                title="로그아웃"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
