import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import Icon from "@/components/ui/icon"
import { ADMIN_URL, getToken } from "@/lib/auth"

interface Sub {
  id: number
  email: string
  name: string
  subscription: string
  expires_at: string | null
  status: string
}

const SUB_COLOR: Record<string, string> = {
  premium: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
  pro: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  basic: "text-muted-foreground border-border",
  free: "text-muted-foreground border-border",
}

export default function SubscriptionsPage() {
  const [subs, setSubs] = useState<Sub[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Sub | null>(null)
  const [newSub, setNewSub] = useState("pro")
  const [newDays, setNewDays] = useState("30")
  const [saving, setSaving] = useState(false)

  const load = () => {
    setLoading(true)
    const token = getToken()
    fetch(`${ADMIN_URL}/subscriptions`, {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(d => setSubs(d.subscriptions || []))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const save = async () => {
    setSaving(true)
    const token = getToken()
    await fetch(`${ADMIN_URL}/subscription-action`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: selected?.id, subscription: newSub, days: parseInt(newDays) })
    })
    setSaving(false)
    setSelected(null)
    load()
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-white font-orbitron mb-1">Подписки</h2>
        <p className="text-muted-foreground text-sm">Управление тарифами пользователей</p>
      </div>

      <Card className="bg-card border-border">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-4 py-3 text-muted-foreground text-xs">Пользователь</th>
                  <th className="text-left px-4 py-3 text-muted-foreground text-xs">Подписка</th>
                  <th className="text-left px-4 py-3 text-muted-foreground text-xs">Истекает</th>
                  <th className="text-left px-4 py-3 text-muted-foreground text-xs">Статус</th>
                  <th className="text-left px-4 py-3 text-muted-foreground text-xs"></th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={5} className="text-center py-12">
                    <Icon name="Loader2" size={20} className="animate-spin mx-auto text-muted-foreground" />
                  </td></tr>
                ) : subs.map(s => (
                  <tr key={s.id} className="border-b border-border/40 hover:bg-background/40">
                    <td className="px-4 py-3">
                      <p className="text-white text-sm">{s.name || "—"}</p>
                      <p className="text-muted-foreground text-xs">{s.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className={`text-xs ${SUB_COLOR[s.subscription] || "border-border text-muted-foreground"}`}>
                        {s.subscription || "free"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">
                      {s.expires_at ? new Date(s.expires_at).toLocaleDateString("ru") : "Не ограничено"}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className={`text-xs ${s.status === "active" ? "text-green-400 bg-green-500/10 border-green-500/20" : "border-border text-muted-foreground"}`}>
                        {s.status === "active" ? "Активен" : "Заблокирован"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Button size="sm" variant="ghost" className="text-muted-foreground hover:text-white" onClick={() => { setSelected(s); setNewSub(s.subscription || "free") }}>
                        <Icon name="Edit2" size={14} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="bg-card border-border text-white max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-white">Изменить подписку</DialogTitle>
            <DialogDescription className="text-muted-foreground text-sm">{selected?.email}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <Label className="text-muted-foreground text-sm mb-1.5 block">Тариф</Label>
              <Select value={newSub} onValueChange={setNewSub}>
                <SelectTrigger className="bg-background border-border text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="free">Бесплатный</SelectItem>
                  <SelectItem value="basic">Базовый</SelectItem>
                  <SelectItem value="pro">Профессиональный</SelectItem>
                  <SelectItem value="premium">Премиум</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-muted-foreground text-sm mb-1.5 block">Дней</Label>
              <Select value={newDays} onValueChange={setNewDays}>
                <SelectTrigger className="bg-background border-border text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 дней</SelectItem>
                  <SelectItem value="30">30 дней</SelectItem>
                  <SelectItem value="90">90 дней</SelectItem>
                  <SelectItem value="365">365 дней</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full bg-primary hover:bg-primary/90 text-white" onClick={save} disabled={saving}>
              {saving ? <Icon name="Loader2" size={14} className="mr-2 animate-spin" /> : null}
              Сохранить
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
