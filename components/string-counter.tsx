"use client"

import { useState, useEffect } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

interface CountStats {
  totalChars: number
  charsWithoutNewlines: number
  charsWithoutSpaces: number
  lines: number
  utf8Bytes: number
  utf16Bytes: number
}

export function StringCounter() {
  const [text, setText] = useState("")
  const [realtimeCount, setRealtimeCount] = useState(true)
  const [stats, setStats] = useState<CountStats>({
    totalChars: 0,
    charsWithoutNewlines: 0,
    charsWithoutSpaces: 0,
    lines: 0,
    utf8Bytes: 0,
    utf16Bytes: 0,
  })

  const calculateStats = (value: string): CountStats => {
    // Total characters
    const totalChars = value.length

    // Characters without newlines
    const charsWithoutNewlines = value.replace(/\r?\n/g, "").length

    // Characters without spaces and newlines
    const charsWithoutSpaces = value.replace(/[\s\r\n]/g, "").length

    // Lines
    const lines = value === "" ? 0 : value.split(/\r?\n/).length

    // UTF-8 bytes
    const utf8Bytes = new TextEncoder().encode(value).length

    // UTF-16 bytes (2 bytes per character in basic plane)
    const utf16Bytes = value.length * 2

    return {
      totalChars,
      charsWithoutNewlines,
      charsWithoutSpaces,
      lines,
      utf8Bytes,
      utf16Bytes,
    }
  }

  useEffect(() => {
    if (realtimeCount) {
      setStats(calculateStats(text))
    }
  }, [text, realtimeCount])

  const handleCount = () => {
    setStats(calculateStats(text))
  }

  const handleReset = () => {
    setText("")
    setStats({
      totalChars: 0,
      charsWithoutNewlines: 0,
      charsWithoutSpaces: 0,
      lines: 0,
      utf8Bytes: 0,
      utf16Bytes: 0,
    })
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-4">
          <Button onClick={handleReset} variant="outline" size="lg">
            カウントリセット
          </Button>
          <div className="flex items-center gap-2">
            <Switch id="realtime-mode" checked={realtimeCount} onCheckedChange={setRealtimeCount} />
            <Label htmlFor="realtime-mode" className="cursor-pointer">
              リアルタイムにカウントする
            </Label>
          </div>
          {!realtimeCount && (
            <Button onClick={handleCount} variant="default" size="lg">
              カウント
            </Button>
          )}
        </div>
      </Card>

      {/* Text Input */}
      <Card className="p-6 bg-card">
        <Textarea
          placeholder="ここにテキストを入力してください..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="min-h-[300px] text-base resize-y bg-background border-2 focus:border-primary transition-colors"
        />
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard label="文字数" value={stats.totalChars} unit="文字" color="primary" />
        <StatCard label="改行を除いた文字数" value={stats.charsWithoutNewlines} unit="文字" color="secondary" />
        <StatCard label="改行、空白を除いた文字数" value={stats.charsWithoutSpaces} unit="文字" color="accent" />
        <StatCard label="行数" value={stats.lines} unit="行" color="chart-1" />
        <StatCard label="バイト数 (UTF-8)" value={stats.utf8Bytes} unit="バイト" color="chart-2" />
        <StatCard label="バイト数 (UTF-16)" value={stats.utf16Bytes} unit="バイト" color="chart-3" />
      </div>

      {/* Info */}
      <Card className="p-6 bg-muted/30">
        <h2 className="text-xl font-semibold mb-3 text-foreground">使い方</h2>
        <div className="space-y-2 text-sm text-muted-foreground leading-relaxed">
          <p>
            上のテキストボックスに文字数を数えたい文章を入力または貼り付けると、リアルタイムで文字数・行数・バイト数を表示します。
          </p>
          <p>入力データは一切サーバーに送信されません。完全ローカルで安心してご利用いただけます。</p>
          <p className="text-xs mt-4 text-muted-foreground/70">
            ※動作が重い場合は、「リアルタイムにカウントする」のチェックをはずしてください。
          </p>
        </div>
      </Card>
    </div>
  )
}

interface StatCardProps {
  label: string
  value: number
  unit: string
  color: string
}

function StatCard({ label, value, unit, color }: StatCardProps) {
  const colorClasses = {
    primary: "bg-primary/10 border-primary/30",
    secondary: "bg-secondary/10 border-secondary/30",
    accent: "bg-accent/10 border-accent/30",
    "chart-1": "bg-chart-1/10 border-chart-1/30",
    "chart-2": "bg-chart-2/10 border-chart-2/30",
    "chart-3": "bg-chart-3/10 border-chart-3/30",
  }

  const textColorClasses = {
    primary: "text-primary",
    secondary: "text-secondary",
    accent: "text-accent",
    "chart-1": "text-chart-1",
    "chart-2": "text-chart-2",
    "chart-3": "text-chart-3",
  }

  return (
    <Card className={`p-6 border-2 transition-all hover:scale-105 ${colorClasses[color as keyof typeof colorClasses]}`}>
      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <div className="flex items-baseline gap-2">
          <span
            className={`text-4xl font-bold tabular-nums ${textColorClasses[color as keyof typeof textColorClasses]}`}
          >
            {value.toLocaleString()}
          </span>
          <span className="text-lg text-muted-foreground">{unit}</span>
        </div>
      </div>
    </Card>
  )
}
