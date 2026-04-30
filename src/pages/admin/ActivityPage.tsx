import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import Icon from "@/components/ui/icon"

const MOCK_LOGS = [
  { id: 1, email: "ivan@mail.ru", action: "login", details: "Успешный вход", ip: "77.25.10.1", created_at: "2025-04-30 12:00" },
  { id: 2, email: "anna@gmail.com", action: "generate_music", details: "Стиль: Поп, 3:24", ip: "85.10.20.5", created_at: "2025-04-30 11:55" },
  { id: 3, email: "elenalazareva88@yandex.ru", action: "admin_block", details: "user_id=5", ip: "192.168.1.1", created_at: "2025-04-30 11:45" },
  { id: 4, email: "dmitry@yandex.ru", action: "payment_success", details: "ORD-2025-003, 2490 ₽", ip: "45.12.3.100", created_at: "2025-04-30 11:30" },
  { id: 5, email: "maria@gmail.com", action: "generate_video", details: "Формат: вертикальный, 15 сек", ip: "78.90.1.200", created_at: "2025-04-30 11:20" },
  { id: 6, email: "ivan@mail.ru", action: "download", details: "track.mp3, 4.2 МБ", ip: "77.25.10.1", created_at: "2025-04-30 11:10" },
  { id: 7, email: "olga@mail.ru", action: "register", details: "Новая регистрация", ip: "91.100.5.6", created_at: "2025-04-30 10:50" },
  { id: 8, email: "sergey@yandex.ru", action: "ticket_created", details: "Тема: ошибка WAV", ip: "62.5.8.9", created_at: "2025-04-30 10:30" },
]

const ACTION_ICONS: Record<string, string> = {
  login: "LogIn", register: "UserPlus", logout: "LogOut",
  generate_music: "Music", generate_video: "Video", generate_photo: "Image",
  payment_success: "CreditCard", download: "Download",
  admin_block: "UserX", admin_unblock: "UserCheck", ticket_created: "LifeBuoy",
}

const ACTION_COLORS: Record<string, string> = {
  login: "text-green-400", register: "text-blue-400",
  generate_music: "text-purple-400", generate_video: "text-orange-400",
  payment_success: "text-yellow-400", admin_block: "text-red-400",
  download: "text-muted-foreground", ticket_created: "text-orange-400",
}

const actionLabel = (action: string) => ({
  login: "Вход", register: "Регистрация", logout: "Выход",
  generate_music: "Генерация музыки", generate_video: "Генерация видео",
  payment_success: "Оплата", download: "Скачивание", admin_block: "Блокировка",
  admin_unblock: "Разблокировка", ticket_created: "Тикет создан",
}[action] || action)

export default function ActivityPage() {
  const [search, setSearch] = useState("")

  const filtered = MOCK_LOGS.filter(l =>
    l.email.toLowerCase().includes(search.toLowerCase()) ||
    actionLabel(l.action).toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-white font-orbitron">Журнал активности</h2>
        <p className="text-muted-foreground text-sm mt-1">Все действия пользователей и администраторов</p>
      </div>

      {/* Realtime indicators */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Онлайн", value: "38", icon: "Wifi", color: "text-green-400" },
          { label: "Генераций/час", value: "124", icon: "Zap", color: "text-yellow-400" },
          { label: "Новых сообщений", value: "47", icon: "MessageSquare", color: "text-blue-400" },
          { label: "Ошибок/час", value: "3", icon: "AlertTriangle", color: "text-red-400" },
        ].map((m) => (
          <Card key={m.label} className="bg-card border-border">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <Icon name={m.icon as "Wifi"} size={18} className={m.color} />
                <div>
                  <p className="text-white font-bold">{m.value}</p>
                  <p className="text-muted-foreground text-xs">{m.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-white text-base">Лог действий</CardTitle>
            <div className="relative">
              <Icon name="Search" size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Поиск..." value={search} onChange={e => setSearch(e.target.value)}
                className="pl-8 h-8 w-56 bg-background border-border text-white placeholder:text-muted-foreground text-sm" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {filtered.map((log) => {
              const icon = ACTION_ICONS[log.action] || "Activity"
              const color = ACTION_COLORS[log.action] || "text-muted-foreground"
              return (
                <div key={log.id} className="flex items-center gap-3 p-3 rounded-lg bg-background border border-border hover:border-border/80">
                  <div className={`w-8 h-8 rounded-lg bg-card flex items-center justify-center flex-shrink-0 ${color}`}>
                    <Icon name={icon as "LogIn"} size={15} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-white text-sm font-medium truncate">{log.email}</p>
                      <Badge variant="outline" className="border-border text-muted-foreground text-xs flex-shrink-0">{actionLabel(log.action)}</Badge>
                    </div>
                    <p className="text-muted-foreground text-xs truncate">{log.details} • IP: {log.ip}</p>
                  </div>
                  <span className="text-muted-foreground text-xs flex-shrink-0">{log.created_at.split(" ")[1]}</span>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
