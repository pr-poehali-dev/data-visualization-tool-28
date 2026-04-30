import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import Icon from "@/components/ui/icon"

const MOCK_SUBS = [
  { id: 1, email: "elenalazareva88@yandex.ru", name: "Elena Lazareva", subscription: "premium", expires_at: null, status: "active" },
  { id: 2, email: "ivan@mail.ru", name: "Иван Петров", subscription: "pro", expires_at: "2025-05-30", status: "active" },
  { id: 3, email: "anna@gmail.com", name: "Анна Кузнецова", subscription: "basic", expires_at: "2025-05-15", status: "active" },
  { id: 4, email: "dmitry@yandex.ru", name: "Дмитрий Сидоров", subscription: "pro", expires_at: "2025-05-01", status: "active" },
  { id: 5, email: "olga@mail.ru", name: "Ольга Нова", subscription: "free", expires_at: null, status: "blocked" },
]

const subColor = (s: string) => s === "premium" ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" : s === "pro" ? "bg-purple-500/20 text-purple-400 border-purple-500/30" : s === "basic" ? "bg-blue-500/20 text-blue-400 border-blue-500/30" : "bg-muted text-muted-foreground border-border"
const subLabel = (s: string) => ({ premium: "Премиум", pro: "Профи", basic: "Базовый", free: "Бесплатный" }[s] || s)

export default function SubscriptionsPage() {
  const [subs, setSubs] = useState(MOCK_SUBS)
  const [selected, setSelected] = useState<typeof MOCK_SUBS[0] | null>(null)
  const [newPlan, setNewPlan] = useState("pro")
  const [msg, setMsg] = useState("")

  const applyPlan = () => {
    if (!selected) return
    setSubs(prev => prev.map(s => s.id === selected.id ? { ...s, subscription: newPlan } : s))
    setMsg(`Тариф «${subLabel(newPlan)}» назначен`)
    setSelected(null)
    setTimeout(() => setMsg(""), 2000)
  }

  const counts = {
    premium: subs.filter(s => s.subscription === "premium").length,
    pro: subs.filter(s => s.subscription === "pro").length,
    basic: subs.filter(s => s.subscription === "basic").length,
    free: subs.filter(s => s.subscription === "free").length,
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-white font-orbitron">Подписки</h2>
        <p className="text-muted-foreground text-sm mt-1">Управление тарифами и доступом пользователей</p>
      </div>

      {msg && <div className="bg-green-500/20 border border-green-500/30 text-green-400 px-4 py-2 rounded-lg text-sm">{msg}</div>}

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Премиум", count: counts.premium, color: "text-yellow-400" },
          { label: "Профи", count: counts.pro, color: "text-purple-400" },
          { label: "Базовый", count: counts.basic, color: "text-blue-400" },
          { label: "Бесплатный", count: counts.free, color: "text-muted-foreground" },
        ].map((s) => (
          <Card key={s.label} className="bg-card border-border">
            <CardContent className="pt-4 pb-4 text-center">
              <p className={`text-2xl font-bold ${s.color}`}>{s.count}</p>
              <p className="text-muted-foreground text-xs mt-1">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-card border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-background/50">
                <th className="text-left px-4 py-3 text-muted-foreground text-xs font-medium">Пользователь</th>
                <th className="text-left px-4 py-3 text-muted-foreground text-xs font-medium">Тариф</th>
                <th className="text-left px-4 py-3 text-muted-foreground text-xs font-medium">Истекает</th>
                <th className="text-left px-4 py-3 text-muted-foreground text-xs font-medium">Статус</th>
                <th className="text-left px-4 py-3 text-muted-foreground text-xs font-medium">Действия</th>
              </tr>
            </thead>
            <tbody>
              {subs.map((s) => (
                <tr key={s.id} className="border-b border-border/50 hover:bg-background/20">
                  <td className="px-4 py-3">
                    <p className="text-white text-sm">{s.name}</p>
                    <p className="text-muted-foreground text-xs">{s.email}</p>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className={`text-xs ${subColor(s.subscription)}`}>{subLabel(s.subscription)}</Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">{s.expires_at || "Бессрочно"}</td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className={`text-xs ${s.status === "active" ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-red-500/20 text-red-400 border-red-500/30"}`}>
                      {s.status === "active" ? "Активен" : "Заблокирован"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Button size="sm" variant="ghost" className="h-7 px-2 text-muted-foreground hover:text-white" onClick={() => { setSelected(s); setNewPlan(s.subscription) }}>
                      <Icon name="Edit" size={13} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="bg-card border-border text-white max-w-sm">
          <DialogHeader>
            <DialogTitle>Изменить тариф</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4">
              <p className="text-muted-foreground text-sm">{selected.email}</p>
              <div>
                <Label className="text-muted-foreground text-sm mb-2 block">Новый тариф</Label>
                <Select value={newPlan} onValueChange={setNewPlan}>
                  <SelectTrigger className="bg-background border-border text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free">Бесплатный</SelectItem>
                    <SelectItem value="basic">Базовый (490 ₽/мес)</SelectItem>
                    <SelectItem value="pro">Профи (990 ₽/мес)</SelectItem>
                    <SelectItem value="premium">Премиум (2490 ₽/мес)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button className="flex-1 bg-primary hover:bg-primary/90 text-white" onClick={applyPlan}>Применить</Button>
                <Button variant="outline" className="border-border text-white bg-transparent" onClick={() => setSelected(null)}>Отмена</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
