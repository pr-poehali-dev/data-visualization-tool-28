import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Icon from "@/components/ui/icon"

const MOCK_CHATS = [
  { id: 1, user: "ivan@mail.ru", messages: 24, last: "Как скачать в WAV?", time: "12:00", flagged: false },
  { id: 2, user: "anna@gmail.com", messages: 8, last: "Спасибо за помощь!", time: "11:30", flagged: false },
  { id: 3, user: "olga@mail.ru", messages: 31, last: "Это невозможно использовать", time: "10:00", flagged: true },
  { id: 4, user: "dm@gmail.com", messages: 5, last: "Добавьте FLAC", time: "09:30", flagged: false },
]

const MOCK_MSGS = [
  { from: "user", text: "Привет! Как скачать трек в формате WAV?", time: "12:00" },
  { from: "ai", text: "Здравствуйте! После генерации трека нажмите кнопку «Скачать» и выберите формат WAV.", time: "12:00" },
  { from: "user", text: "А можно скачать несколько треков сразу?", time: "12:05" },
  { from: "ai", text: "Пока скачивание доступно только по одному файлу. Эта функция в разработке!", time: "12:05" },
]

export default function AdminChatPage() {
  const [search, setSearch] = useState("")
  const [selectedChat, setSelectedChat] = useState(MOCK_CHATS[0])
  const [filter, setFilter] = useState("all")

  const filtered = MOCK_CHATS.filter(c =>
    (filter === "all" || (filter === "flagged" && c.flagged)) &&
    c.user.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-white font-orbitron">Чаты пользователей</h2>
        <p className="text-muted-foreground text-sm mt-1">Просмотр и модерация всех диалогов</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Sidebar */}
        <div className="space-y-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Icon name="Search" size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Поиск..." value={search} onChange={e => setSearch(e.target.value)}
                className="pl-8 bg-card border-border text-white placeholder:text-muted-foreground text-sm" />
            </div>
          </div>
          <div className="flex gap-2">
            {[["all", "Все"], ["flagged", "⚑ Жалобы"]].map(([v, l]) => (
              <button key={v} className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${filter === v ? "bg-primary text-white" : "bg-card border border-border text-muted-foreground hover:text-white"}`}
                onClick={() => setFilter(v)}>{l}</button>
            ))}
          </div>
          <div className="space-y-1">
            {filtered.map(c => (
              <div
                key={c.id}
                className={`p-3 rounded-lg cursor-pointer transition-colors border ${selectedChat.id === c.id ? "border-primary bg-primary/10" : "border-border bg-card hover:border-border/80"}`}
                onClick={() => setSelectedChat(c)}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-white text-sm font-medium truncate flex-1">{c.user}</span>
                  {c.flagged && <Icon name="Flag" size={13} className="text-red-400 flex-shrink-0 ml-1" />}
                  <span className="text-muted-foreground text-xs ml-2">{c.time}</span>
                </div>
                <p className="text-muted-foreground text-xs truncate">{c.last}</p>
                <p className="text-muted-foreground text-xs mt-1">{c.messages} сообщений</p>
              </div>
            ))}
          </div>
        </div>

        {/* Chat viewer */}
        <div className="lg:col-span-2">
          <Card className="bg-card border-border">
            <CardHeader className="pb-3 border-b border-border">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white text-base">{selectedChat.user}</CardTitle>
                  <p className="text-muted-foreground text-xs mt-0.5">{selectedChat.messages} сообщений</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" className="text-muted-foreground hover:text-red-400 h-8 text-xs">
                    <Icon name="UserX" size={13} className="mr-1" />Бан
                  </Button>
                  <Button size="sm" variant="ghost" className="text-muted-foreground hover:text-orange-400 h-8 text-xs">
                    <Icon name="Flag" size={13} className="mr-1" />Пожаловаться
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {MOCK_MSGS.map((m, i) => (
                  <div key={i} className={`flex gap-2 ${m.from === "user" ? "" : "flex-row-reverse"}`}>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs ${m.from === "user" ? "bg-primary/20 text-primary" : "bg-background text-muted-foreground border border-border"}`}>
                      {m.from === "user" ? "U" : "AI"}
                    </div>
                    <div className={`rounded-xl px-3 py-2 max-w-xs text-sm group relative ${m.from === "user" ? "bg-background border border-border text-white" : "bg-primary/20 text-white"}`}>
                      {m.text}
                      <span className="block text-xs text-muted-foreground mt-1">{m.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
