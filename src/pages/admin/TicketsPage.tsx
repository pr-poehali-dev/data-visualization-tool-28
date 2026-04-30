import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Icon from "@/components/ui/icon"
import { ADMIN_URL, getToken } from "@/lib/auth"

interface Ticket {
  id: number
  subject: string
  status: string
  priority: string
  created_at: string
  user_email: string | null
}

const STATUS_COLOR: Record<string, string> = {
  new: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  in_progress: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
  closed: "text-muted-foreground bg-muted border-border",
}
const STATUS_LABEL: Record<string, string> = { new: "Новый", in_progress: "В работе", closed: "Закрыт" }
const PRIORITY_COLOR: Record<string, string> = { high: "text-red-400", normal: "text-muted-foreground", low: "text-green-400" }

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState("")
  const [selected, setSelected] = useState<Ticket | null>(null)
  const [reply, setReply] = useState("")
  const [replying, setReplying] = useState(false)

  const load = () => {
    setLoading(true)
    const token = getToken()
    const params = statusFilter ? `?status=${statusFilter}` : ""
    fetch(`${ADMIN_URL}/tickets${params}`, {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(d => setTickets(d.tickets || []))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [statusFilter])

  const doAction = async (action: string, extra: Record<string, unknown> = {}) => {
    setReplying(true)
    const token = getToken()
    await fetch(`${ADMIN_URL}/ticket-action`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ ticket_id: selected?.id, action, ...extra })
    })
    setReplying(false)
    setReply("")
    setSelected(null)
    load()
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white font-orbitron mb-1">Техподдержка</h2>
          <p className="text-muted-foreground text-sm">Тикеты пользователей</p>
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40 bg-card border-border text-white">
              <SelectValue placeholder="Все тикеты" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Все тикеты</SelectItem>
              <SelectItem value="new">Новые</SelectItem>
              <SelectItem value="in_progress">В работе</SelectItem>
              <SelectItem value="closed">Закрытые</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="bg-card border-border">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-4 py-3 text-muted-foreground text-xs">#</th>
                  <th className="text-left px-4 py-3 text-muted-foreground text-xs">Тема</th>
                  <th className="text-left px-4 py-3 text-muted-foreground text-xs">Пользователь</th>
                  <th className="text-left px-4 py-3 text-muted-foreground text-xs">Статус</th>
                  <th className="text-left px-4 py-3 text-muted-foreground text-xs">Приоритет</th>
                  <th className="text-left px-4 py-3 text-muted-foreground text-xs">Дата</th>
                  <th className="text-left px-4 py-3 text-muted-foreground text-xs"></th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={7} className="text-center py-12">
                    <Icon name="Loader2" size={20} className="animate-spin mx-auto text-muted-foreground" />
                  </td></tr>
                ) : tickets.length === 0 ? (
                  <tr><td colSpan={7} className="text-center text-muted-foreground py-12">Тикетов нет</td></tr>
                ) : tickets.map((t) => (
                  <tr key={t.id} className="border-b border-border/40 hover:bg-background/40">
                    <td className="px-4 py-3 text-muted-foreground text-sm">#{t.id}</td>
                    <td className="px-4 py-3 text-white text-sm max-w-xs truncate">{t.subject}</td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{t.user_email || "—"}</td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className={`text-xs ${STATUS_COLOR[t.status] || "border-border text-muted-foreground"}`}>
                        {STATUS_LABEL[t.status] || t.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs ${PRIORITY_COLOR[t.priority] || "text-muted-foreground"}`}>
                        {t.priority === "high" ? "Высокий" : t.priority === "low" ? "Низкий" : "Обычный"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{new Date(t.created_at).toLocaleDateString("ru")}</td>
                    <td className="px-4 py-3">
                      <Button size="sm" variant="ghost" className="text-muted-foreground hover:text-white" onClick={() => setSelected(t)}>
                        <Icon name="MessageSquare" size={14} />
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
        <DialogContent className="bg-card border-border text-white max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-white">Тикет #{selected?.id}</DialogTitle>
            <DialogDescription className="text-muted-foreground text-sm">{selected?.subject}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="Ответ пользователю..."
              value={reply}
              onChange={e => setReply(e.target.value)}
              rows={4}
              className="bg-background border-border text-white placeholder:text-muted-foreground resize-none"
            />
            <div className="flex gap-2">
              <Button
                className="flex-1 bg-primary hover:bg-primary/90 text-white"
                disabled={!reply.trim() || replying}
                onClick={() => doAction("reply", { body: reply })}
              >
                {replying ? <Icon name="Loader2" size={14} className="mr-2 animate-spin" /> : <Icon name="Send" size={14} className="mr-2" />}
                Ответить
              </Button>
              <Button
                variant="outline"
                className="border-border text-white hover:border-primary"
                disabled={replying}
                onClick={() => doAction("close")}
              >
                <Icon name="CheckCircle" size={14} className="mr-2" />Закрыть тикет
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
