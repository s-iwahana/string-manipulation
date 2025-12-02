import { StringCounter } from "@/components/string-counter"

export default function Home() {
  return (
    <main className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3 text-balance">文字数カウント</h1>
          <p className="text-lg text-muted-foreground text-balance">
            テキストの文字数・行数・バイト数をリアルタイムでカウント
          </p>
        </div>
        <StringCounter />
      </div>
    </main>
  )
}
