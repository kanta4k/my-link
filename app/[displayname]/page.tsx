import { Link2 } from "lucide-react"
import { notFound } from "next/navigation"
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore"

import Header from "@/components/Header"
import TrackedLinkCard from "@/components/TrackedLinkCard"
import { Card } from "@/components/ui/card"
import { db } from "@/lib/firebase"

interface PublicProfile {
  username?: string
  displayName?: string
  bio?: string
  avatarInitials?: string
}

const themeClasses: Record<
  string,
  {
    bg: string
    avatar: string
    card: string
    tag: string
    accent: string
  }
> = {
  cyberpunk: {
    bg: "bg-radial from-violet-950 via-slate-950 to-neutral-950 text-slate-100",
    avatar: "from-fuchsia-500 to-cyan-500",
    card: "border-fuchsia-500/20 bg-slate-900/50 text-slate-100 hover:border-fuchsia-400/60",
    tag: "border-cyan-500/20 bg-slate-800/80 text-cyan-300",
    accent: "text-fuchsia-300",
  },
  emerald: {
    bg: "bg-radial from-emerald-950 via-zinc-950 to-neutral-950 text-emerald-50",
    avatar: "from-emerald-500 to-teal-500",
    card: "border-emerald-500/20 bg-zinc-900/50 text-emerald-50 hover:border-emerald-400/60",
    tag: "border-teal-500/20 bg-zinc-800/80 text-teal-300",
    accent: "text-emerald-300",
  },
  sunset: {
    bg: "bg-radial from-amber-950 via-rose-950 to-neutral-950 text-rose-50",
    avatar: "from-orange-500 to-rose-500",
    card: "border-orange-500/20 bg-rose-950/30 text-rose-50 hover:border-orange-400/60",
    tag: "border-rose-500/20 bg-rose-900/40 text-rose-300",
    accent: "text-orange-300",
  },
  minimal: {
    bg: "bg-radial from-slate-900 via-slate-950 to-zinc-950 text-slate-100",
    avatar: "from-slate-600 to-indigo-600",
    card: "border-slate-700/40 bg-slate-900/60 text-slate-100 hover:border-slate-400/80",
    tag: "border-slate-700 bg-slate-800 text-slate-300",
    accent: "text-slate-200",
  },
  "glass-light": {
    bg: "bg-radial from-emerald-50 via-zinc-100 to-slate-100 text-slate-900",
    avatar: "from-emerald-500 to-teal-500",
    card: "border-emerald-500/15 bg-white/75 text-slate-900 hover:border-emerald-500/40",
    tag: "border-slate-200 bg-white/90 text-slate-700",
    accent: "text-emerald-700",
  },
}

const normalizeUrl = (url: string) => {
  if (!url) return "#"
  return /^https?:\/\//i.test(url) ? url : `https://${url}`
}

async function getPublicPage(displayname: string) {
  const usersRef = collection(db, "users")
  const userQuery = query(
    usersRef,
    where("profile.username", "==", displayname),
    limit(1)
  )
  const userSnapshot = await getDocs(userQuery)

  if (userSnapshot.empty) {
    return null
  }

  const userDoc = userSnapshot.docs[0]
  const userId = userDoc.id
  const userData = userDoc.data()
  const profile = (userData.profile ?? {}) as PublicProfile

  const linksRef = collection(db, "users", userId, "links")
  const linksQuery = query(linksRef, orderBy("createdAt", "desc"))
  const linksSnapshot = await getDocs(linksQuery)
  const links = linksSnapshot.docs.map((linkDoc) => {
    const data = linkDoc.data()

    return {
      id: linkDoc.id,
      title: data.title || "",
        url: normalizeUrl(data.url || ""),
      clickCount: typeof data.clickCount === "number" ? data.clickCount : 0,
    }
  })

  return {
    userId,
    profile,
    links,
    tags: Array.isArray(userData.tags) ? (userData.tags as string[]) : [],
    themeId: typeof userData.themeId === "string" ? userData.themeId : "glass-light",
  }
}

export default async function DisplayNamePage({
  params,
}: {
  params: Promise<{ displayname: string }>
}) {
  const { displayname } = await params
  const decodedDisplayName = decodeURIComponent(displayname).trim()
  const pageData = await getPublicPage(decodedDisplayName)

  if (!pageData) {
    notFound()
  }

  const { userId, profile, links, tags, themeId } = pageData
  const theme = themeClasses[themeId] ?? themeClasses["glass-light"]
  const displayName = profile.displayName || profile.username || decodedDisplayName
  const initials =
    profile.avatarInitials || displayName.trim().substring(0, 2).toUpperCase() || "ML"

  return (
    <main
      className={`relative flex min-h-svh w-full flex-col items-center overflow-x-hidden px-4 pb-16 pt-28 ${theme.bg}`}
    >
      <Header isPublicProfile />

      <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-80 w-80 -translate-x-1/2 rounded-full bg-white/20 blur-3xl" />

      <div className="flex w-full max-w-md flex-col items-center gap-8">
        <header className="flex w-full flex-col items-center text-center">
          <div className="relative">
            <div
              className={`absolute -inset-1 rounded-full bg-gradient-to-r ${theme.avatar} opacity-60 blur-md`}
            />
            <div className="relative flex h-24 w-24 items-center justify-center rounded-full border-2 border-white/20 bg-zinc-950 text-3xl font-black tracking-wider text-white shadow-2xl">
              {initials}
            </div>
          </div>

          <p className="mt-5 text-xs font-bold text-zinc-500">@{profile.username}</p>
          <h1 className="mt-2 text-2xl font-black tracking-tight">{displayName}</h1>
          {profile.bio ? (
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
              {profile.bio}
            </p>
          ) : null}

          {tags.length > 0 ? (
            <div className="mt-5 flex max-w-sm flex-wrap justify-center gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className={`rounded-full border px-2.5 py-1 text-[10px] font-bold ${theme.tag}`}
                >
                  #{tag}
                </span>
              ))}
            </div>
          ) : null}
        </header>

        <section className="flex w-full flex-col gap-4">
          {links.length > 0 ? (
            links.map((link) => (
              <TrackedLinkCard
                key={link.id}
                userId={userId}
                linkId={link.id}
                title={link.title}
                url={link.url}
                cardClass={theme.card}
                primaryText={theme.accent}
                accentText="text-zinc-400"
              />
            ))
          ) : (
            <Card className={`items-center rounded-2xl p-8 text-center ${theme.card}`}>
              <Link2 className="mx-auto h-6 w-6 text-zinc-400" />
              <p className="mt-3 text-sm font-semibold text-zinc-500">
                등록된 링크가 아직 없습니다.
              </p>
            </Card>
          )}
        </section>
      </div>
    </main>
  )
}
