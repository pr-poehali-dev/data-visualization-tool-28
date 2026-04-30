import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Icon from "@/components/ui/icon"

const MOCK_ORDERS = [
  { id: 1, order_number: "ORD-2025-001", user_name: "Иван Петров", user_email: "ivan@mail.ru", amount: 990, status: "paid", created_at: "2025-04-30 11:00", plan: "pro" },
  { id: 2, order_number: "ORD-2025-002", user_name: "Анна Кузнецова", user_email: "anna@gmail.com", amount: 490, status: "paid", created_at: "2025-04-29 18:00", plan: "basic" },
  { id: 3, order_number: "ORD-2025-003", user_name: "Дмитрий Сидоров", user_email: "dmitry@yandex.ru", amount: 2490, status: "paid", created_at: "2025-04-29 09:00", plan: "premium" },
  { id: 4, order_number: "ORD-2025-004", user_name: "Сергей Ли", user_email: "sergey@mail.ru", amount: 990, status: "pending", created_at: "2025-04-28 14:00", plan: "pro" },
  { id: 5, order_number: "ORD-2025-005", user_name: "Мария Воронова", user_email: "maria@gmail.com", amount: 49, status: "paid", created_at: "2025-04-27 20:00", plan: "single" },
]

const statusColor = (s: string) => s === "paid" ? "bg-green-500/20 text-green-400 border-green-500/30" : s === "pending" ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" : "bg-muted text-muted-foreground border-border"
const statusLabel = (s: string) => ({ paid: "Оплачен", pending: "Ожидание", failed: "Ошибка" }[s] || s)

export default function FinancePage() {
  const [period, setPeriod] = useState("month")

  const totalRevenue = MOCK_ORDERS.filter(o => o.status === "paid").reduce((s, o) => s + o.amount, 0)
  const monthRevenue = totalRevenue
  const avgOrder = Math.round(totalRevenue / MOCK_ORDERS.filter(o => o.status === "paid").length)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white font-orbitron">Финансы</h2>
          <p className="text-muted-foreground text-sm mt-1">История транзакций и аналитика доходов</p>
        </div>
        <div className="flex gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-36 bg-card border-border text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Сегодня</SelectItem>
              <SelectItem value="week">Неделя</SelectItem>
              <SelectItem value="month">Месяц</SelectItem>
              <SelectItem value="all">Всё время</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="border-border text-white hover:border-primary">
            <Icon name="Download" size={14} className="mr-2" />CSV
          </Button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Выручка за период", value: `${monthRevenue.toLocaleString()} ₽`, icon: "TrendingUp", color: "text-green-400", sub: `${MOCK_ORDERS.filter(o => o.status === "paid").length} платежей` },
          { label: "Средний чек", value: `${avgOrder.toLocaleString()} ₽`, icon: "BarChart2", color: "text-blue-400", sub: "за одну оплату" },
          { label: "Конверсия в оплату", value: "73%", icon: "Percent", color: "text-purple-400", sub: "от регистраций" },
        ].map((m) => (
          <Card key={m.label} className="bg-card border-border">
            <CardContent className="pt-5 pb-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-muted-foreground text-xs mb-1">{m.label}</p>
                  <p className="text-white text-2xl font-bold">{m.value}</p>
                  <p className="text-muted-foreground text-xs mt-1">{m.sub}</p>
                </div>
                <div className={`w-10 h-10 rounded-lg bg-background flex items-center justify-center ${m.color}`}>
                  <Icon name={m.icon as "TrendingUp"} size={20} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* By plan */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-base">Распределение по тарифам</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { plan: "premium", label: "Премиум", amount: 2490, count: 1 },
              { plan: "pro", label: "Профессиональный", amount: 1980, count: 2 },
              { plan: "basic", label: "Базовый", amount: 490, count: 1 },
              { plan: "single", label: "Разовая", amount: 49, count: 1 },
            ].map((p) => (
              <div key={p.plan} className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-white">{p.label}</span>
                    <span className="text-muted-foreground">{p.amount.toLocaleString()} ₽ ({p.count} шт)</span>
                  </div>
                  <div className="h-2 bg-background rounded-full">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${(p.amount / totalRevenue) * 100}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Transactions table */}
      <Card className="bg-card border-border overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-base">История транзакций</CardTitle>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-background/50">
                <th className="text-left px-4 py-3 text-muted-foreground text-xs font-medium">Заказ</th>
                <th className="text-left px-4 py-3 text-muted-foreground text-xs font-medium">Клиент</th>
                <th className="text-left px-4 py-3 text-muted-foreground text-xs font-medium">Тариф</th>
                <th className="text-left px-4 py-3 text-muted-foreground text-xs font-medium">Сумма</th>
                <th className="text-left px-4 py-3 text-muted-foreground text-xs font-medium">Статус</th>
                <th className="text-left px-4 py-3 text-muted-foreground text-xs font-medium">Дата</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_ORDERS.map((o) => (
                <tr key={o.id} className="border-b border-border/50 hover:bg-background/20">
                  <td className="px-4 py-3 text-muted-foreground text-xs font-mono">{o.order_number}</td>
                  <td className="px-4 py-3">
                    <p className="text-white text-sm">{o.user_name}</p>
                    <p className="text-muted-foreground text-xs">{o.user_email}</p>
                  </td>
                  <td className="px-4 py-3"><Badge variant="outline" className="border-border text-muted-foreground text-xs">{o.plan}</Badge></td>
                  <td className="px-4 py-3 text-white font-medium">{o.amount.toLocaleString()} ₽</td>
                  <td className="px-4 py-3"><Badge variant="outline" className={`text-xs ${statusColor(o.status)}`}>{statusLabel(o.status)}</Badge></td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">{o.created_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
