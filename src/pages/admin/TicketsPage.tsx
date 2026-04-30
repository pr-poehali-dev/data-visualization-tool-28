import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Icon from "@/components/ui/icon"

const MOCK_TICKETS = [
  { id: 1, subject: "Не загружается видео при генерации", status: "new", priority: "high", user_email: "ivan@mail.ru", created_at: "2025-04-30 11:00", body: "Пробую создать видео, нажимаю Сгенерировать — ничего не происходит. Подписка Pro." },
  { id: 2, subject: "Как отменить подписку?", status: "in_progress", priority: "normal", user_email: "anna@gmail.com", created_at: "2025-04-29 18:00", body: "Хочу отменить автопродление. Где это сделать?" },
  { id: 3, subject: "Ошибка при скачивании WAV", status: "new", priority: "normal", user_email: "sergey@mail.ru", created_at: "2025-04-29 15:30", body: "Скачиваю трек в WAV — файл пустой." },
  { id: 4, subject: "Не пришло письмо с подтверждением", status: "closed", priority: "low", user_email: "olga@yandex.ru", created_at: "2025-04-28 09:00", body: "Зарегистрировалась, письмо не получила." },
  { id: 5, subject: "Предложение: добавить FLAC", status: "new", priority: "low", user_email: "dm@gmail.com", created_at: "2025-04-27 14:00", body: "Было бы здорово добавить формат FLAC для скачивания музыки." },
]

const statusColor = (s: string) => s === "new" ? "bg-red-500/20 text-red-400 border-red-500/30" : s === "in_progress" ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" : "bg-green-500/20 text-green-400 border-green-500/30"
const statusLabel = (s: string) => ({ new: "Новый", in_progress: "В работе", closed: "Закрыт" }[s] || s)
const prioColor = (p: string) => p === "high" ? "bg-red-500/20 text-red-400" : p === "normal" ? "bg-blue-500/20 text-blue-400" : "bg-muted text-muted-foreground"
const prioLabel = (p: string) => ({ high: "Высокий", normal: "Обычный", low: "Низкий" }[p] || p)

export default function TicketsPage() {
  const [tickets, setTickets] = useState(MOCK_TICKETS)
  const [statusFilter, setStatusFilter] = useState("all")
  const [search, setSearch] = useState("")
  const [selected, setSelected] = useState<typeof MOCK_TICKETS[0] | null>(null)
  const [reply, setReply] = useState("")

  const filtered = tickets.filter(t =>
    (statusFilter === "all" || t.status === statusFilter) &&
    (t.subject.toLowerCase().includes(search.toLowerCase()) || t.user_email.toLowerCase().includes(search.toLowerCase()))
  )

  const doClose = (id: number) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, status: "closed" } : t))
    setSelected(null)
  }

  const doReply = () => {
    if (!reply.trim() || !selected) return
    setTickets(prev => prev.map(t => t.id === selected.id ? { ...t, status: "in_progress" } : t))
    setReply("")
    setSelected(null)
  }

  const counts = {
    all: tickets.length,
    new: tickets.filter(t => t.status === "new").length,
    in_progress: tickets.filter(t => t.status === "in_progress").length,
    closed: tickets.filter(t => t.status === "closed").length,
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-white font-orbitron">Техподдержка</h2>
        <p className="text-muted-foreground text-sm mt-1">Обращения пользователей</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Всего", count: counts.all, color: "text-white" },
          { label: "Новых", count: counts.new, color: "text-red-400" },
          { label: "В работе", count: counts.in_progress, color: "text-yellow-400" },
          { label: "Закрытых", count: counts.closed, color: "text-green-400" },
        ].map((s) => (
          <Card key={s.label} className="bg-card border-border">
            <CardContent className="pt-4 pb-4 text-center">
              <p className={`text-2xl font-bold ${s.color}`}>{s.count}</p>
              <p className="text-muted-foreground text-xs mt-1">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="bg-card border-border">
        <CardContent className="pt-4 pb-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Icon name="Search" size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Поиск по теме или email..." value={search} onChange={e => setSearch(e.target.value)}
                className="pl-9 bg-background border-border text-white placeholder:text-muted-foreground" />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-44 bg-background border-border text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все статусы</SelectItem>
                <SelectItem value="new">Новые</SelectItem>
                <SelectItem value="in_progress">В работе</SelectItem>
                <SelectItem value="closed">Закрытые</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tickets */}
      <div className="space-y-2">
        {filtered.map((t) => (
          <Card key={t.id} className="bg-card border-border hover:border-primary/50 transition-colors cursor-pointer" onClick={() => setSelected(t)}>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className={`text-xs ${statusColor(t.status)}`}>{statusLabel(t.status)}</Badge>
                    <Badge variant="outline" className={`text-xs ${prioColor(t.priority)}`}>{prioLabel(t.priority)}</Badge>
                  </div>
                  <h3 className="text-white font-medium text-sm">{t.subject}</h3>
                  <p className="text-muted-foreground text-xs mt-1">{t.user_email} • {t.created_at}</p>
                </div>
                <Icon name="ChevronRight" size={16} className="text-muted-foreground flex-shrink-0 mt-1" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Ticket dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="bg-card border-border text-white max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-white">{selected?.subject}</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="flex gap-2">
                <Badge variant="outline" className={`text-xs ${statusColor(selected.status)}`}>{statusLabel(selected.status)}</Badge>
                <Badge variant="outline" className={`text-xs ${prioColor(selected.priority)}`}>{prioLabel(selected.priority)}</Badge>
                <span className="text-muted-foreground text-xs">{selected.user_email}</span>
              </div>
              <div className="bg-background rounded-lg p-4 border border-border">
                <p className="text-white text-sm leading-relaxed">{selected.body}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs mb-2">Ответ пользователю</p>
                <Textarea
                  placeholder="Введите ответ..."
                  value={reply}
                  onChange={e => setReply(e.target.value)}
                  rows={4}
                  className="bg-background border-border text-white placeholder:text-muted-foreground resize-none"
                />
              </div>
              <div className="flex gap-2">
                <Button className="bg-primary hover:bg-primary/90 text-white" onClick={doReply} disabled={!reply.trim()}>
                  <Icon name="Send" size={14} className="mr-2" />Ответить
                </Button>
                {selected.status !== "closed" && (
                  <Button variant="outline" size="sm" className="border-border text-white hover:border-green-500 hover:text-green-400" onClick={() => doClose(selected.id)}>
                    <Icon name="CheckCircle" size={14} className="mr-2" />Закрыть тикет
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
