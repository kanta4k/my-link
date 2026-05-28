"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { 
  Sparkles, Plus, Trash2, ArrowLeft, Eye, Link2, 
  User, FileText, BadgePlus, HelpCircle, Save, Check
} from "lucide-react"
import { dummyLinks, dummySocials, defaultTags, getFaviconUrl, LinkItem, SocialItem } from "@/Data/links"
import { Card } from "@/components/ui/card"
import { Dialog } from "@/components/ui/dialog"

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

// 메인 페이지와 동일한 5가지 프리미엄 컬러 프리셋 테마
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

export default function MyPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [activeThemeId, setActiveThemeId] = useState<string>("cyberpunk")

  // 핵심 관리 상태 정의
  const [profile, setProfile] = useState({
    displayName: "정운학 (Unhak Jeong)",
    bio: "🚀 마이링크 프론트엔드 리디자인 연구원 | 멋진 인터랙션과 최상의 UX를 설계하는 제품 지향적 개발자입니다. React, Next.js, Rust에 푹 빠져있습니다.",
    avatarInitials: "JU"
  })
  
  const [links, setLinks] = useState<LinkItem[]>([])
  const [tags, setTags] = useState<string[]>([])

  // 다이얼로그 모달 제어 상태
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  
  // 신규 링크 입력 폼 상태
  const [newTitle, setNewTitle] = useState("")
  const [newUrl, setNewUrl] = useState("")

  // 관심 스택 추가를 위한 입력 폼 상태
  const [newTag, setNewTag] = useState("")
  const [isAddingTag, setIsAddingTag] = useState(false)

  // 알림 메시지 피드백 상태
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // 로컬 스토리지로부터 상태 로드
  useEffect(() => {
    setMounted(true)

    const savedProfile = localStorage.getItem("mylink_profile")
    const savedLinks = localStorage.getItem("mylink_links")
    const savedTags = localStorage.getItem("mylink_tags")
    const savedThemeId = localStorage.getItem("mylink_theme_id")

    if (savedProfile) setProfile(JSON.parse(savedProfile))
    
    if (savedLinks) {
      setLinks(JSON.parse(savedLinks))
    } else {
      setLinks(dummyLinks)
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

  // 데이터 통합 저장 유틸리티
  const saveAllToLocal = (updatedProfile = profile, updatedLinks = links, updatedTags = tags) => {
    localStorage.setItem("mylink_profile", JSON.stringify(updatedProfile))
    localStorage.setItem("mylink_links", JSON.stringify(updatedLinks))
    localStorage.setItem("mylink_tags", JSON.stringify(updatedTags))
  }

  // 알림 피드백 노출 유틸리티
  const showToast = (message: string) => {
    setToastMessage(message)
    setTimeout(() => {
      setToastMessage(null)
    }, 2800)
  }

  // 프로필 텍스트 필드 실시간 반영 및 저장
  const handleProfileFieldChange = (field: "displayName" | "bio" | "avatarInitials", value: string) => {
    const updated = { ...profile, [field]: value }
    setProfile(updated)
    saveAllToLocal(updated)
  }

  // 관심사 스택 배지 추가
  const handleAddTagSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const val = newTag.trim()
    if (!val) return

    if (tags.includes(val)) {
      showToast("⚠️ 이미 등록된 관심 스택명입니다.")
      return
    }

    const updated = [...tags, val]
    setTags(updated)
    saveAllToLocal(profile, links, updated)
    setNewTag("")
    setIsAddingTag(false)
    showToast("🏷️ 관심 스택이 프로필에 반영되었습니다.")
  }

  // 관심사 스택 배지 삭제
  const handleDeleteTag = (targetTag: string) => {
    const updated = tags.filter(t => t !== targetTag)
    setTags(updated)
    saveAllToLocal(profile, links, updated)
    showToast("🗑️ 태그가 삭제되었습니다.")
  }

  // 다이얼로그 열기
  const handleOpenDialog = () => {
    setNewTitle("")
    setNewUrl("")
    setIsDialogOpen(true)
  }

  // 다이얼로그 폼을 통한 링크 신규 추가
  const handleAddLinkSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const title = newTitle.trim()
    let url = newUrl.trim()

    if (!title || !url) {
      showToast("❌ 제목과 URL 주소를 모두 채워주세요.")
      return
    }

    // 간단한 URL 포맷 체크 및 프로토콜(https) 보완
    if (!/^https?:\/\//i.test(url)) {
      url = "https://" + url
    }

    const newLinkItem: LinkItem = {
      id: `link-${Date.now()}`,
      title,
      url
    }

    const updated = [...links, newLinkItem]
    setLinks(updated)
    saveAllToLocal(profile, updated)
    setIsDialogOpen(false)
    showToast("🎉 새 링크 카드가 성공적으로 추가되었습니다!")
  }

  // 링크 삭제
  const handleDeleteLink = (id: string) => {
    const updated = links.filter(link => link.id !== id)
    setLinks(updated)
    saveAllToLocal(profile, updated)
    showToast("🗑️ 링크 카드가 목록에서 삭제되었습니다.")
  }

  if (!mounted) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-zinc-950 text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-r-2 border-fuchsia-500" />
          <p className="text-sm font-medium tracking-widest text-zinc-400">LOADING MYPAGE...</p>
        </div>
      </div>
    )
  }

  return (
    <main className={`relative flex min-h-svh w-full flex-col items-center justify-start overflow-x-hidden p-4 pb-20 pt-8 sm:pt-12 transition-all duration-700 ease-in-out ${activePreset.bgClass}`}>
      
      {/* 1. 상단 백라이트 앰비언트 글로우 장식 */}
      <div className={`pointer-events-none absolute top-0 left-1/4 -z-10 h-[400px] w-[400px] rounded-full bg-gradient-to-b ${activePreset.auraClass1} blur-3xl`} />
      <div className={`pointer-events-none absolute top-20 right-1/4 -z-10 h-[450px] w-[450px] rounded-full bg-gradient-to-b ${activePreset.auraClass2} blur-3xl`} />

      {/* 실시간 알림 토스트 피드백 */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 z-50 -translate-x-1/2 flex items-center gap-2 rounded-full bg-zinc-900/95 border border-white/10 px-5 py-3 shadow-2xl text-xs font-semibold text-white backdrop-blur-md animate-fade-in-down">
          <Sparkles className="h-4 w-4 text-amber-400 animate-spin-[spin_3s_linear_infinite]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 메인 어드민 대시보드 쉘 */}
      <div className="w-full max-w-xl flex flex-col gap-6 animate-fade-in">
        
        {/* 상단 액션 바 */}
        <header className="flex items-center justify-between p-1 bg-white/5 border border-white/10 dark:bg-black/25 dark:border-white/5 rounded-2xl backdrop-blur-md">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-zinc-300 hover:text-white rounded-xl transition-all hover:bg-white/5 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>메인 시뮬레이터</span>
          </button>
          
          <button
            onClick={() => router.push("/")}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-black text-white ${activePreset.primaryBg} rounded-xl shadow-lg hover:brightness-110 transition-all cursor-pointer`}
          >
            <Eye className="h-4 w-4 animate-pulse" />
            <span>내 마이링크 보러가기</span>
          </button>
        </header>

        {/* 대시보드 인트로 */}
        <section className="flex flex-col gap-1.5 text-left pl-1">
          <h1 className="text-xl sm:text-2xl font-black bg-gradient-to-r from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-400" />
            마이링크 프로필 및 링크 관리자
          </h1>
          <p className="text-xs text-zinc-400 leading-relaxed">
            나를 표현하는 고유 닉네임 페이지의 정보와 링크 목록을 실시간으로 관리할 수 있습니다. 로컬 데이터 연동 상태입니다.
          </p>
        </section>

        {/* CARD 1: 프로필 정보 편집 */}
        <Card className={`p-5 backdrop-blur-xl border flex flex-col gap-5 ${activePreset.cardClass}`}>
          <div className="flex items-center gap-2 border-b border-white/10 pb-3">
            <User className={`h-4.5 w-4.5 ${activePreset.primaryText}`} />
            <h2 className="text-sm font-bold text-white tracking-wide">프로필 정보 편집</h2>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-start">
            {/* 아바타 이니셜 입력란 */}
            <div className="flex flex-col gap-1.5 w-full sm:w-20">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">아바타</label>
              <input
                type="text"
                maxLength={2}
                value={profile.avatarInitials}
                onChange={(e) => handleProfileFieldChange("avatarInitials", e.target.value.toUpperCase())}
                placeholder="JU"
                className="w-full text-center bg-zinc-950/85 border border-white/10 rounded-xl py-2 px-3 text-sm font-black text-white outline-none focus:border-cyan-500/80 uppercase"
              />
            </div>

            {/* 표시 이름(displayName) 입력란 */}
            <div className="flex flex-col gap-1.5 flex-grow w-full">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">표시 이름</label>
              <input
                type="text"
                value={profile.displayName}
                onChange={(e) => handleProfileFieldChange("displayName", e.target.value)}
                placeholder="이름 혹은 닉네임을 적어주세요."
                className="w-full bg-zinc-950/85 border border-white/10 rounded-xl py-2 px-3 text-sm font-bold text-white outline-none focus:border-cyan-500/80"
              />
            </div>
          </div>

          {/* 단문 소개(bio) 입력란 */}
          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">단문 자기소개 (Bio)</label>
            <textarea
              value={profile.bio}
              onChange={(e) => handleProfileFieldChange("bio", e.target.value)}
              placeholder="자신을 나타내는 멋진 한 줄을 작성해 주세요."
              rows={3}
              className="w-full bg-zinc-950/85 border border-white/10 rounded-xl py-2.5 px-3 text-xs text-zinc-200 outline-none focus:border-cyan-500/80 resize-none leading-relaxed"
            />
          </div>

          {/* 스택 태그 관리 */}
          <div className="flex flex-col gap-2 w-full pt-1">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center justify-between">
              <span>관심 분야 / 스택 태그</span>
              <span className="text-[9px] text-zinc-500 font-normal">태그 삭제 시 우측 × 클릭</span>
            </label>

            {/* 기존 등록된 배지 */}
            <div className="flex flex-wrap gap-1.5 min-h-[30px] p-2 bg-zinc-950/50 rounded-xl border border-white/5">
              {tags.map((tag) => (
                <span 
                  key={tag} 
                  className={`text-[9px] py-1 px-2 rounded-full font-bold select-none flex items-center gap-1 transition-transform hover:scale-[1.02] ${activePreset.tagBg}`}
                >
                  #{tag}
                  <button 
                    onClick={() => handleDeleteTag(tag)}
                    className="hover:text-red-400 text-zinc-400 font-extrabold ml-1 cursor-pointer"
                  >
                    ×
                  </button>
                </span>
              ))}
              {tags.length === 0 && (
                <span className="text-[10px] text-zinc-500 self-center pl-1 font-medium">등록된 관심 태그가 없습니다.</span>
              )}
            </div>

            {/* 태그 입력 폼 */}
            <div className="mt-1">
              {isAddingTag ? (
                <form onSubmit={handleAddTagSubmit} className="flex gap-2 w-full max-w-sm">
                  <input
                    type="text"
                    placeholder="예: React 19"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    className="flex-grow bg-zinc-950/80 border border-white/15 rounded-xl px-3 py-1.5 text-xs text-white outline-none focus:border-cyan-500/50"
                    autoFocus
                  />
                  <button 
                    type="submit" 
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-black transition-all cursor-pointer"
                  >
                    확인
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setIsAddingTag(false)} 
                    className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 text-xs font-semibold cursor-pointer"
                  >
                    취소
                  </button>
                </form>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsAddingTag(true)}
                  className="inline-flex items-center gap-1.5 text-[10px] py-1.5 px-3 rounded-xl font-bold bg-white/5 border border-white/5 hover:bg-white/10 text-zinc-300 transition-all cursor-pointer"
                >
                  <BadgePlus className="h-3.5 w-3.5" />
                  스택 배지 추가
                </button>
              )}
            </div>
          </div>
        </Card>

        {/* CARD 2: 연결 링크 목록 관리 */}
        <Card className={`p-5 backdrop-blur-xl border flex flex-col gap-4 ${activePreset.cardClass}`}>
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Link2 className={`h-4.5 w-4.5 ${activePreset.primaryText}`} />
              <h2 className="text-sm font-bold text-white tracking-wide">내 연결 링크 리스트</h2>
            </div>
            
            {/* 다이얼로그 추가 트리거 버튼 */}
            <button
              onClick={handleOpenDialog}
              className={`flex items-center gap-1 py-1.5 px-3 rounded-xl text-xs font-black text-white ${activePreset.primaryBg} hover:brightness-110 shadow-md cursor-pointer transition-all hover:scale-[1.03] active:scale-[0.97]`}
            >
              <Plus className="h-3.5 w-3.5" />
              <span>새 링크 추가</span>
            </button>
          </div>

          {/* 기존 연결 리스트 */}
          <div className="flex flex-col gap-2 max-h-[350px] overflow-y-auto pr-1">
            {links.map((link) => {
              const faviconUrl = getFaviconUrl(link.url, 64)
              
              return (
                <div 
                  key={link.id}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-zinc-950/40 border border-white/5 hover:border-white/10 transition-all duration-200 group"
                >
                  <div className="flex items-center gap-3 overflow-hidden text-left">
                    {/* 파비콘 */}
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-white p-1.5 border border-white/10 shadow-sm">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={faviconUrl}
                        alt={`${link.title} 파비콘`}
                        className="h-6 w-6 object-contain"
                        onError={(e) => {
                          const target = e.currentTarget
                          target.style.display = "none"
                          const parent = target.parentElement
                          if (parent) {
                            const existingFallback = parent.querySelector(".list-fallback")
                            if (existingFallback) existingFallback.remove()
                            
                            const fallback = document.createElement("div")
                            fallback.className = "list-fallback flex h-full w-full items-center justify-center text-xs font-black text-fuchsia-500"
                            fallback.innerText = link.title ? link.title.substring(0, 1).toUpperCase() : "🔗"
                            parent.appendChild(fallback)
                          }
                        }}
                      />
                    </div>
                    {/* 텍스트 타이틀 */}
                    <div className="overflow-hidden">
                      <h4 className="text-xs font-bold text-zinc-100 group-hover:text-white truncate">
                        {link.title}
                      </h4>
                      <p className="text-[10px] text-zinc-500 truncate mt-0.5 max-w-[240px] sm:max-w-[320px]">
                        {link.url}
                      </p>
                    </div>
                  </div>

                  {/* 삭제 버튼 */}
                  <button
                    onClick={() => handleDeleteLink(link.id)}
                    className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/25 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer flex-shrink-0"
                    title="링크 제거"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              )
            })}

            {links.length === 0 && (
              <div className="flex flex-col items-center justify-center py-10 gap-2 border-2 border-dashed border-white/5 rounded-2xl bg-zinc-950/20">
                <HelpCircle className="h-8 w-8 text-zinc-600 animate-pulse" />
                <p className="text-xs text-zinc-500 font-medium">연결된 링크 카드가 없습니다.</p>
                <button
                  onClick={handleOpenDialog}
                  className="mt-1 text-[11px] font-bold text-cyan-400 hover:underline cursor-pointer"
                >
                  새로운 링크 첫 등록하기
                </button>
              </div>
            )}
          </div>
        </Card>

        {/* 안내 팁 박스 */}
        <section className="p-4 bg-zinc-950/45 border border-white/5 rounded-2xl flex items-start gap-2.5 pl-4 text-left">
          <span className="flex h-5 w-5 items-center justify-center rounded bg-amber-500/15 text-amber-400 text-[10px] font-black border border-amber-500/30 flex-shrink-0 mt-0.5">TIP</span>
          <div>
            <h5 className="text-[11px] font-bold text-zinc-200">데이터 실시간 반영 안내</h5>
            <p className="text-[10px] text-zinc-500 leading-relaxed mt-1">
              여기서 변경된 사항은 브라우저 공통 로컬 스토리지에 동기화되므로, 상단의 &apos;내 마이링크 보러가기&apos; 버튼으로 이동하시면 실제 디자인 뷰(방문자 모드)에서 즉시 반영된 것을 보실 수 있습니다.
            </p>
          </div>
        </section>

        {/* 푸터 */}
        <footer className="text-center text-[10px] text-zinc-500 select-none">
          <p>© {new Date().getFullYear()} My Link Dashboard. Made with High Aesthetics.</p>
        </footer>
      </div>

      {/* 2단계: 신규 링크 등록 다이얼로그 모달 */}
      <Dialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title="새 마이링크 카드 만들기"
      >
        <form onSubmit={handleAddLinkSubmit} className="flex flex-col gap-4 text-left">
          
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest pl-0.5">
              웹페이지 제목
            </label>
            <input
              type="text"
              placeholder="예: 깃허브 개인 저장소"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full bg-zinc-950 border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white outline-none focus:border-amber-400"
              required
              autoFocus
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest pl-0.5 flex items-center justify-between">
              <span>연결 주소 (URL)</span>
              <span className="text-[9px] text-zinc-500 font-normal">프로토콜 자동 보완됨</span>
            </label>
            <input
              type="text"
              placeholder="예: github.com"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              className="w-full bg-zinc-950 border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white outline-none focus:border-amber-400"
              required
            />
          </div>

          {/* 하단 액션 버튼 */}
          <div className="flex justify-end gap-2.5 mt-2 border-t border-white/5 pt-4">
            <button
              type="button"
              onClick={() => setIsDialogOpen(false)}
              className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 text-xs font-semibold cursor-pointer"
            >
              취소
            </button>
            <button
              type="submit"
              className={`px-4.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 text-zinc-950 text-xs font-black shadow-lg hover:brightness-110 transition-all cursor-pointer`}
            >
              카드 생성하기
            </button>
          </div>
        </form>
      </Dialog>
    </main>
  )
}
