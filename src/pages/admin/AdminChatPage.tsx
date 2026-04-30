import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Icon from "@/components/ui/icon"
import { useState } from "react"

const MOCK_CHATS = [
  { id: 1, user: "ivan@mail.ru", last: "Как скачать трек?", time: "2 мин", type: "Личный", messages: 4 },
  { id: 2, user: "anna@gmail.com", last: "Спасибо за помощь!", time: "15 мин", type: "Поддержка", messages: 8 },
  { id: 3, user: "Команда разработчиков", last: "Обновление v2.1 готово", time: "1 ч", type: "Группа", messages: 23 },
  { id: 4, user: "dmitry@yandex.ru", last: "Когда выйдет новая функция?", time: "3 ч", type: "Личный", messages: 2 },
]

const MOCK_MESSAGES = [
  { from: "ivan@mail.ru", text: "Привет! Как скачать трек в формате WAV?", time: "12:30" },
  { from: "support", text: "Здравствуйте! После генерации нажмите кнопку «Скачать» и выберите WAV.", time: "12:31" },
  { from: "ivan@mail.ru", text: "Спасибо, нашёл!", time: "12:32" },
  { from: "ivan@mail.ru", text: "Как скачать трек?", time: "12:45" },
]

export default function AdminChatPage() {
  const [search, setSearch] = useState("")
  const [selected, setSelected] = useState(MOCK_CHATS[0])

  const filtered = MOCK_CHATS.filter(c => c.user.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-white font-orbitron mb-1">Чаты</h2>
        <p className="text-muted-foreground text-sm">Просмотр и модерация всех диалогов</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 h-[600px]">
        {/* List */}
        <Card className="bg-card border-border flex flex-col overflow-hidden">
          <CardContent className="pt-4 pb-3 border-b border-border">
            <div className="relative">
              <Icon name="Search" size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Поиск..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9 bg-background border-border text-white placeholder:text-muted-foreground h-8 text-sm"
              />
            </div>
          </CardContent>
          <div className="flex-1 overflow-y-auto">
            {filtered.map(c => (
              <div
                key={c.id}
                className={`flex items-center gap-3 px-4 py-3 cursor-pointer border-b border-border/50 hover:bg-background transition-colors ${selected.id === c.id ? "bg-background border-l-2 border-l-primary" : ""}`}
                onClick={() => setSelected(c)}
              >
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Icon name={c.type === "Группа" ? "Users" : "User"} size={14} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-white text-sm truncate">{c.user}</p>
                    <span className="text-muted-foreground text-xs flex-shrink-0">{c.time}</span>
                  </div>
                  <p className="text-muted-foreground text-xs truncate">{c.last}</p>
                </div>
                {c.messages > 0 && (
                  <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs">{c.messages}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Chat */}
        <Card className="bg-card border-border flex flex-col overflow-hidden lg:col-span-2">
          <CardHeader className="pb-3 border-b border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <Icon name="User" size={14} className="text-primary" />
                </div>
                <div>
                  <CardTitle className="text-white text-sm">{selected.user}</CardTitle>
                  <Badge variant="outline" className="border-border text-muted-foreground text-xs">{selected.type}</Badge>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300 text-xs">
                <Icon name="Ban" size={14} className="mr-1.5" />Забанить
              </Button>
            </div>
          </CardHeader>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {MOCK_MESSAGES.map((m, i) => (
              <div key={i} className={`flex gap-3 ${m.from === "support" ? "flex-row-reverse" : ""}`}>
                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Icon name={m.from === "support" ? "Shield" : "User"} size={13} className="text-primary" />
                </div>
                <div className={`flex flex-col gap-1 max-w-xs ${m.from === "support" ? "items-end" : ""}`}>
                  <div className={`rounded-xl px-3 py-2 text-sm ${m.from === "support" ? "bg-primary text-white" : "bg-background text-white border border-border"}`}>
                    {m.text}
                  </div>
                  <span className="text-muted-foreground text-xs">{m.time}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 border-t border-border">
            <p className="text-muted-foreground text-xs text-center">Режим просмотра — редактирование сообщений недоступно для защиты приватности</p>
          </div>
        </Card>
      </div>
    </div>
  )
}
