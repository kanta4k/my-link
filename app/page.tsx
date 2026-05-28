"use client"

import React, { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { 
  Sun, Moon, ExternalLink, Sparkles, Edit3, Check, Plus, Trash2, 
  Globe, Mail, RotateCcw, Info, User, Eye, EyeOff, LayoutTemplate,
  Settings, ArrowRight
} from "lucide-react"
import { dummyLinks, dummySocials, defaultTags, getFaviconUrl, LinkItem, SocialItem } from "@/Data/links"
import { Card } from "@/components/ui/card"

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
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // 1. 핵심 클라이언트 관리 상태 정의
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false)
  const [activeThemeId, setActiveThemeId] = useState<string>("cyberpunk")
  
  // 프로필 정보 상태
  const [profile, setProfile] = useState({
    displayName: "정운학 (Unhak Jeong)",
    bio: "🚀 마이링크 프론트엔드 리디자인 연구원 | 멋진 인터랙션과 최상의 UX를 설계하는 제품 지향적 개발자입니다. React, Next.js, Rust에 푹 빠져있습니다.",
    avatarInitials: "JU"
  })

  // 링크 목록 상태
  const [links, setLinks] = useState<LinkItem[]>([])
  // 소셜 목록 상태
  const [socials, setSocials] = useState<SocialItem[]>([])
  // 태그 리스트 상태
  const [tags, setTags] = useState<string[]>([])

  // 2. 인라인 편집용 식별 상태
  const [editingLinkId, setEditingLinkId] = useState<string | null>(null)
  const [editingField, setEditingField] = useState<"title" | "url" | null>(null)
  const [tempEditValue, setTempEditValue] = useState<string>("")

  // 프로필 편집 상태
  const [isEditingProfileName, setIsEditingProfileName] = useState(false)
  const [isEditingProfileBio, setIsEditingProfileBio] = useState(false)
  const [isEditingAvatar, setIsEditingAvatar] = useState(false)
  const [tempProfileName, setTempProfileName] = useState("")
  const [tempProfileBio, setTempProfileBio] = useState("")
  const [tempAvatar, setTempAvatar] = useState("")

  // 신규 링크 입력 폼 상태
  const [newTitle, setNewTitle] = useState("")
  const [newUrl, setNewUrl] = useState("")
  const [isAddingLink, setIsAddingLink] = useState(false)

  // 신규 태그 입력 상태
  const [newTag, setNewTag] = useState("")
  const [isAddingTag, setIsAddingTag] = useState(false)

  // 알림 메시지 상태
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // input 포커스 제어용 refs
  const editInputRef = useRef<HTMLInputElement>(null)

  // Hydration mismatch 방지 및 로컬스토리지 로딩
  useEffect(() => {
    setMounted(true)
    
    // 로컬스토리지 복구
    const savedProfile = localStorage.getItem("mylink_profile")
    const savedLinks = localStorage.getItem("mylink_links")
    const savedSocials = localStorage.getItem("mylink_socials")
    const savedTags = localStorage.getItem("mylink_tags")
    const savedThemeId = localStorage.getItem("mylink_theme_id")
    const savedAdmin = localStorage.getItem("mylink_admin_mode")

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

    if (savedAdmin) {
      setIsAdminMode(JSON.parse(savedAdmin))
    }
  }, [])

  // 활성 프리셋 정보 로드
  const activePreset = themePresets.find(p => p.id === activeThemeId) || themePresets[0]

  // 테마 프리셋 선택시 next-themes 다크/라이트 모드와 자동 Sync
  useEffect(() => {
    if (!mounted) return
    localStorage.setItem("mylink_theme_id", activeThemeId)
    
    if (activePreset.isDark) {
      setTheme("dark")
    } else {
      setTheme("light")
    }
  }, [activeThemeId, activePreset, setTheme, mounted])

  // 자동 데이터 영속화 저장 함수
  const saveAllToLocal = (updatedProfile = profile, updatedLinks = links, updatedSocials = socials, updatedTags = tags) => {
    localStorage.setItem("mylink_profile", JSON.stringify(updatedProfile))
    localStorage.setItem("mylink_links", JSON.stringify(updatedLinks))
    localStorage.setItem("mylink_socials", JSON.stringify(updatedSocials))
    localStorage.setItem("mylink_tags", JSON.stringify(updatedTags))
  }

  // 알림 토스트 유틸
  const showToast = (message: string) => {
    setToastMessage(message)
    setTimeout(() => {
      setToastMessage(null)
    }, 2800)
  }

  // 1. [초기화] 복구 기능 구현
  const handleResetData = () => {
    if (confirm("모든 데이터를 초기 상태로 복구하시겠습니까? (로컬 브라우저 변경 이력도 초기화됩니다)")) {
      setProfile({
        displayName: "정운학 (Unhak Jeong)",
        bio: "🚀 마이링크 프론트엔드 리디자인 연구원 | 멋진 인터랙션과 최상의 UX를 설계하는 제품 지향적 개발자입니다. React, Next.js, Rust에 푹 빠져있습니다.",
        avatarInitials: "JU"
      })
      setLinks(dummyLinks)
      setSocials(dummySocials)
      setTags(defaultTags)
      setActiveThemeId("cyberpunk")
      
      localStorage.removeItem("mylink_profile")
      localStorage.removeItem("mylink_links")
      localStorage.removeItem("mylink_socials")
      localStorage.removeItem("mylink_tags")
      localStorage.removeItem("mylink_theme_id")
      
      showToast("데이터가 데모 초기 프리셋으로 재설정되었습니다.")
    }
  }

  // 2. [어드민 모드] 스위칭 제어
  const toggleAdminMode = () => {
    const nextMode = !isAdminMode
    setIsAdminMode(nextMode)
    localStorage.setItem("mylink_admin_mode", JSON.stringify(nextMode))
    
    // 편집 상태 초기화
    setEditingLinkId(null)
    setEditingField(null)
    setIsEditingProfileName(false)
    setIsEditingProfileBio(false)
    setIsEditingAvatar(false)
    
    showToast(nextMode ? "🛠️ 관리자 데모 모드가 켜졌습니다. 필드를 클릭해 인라인 수정해보세요!" : "👀 방문자 모드로 전환되었습니다. 프리미엄 완성 화면입니다.")
  }

  // 3. [인라인 링크 편집] 시작
  const startEditingLink = (id: string, field: "title" | "url", currentVal: string) => {
    if (!isAdminMode) return // 어드민 모드에서만 편집 가능
    setEditingLinkId(id)
    setEditingField(field)
    setTempEditValue(currentVal)
    
    // 자동 포커싱을 위한 타이밍 지연
    setTimeout(() => {
      editInputRef.current?.focus()
      editInputRef.current?.select()
    }, 50)
  }

  // [인라인 링크 편집] 저장
  const saveLinkEditing = () => {
    if (!editingLinkId || !editingField) return

    let finalVal = tempEditValue.trim()

    // URL 필드 수정 중인 경우 자동 프로토콜(http) 보완
    if (editingField === "url" && finalVal) {
      if (!/^https?:\/\//i.test(finalVal)) {
        finalVal = "https://" + finalVal
      }
    }

    if (!finalVal) {
      showToast("❌ 입력값을 공백으로 둘 수 없습니다.")
      cancelLinkEditing()
      return
    }

    const updatedLinks = links.map(link => {
      if (link.id === editingLinkId) {
        return { ...link, [editingField]: finalVal }
      }
      return link
    })

    setLinks(updatedLinks)
    saveAllToLocal(profile, updatedLinks)
    cancelLinkEditing()
    showToast("💾 링크 정보가 인라인으로 저장되었습니다.")
  }

  const cancelLinkEditing = () => {
    setEditingLinkId(null)
    setEditingField(null)
    setTempEditValue("")
  }

  // 4. [프로필 이름 및 Bio 인라인 편집]
  const saveProfileName = () => {
    const val = tempProfileName.trim()
    if (!val) {
      setIsEditingProfileName(false)
      return
    }
    const updated = { ...profile, displayName: val }
    setProfile(updated)
    saveAllToLocal(updated)
    setIsEditingProfileName(false)
    showToast("👤 프로필 이름이 업데이트되었습니다.")
  }

  const saveProfileBio = () => {
    const val = tempProfileBio.trim()
    if (!val) {
      setIsEditingProfileBio(false)
      return
    }
    const updated = { ...profile, bio: val }
    setProfile(updated)
    saveAllToLocal(updated)
    setIsEditingProfileBio(false)
    showToast("📝 자기소개가 업데이트되었습니다.")
  }

  const saveAvatarInitials = () => {
    const val = tempAvatar.trim().substring(0, 2).toUpperCase()
    if (!val) {
      setIsEditingAvatar(false)
      return
    }
    const updated = { ...profile, avatarInitials: val }
    setProfile(updated)
    saveAllToLocal(updated)
    setIsEditingAvatar(false)
    showToast("🖼️ 아바타 이니셜이 업데이트되었습니다.")
  }

  // 5. [링크 생성 (CRUD)]
  const handleAddLink = (e: React.FormEvent) => {
    e.preventDefault()
    const title = newTitle.trim()
    let url = newUrl.trim()

    if (!title || !url) {
      showToast("❌ 제목과 주소를 모두 입력해주세요.")
      return
    }

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
    
    // 입력 폼 클리어
    setNewTitle("")
    setNewUrl("")
    setIsAddingLink(false)
    showToast("🎉 새로운 링크 카드가 성공적으로 추가되었습니다!")
  }

  // 6. [링크 삭제 (CRUD)]
  const handleDeleteLink = (id: string, e: React.MouseEvent) => {
    e.stopPropagation() // 클릭 이벤트 차단
    e.preventDefault()
    
    const updated = links.filter(link => link.id !== id)
    setLinks(updated)
    saveAllToLocal(profile, updated)
    showToast("🗑️ 링크 카드가 삭제되었습니다.")
  }

  // 7. [태그 배지 추가 / 삭제]
  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault()
    const val = newTag.trim()
    if (!val) return

    if (tags.includes(val)) {
      showToast("⚠️ 이미 존재하는 태그명입니다.")
      return
    }

    const updated = [...tags, val]
    setTags(updated)
    saveAllToLocal(profile, links, socials, updated)
    setNewTag("")
    setIsAddingTag(false)
    showToast("🏷️ 새 관심사 태그가 추가되었습니다.")
  }

  const handleDeleteTag = (targetTag: string) => {
    const updated = tags.filter(t => t !== targetTag)
    setTags(updated)
    saveAllToLocal(profile, links, socials, updated)
    showToast("🏷️ 태그가 삭제되었습니다.")
  }

  // 소셜 위젯 플랫폼 아이콘 매퍼 (인라인 SVG 렌더링을 통한 외부 라이브러리 타입 세이프성 확보)
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
    <main className={`relative flex min-h-svh w-full flex-col items-center justify-start overflow-x-hidden p-4 pb-28 pt-8 sm:pt-16 transition-all duration-700 ease-in-out ${activePreset.bgClass}`}>
      
      {/* 1. 상단 장식 오라 백라이트 효과 */}
      <div className={`pointer-events-none absolute top-0 left-1/4 -z-10 h-96 w-96 rounded-full bg-gradient-to-b ${activePreset.auraClass1} blur-3xl`} />
      <div className={`pointer-events-none absolute top-40 right-1/4 -z-10 h-[500px] w-[500px] rounded-full bg-gradient-to-b ${activePreset.auraClass2} blur-3xl`} />

      {/* 2. 최상단 통합 제어 패널 (Admin 및 테마 프리셋 관리) */}
      <section className="w-full max-w-xl mb-12 animate-fade-in">
        <div className="rounded-2xl bg-white/5 border border-white/10 dark:bg-black/25 dark:border-white/5 p-4 sm:p-5 backdrop-blur-xl shadow-2xl flex flex-col gap-4">
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10 pb-4">
            {/* 프로젝트 타이틀 / 설명 */}
            <div className="flex items-center gap-2.5">
              <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${activePreset.primaryBg} text-white shadow-lg`}>
                <Sparkles className="h-4 w-4 animate-pulse" />
              </span>
              <div>
                <h3 className="text-sm font-bold tracking-tight text-white dark:text-zinc-100 flex items-center gap-1.5">
                  마이링크 시뮬레이터 
                  <span className="text-[10px] py-0.5 px-1.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30">Active</span>
                </h3>
                <p className="text-[11px] text-zinc-400">MVP 스펙 인라인 편집 및 PRD v2 프리셋 체험</p>
              </div>
            </div>

            {/* 어드민 모드 & 마이페이지 바로가기 & 리셋 버튼 */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleAdminMode}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300 shadow-md border ${
                  isAdminMode 
                    ? "bg-amber-500/25 text-amber-300 border-amber-500/40 animate-pulse hover:bg-amber-500/35"
                    : "bg-white/10 hover:bg-white/20 text-zinc-200 border-white/10"
                }`}
                aria-label="어드민 에뮬레이터 모드 변경"
              >
                {isAdminMode ? (
                  <>
                    <Eye className="h-3.5 w-3.5" />
                    <span>편집 중 (Admin)</span>
                  </>
                ) : (
                  <>
                    <Edit3 className="h-3.5 w-3.5" />
                    <span>관리자 시뮬레이터</span>
                  </>
                )}
              </button>

              <button
                onClick={() => router.push("/mypage")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-500 text-white transition-all duration-300 hover:brightness-110 shadow-md cursor-pointer"
                title="전용 관리 페이지(/mypage)로 이동"
              >
                <Settings className="h-3.5 w-3.5" />
                <span>관리 페이지</span>
                <ArrowRight className="h-3 w-3" />
              </button>

              <button
                onClick={handleResetData}
                className="flex items-center justify-center p-2 rounded-full bg-white/5 border border-white/5 text-zinc-400 hover:text-white hover:bg-white/10 transition-all duration-200"
                title="시뮬레이터 데이터 전체 초기화"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* 테마 프리셋 선택 칩 */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-zinc-400 tracking-wider flex items-center gap-1">
              <LayoutTemplate className="h-3 w-3" />
              PRD V2 개선 제안: 프리미엄 테마 프리셋
            </label>
            <div className="flex flex-wrap gap-1.5">
              {themePresets.map((preset) => {
                const isActive = preset.id === activeThemeId
                return (
                  <button
                    key={preset.id}
                    onClick={() => setActiveThemeId(preset.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer ${
                      isActive 
                        ? `${preset.primaryBg} text-white font-bold scale-[1.03] shadow-lg`
                        : "bg-white/5 border border-white/5 hover:bg-white/10 text-zinc-300 dark:text-zinc-400"
                    }`}
                  >
                    {preset.name}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 실시간 알림 토스트 피드백 */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 z-50 -translate-x-1/2 flex items-center gap-2 rounded-full bg-zinc-900/95 border border-white/10 px-5 py-3 shadow-2xl text-xs font-medium text-white backdrop-blur-md animate-fade-in-down">
          <Sparkles className="h-4 w-4 text-amber-400 animate-spin-[spin_3s_linear_infinite]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 3. 메인 링크트리 컨테이너 */}
      <div className="flex w-full max-w-md flex-col items-center gap-8 animate-fade-in">
        
        {/* 프로필 정보 섹션 */}
        <header className="flex flex-col items-center text-center w-full">
          <div className="relative group">
            {/* 프로필 외곽 다이내믹 그라데이션 광원 */}
            <div className={`absolute -inset-1 rounded-full ${activePreset.primaryBg} opacity-50 blur-md group-hover:opacity-90 group-hover:blur-xl transition duration-700`} />
            
            {/* 프로필 아바타 서클 */}
            <div 
              onClick={() => {
                if (isAdminMode) {
                  setTempAvatar(profile.avatarInitials)
                  setIsEditingAvatar(true)
                }
              }}
              className={`relative flex h-24 w-24 cursor-pointer items-center justify-center rounded-full bg-zinc-950 text-3xl font-black tracking-wider text-white shadow-2xl border-2 border-white/15 transition-transform duration-300 hover:scale-105`}
            >
              {isEditingAvatar ? (
                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-zinc-900 p-2">
                  <input
                    type="text"
                    maxLength={2}
                    value={tempAvatar}
                    onChange={(e) => setTempAvatar(e.target.value)}
                    onBlur={saveAvatarInitials}
                    onKeyDown={(e) => e.key === "Enter" && saveAvatarInitials()}
                    className="w-full text-center bg-transparent border-b border-fuchsia-500 font-bold uppercase text-2xl text-white focus:outline-none"
                    autoFocus
                  />
                </div>
              ) : (
                profile.avatarInitials
              )}

              {/* 어드민 모드 편집 지시 뱃지 */}
              {isAdminMode && !isEditingAvatar && (
                <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-zinc-950 border border-zinc-950 shadow-md">
                  <Edit3 className="h-3 w-3" />
                </span>
              )}
            </div>
          </div>

          {/* 프로필 이름 (인라인 편집 지원) */}
          <div className="mt-5 w-full flex items-center justify-center">
            {isEditingProfileName ? (
              <div className="flex items-center gap-1 border-b-2 border-fuchsia-500 pb-1 w-2/3 max-w-xs">
                <input
                  type="text"
                  value={tempProfileName}
                  onChange={(e) => setTempProfileName(e.target.value)}
                  onBlur={saveProfileName}
                  onKeyDown={(e) => e.key === "Enter" && saveProfileName()}
                  className="bg-transparent text-center font-extrabold text-xl sm:text-2xl text-current border-none outline-none w-full"
                  autoFocus
                />
                <button onClick={saveProfileName} className="text-emerald-400">
                  <Check className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <h1 
                onClick={() => {
                  if (isAdminMode) {
                    setTempProfileName(profile.displayName)
                    setIsEditingProfileName(true)
                  }
                }}
                className={`text-xl font-black tracking-tight sm:text-2xl cursor-pointer ${
                  isAdminMode ? "hover:underline hover:decoration-amber-400 hover:decoration-dashed" : ""
                }`}
              >
                {profile.displayName}
                {isAdminMode && <Edit3 className="inline-block h-3.5 w-3.5 ml-1.5 text-amber-500/70" />}
              </h1>
            )}
          </div>

          {/* 프로필 Bio 자기소개 (인라인 편집 지원) */}
          <div className="mt-3.5 w-full max-w-xs sm:max-w-sm">
            {isEditingProfileBio ? (
              <div className="flex flex-col gap-1 border border-fuchsia-500 rounded-lg p-2 bg-zinc-900/90">
                <textarea
                  value={tempProfileBio}
                  onChange={(e) => setTempProfileBio(e.target.value)}
                  className="bg-transparent text-sm text-zinc-100 border-none outline-none w-full min-h-[80px] resize-none"
                  autoFocus
                />
                <div className="flex justify-end gap-1.5">
                  <button 
                    onClick={() => setIsEditingProfileBio(false)} 
                    className="px-2 py-1 rounded bg-white/10 text-zinc-400 text-[10px] font-bold"
                  >
                    취소
                  </button>
                  <button 
                    onClick={saveProfileBio} 
                    className="px-2.5 py-1 rounded bg-emerald-500 text-zinc-950 text-[10px] font-black"
                  >
                    저장
                  </button>
                </div>
              </div>
            ) : (
              <p 
                onClick={() => {
                  if (isAdminMode) {
                    setTempProfileBio(profile.bio)
                    setIsEditingProfileBio(true)
                  }
                }}
                className={`text-xs leading-relaxed text-zinc-400 cursor-pointer ${
                  isAdminMode ? "hover:bg-amber-500/10 hover:border-amber-500/20 border border-transparent rounded-lg p-1.5 transition-colors" : ""
                }`}
              >
                {profile.bio}
                {isAdminMode && <Edit3 className="inline-block h-3 w-3 ml-1 text-amber-500/70" />}
              </p>
            )}
          </div>

          {/* 4. 전문 관심 스택 배지 리스트 (PRD v2 Bio 개선 요소) */}
          <div className="mt-5 flex flex-wrap justify-center gap-1.5 max-w-sm">
            {tags.map((tag) => (
              <span 
                key={tag} 
                className={`text-[10px] py-1 px-2.5 rounded-full font-bold select-none flex items-center gap-1.5 transition-transform hover:scale-105 ${activePreset.tagBg}`}
              >
                #{tag}
                {isAdminMode && (
                  <button 
                    onClick={() => handleDeleteTag(tag)}
                    className="hover:text-red-400 text-zinc-400 ml-0.5 rounded-full cursor-pointer transition-colors"
                  >
                    ×
                  </button>
                )}
              </span>
            ))}

            {/* 태그 추가 버튼 및 인풋 (어드민 모드 활성시) */}
            {isAdminMode && (
              <>
                {isAddingTag ? (
                  <form onSubmit={handleAddTag} className="inline-flex items-center gap-1 bg-zinc-900 border border-amber-500/40 rounded-full px-2.5 py-0.5">
                    <input
                      type="text"
                      placeholder="스택 입력"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      className="bg-transparent text-[10px] text-white border-none outline-none w-16"
                      autoFocus
                    />
                    <button type="submit" className="text-emerald-400 text-xs font-black">
                      ✓
                    </button>
                    <button type="button" onClick={() => setIsAddingTag(false)} className="text-zinc-500 text-xs">
                      ×
                    </button>
                  </form>
                ) : (
                  <button 
                    onClick={() => setIsAddingTag(true)}
                    className="text-[10px] py-1 px-2.5 rounded-full font-black bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 flex items-center gap-1"
                  >
                    <Plus className="h-2.5 w-2.5" />
                    스택 배지 추가
                  </button>
                )}
              </>
            )}
          </div>
        </header>

        {/* 5. 링크 목록 섹션 (인라인 편집 시뮬레이터 & 글래스모피즘 디자인) */}
        <section className="flex w-full flex-col gap-4" id="links-container">
          {links.map((link, index) => {
            const faviconUrl = getFaviconUrl(link.url, 64)
            const isEditing = editingLinkId === link.id

            return (
              <div
                key={link.id}
                className="group relative w-full"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animationFillMode: "both",
                }}
                id={`link-item-${link.id}`}
              >
                {/* 엣지 글로우 라인 장식 */}
                <div className={`absolute -inset-0.5 rounded-2xl bg-gradient-to-r ${activePreset.primaryBg} opacity-0 group-hover:opacity-40 transition-opacity duration-300 blur-sm -z-10`} />

                {/* 링크 메인 카드 */}
                <div 
                  className={`flex items-center gap-3.5 p-4 rounded-2xl transition-all duration-300 ${activePreset.cardClass} ${activePreset.cardHoverGlow} ${
                    !isAdminMode ? "cursor-pointer transform hover:-translate-y-1 hover:scale-[1.02] active:scale-[0.98]" : ""
                  }`}
                  onClick={() => {
                    // 방문자 모드 시 클릭 시 외부 새탭 링크 실행
                    if (!isAdminMode) {
                      window.open(link.url, "_blank", "noopener,noreferrer")
                    }
                  }}
                >
                  
                  {/* 파비콘 아이콘 컨테이너 */}
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-white/95 dark:bg-zinc-800/90 p-2.5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)] border border-white/20 transition-transform duration-300 group-hover:scale-105">
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
                          // 기존 fallback 제거
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

                  {/* 텍스트 타이틀 & URL 정보 (어드민 모드 시 인라인 편집 지원) */}
                  <div className="flex-grow text-left overflow-hidden">
                    {isEditing ? (
                      <div className="flex flex-col gap-1.5 w-full bg-zinc-950/20 p-2 rounded-xl border border-white/10">
                        {/* 타이틀 편집 인풋 */}
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-bold text-zinc-500 w-9">이름</span>
                          <input
                            ref={editingField === "title" ? editInputRef : null}
                            type="text"
                            value={editingField === "title" ? tempEditValue : link.title}
                            onChange={(e) => {
                              if (editingField === "title") setTempEditValue(e.target.value)
                            }}
                            onClick={(e) => {
                              e.stopPropagation()
                              if (editingField !== "title") startEditingLink(link.id, "title", link.title)
                            }}
                            className="bg-zinc-900/90 text-xs font-semibold px-2 py-1 rounded text-white border border-white/10 outline-none w-full"
                          />
                        </div>
                        {/* URL 편집 인풋 */}
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-bold text-zinc-500 w-9">주소</span>
                          <input
                            ref={editingField === "url" ? editInputRef : null}
                            type="text"
                            value={editingField === "url" ? tempEditValue : link.url}
                            onChange={(e) => {
                              if (editingField === "url") setTempEditValue(e.target.value)
                            }}
                            onClick={(e) => {
                              e.stopPropagation()
                              if (editingField !== "url") startEditingLink(link.id, "url", link.url)
                            }}
                            className="bg-zinc-900/90 text-[11px] px-2 py-1 rounded text-zinc-300 border border-white/10 outline-none w-full"
                          />
                        </div>
                        
                        {/* 액션 버튼 */}
                        <div className="flex justify-end gap-1.5 mt-1.5">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation()
                              cancelLinkEditing()
                            }}
                            className="px-2 py-1 rounded bg-white/10 text-zinc-300 text-[10px] font-bold"
                          >
                            취소
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation()
                              saveLinkEditing()
                            }}
                            className="px-2.5 py-1 rounded bg-emerald-500 text-zinc-950 text-[10px] font-black"
                          >
                            인라인 저장
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <h2 
                          onClick={(e) => {
                            if (isAdminMode) {
                              e.stopPropagation()
                              startEditingLink(link.id, "title", link.title)
                            }
                          }}
                          className={`text-[14px] sm:text-[15px] font-black leading-snug tracking-tight transition-colors ${
                            isAdminMode 
                              ? "cursor-pointer hover:bg-amber-500/10 hover:border-b hover:border-amber-400" 
                              : activePreset.primaryText
                          }`}
                        >
                          {link.title}
                          {isAdminMode && <Edit3 className="inline-block h-3 w-3 ml-1.5 text-amber-500/60" />}
                        </h2>
                        <p 
                          onClick={(e) => {
                            if (isAdminMode) {
                              e.stopPropagation()
                              startEditingLink(link.id, "url", link.url)
                            }
                          }}
                          className={`mt-1 text-[11px] truncate font-medium text-zinc-400/85 max-w-[210px] sm:max-w-[270px] ${
                            isAdminMode 
                              ? "cursor-pointer hover:bg-amber-500/10 hover:border-b hover:border-amber-400" 
                              : ""
                          }`}
                        >
                          {link.url.replace(/^https?:\/\/(www\.)?/, "")}
                          {isAdminMode && <Edit3 className="inline-block h-2.5 w-2.5 ml-1 text-amber-500/60" />}
                        </p>
                      </>
                    )}
                  </div>

                  {/* 우측 앰비언트 액션 영역 (방문자: External Link / 어드민: 휴지통 삭제) */}
                  <div className="flex-shrink-0 flex items-center gap-1.5 pl-1">
                    {isAdminMode ? (
                      <button
                        onClick={(e) => handleDeleteLink(link.id, e)}
                        className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-all cursor-pointer"
                        title="링크 삭제"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    ) : (
                      <span className={`text-zinc-400 transition-all duration-300 group-hover:translate-x-0.5 ${activePreset.accentText}`}>
                        <ExternalLink className="h-4 w-4" />
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}

          {/* 6. 새 링크 추가 카드 폼 (어드민 모드에서만 아래에 부드럽게 노출) */}
          {isAdminMode && (
            <div className="w-full mt-2 animate-fade-in">
              {isAddingLink ? (
                <form 
                  onSubmit={handleAddLink}
                  className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 backdrop-blur-xl shadow-xl flex flex-col gap-3"
                >
                  <div className="flex items-center gap-2 text-xs font-black text-amber-400">
                    <Plus className="h-3.5 w-3.5" />
                    <span>새 링크 만들기</span>
                  </div>

                  <div className="flex flex-col gap-2.5">
                    <input
                      type="text"
                      placeholder="웹페이지 타이틀 (예: 개인 블로그)"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="bg-zinc-950/80 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-amber-400/80 w-full"
                      required
                    />
                    <input
                      type="text"
                      placeholder="연결 대상 URL 주소 (예: velog.io)"
                      value={newUrl}
                      onChange={(e) => setNewUrl(e.target.value)}
                      className="bg-zinc-950/80 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-amber-400/80 w-full"
                      required
                    />
                  </div>

                  <div className="flex justify-end gap-2 mt-1">
                    <button
                      type="button"
                      onClick={() => setIsAddingLink(false)}
                      className="px-3 py-1.5 rounded-lg bg-white/5 text-zinc-300 text-xs font-semibold hover:bg-white/10"
                    >
                      취소
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-lg bg-amber-500 text-zinc-950 text-xs font-black hover:bg-amber-400 transition-colors"
                    >
                      리스트 추가
                    </button>
                  </div>
                </form>
              ) : (
                <button
                  onClick={() => setIsAddingLink(true)}
                  className="w-full py-4.5 rounded-2xl border-2 border-dashed border-amber-500/20 hover:border-amber-500/40 bg-amber-500/5 hover:bg-amber-500/10 transition-all duration-300 flex items-center justify-center gap-2 text-xs font-black text-amber-400 cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  <span>새 링크 카드 추가하기</span>
                </button>
              )}
            </div>
          )}
        </section>

        {/* 푸터 영역 */}
        <footer className="mt-8 text-center text-[11px] text-zinc-500/80 select-none flex flex-col items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-zinc-500 animate-ping" />
            <p>Designed with High Aesthetics & Glassmorphism</p>
          </div>
          <p>© {new Date().getFullYear()} My Link. All rights reserved.</p>
        </footer>
      </div>

      {/* 7. 하단 고정형 세련된 소셜 미디어 독 (PRD v2 제안) */}
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
