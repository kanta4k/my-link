import Link from "next/link"

export default function NotFound() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center bg-zinc-950 px-6 text-center text-white">
      <p className="text-sm font-bold uppercase tracking-widest text-emerald-400">404</p>
      <h1 className="mt-3 text-2xl font-black tracking-tight">페이지를 찾을 수 없습니다</h1>
      <p className="mt-3 max-w-sm text-sm leading-relaxed text-zinc-400">
        요청한 username의 프로필이 없거나 공개 페이지가 아직 생성되지 않았습니다.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-extrabold text-white transition hover:bg-emerald-400"
      >
        홈으로 이동
      </Link>
    </main>
  )
}
