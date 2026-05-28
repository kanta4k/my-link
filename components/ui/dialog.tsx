"use client"

import React, { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { X } from "lucide-react"

interface DialogProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

export function Dialog({ isOpen, onClose, title, children }: DialogProps) {
  const [mounted, setMounted] = useState(false)
  const [shouldRender, setShouldRender] = useState(isOpen)
  const [animating, setAnimating] = useState(false)

  // SSR 환경에서 Portal 렌더링 방지
  useEffect(() => {
    setMounted(true)
  }, [])

  // 애니메이션 수동 트랜지션 처리 (부드러운 퇴장 효과를 위해)
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true)
      // 다음 틱에서 애니메이션 클래스 활성화
      const timer = setTimeout(() => setAnimating(true), 10)
      return () => clearTimeout(timer)
    } else {
      setAnimating(false)
      // 애니메이션 퇴장 지속 시간(200ms) 후 마운트 해제
      const timer = setTimeout(() => setShouldRender(false), 200)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  // ESC 키 클릭 시 닫기 동작 지원
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onClose])

  // 스크롤 방지
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  if (!mounted || !shouldRender) return null

  // Portal을 통해 body 최하단에 렌더링
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* 백드롭 (배경 흐림) */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/65 backdrop-blur-md transition-opacity duration-300 ${
          animating ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* 다이얼로그 바디 */}
      <div
        className={`relative z-10 w-full max-w-md transform rounded-3xl border border-white/10 bg-zinc-900/90 p-6 text-white shadow-2xl backdrop-blur-2xl transition-all duration-200 ${
          animating ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold tracking-tight bg-gradient-to-r from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-zinc-400 hover:text-white hover:bg-white/5 transition-all duration-200 cursor-pointer"
            aria-label="다이얼로그 닫기"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* 컨텐츠 본문 */}
        <div className="text-zinc-300 text-sm">
          {children}
        </div>
      </div>
    </div>,
    document.body
  )
}
