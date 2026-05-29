import type { Metadata } from "next"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/context/AuthContext"

export const metadata: Metadata = {
  title: "마이링크 - 나만의 프리미엄 링크 트리",
  description: "즐겨 찾는 소셜 미디어와 유용한 링크들을 고품격 테마로 한곳에서 관리하고 공유하세요.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="ko"
      suppressHydrationWarning
      className="antialiased font-sans"
    >
      <head>
        <meta name="google" content="notranslate" />
      </head>
      <body>
        <ThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
