import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Icon from "@/components/ui/icon"

const METRICS = [
  { label: "DAU", value: "23", sub: "Среднедневные активные", icon: "Users", trend: "+12%" },
  { label: "MAU", value: "512", sub: "Активные за месяц", icon: "Calendar", trend: "+8%" },
  { label: "ARPU", value: "189 ₽", sub: "Средний доход на юзера", icon: "DollarSign", trend: "+5%" },
  { label: "LTV", value: "2 340 ₽", sub: "Пожизненная ценность", icon: "TrendingUp", trend: "+3%" },
  { label: "Churn Rate", value: "4.2%", sub: "Отток в месяц", icon: "UserMinus", trend: "-0.8%" },
  { label: "Конверсия", value: "73%", sub: "Регистрация → Оплата", icon: "Percent", trend: "+2%" },
]

const TOP_TOOLS = [
  { tool: "Создание музыки", count: 4821, percent: 100 },
  { tool: "Написание текстов", count: 3654, percent: 76 },
  { tool: "Работа с фото", count: 2987, percent: 62 },
  { tool: "Создание видео", count: 1843, percent: 38 },
  { tool: "Джинглы", count: 921, percent: 19 },
]

const TOP_PROMPTS = [
  "Энергичная поп-музыка для рекламы",
  "Продающий пост для Instagram",
  "Звуковой логотип 5 секунд",
  "Колоризация чёрно-белого фото",
  "Статья о здоровом питании",
]

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white font-orbitron">Аналитика</h2>
          <p className="text-muted-foreground text-sm mt-1">Ключевые метрики и отчёты платформы</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="border-border text-white hover:border-primary bg-transparent">
            <Icon name="Download" size={14} className="mr-2" />Экспорт CSV
          </Button>
          <Button variant="outline" size="sm" className="border-border text-white hover:border-primary bg-transparent">
            <Icon name="FileSpreadsheet" size={14} className="mr-2" />Excel
          </Button>
        </div>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {METRICS.map((m) => (
          <Card key={m.label} className="bg-card border-border">
            <CardContent className="pt-5 pb-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-muted-foreground text-xs mb-1">{m.label}</p>
                  <p className="text-white text-2xl font-bold">{m.value}</p>
                  <p className="text-muted-foreground text-xs mt-1">{m.sub}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Icon name={m.icon as "Users"} size={18} className="text-primary" />
                  <Badge variant="outline" className={`text-xs border-0 ${m.trend.startsWith("+") ? "text-green-400" : "text-red-400"}`}>
                    {m.trend}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top tools */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-base flex items-center gap-2">
              <Icon name="BarChart2" size={16} className="text-primary" />
              Популярные инструменты
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {TOP_TOOLS.map((t) => (
                <div key={t.tool}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-white">{t.tool}</span>
                    <span className="text-muted-foreground">{t.count.toLocaleString()}</span>
                  </div>
                  <div className="h-2 bg-background rounded-full">
                    <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${t.percent}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top prompts */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-base flex items-center gap-2">
              <Icon name="Lightbulb" size={16} className="text-primary" />
              Популярные промпты
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {TOP_PROMPTS.map((p, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-background border border-border">
                  <span className="text-primary font-bold text-sm w-5 text-center">{i + 1}</span>
                  <p className="text-white text-sm flex-1">{p}</p>
                  <Icon name="TrendingUp" size={14} className="text-muted-foreground" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Custom reports */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-base flex items-center gap-2">
            <Icon name="Filter" size={16} className="text-primary" />
            Кастомные отчёты
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { label: "Пользователи по регионам", icon: "MapPin" },
              { label: "Конверсионная воронка", icon: "Filter" },
              { label: "Активность по часам", icon: "Clock" },
              { label: "Доход по тарифам", icon: "PieChart" },
              { label: "Удержание (Retention)", icon: "RefreshCcw" },
              { label: "Ошибки генерации", icon: "AlertTriangle" },
            ].map((r) => (
              <Button key={r.label} variant="outline" size="sm" className="justify-start border-border text-muted-foreground hover:border-primary hover:text-white bg-transparent h-auto py-3">
                <Icon name={r.icon as "MapPin"} size={14} className="mr-2 flex-shrink-0" />
                <span className="text-left text-xs">{r.label}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
