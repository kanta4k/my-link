"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { 
  Sparkles, Plus, Trash2, Link2, 
  User, FileText, BadgePlus, HelpCircle, RotateCcw, 
  LayoutTemplate, AlertTriangle, Globe, Mail, Check, X, Edit3, Lock
} from "lucide-react"
import { dummyLinks, dummySocials, defaultTags, getFaviconUrl, LinkItem, SocialItem } from "@/Data/links"
import { Card } from "@/components/ui/card"
import { Dialog } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { db } from "@/lib/firebase"
import { useAuth } from "@/context/AuthContext"
import Header from "@/components/Header"
import { 
  collection, 
  addDoc, 
  deleteDoc, 
  updateDoc, 
  setDoc,
  doc, 
  onSnapshot, 
  query, 
  orderBy, 
  writeBatch, 
  getDocs, 
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

// 테마별 동적 포커싱 링 클래스 매퍼
const getFocusRingClass = (themeId: string) => {
  switch (themeId) {
    case "cyberpunk":
      return "focus:border-fuchsia-500/60 focus:ring-1 focus:ring-fuchsia-500/30"
    case "emerald":
      return "focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/30"
    case "sunset":
      return "focus:border-orange-500/60 focus:ring-1 focus:ring-orange-500/30"
    case "minimal":
      return "focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30"
    case "glass-light":
      return "focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/30"
    default:
      return "focus:border-fuchsia-500/60 focus:ring-1 focus:ring-fuchsia-500/30"
  }
}

export default function MyPage() {
  const router = useRouter()
  const { user, loading: authLoading, loginWithGoogle } = useAuth()

  const [mounted, setMounted] = useState(false)
  const [activeThemeId, setActiveThemeId] = useState<string>("glass-light")

  // 핵심 관리 상태 정의
  const [profile, setProfile] = useState({
    displayName: "정운학 (Unhak Jeong)",
    bio: "🚀 마이링크 프론트엔드 리디자인 연구원 | 멋진 인터랙션과 최상의 UX를 설계하는 제품 지향적 개발자입니다. React, Next.js, Rust에 푹 빠져있습니다.",
    avatarInitials: "JU"
  })
  
  const [links, setLinks] = useState<LinkItem[]>([])
  const [socials, setSocials] = useState<SocialItem[]>([])
  const [tags, setTags] = useState<string[]>([])

  // 다이얼로그 모달 제어 상태
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  
  // 신규 링크 입력 폼 상태
  const [newTitle, setNewTitle] = useState("")
  const [newUrl, setNewUrl] = useState("")

  // 관심 스택 추가를 위한 입력 폼 상태
  const [newTag, setNewTag] = useState("")
  const [isAddingTag, setIsAddingTag] = useState(false)

  // 소셜 미디어 플랫폼 개별 수정 상태
  const [editingSocialPlatform, setEditingSocialPlatform] = useState<string | null>(null)
  const [tempSocialUrl, setTempSocialUrl] = useState("")

  // 알림 메시지 피드백 상태
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // 링크 인라인 편집 상태
  const [editingLinkId, setEditingLinkId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState("")
  const [editUrl, setEditUrl] = useState("")

  // 링크 삭제 확인 모달 상태
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [linkToDeleteId, setLinkToDeleteId] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  // 로드 및 Firestore 실시간 동기화 (유저 UID 전제)
  useEffect(() => {
    if (!mounted || !user) return

    // 1. 프로필 정보 실시간 동기화
    const profileDocRef = doc(db, "users", user.uid)
    const unsubscribeProfile = onSnapshot(profileDocRef, async (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data()
        if (data.profile) setProfile(data.profile)
        if (data.tags) setTags(data.tags)
        if (data.themeId) setActiveThemeId(data.themeId)
      } else {
        // Firestore에 프로필 문서가 없는 경우 로컬 스토리지 마이그레이션 또는 초기 Seeding
        const savedProfile = localStorage.getItem("mylink_profile")
        const savedTags = localStorage.getItem("mylink_tags")
        const savedThemeId = localStorage.getItem("mylink_theme_id")

        const initialProfile = savedProfile ? JSON.parse(savedProfile) : {
          displayName: user.displayName || "정운학 (Unhak Jeong)",
          bio: "🚀 마이링크 프론트엔드 리디자인 연구원 | 멋진 인터랙션과 최상의 UX를 설계하는 제품 지향적 개발자입니다. React, Next.js, Rust에 푹 빠져있습니다.",
          avatarInitials: user.displayName ? user.displayName.substring(0, 2).toUpperCase() : "JU"
        }
        const initialTags = savedTags ? JSON.parse(savedTags) : defaultTags
        const initialThemeId = savedThemeId || "glass-light"

        // 최초 1회 Firestore 문서 생성
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

        setProfile(initialProfile)
        setTags(initialTags)
        setActiveThemeId(initialThemeId)
      }
    }, (error) => {
      console.error("Firestore Profile Sync Error: ", error)
    })

    // 2. Links 실시간 동기화 (users/{uid}/links)
    const linksRef = collection(db, "users", user.uid, "links")
    const q = query(linksRef, orderBy("createdAt", "desc"))
    const unsubscribeLinks = onSnapshot(q, async (snapshot) => {
      const fetchedLinks = snapshot.docs.map((doc) => ({
        id: doc.id,
        title: doc.data().title || "",
        url: doc.data().url || "",
      }))
      setLinks(fetchedLinks)
    }, (error) => {
      console.error("Firestore links Sync Error: ", error)
    })

    // 3. Socials 실시간 동기화 (users/{uid}/socials)
    const socialsRef = collection(db, "users", user.uid, "socials")
    const unsubscribeSocials = onSnapshot(socialsRef, async (snapshot) => {
      const fetchedSocials = snapshot.docs.map((doc) => ({
        id: doc.id,
        platform: doc.data().platform || doc.id,
        url: doc.data().url || "",
      })) as SocialItem[]

      const order = ['github', 'linkedin', 'twitter', 'youtube', 'instagram']
      const sortedSocials = [...fetchedSocials].sort((a, b) => {
        return order.indexOf(a.platform) - order.indexOf(b.platform)
      })
      setSocials(sortedSocials)
    }, (error) => {
      console.error("Firestore socials Sync Error: ", error)
    })

    return () => {
      unsubscribeProfile()
      unsubscribeLinks()
      unsubscribeSocials()
    }
  }, [user, mounted])

  // 활성 프리셋 정보 로드
  const activePreset = themePresets.find(p => p.id === activeThemeId) || themePresets[0]

  // 알림 피드백 노출 유틸리티
  const showToast = (message: string) => {
    setToastMessage(message)
    setTimeout(() => {
      setToastMessage(null)
    }, 2800)
  }

  // 프로필 텍스트 필드 실시간 반영 및 저장 (Firestore 연동)
  const handleProfileFieldChange = async (field: "displayName" | "bio" | "avatarInitials", value: string) => {
    const updated = { ...profile, [field]: value }
    setProfile(updated)
    localStorage.setItem("mylink_profile", JSON.stringify(updated))

    if (!user) return
    try {
      await setDoc(doc(db, "users", user.uid), {
        profile: updated
      }, { merge: true })
    } catch (err) {
      console.error("Failed to save profile to Firestore", err)
    }
  }

  // 관심사 스택 배지 추가 (Firestore 연동)
  const handleAddTagSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const val = newTag.trim()
    if (!val || !user) return

    if (tags.includes(val)) {
      showToast("⚠️ 이미 등록된 관심 스택명입니다.")
      return
    }

    const updated = [...tags, val]
    setTags(updated)
    localStorage.setItem("mylink_tags", JSON.stringify(updated))
    setNewTag("")
    setIsAddingTag(false)

    try {
      await setDoc(doc(db, "users", user.uid), {
        tags: updated
      }, { merge: true })
      showToast("🏷️ 관심 스택이 프로필에 반영되었습니다.")
    } catch (err) {
      console.error(err)
      showToast("❌ 관심 스택 저장에 실패했습니다.")
    }
  }

  // 관심사 스택 배지 삭제 (Firestore 연동)
  const handleDeleteTag = async (targetTag: string) => {
    if (!user) return
    const updated = tags.filter(t => t !== targetTag)
    setTags(updated)
    localStorage.setItem("mylink_tags", JSON.stringify(updated))

    try {
      await setDoc(doc(db, "users", user.uid), {
        tags: updated
      }, { merge: true })
      showToast("🗑️ 태그가 삭제되었습니다.")
    } catch (err) {
      console.error(err)
      showToast("❌ 태그 삭제에 실패했습니다.")
    }
  }

  // 테마 프리셋 실시간 변경 (Firestore 연동)
  const handleThemePresetChange = async (themeId: string) => {
    setActiveThemeId(themeId)
    localStorage.setItem("mylink_theme_id", themeId)

    if (!user) return
    try {
      await setDoc(doc(db, "users", user.uid), {
        themeId
      }, { merge: true })
      showToast(`🎨 테마 프리셋이 '${themePresets.find(t=>t.id===themeId)?.name}'(으)로 변경되었습니다!`)
    } catch (err) {
      console.error(err)
      showToast("❌ 테마 저장에 실패했습니다.")
    }
  }

  // 소셜 미디어 링크 편집 개시
  const startEditingSocial = (platform: string, currentUrl: string) => {
    setEditingSocialPlatform(platform)
    setTempSocialUrl(currentUrl)
  }

  // 소셜 미디어 링크 저장 (Firestore 연동)
  const saveSocialLink = async () => {
    if (!editingSocialPlatform || !user) return
    let finalUrl = tempSocialUrl.trim()

    // 공백이 아닌 경우에만 유효성 정밀 검증
    if (finalUrl) {
      if (editingSocialPlatform === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(finalUrl)) {
          showToast("❌ 올바른 이메일 주소를 입력하세요.")
          return
        }
      } else {
        if (!/^https?:\/\//i.test(finalUrl)) {
          finalUrl = "https://" + finalUrl
        }

        try {
          const parsedUrl = new URL(finalUrl)
          if (!parsedUrl.hostname.includes(".")) {
            throw new Error("Invalid domain")
          }
        } catch (err) {
          showToast("❌ 올바른 소셜 주소를 입력하세요.")
          return
        }
      }
    }

    try {
      await setDoc(doc(db, "users", user.uid, "socials", editingSocialPlatform), {
        platform: editingSocialPlatform,
        url: finalUrl
      }, { merge: true })

      setEditingSocialPlatform(null)
      setTempSocialUrl("")
      showToast(`🔗 ${editingSocialPlatform.toUpperCase()} 주소가 업데이트되었습니다.`)
    } catch (err) {
      console.error("Failed to save social link to Firestore", err)
      showToast("❌ 소셜 주소 업데이트에 실패했습니다.")
    }
  }

  // 다이얼로그 열기
  const handleOpenDialog = () => {
    setNewTitle("")
    setNewUrl("")
    setIsDialogOpen(true)
  }

  // 다이얼로그 폼을 통한 링크 신규 추가 (Firestore 연동)
  const handleAddLinkSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    
    const title = newTitle.trim()
    let url = newUrl.trim()

    if (!title) {
      showToast("❌ 제목을 입력해주세요")
      return
    }
    if (!url) {
      showToast("❌ 주소를 입력해주세요")
      return
    }

    let testUrl = url
    if (!/^https?:\/\//i.test(testUrl)) {
      testUrl = "https://" + testUrl
    }

    let isValidUrl = false
    try {
      const parsedUrl = new URL(testUrl)
      if (parsedUrl.hostname && parsedUrl.hostname.includes(".")) {
        isValidUrl = true
        url = testUrl
      }
    } catch (err) {}

    if (!isValidUrl) {
      showToast("❌ 올바른 주소를 입력해주세요")
      return
    }

    try {
      await addDoc(collection(db, "users", user.uid, "links"), {
        title,
        url,
        createdAt: serverTimestamp()
      })
      setIsDialogOpen(false)
      showToast("🎉 새 링크 카드가 성공적으로 추가되었습니다!")
    } catch (err) {
      console.error("Failed to add link to Firestore", err)
      showToast("❌ 링크 카드 추가에 실패했습니다.")
    }
  }

  // 링크 삭제 확인 모달 열기
  const openDeleteConfirm = (id: string) => {
    setLinkToDeleteId(id)
    setIsDeleteConfirmOpen(true)
  }

  // 실제 링크 삭제 실행 (Firestore 연동)
  const confirmDeleteLink = async () => {
    if (!linkToDeleteId || !user) return
    try {
      await deleteDoc(doc(db, "users", user.uid, "links", linkToDeleteId))
      setIsDeleteConfirmOpen(false)
      setLinkToDeleteId(null)
      showToast("🗑️ 링크 카드가 목록에서 삭제되었습니다.")
    } catch (err) {
      console.error("Failed to delete link from Firestore", err)
      showToast("❌ 링크 삭제에 실패했습니다.")
    }
  }

  // 링크 인라인 편집 개시
  const startEditingLink = (id: string, currentTitle: string, currentUrl: string) => {
    setEditingLinkId(id)
    setEditTitle(currentTitle)
    setEditUrl(currentUrl)
  }

  // 링크 인라인 편집 저장 (Firestore 연동)
  const handleUpdateLinkSubmit = async (id: string) => {
    if (!user) return
    const title = editTitle.trim()
    let url = editUrl.trim()

    if (!title) {
      showToast("❌ 제목을 입력해주세요")
      return
    }
    if (!url) {
      showToast("❌ 주소를 입력해주세요")
      return
    }

    let testUrl = url
    if (!/^https?:\/\//i.test(testUrl)) {
      testUrl = "https://" + testUrl
    }

    let isValidUrl = false
    try {
      const parsedUrl = new URL(testUrl)
      if (parsedUrl.hostname && parsedUrl.hostname.includes(".")) {
        isValidUrl = true
        url = testUrl
      }
    } catch (err) {}

    if (!isValidUrl) {
      showToast("❌ 올바른 주소를 입력해주세요")
      return
    }

    try {
      await updateDoc(doc(db, "users", user.uid, "links", id), {
        title,
        url,
        updatedAt: serverTimestamp()
      })
      setEditingLinkId(null)
      showToast("✏️ 링크 카드가 성공적으로 수정되었습니다!")
    } catch (err) {
      console.error("Failed to update link in Firestore", err)
      showToast("❌ 링크 카드 수정에 실패했습니다.")
    }
  }

  // 링크 인라인 편집 취소
  const handleCancelEdit = () => {
    setEditingLinkId(null)
    setEditTitle("")
    setEditUrl("")
  }

  // 전체 데이터 데모 상태로 초기화 (개인 계정 복구)
  const handleResetToDemo = async () => {
    if (!user) return
    if (confirm("🚨 경고: 정말 모든 데이터를 데모 초기값으로 복구하시겠습니까?\n현재 본인 계정에 업로드된 모든 프로필 및 링크 카드 수정 이력이 초기화됩니다.")) {
      const defaultProfile = {
        displayName: user.displayName || "정운학 (Unhak Jeong)",
        bio: "🚀 마이링크 프론트엔드 리디자인 연구원 | 멋진 인터랙션과 최상의 UX를 설계하는 제품 지향적 개발자입니다. React, Next.js, Rust에 푹 빠져있습니다.",
        avatarInitials: user.displayName ? user.displayName.substring(0, 2).toUpperCase() : "JU"
      }

      try {
        const linksRef = collection(db, "users", user.uid, "links")
        const snapshot = await getDocs(linksRef)
        const batch = writeBatch(db)

        // 기존 문서 삭제 등록
        snapshot.docs.forEach((doc) => {
          batch.delete(doc.ref)
        })

        // 데모 링크 추가
        dummyLinks.forEach((item) => {
          const newDocRef = doc(linksRef)
          batch.set(newDocRef, {
            title: item.title,
            url: item.url,
            createdAt: serverTimestamp()
          })
        })

        // 소셜 데이터 리셋
        const socialsRef = collection(db, "users", user.uid, "socials")
        const socialsSnapshot = await getDocs(socialsRef)
        socialsSnapshot.docs.forEach((doc) => {
          batch.delete(doc.ref)
        })
        dummySocials.forEach((item) => {
          const docRef = doc(db, "users", user.uid, "socials", item.platform)
          batch.set(docRef, {
            platform: item.platform,
            url: item.url
          })
        })

        // 프로필 문서 리셋
        const profileDocRef = doc(db, "users", user.uid)
        batch.set(profileDocRef, {
          profile: defaultProfile,
          tags: defaultTags,
          themeId: "glass-light",
          createdAt: serverTimestamp()
        }, { merge: true })

        await batch.commit()

        setProfile(defaultProfile)
        setSocials(dummySocials)
        setTags(defaultTags)
        setActiveThemeId("glass-light")

        showToast("🔄 본인 계정의 데이터가 데모 기본값으로 완벽하게 초기화되었습니다.")
      } catch (err) {
        console.error("Failed to reset Firestore to demo data", err)
        showToast("❌ 데모 복구 초기화에 실패했습니다.")
      }
    }
  }

  // 소셜 아이콘 SVG 렌더링
  const renderSocialIcon = (platform: string, className = "h-4 w-4") => {
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

  // 1. 전체 인증 로딩 처리
  if (!mounted || authLoading) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-zinc-950 text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-r-2 border-fuchsia-500" />
          <p className="text-xs font-bold tracking-widest text-zinc-400">설정 페이지를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  // 2. 비로그인 접근 제한 화면 (보안 게이트 & 구글 로그인 유도)
  if (!user) {
    return (
      <main className="relative flex min-h-svh w-full flex-col items-center justify-center overflow-x-hidden p-4 transition-all duration-700 bg-radial from-slate-950 via-zinc-950 to-neutral-950 text-slate-100">
        
        {/* 상단 앰비언트 글로우 */}
        <div className="pointer-events-none absolute top-10 left-1/4 -z-10 h-80 w-80 rounded-full bg-fuchsia-500/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-10 right-1/4 -z-10 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />

        {/* 기본 헤더 탑재 */}
        <Header isDashboard={true} />

        <div className="w-full max-w-md p-8 rounded-3xl border border-white/10 bg-slate-900/40 backdrop-blur-2xl shadow-2xl flex flex-col items-center text-center gap-6 relative overflow-hidden animate-fade-in">
          <div className="absolute -inset-0.5 rounded-3xl bg-gradient-to-r from-fuchsia-500 to-cyan-500 opacity-20 blur-sm -z-10" />

          {/* 자물쇠 잠금 마이크로 애니메이션 */}
          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-950 border border-white/10 shadow-lg">
            <Lock className="h-7.5 w-7.5 text-fuchsia-400 animate-pulse" />
          </div>

          <div className="flex flex-col gap-2">
            <h1 className="text-xl sm:text-2xl font-black bg-gradient-to-r from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent">
              로그인 필요
            </h1>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-xs mx-auto">
              마이링크 설정 센터는 보호된 영역입니다. 나만의 프리미엄 링크 트리를 편집하려면 구글 로그인을 진행해 주세요.
            </p>
          </div>

          <button
            onClick={loginWithGoogle}
            className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl border border-white/10 bg-zinc-900/60 hover:bg-zinc-950 text-xs font-black text-white hover:border-fuchsia-500/40 shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            {/* Google SVG */}
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
            <span>Google 계정으로 로그인</span>
          </button>
        </div>
      </main>
    )
  }

  // 3. 정상 로그인 대시보드 화면
  return (
    <main className={`relative flex min-h-svh w-full flex-col items-center justify-start overflow-x-hidden p-4 pb-20 pt-24 sm:pt-32 transition-all duration-700 ease-in-out ${activePreset.bgClass}`}>
      
      {/* 고품격 프리미엄 헤더 */}
      <Header activePreset={activePreset} isDashboard={true} />

      {/* 1. 상단 백라이트 앰비언트 글로우 장식 */}
      <div className={`pointer-events-none absolute top-0 left-1/4 -z-10 h-[400px] w-[400px] rounded-full bg-gradient-to-b ${activePreset.auraClass1} blur-3xl`} />
      <div className={`pointer-events-none absolute top-20 right-1/4 -z-10 h-[450px] w-[450px] rounded-full bg-gradient-to-b ${activePreset.auraClass2} blur-3xl`} />

      {/* 실시간 알림 토스트 피드백 */}
      {toastMessage && (
        <div className="fixed top-24 left-1/2 z-[100] -translate-x-1/2 flex items-center gap-2 rounded-full bg-zinc-900/95 border border-white/10 px-5 py-3 shadow-2xl text-xs font-semibold text-white backdrop-blur-md animate-fade-in-down">
          <Sparkles className="h-4 w-4 text-amber-400 animate-spin-[spin_3s_linear_infinite]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 메인 어드민 대시보드 쉘 */}
      <div className="w-full max-w-xl flex flex-col gap-6 animate-fade-in">
        
        {/* 대시보드 인트로 */}
        <section className="flex flex-col gap-1.5 text-left pl-1">
          <h1 className="text-xl sm:text-2xl font-black bg-gradient-to-r from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-400" />
            마이링크 설정 센터
          </h1>
          <p className="text-xs text-zinc-400 leading-relaxed">
            안녕하세요, <span className="text-zinc-200 font-bold">{user.displayName || "사용자"}</span>님! 나만의 퍼블릭 링크, 비주얼 테마, 프로필 상태를 완벽하게 제어합니다.
          </p>
        </section>

        {/* CARD 1: 마이링크 테마 프리셋 설정 */}
        <Card className={`p-5 backdrop-blur-xl border flex flex-col gap-4.5 ${activePreset.cardClass}`}>
          <div className="flex items-center gap-2 border-b border-white/10 pb-3">
            <LayoutTemplate className={`h-4.5 w-4.5 ${activePreset.primaryText}`} />
            <h2 className="text-sm font-bold text-white tracking-wide">내 브랜드 비주얼 테마 설정</h2>
          </div>

          <div className="flex flex-col gap-2 text-left">
            <p className="text-[11px] text-zinc-400">
              내 퍼블릭 링크 페이지에 적용될 5가지 프리미엄 그래디언트 테마 프리셋입니다.
            </p>
            
            <div className="flex flex-wrap gap-2.5 mt-2">
              {themePresets.map((preset) => {
                const isActive = preset.id === activeThemeId
                return (
                  <button
                    key={preset.id}
                    onClick={() => handleThemePresetChange(preset.id)}
                    className={`px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer ${
                      isActive 
                        ? `${preset.primaryBg} text-white scale-[1.03] shadow-lg`
                        : "bg-zinc-950/70 border border-white/5 hover:bg-white/5 hover:border-white/10 text-zinc-300"
                    }`}
                  >
                    {preset.name}
                  </button>
                )
              })}
            </div>
          </div>
        </Card>

        {/* CARD 2: 프로필 정보 편집 */}
        <Card className={`p-5 backdrop-blur-xl border flex flex-col gap-5 ${activePreset.cardClass}`}>
          <div className="flex items-center gap-2 border-b border-white/10 pb-3">
            <User className={`h-4.5 w-4.5 ${activePreset.primaryText}`} />
            <h2 className="text-sm font-bold text-white tracking-wide">프로필 정보 편집</h2>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-start text-left">
            {/* 아바타 이니셜 입력란 */}
            <div className="flex flex-col gap-1.5 w-full sm:w-20">
              <Label>아바타</Label>
              <Input
                type="text"
                maxLength={2}
                value={profile.avatarInitials}
                onChange={(e) => handleProfileFieldChange("avatarInitials", e.target.value.toUpperCase())}
                placeholder="JU"
                className={cn("text-center font-black uppercase", getFocusRingClass(activeThemeId))}
              />
            </div>

            {/* 표시 이름(displayName) 입력란 */}
            <div className="flex flex-col gap-1.5 flex-grow w-full">
              <Label>표시 이름</Label>
              <Input
                type="text"
                value={profile.displayName}
                onChange={(e) => handleProfileFieldChange("displayName", e.target.value)}
                placeholder="이름 혹은 닉네임을 적어주세요."
                className={getFocusRingClass(activeThemeId)}
              />
            </div>
          </div>

          {/* 단문 소개(bio) 입력란 */}
          <div className="flex flex-col gap-1.5 w-full text-left">
            <Label>단문 자기소개 (Bio)</Label>
            <Textarea
              value={profile.bio}
              onChange={(e) => handleProfileFieldChange("bio", e.target.value)}
              placeholder="자신을 나타내는 멋진 한 줄을 작성해 주세요."
              rows={3}
              className={getFocusRingClass(activeThemeId)}
            />
          </div>

          {/* 스택 태그 관리 */}
          <div className="flex flex-col gap-2 w-full pt-1 text-left">
            <Label className="flex items-center justify-between">
              <span>관심 분야 / 스택 태그</span>
              <span className="text-[9px] text-zinc-500 font-normal lowercase tracking-normal">태그 삭제 시 우측 × 클릭</span>
            </Label>

            {/* 기존 등록된 배지 */}
            <div className="flex flex-wrap gap-1.5 min-h-[30px] p-2 bg-zinc-950/50 rounded-xl border border-white/5">
              {tags.map((tag) => (
                <span 
                  key={tag} 
                  className={`text-[9px] py-1 px-2.5 rounded-full font-bold select-none flex items-center gap-1 transition-transform hover:scale-[1.02] ${activePreset.tagBg}`}
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
                  <Input
                    type="text"
                    placeholder="예: React 19"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    className={cn("flex-grow px-3 py-1.5 h-8.5", getFocusRingClass(activeThemeId))}
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

        {/* CARD 3: 연결 링크 목록 관리 */}
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
              const isLinkEditing = editingLinkId === link.id

              return (
                <div 
                  key={link.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-2xl bg-zinc-950/40 border border-white/5 hover:border-white/10 transition-all duration-200 group text-left gap-3"
                >
                  <div className="flex items-center gap-3 overflow-hidden text-left flex-grow">
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
                    
                    {/* 텍스트 타이틀 혹은 인라인 수정 인풋 */}
                    {isLinkEditing ? (
                      <div className="flex flex-col gap-1.5 flex-grow pr-1">
                        <Input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          placeholder="링크 제목을 입력하세요"
                          className={cn("w-full h-8.5 px-2.5 py-1 text-xs rounded-lg", getFocusRingClass(activeThemeId))}
                          autoFocus
                        />
                        <Input
                          type="text"
                          value={editUrl}
                          onChange={(e) => setEditUrl(e.target.value)}
                          placeholder="연결 URL 주소를 입력하세요"
                          className={cn("w-full h-8.5 px-2.5 py-1 text-xs rounded-lg text-zinc-300", getFocusRingClass(activeThemeId))}
                        />
                      </div>
                    ) : (
                      <div className="overflow-hidden">
                        <h4 className="text-xs font-bold text-zinc-100 group-hover:text-white truncate">
                          {link.title}
                        </h4>
                        <p className="text-[10px] text-zinc-500 truncate mt-0.5 max-w-[200px] sm:max-w-[280px]">
                          {link.url}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* 액션 버튼 영역 */}
                  <div className="flex items-center gap-1.5 flex-shrink-0 justify-end sm:justify-start">
                    {isLinkEditing ? (
                      <>
                        <button
                          onClick={() => handleUpdateLinkSubmit(link.id)}
                          className="p-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
                          title="저장"
                        >
                          <Check className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer border border-white/5"
                          title="취소"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEditingLink(link.id, link.title, link.url)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-zinc-300 hover:text-white transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
                          title="링크 수정"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => openDeleteConfirm(link.id)}
                          className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/25 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
                          title="링크 제거"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </>
                    )}
                  </div>
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

        {/* CARD 4: 소셜 아이콘 바 설정 */}
        <Card className={`p-5 backdrop-blur-xl border flex flex-col gap-4 ${activePreset.cardClass}`}>
          <div className="flex items-center gap-2 border-b border-white/10 pb-3">
            <Globe className={`h-4.5 w-4.5 ${activePreset.primaryText}`} />
            <h2 className="text-sm font-bold text-white tracking-wide">하단 소셜 미디어 주소 설정</h2>
          </div>

          <p className="text-[11px] text-zinc-400 text-left">
            메인 페이지 최하단에 정렬되는 툴팁형 소셜 아이콘 바의 연결 경로를 지정합니다.
          </p>

          <div className="flex flex-col gap-2.5 mt-1 text-left">
            {socials.map((social) => {
              const isEditing = editingSocialPlatform === social.platform
              const hasUrl = !!social.url

              return (
                <div 
                  key={social.id}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-zinc-950/40 rounded-2xl border transition-all duration-300 ${
                    hasUrl || isEditing 
                      ? "border-white/5 opacity-100" 
                      : "border-white/0 opacity-40 hover:opacity-75"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/5 border border-white/5 text-zinc-300">
                      {renderSocialIcon(social.platform)}
                    </span>
                    <span className="text-xs font-black text-zinc-200 capitalize w-16">{social.platform}</span>
                  </div>

                  <div className="flex-grow flex items-center gap-2 w-full sm:w-auto">
                    {isEditing ? (
                      <div className="flex gap-2 w-full">
                        <Input
                          type="text"
                          value={tempSocialUrl}
                          onChange={(e) => setTempSocialUrl(e.target.value)}
                          placeholder={social.platform === 'email' ? "unhak@example.com" : "URL 주소를 적어주세요."}
                          className={cn("flex-grow px-3 py-1.5 h-8.5", getFocusRingClass(activeThemeId))}
                          autoFocus
                        />
                        <button
                          onClick={saveSocialLink}
                          className="p-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black cursor-pointer"
                          title="주소 저장"
                        >
                          <Check className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => setEditingSocialPlatform(null)}
                          className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 text-xs font-semibold cursor-pointer"
                        >
                          취소
                        </button>
                      </div>
                    ) : (
                      <>
                        <span className={`text-[10px] font-medium truncate max-w-[160px] sm:max-w-[200px] flex-grow text-right pr-2 ${
                          hasUrl ? "text-zinc-500" : "text-zinc-600 italic"
                        }`}>
                          {hasUrl ? social.url : "(미설정 / 사용 안 함)"}
                        </span>
                        <button
                          onClick={() => startEditingSocial(social.platform, social.url)}
                          className="flex items-center gap-1 py-1 px-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-[10px] font-bold text-zinc-300 hover:text-white cursor-pointer"
                        >
                          <Edit3 className="h-3 w-3" />
                          <span>주소 수정</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </Card>

        {/* CARD 5: Danger Zone */}
        <Card className="p-5 backdrop-blur-xl border border-red-500/20 bg-red-950/10 flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-red-500/15 pb-3">
            <AlertTriangle className="h-4.5 w-4.5 text-red-400 animate-pulse" />
            <h2 className="text-sm font-bold text-red-200 tracking-wide">Danger Zone (위험 구역)</h2>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
            <div>
              <h4 className="text-xs font-black text-zinc-200">데모 데이터 전체 복구 및 리셋</h4>
              <p className="text-[10px] text-zinc-500 leading-relaxed mt-1">
                기존에 설정하신 나만의 마이링크 데이터를 전부 지우고 최초 데모 프리셋 데이터로 복구 및 리셋합니다.
              </p>
            </div>
            
            <button
              onClick={handleResetToDemo}
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-black bg-red-500/15 hover:bg-red-500/25 border border-red-500/35 text-red-400 transition-all cursor-pointer flex-shrink-0"
              title="데이터 전체 초기 데모 프리셋으로 리셋"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>데이터 복구 초기화</span>
            </button>
          </div>
        </Card>

        {/* 푸터 */}
        <footer className="text-center text-[10px] text-zinc-500 select-none">
          <p>© {new Date().getFullYear()} My Link Center. Design System Integrated.</p>
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
            <Label>웹페이지 제목</Label>
            <Input
              type="text"
              placeholder="예: 깃허브 개인 저장소"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className={getFocusRingClass(activeThemeId)}
              autoFocus
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="flex items-center justify-between">
              <span>연결 주소 (URL)</span>
              <span className="text-[9px] text-zinc-500 font-normal lowercase tracking-normal">프로토콜 자동 보완됨</span>
            </Label>
            <Input
              type="text"
              placeholder="예: github.com"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              className={getFocusRingClass(activeThemeId)}
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

      {/* 3단계: 링크 삭제 확인 다이얼로그 모달 */}
      <Dialog
        isOpen={isDeleteConfirmOpen}
        onClose={() => {
          setIsDeleteConfirmOpen(false)
          setLinkToDeleteId(null)
        }}
        title="마이링크 카드 삭제 확인"
      >
        <div className="flex flex-col gap-4 text-left">
          <div className="flex items-center gap-3 p-3 bg-red-500/10 border border-red-500/20 rounded-2xl">
            <AlertTriangle className="h-6 w-6 text-red-400 flex-shrink-0 animate-bounce" />
            <div className="text-xs text-red-200">
              <p className="font-black">정말 이 링크 카드를 목록에서 삭제하시겠습니까?</p>
              <p className="mt-1 font-medium text-red-300/80 text-[10px]">이 작업은 되돌릴 수 없습니다.</p>
            </div>
          </div>

          {/* 하단 액션 버튼 */}
          <div className="flex justify-end gap-2.5 mt-2 border-t border-white/5 pt-4">
            <button
              type="button"
              onClick={() => {
                setIsDeleteConfirmOpen(false)
                setLinkToDeleteId(null)
              }}
              className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 text-xs font-semibold cursor-pointer"
            >
              취소
            </button>
            <button
              type="button"
              onClick={confirmDeleteLink}
              className="px-4.5 py-2 rounded-xl bg-red-500 hover:bg-red-400 text-zinc-950 text-xs font-black shadow-lg hover:brightness-110 transition-all cursor-pointer"
            >
              삭제
            </button>
          </div>
        </div>
      </Dialog>
    </main>
  )
}
