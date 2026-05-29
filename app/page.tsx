"use client"

import React, { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Sparkles, Globe, Mail, ArrowRight, LayoutTemplate, Edit3, BadgePlus } from "lucide-react"
import { dummyLinks, dummySocials, defaultTags, LinkItem, SocialItem } from "@/Data/links"
import { db } from "@/lib/firebase"
import { useAuth } from "@/context/AuthContext"
import Header from "@/components/Header"
import { useTheme } from "@/components/theme-provider"
import TrackedLinkCard from "@/components/TrackedLinkCard"
import { Card } from "@/components/ui/card"
import { 
  collection, 
  onSnapshot, 
  query, 
  orderBy, 
  writeBatch, 
  doc, 
  setDoc,
  serverTimestamp 
} from "firebase/firestore"

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
  return (
    <Suspense fallback={
      <div className="flex min-h-svh items-center justify-center bg-zinc-950 text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-r-2 border-fuchsia-500" />
          <p className="text-xs font-bold tracking-widest text-zinc-400">마이링크를 불러오는 중...</p>
        </div>
      </div>
    }>
      <LinkTreeContent />
    </Suspense>
  )
}

function LinkTreeContent() {
  const { setTheme } = useTheme()
  const { user, loginWithGoogle } = useAuth()
  const searchParams = useSearchParams()
  const queryUid = searchParams.get("uid")

  const [mounted, setMounted] = useState(false)
  const [activeThemeId, setActiveThemeId] = useState<string>("glass-light")
  
  // 프로필 정보 상태
  const [profile, setProfile] = useState({
    username: "mylink",
    displayName: "정운학 (Unhak Jeong)",
    bio: "🚀 마이링크 프론트엔드 리디자인 연구원 | 멋진 인터랙션과 최상의 UX를 설계하는 제품 지향적 개발자입니다. React, Next.js, Rust에 푹 빠져있습니다.",
    avatarInitials: "JU"
  })

  // 데이터 목록 상태들
  const [links, setLinks] = useState<LinkItem[]>([])
  const [socials, setSocials] = useState<SocialItem[]>([])
  const [tags, setTags] = useState<string[]>([])

  // 최종 targetUid 계산 (우선순위: 쿼리스트링 > 로그인 유저 > 데모)
  const targetUid = queryUid || (user ? user.uid : "anonymous")

  useEffect(() => {
    setMounted(true)
  }, [])

  // Firestore 실시간 동기화
  useEffect(() => {
    if (!mounted) return

    // 1. 프로필 정보 실시간 동기화 (users/{uid} 단일 문서 구조)
    const profileDocRef = doc(db, "users", targetUid)
    const unsubscribeProfile = onSnapshot(profileDocRef, async (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data()
        if (data.profile) setProfile((current) => ({ ...current, ...data.profile }))
        if (data.tags) setTags(data.tags)
        if (data.themeId) setActiveThemeId(data.themeId)
      } else {
        // 프로필 정보가 생성되지 않은 유저인 경우 기본값 자동 Seeding
        const savedProfile = localStorage.getItem("mylink_profile")
        const savedTags = localStorage.getItem("mylink_tags")
        const savedThemeId = localStorage.getItem("mylink_theme_id")

        const initialProfile = savedProfile ? JSON.parse(savedProfile) : {
          username: user?.email?.split("@")[0]?.toLowerCase().replace(/[^a-z0-9._-]/g, "-") || "mylink",
          displayName: user?.displayName || "정운학 (Unhak Jeong)",
          bio: "🚀 마이링크 프론트엔드 리디자인 연구원 | 멋진 인터랙션과 최상의 UX를 설계하는 제품 지향적 개발자입니다. React, Next.js, Rust에 푹 빠져있습니다.",
          avatarInitials: user?.displayName ? user.displayName.substring(0, 2).toUpperCase() : "JU"
        }
        const initialTags = savedTags ? JSON.parse(savedTags) : defaultTags
        const initialThemeId = savedThemeId || "glass-light"

        // 쓰기 권한이 있는 본인의 프로필 문서이거나 anonymous 데모인 경우 최초 1회 Firestore 생성
        const canWrite = targetUid === "anonymous" || (user && user.uid === targetUid)
        if (canWrite) {
          try {
            await setDoc(profileDocRef, {
              profile: initialProfile,
              tags: initialTags,
              themeId: initialThemeId,
              createdAt: serverTimestamp()
            }, { merge: true })
          } catch (e) {
            console.error("Failed to seed initial user profile in Firestore", e)
          }
        }

        setProfile(initialProfile)
        setTags(initialTags)
        setActiveThemeId(initialThemeId)
      }
    }, (error) => {
      console.error("Firestore Profile Sync Error: ", error)
    })

    const profileSubDocRef = doc(db, "users", targetUid, "profile", "main")
    const unsubscribeProfileSubDoc = onSnapshot(profileSubDocRef, (snapshot) => {
      if (snapshot.exists()) {
        setProfile((current) => ({ ...current, ...snapshot.data() }))
      }
    }, (error) => {
      console.error("Firestore Profile SubDoc Sync Error: ", error)
    })

    // 2. Links 실시간 동기화 (users/{uid}/links)
    const linksRef = collection(db, "users", targetUid, "links")
    const q = query(linksRef, orderBy("createdAt", "desc"))
    const unsubscribeLinks = onSnapshot(q, async (snapshot) => {
      if (snapshot.empty && targetUid === "anonymous") {
        // anonymous 데모가 비어 있는 경우 자동 마이그레이션 실행
        try {
          const batch = writeBatch(db)
          dummyLinks.forEach((item) => {
            const newDocRef = doc(linksRef)
            batch.set(newDocRef, {
              title: item.title,
              url: item.url,
              clickCount: 0,
              createdAt: serverTimestamp()
            })
          })
          await batch.commit()
        } catch (err) {
          console.error("Migration to Firestore failed", err)
        }
      } else {
        const fetchedLinks = snapshot.docs.map((doc) => ({
          id: doc.id,
          title: doc.data().title || "",
          url: doc.data().url || "",
          clickCount: typeof doc.data().clickCount === "number" ? doc.data().clickCount : 0,
        }))
        setLinks(fetchedLinks)
      }
    }, (error) => {
      console.error("Firestore onSnapshot error: ", error)
    })

    // 3. Socials 실시간 동기화 (users/{uid}/socials)
    const socialsRef = collection(db, "users", targetUid, "socials")
    const unsubscribeSocials = onSnapshot(socialsRef, async (snapshot) => {
      if (snapshot.empty && targetUid === "anonymous") {
        // anonymous 데모 소셜 링크 자동 Seeding
        try {
          const batch = writeBatch(db)
          dummySocials.forEach((item) => {
            const docRef = doc(db, "users", targetUid, "socials", item.platform)
            batch.set(docRef, {
              platform: item.platform,
              url: item.url
            })
          })
          await batch.commit()
        } catch (err) {
          console.error("Socials migration to Firestore failed", err)
        }
      } else {
        const fetchedSocials = snapshot.docs.map((doc) => ({
          id: doc.id,
          platform: doc.data().platform || doc.id,
          url: doc.data().url || "",
          active: doc.data().active !== undefined ? doc.data().active : !!doc.data().url,
        })) as SocialItem[]

        const order = ['github', 'linkedin', 'twitter', 'youtube', 'instagram']
        const sortedSocials = [...fetchedSocials].sort((a, b) => {
          return order.indexOf(a.platform) - order.indexOf(b.platform)
        })
        setSocials(sortedSocials)
      }
    }, (error) => {
      console.error("Firestore socials onSnapshot error: ", error)
    })

    return () => {
      unsubscribeProfile()
      unsubscribeProfileSubDoc()
      unsubscribeLinks()
      unsubscribeSocials()
    }
  }, [targetUid, mounted, user])

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
          <p className="text-xs font-bold tracking-widest text-zinc-400">마이링크를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  // 로그인 상태 배너 표시 조건: 쿼리스트링 없고 비로그인 상태이며, 데모 계정을 보여주는 상황
  const showIntroBanner = !queryUid && !user

  return (
    <main className={`relative flex min-h-svh w-full flex-col items-center justify-start overflow-x-hidden p-4 pb-28 pt-24 sm:pt-32 transition-all duration-700 ease-in-out ${activePreset.bgClass}`}>
      
      {/* 고품격 프리미엄 헤더 */}
      <Header activePreset={activePreset} />

      {/* 상단 장식 오라 백라이트 효과 */}
      <div className={`pointer-events-none absolute top-0 left-1/4 -z-10 h-96 w-96 rounded-full bg-gradient-to-b ${activePreset.auraClass1} blur-3xl`} />
      <div className={`pointer-events-none absolute top-40 right-1/4 -z-10 h-[500px] w-[500px] rounded-full bg-gradient-to-b ${activePreset.auraClass2} blur-3xl`} />

      {/* 메인 링크트리 컨테이너 */}
      <div className="flex w-full max-w-md flex-col items-center gap-8 animate-fade-in">
        
        {showIntroBanner ? (
          // ==================== [CASE A] 비로그인 첫 방문자 화면 ====================
          <>
            {/* 로그인 유도 프리미엄 인트로 배너 */}
            <div className={`w-full p-4.5 rounded-2xl border transition-all duration-300 flex flex-col gap-3 relative overflow-hidden backdrop-blur-xl ${
              activePreset.isDark 
                ? "bg-slate-900/60 border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)]" 
                : "bg-white/80 border-slate-200/80 shadow-[0_8px_32px_rgba(16,185,129,0.05)]"
            }`}>
              <div className={`absolute -inset-0.5 rounded-2xl bg-gradient-to-r ${activePreset.primaryBg} opacity-15 blur-sm -z-10`} />
              
              <div className="flex items-start gap-2.5">
                <Sparkles className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5 animate-pulse" />
                <div className="text-left">
                  <h3 className="text-xs font-black tracking-tight text-slate-800 dark:text-zinc-100">
                    나만의 프리미엄 링크 트리를 만드세요
                  </h3>
                  <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-zinc-400/90 font-medium">
                    구글 로그인을 완료하면 1초 만에 개인화된 브랜딩 페이지를 자동으로 무료 개설할 수 있습니다.
                  </p>
                </div>
              </div>
              
              <button
                onClick={loginWithGoogle}
                className={`flex items-center justify-center gap-1.5 py-2 px-4 rounded-xl text-xs font-extrabold text-white ${activePreset.primaryBg} shadow-md transition-all duration-300 hover:brightness-110 active:scale-[0.98] cursor-pointer`}
              >
                <span>지금 1초 만에 시작하기</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* 로그인 후 화면 구성 및 기능 설명 카드 */}
            <Card className={`w-full p-5.5 backdrop-blur-xl border flex flex-col gap-5 text-left transition-all duration-300 ${activePreset.cardClass}`}>
              <div className="flex items-center gap-2 border-b border-black/10 dark:border-white/10 pb-3">
                <LayoutTemplate className={`h-4.5 w-4.5 ${activePreset.primaryText}`} />
                <h3 className="text-xs sm:text-sm font-black tracking-wide text-slate-800 dark:text-zinc-100">
                  로그인 이후 사용할 수 있는 핵심 화면 구성 & 기능
                </h3>
              </div>

              <div className="flex flex-col gap-4 text-left">
                {/* 기능 1 */}
                <div className="flex gap-3 items-start">
                  <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    <LayoutTemplate className="h-4 w-4" />
                  </span>
                  <div>
                    <h4 className="text-xs font-black text-slate-800 dark:text-zinc-200">1. 내 브랜드 비주얼 테마 설정</h4>
                    <p className="text-[10px] text-slate-500 dark:text-zinc-400 leading-relaxed mt-0.5 font-medium">
                      Cyberpunk Neo, Midnight Teal, Glass Emerald 등 엄선된 5가지 프리미엄 그래디언트 디자인을 원클릭 설정으로 내 페이지에 즉각 반영할 수 있습니다.
                    </p>
                  </div>
                </div>

                {/* 기능 2 */}
                <div className="flex gap-3 items-start">
                  <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    <Edit3 className="h-4 w-4" />
                  </span>
                  <div>
                    <h4 className="text-xs font-black text-slate-800 dark:text-zinc-200">2. 초간편 링크 인라인(Inline) 편집</h4>
                    <p className="text-[10px] text-slate-500 dark:text-zinc-400 leading-relaxed mt-0.5 font-medium">
                      별도의 팝업 창 이동 없이 설정 페이지 리스트에서 항목을 클릭해 즉석에서 이름และ URL을 즉시 편집하고 지울 수 있는 인라인 인터랙션이 제공됩니다.
                    </p>
                  </div>
                </div>

                {/* 기능 3 */}
                <div className="flex gap-3 items-start">
                  <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    <BadgePlus className="h-4 w-4" />
                  </span>
                  <div>
                    <h4 className="text-xs font-black text-slate-800 dark:text-zinc-200">3. 프로필 정보 및 스택 배지 데코레이션</h4>
                    <p className="text-[10px] text-slate-500 dark:text-zinc-400 leading-relaxed mt-0.5 font-medium">
                      아바타 이니셜과 한줄 자기소개(Bio)를 꾸미고, 나만의 강점 기술이나 관심 분야를 컬러풀한 태그 배지로 개성있게 연출할 수 있습니다.
                    </p>
                  </div>
                </div>

                {/* 기능 4 */}
                <div className="flex gap-3 items-start">
                  <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    <Globe className="h-4 w-4" />
                  </span>
                  <div>
                    <h4 className="text-xs font-black text-slate-800 dark:text-zinc-200">4. 하단 고정형 소셜 미디어 독(Dock)</h4>
                    <p className="text-[10px] text-slate-500 dark:text-zinc-400 leading-relaxed mt-0.5 font-medium">
                      GitHub, LinkedIn, YouTube, Instagram 등 내가 대외적으로 활동하는 주요 SNS 채널들을 설정 페이지에서 독(Dock) 형태로 연동할 수 있습니다.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-black/10 dark:border-white/10 pt-4 text-center">
                <p className="text-[10px] font-bold text-slate-500 dark:text-zinc-400 leading-normal">
                  🔑 구글 로그인을 완료하면 나만의 전용 링크 설정 페이지(<span className="text-emerald-600 dark:text-emerald-400 font-extrabold">mylink.com/내이름</span>)와 위 모든 기능이 담긴 개인 설정 센터가 1초 만에 무료 개설됩니다!
                </p>
              </div>
            </Card>

            {/* 비로그인 홈 전용 세련된 푸터 */}
            <footer className="mt-4 text-center text-[11px] text-zinc-500/85 select-none flex flex-col items-center gap-2 w-full">
              <div className="flex items-center gap-1.5 justify-center">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                <p>고품격 글래스모피즘 디자인의 마이링크 가이드</p>
              </div>
              <p>© {new Date().getFullYear()} My Link. All rights reserved.</p>
            </footer>
          </>
        ) : (
          // ==================== [CASE B] 로그인 유저 또는 개별 퍼블릭 링크 뷰 ====================
          <>
            {/* 프로필 정보 섹션 */}
            <header className="flex flex-col items-center text-center w-full">
              <div className="relative group">
                {/* 프로필 외곽 다이내믹 그라데이션 광원 */}
                <div className={`absolute -inset-1 rounded-full ${activePreset.primaryBg} opacity-50 blur-md group-hover:opacity-95 group-hover:blur-xl transition duration-700`} />
                
                {/* 프로필 아바타 서클 */}
                <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-zinc-950 text-3xl font-black tracking-wider text-white shadow-2xl border-2 border-white/15 transition-transform duration-300 hover:scale-105">
                  {profile.avatarInitials || "JU"}
                </div>
              </div>

              {/* 프로필 이름 */}
              <h1 className="mt-5 text-xl font-black tracking-tight sm:text-2xl">
                {profile.displayName || "이름 정보 없음"}
              </h1>

              {/* 프로필 Bio 자기소개 */}
              <div className="mt-3.5 w-full max-w-xs sm:max-w-sm">
                <p className="text-xs leading-relaxed text-zinc-400">
                  {profile.bio || "아직 작성된 자기소개가 없습니다."}
                </p>
              </div>

              {/* 전문 관심 스택 배지 리스트 */}
              {tags.length > 0 && (
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
              )}
            </header>

            {/* 4. 연결 링크 목록 섹션 (순수 뷰어 모드 & 글래스모피즘 디자인) */}
            <section className="flex w-full flex-col gap-4">
              {links.length > 0 ? (
                links.map((link, index) => {
                  return (
                    <div
                      key={link.id}
                      className="group relative w-full"
                      style={{
                        animationDelay: `${index * 100}ms`,
                        animationFillMode: "both",
                      }}
                    >
                      <TrackedLinkCard
                        userId={targetUid}
                        linkId={link.id}
                        title={link.title}
                        url={link.url}
                        cardClass={`${activePreset.cardClass} ${activePreset.cardHoverGlow} transform hover:scale-[1.02] active:scale-[0.98]`}
                        primaryText={activePreset.primaryText}
                        accentText={activePreset.accentText}
                      />
                    </div>
                  )
                })
              ) : (
                <div className={`p-8 rounded-2xl border text-center transition-all ${activePreset.cardClass}`}>
                  <p className="text-xs font-semibold text-zinc-500">등록된 마이링크가 아직 없습니다.</p>
                </div>
              )}
            </section>

            {/* 푸터 영역 */}
            <footer className="mt-8 text-center text-[11px] text-zinc-500/85 select-none flex flex-col items-center gap-2">
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-zinc-500 animate-ping" />
                <p>고품격 글래스모피즘 디자인으로 제작되었습니다</p>
              </div>
              <p>© {new Date().getFullYear()} My Link. All rights reserved.</p>
            </footer>
          </>
        )}
      </div>

      {/* 5. 하단 고정형 세련된 소셜 미디어 독 (비로그인 첫 화면일 때는 렌더링하지 않음) */}
      {!showIntroBanner && socials.filter((s) => s.url && s.active).length > 0 && (
        <nav className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2 flex items-center gap-4 bg-zinc-900/70 dark:bg-black/40 border border-white/10 dark:border-white/5 backdrop-blur-xl px-5 py-2.5 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.4)] transition-transform duration-300 hover:scale-105">
          {socials
            .filter((social) => social.url && social.active)
            .map((social) => (
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
      )}
    </main>
  )
}
