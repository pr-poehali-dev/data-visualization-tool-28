import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Icon from "@/components/ui/icon"
import { ADMIN_URL, getToken } from "@/lib/auth"

interface Stats {
  total_users: number
  new_today: number
  new_week: number
  new_month: number
  online_now: number
  paid_orders: number
  total_revenue: number
  revenue_month: number
  open_tickets: number
}

const MOCK_ACTIVITY = [
  { user: "ivan@mail.ru", action: "Сгенерировал трек", time: "1 мин назад" },
  { user: "anna@gmail.com", action: "Оформил подписку Pro", time: "3 мин назад" },
  { user: "dmitry@yandex.ru", action: "Зарегистрировался", time: "5 мин назад" },
  { user: "maria@mail.ru", action: "Создал видео", time: "7 мин назад" },
  { user: "oleg@gmail.com", action: "Написал в поддержку", time: "12 мин назад" },
]

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = getToken()
    fetch(`${ADMIN_URL}/stats`, {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(d => setStats(d))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const s = stats || { total_users: 0, new_today: 0, new_week: 0, new_month: 0, online_now: 0, paid_orders: 0, total_revenue: 0, revenue_month: 0, open_tickets: 0 }

  const metrics = [
    { label: "Всего пользователей", value: s.total_users.toLocaleString(), icon: "Users", color: "text-blue-400", sub: `+${s.new_month} за месяц` },
    { label: "Онлайн сейчас", value: s.online_now.toString(), icon: "Wifi", color: "text-green-400", sub: "активных сессий" },
    { label: "Новых сегодня", value: s.new_today.toString(), icon: "UserPlus", color: "text-primary", sub: `${s.new_week} за неделю` },
    { label: "Выручка за месяц", value: `${s.revenue_month.toLocaleString()} ₽`, icon: "TrendingUp", color: "text-yellow-400", sub: `${s.paid_orders} оплат` },
    { label: "Общая выручка", value: `${s.total_revenue.toLocaleString()} ₽`, icon: "DollarSign", color: "text-purple-400", sub: "за всё время" },
    { label: "Открытых тикетов", value: s.open_tickets.toString(), icon: "LifeBuoy", color: "text-orange-400", sub: "требуют ответа" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white font-orbitron mb-1">Дашборд</h2>
        <p className="text-muted-foreground text-sm">Общая статистика платформы в реальном времени</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((m) => (
          <Card key={m.label} className="bg-card border-border">
            <CardContent className="pt-5 pb-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-muted-foreground text-xs mb-1">{m.label}</p>
                  <p className={`text-white text-2xl font-bold ${loading ? "opacity-40" : ""}`}>{m.value}</p>
                  <p className="text-muted-foreground text-xs mt-1">{m.sub}</p>
                </div>
                <div className={`w-10 h-10 rounded-lg bg-background flex items-center justify-center ${m.color}`}>
                  <Icon name={m.icon as "Users"} size={20} />
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
              <Icon name="Activity" size={16} className="text-primary" />
              Последние действия
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {MOCK_ACTIVITY.map((a, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Icon name="User" size={14} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm truncate">{a.user}</p>
                    <p className="text-muted-foreground text-xs">{a.action}</p>
                  </div>
                  <span className="text-muted-foreground text-xs flex-shrink-0">{a.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-base flex items-center gap-2">
              <Icon name="BarChart3" size={16} className="text-primary" />
              Динамика регистраций
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { label: "Сегодня", value: s.new_today, max: 100 },
                { label: "За неделю", value: s.new_week, max: 500 },
                { label: "За месяц", value: s.new_month, max: 1000 },
              ].map((r) => (
                <div key={r.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">{r.label}</span>
                    <span className="text-white font-medium">{r.value}</span>
                  </div>
                  <div className="h-2 bg-background rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${Math.min(100, r.max > 0 ? (r.value / r.max) * 100 : 0)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-border grid grid-cols-3 gap-4 text-center">
              {[{ label: "DAU", value: s.new_today }, { label: "WAU", value: s.new_week }, { label: "MAU", value: s.new_month }].map((m) => (
                <div key={m.label}>
                  <p className="text-white font-bold text-lg">{m.value}</p>
                  <p className="text-muted-foreground text-xs">{m.label}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
