import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Icon from "@/components/ui/icon"
import { ADMIN_URL, getToken } from "@/lib/auth"

interface Order {
  order_number: string
  user_name: string
  user_email: string
  amount: number
  status: string
  created_at: string
}

export default function FinancePage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [revDay, setRevDay] = useState(0)
  const [revWeek, setRevWeek] = useState(0)
  const [revMonth, setRevMonth] = useState(0)
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    const token = getToken()
    fetch(`${ADMIN_URL}/finance`, {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(d => {
        setOrders(d.orders || [])
        setRevDay(d.revenue_day || 0)
        setRevWeek(d.revenue_week || 0)
        setRevMonth(d.revenue_month || 0)
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const summary = [
    { label: "За сегодня", value: revDay, icon: "Calendar", color: "text-blue-400" },
    { label: "За неделю", value: revWeek, icon: "TrendingUp", color: "text-green-400" },
    { label: "За месяц", value: revMonth, icon: "DollarSign", color: "text-yellow-400" },
  ]

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white font-orbitron mb-1">Финансы</h2>
          <p className="text-muted-foreground text-sm">Транзакции и доходы</p>
        </div>
        <Button variant="outline" size="sm" className="border-border text-white hover:border-primary" onClick={load}>
          <Icon name="RefreshCw" size={14} className="mr-2" />Обновить
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {summary.map(s => (
          <Card key={s.label} className="bg-card border-border">
            <CardContent className="pt-5 pb-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-xs mb-1">{s.label}</p>
                  <p className="text-white text-2xl font-bold">{s.value.toLocaleString()} ₽</p>
                </div>
                <div className={`w-10 h-10 rounded-lg bg-background flex items-center justify-center ${s.color}`}>
                  <Icon name={s.icon as "Calendar"} size={20} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-base">История транзакций</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-4 py-3 text-muted-foreground text-xs">Заказ</th>
                  <th className="text-left px-4 py-3 text-muted-foreground text-xs">Пользователь</th>
                  <th className="text-left px-4 py-3 text-muted-foreground text-xs">Сумма</th>
                  <th className="text-left px-4 py-3 text-muted-foreground text-xs">Статус</th>
                  <th className="text-left px-4 py-3 text-muted-foreground text-xs">Дата</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={5} className="text-center py-12">
                    <Icon name="Loader2" size={20} className="animate-spin mx-auto text-muted-foreground" />
                  </td></tr>
                ) : orders.length === 0 ? (
                  <tr><td colSpan={5} className="text-center text-muted-foreground py-12">Транзакций нет</td></tr>
                ) : orders.map((o, i) => (
                  <tr key={i} className="border-b border-border/40 hover:bg-background/40">
                    <td className="px-4 py-3 text-muted-foreground text-xs font-mono">{o.order_number}</td>
                    <td className="px-4 py-3">
                      <p className="text-white text-sm">{o.user_name}</p>
                      <p className="text-muted-foreground text-xs">{o.user_email}</p>
                    </td>
                    <td className="px-4 py-3 text-white font-semibold">{o.amount.toLocaleString()} ₽</td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className={`text-xs ${o.status === "paid" ? "text-green-400 bg-green-500/10 border-green-500/20" : "border-border text-muted-foreground"}`}>
                        {o.status === "paid" ? "Оплачен" : o.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{new Date(o.created_at).toLocaleDateString("ru")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
