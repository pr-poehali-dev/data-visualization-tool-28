import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Icon from "@/components/ui/icon"
import { ADMIN_URL, getToken } from "@/lib/auth"

export default function AnalyticsPage() {
  const [stats, setStats] = useState<Record<string, number>>({})

  useEffect(() => {
    const token = getToken()
    fetch(`${ADMIN_URL}/stats`, { headers: { "Authorization": `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => setStats(d))
      .catch(() => {})
  }, [])

  const kpis = [
    { label: "DAU (сегодня)", value: stats.new_today ?? "—", icon: "Users", desc: "Новых за день" },
    { label: "WAU (неделя)", value: stats.new_week ?? "—", icon: "TrendingUp", desc: "Новых за неделю" },
    { label: "MAU (месяц)", value: stats.new_month ?? "—", icon: "BarChart3", desc: "Новых за месяц" },
    { label: "ARPU", value: stats.revenue_month && stats.new_month ? `${Math.round(stats.revenue_month / (stats.new_month || 1))} ₽` : "—", icon: "DollarSign", desc: "Средний доход на пользователя" },
    { label: "Онлайн", value: stats.online_now ?? "—", icon: "Wifi", desc: "Сейчас на сайте" },
    { label: "Конверсия", value: stats.total_users && stats.paid_orders ? `${((stats.paid_orders / stats.total_users) * 100).toFixed(1)}%` : "—", icon: "Percent", desc: "Платящих от всех" },
  ]

  const exportCSV = () => {
    const rows = [
      ["Метрика", "Значение"],
      ...kpis.map(k => [k.label, String(k.value)])
    ]
    const csv = rows.map(r => r.join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url; a.download = "analytics.csv"; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white font-orbitron mb-1">Аналитика</h2>
          <p className="text-muted-foreground text-sm">Ключевые метрики платформы</p>
        </div>
        <Button variant="outline" size="sm" className="border-border text-white hover:border-primary" onClick={exportCSV}>
          <Icon name="Download" size={14} className="mr-2" />Экспорт CSV
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {kpis.map(k => (
          <Card key={k.label} className="bg-card border-border">
            <CardContent className="pt-5 pb-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-muted-foreground text-xs mb-1">{k.label}</p>
                  <p className="text-white text-3xl font-bold">{k.value}</p>
                  <p className="text-muted-foreground text-xs mt-1">{k.desc}</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center text-primary">
                  <Icon name={k.icon as "Users"} size={20} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-base flex items-center gap-2">
              <Icon name="PieChart" size={16} className="text-primary" />
              Распределение по тарифам
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { label: "Бесплатный", pct: 72, color: "bg-muted-foreground" },
                { label: "Базовый", pct: 14, color: "bg-blue-500" },
                { label: "Профессиональный", pct: 10, color: "bg-primary" },
                { label: "Премиум", pct: 4, color: "bg-yellow-500" },
              ].map(t => (
                <div key={t.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">{t.label}</span>
                    <span className="text-white">{t.pct}%</span>
                  </div>
                  <div className="h-2 bg-background rounded-full overflow-hidden">
                    <div className={`h-full ${t.color} rounded-full`} style={{ width: `${t.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-base flex items-center gap-2">
              <Icon name="BarChart2" size={16} className="text-primary" />
              Популярные инструменты
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { label: "Создание текстов", pct: 38 },
                { label: "Работа с фото", pct: 27 },
                { label: "Создание музыки", pct: 19 },
                { label: "Создание видео", pct: 11 },
                { label: "Джинглы", pct: 5 },
              ].map(t => (
                <div key={t.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">{t.label}</span>
                    <span className="text-white">{t.pct}%</span>
                  </div>
                  <div className="h-2 bg-background rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${t.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
