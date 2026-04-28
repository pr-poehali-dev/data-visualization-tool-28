import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Icon from "@/components/ui/icon"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

const PROJECTS = [
  {
    id: 1,
    name: "Рекламный джингл — Кафе «Уют»",
    type: "Джингл",
    members: ["АМ", "ИП", "СК"],
    status: "active",
    updated: "Сегодня",
    role: "Владелец",
    messages: 12,
  },
  {
    id: 2,
    name: "Видеоролик для Instagram",
    type: "Видео",
    members: ["МС", "ДИ"],
    status: "active",
    updated: "Вчера",
    role: "Участник",
    messages: 5,
  },
  {
    id: 3,
    name: "Текст для лендинга",
    type: "Текст",
    members: ["ОН"],
    status: "done",
    updated: "3 дня назад",
    role: "Владелец",
    messages: 0,
  },
]

const PROJECT_MESSAGES = [
  { from: "АМ", text: "Добавил черновик джингла, посмотрите", time: "11:30" },
  { from: "ИП", text: "Отлично! Можно немного ускорить темп?", time: "11:45" },
  { from: "СК", text: "Согласна, и голос сделать чуть мягче", time: "12:00" },
  { from: "АМ", text: "Обновил версию, проверьте", time: "12:20" },
]

export default function CollabPage() {
  const [activeProject, setActiveProject] = useState(PROJECTS[0])
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState(PROJECT_MESSAGES)
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole] = useState("editor")
  const [showInvite, setShowInvite] = useState(false)

  const sendMessage = () => {
    if (!message.trim()) return
    setMessages([...messages, {
      from: "Я",
      text: message,
      time: new Date().toLocaleTimeString("ru", { hour: "2-digit", minute: "2-digit" })
    }])
    setMessage("")
  }

  const statusColor = (s: string) => s === "active" ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-muted text-muted-foreground border-border"
  const statusLabel = (s: string) => s === "active" ? "Активен" : "Завершён"

  return (
    <div className="dark min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-16 px-4 max-w-7xl mx-auto">
        <div className="mb-8 mt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 mb-2">
              <Icon name="GitBranch" size={28} className="text-primary" />
              <h1 className="text-3xl font-bold text-white font-orbitron">Коллаборации</h1>
            </div>
            <Button className="bg-primary hover:bg-primary/90 text-white">
              <Icon name="Plus" size={16} className="mr-2" />
              Новый проект
            </Button>
          </div>
          <p className="text-muted-foreground">Совместная работа над проектами с командой</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Projects list */}
          <div className="space-y-3">
            <h2 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Мои проекты</h2>
            {PROJECTS.map((p) => (
              <Card
                key={p.id}
                className={`bg-card border cursor-pointer transition-colors ${activeProject.id === p.id ? "border-primary" : "border-border hover:border-primary/50"}`}
                onClick={() => setActiveProject(p)}
              >
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-white text-sm font-medium leading-snug flex-1 mr-2">{p.name}</h3>
                    <Badge variant="outline" className={`text-xs flex-shrink-0 ${statusColor(p.status)}`}>
                      {statusLabel(p.status)}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex -space-x-1">
                      {p.members.map((m, i) => (
                        <Avatar key={i} className="h-6 w-6 border border-background">
                          <AvatarFallback className="bg-primary/30 text-primary text-xs">{m}</AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
                    <div className="flex items-center gap-3 text-muted-foreground text-xs">
                      {p.messages > 0 && (
                        <span className="flex items-center gap-1">
                          <Icon name="MessageSquare" size={12} />{p.messages}
                        </span>
                      )}
                      <span>{p.updated}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mt-2">
                    <Badge variant="outline" className="border-border text-muted-foreground text-xs">{p.type}</Badge>
                    <Badge variant="outline" className="border-border text-muted-foreground text-xs">{p.role}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Project detail */}
          <div className="lg:col-span-2">
            <Card className="bg-card border-border">
              <CardHeader className="border-b border-border">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-white text-lg">{activeProject.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="border-border text-muted-foreground text-xs">{activeProject.type}</Badge>
                      <Badge variant="outline" className={`text-xs ${statusColor(activeProject.status)}`}>{statusLabel(activeProject.status)}</Badge>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-border text-white hover:border-primary"
                    onClick={() => setShowInvite(!showInvite)}
                  >
                    <Icon name="UserPlus" size={14} className="mr-2" />
                    Пригласить
                  </Button>
                </div>

                {showInvite && (
                  <div className="mt-4 p-4 rounded-lg bg-background border border-border">
                    <p className="text-white text-sm font-medium mb-3">Пригласить участника</p>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Email участника"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        className="bg-card border-border text-white placeholder:text-muted-foreground flex-1"
                      />
                      <Select value={inviteRole} onValueChange={setInviteRole}>
                        <SelectTrigger className="w-36 bg-card border-border text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="editor">Редактор</SelectItem>
                          <SelectItem value="viewer">Наблюдатель</SelectItem>
                          <SelectItem value="admin">Админ</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button className="bg-primary hover:bg-primary/90 text-white">
                        <Icon name="Send" size={14} />
                      </Button>
                    </div>
                  </div>
                )}
              </CardHeader>

              <Tabs defaultValue="chat">
                <div className="px-6 pt-4">
                  <TabsList className="bg-background border border-border">
                    <TabsTrigger value="chat" className="data-[state=active]:bg-primary data-[state=active]:text-white text-muted-foreground">
                      <Icon name="MessageSquare" size={14} className="mr-2" />Чат проекта
                    </TabsTrigger>
                    <TabsTrigger value="files" className="data-[state=active]:bg-primary data-[state=active]:text-white text-muted-foreground">
                      <Icon name="FolderOpen" size={14} className="mr-2" />Файлы
                    </TabsTrigger>
                    <TabsTrigger value="access" className="data-[state=active]:bg-primary data-[state=active]:text-white text-muted-foreground">
                      <Icon name="Shield" size={14} className="mr-2" />Доступ
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="chat" className="px-6 pb-4">
                  <div className="min-h-[280px] max-h-[280px] overflow-y-auto py-4 space-y-3">
                    {messages.map((m, i) => (
                      <div key={i} className={`flex gap-3 ${m.from === "Я" ? "flex-row-reverse" : ""}`}>
                        <Avatar className="h-7 w-7 flex-shrink-0">
                          <AvatarFallback className="bg-primary/20 text-primary text-xs">{m.from}</AvatarFallback>
                        </Avatar>
                        <div className={`flex flex-col gap-1 ${m.from === "Я" ? "items-end" : ""}`}>
                          <div className={`rounded-xl px-3 py-2 max-w-xs text-sm ${m.from === "Я" ? "bg-primary text-white" : "bg-background text-white border border-border"}`}>
                            {m.text}
                          </div>
                          <span className="text-muted-foreground text-xs">{m.from} • {m.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-2 border-t border-border pt-4">
                    <Input
                      placeholder="Написать в чате проекта..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                      className="bg-background border-border text-white placeholder:text-muted-foreground"
                    />
                    <Button onClick={sendMessage} className="bg-primary hover:bg-primary/90 text-white">
                      <Icon name="Send" size={16} />
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="files" className="px-6 pb-6">
                  <div className="space-y-2 py-4">
                    {[
                      { name: "jingle_v1.mp3", size: "2.4 МБ", date: "Сегодня" },
                      { name: "brief.docx", size: "45 КБ", date: "Вчера" },
                      { name: "jingle_draft.mp3", size: "1.8 МБ", date: "2 дня назад" },
                    ].map((f, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-background border border-border">
                        <Icon name="FileAudio" size={18} className="text-primary flex-shrink-0" fallback="File" />
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm">{f.name}</p>
                          <p className="text-muted-foreground text-xs">{f.size} • {f.date}</p>
                        </div>
                        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-white">
                          <Icon name="Download" size={14} />
                        </Button>
                      </div>
                    ))}
                    <Button variant="outline" className="w-full border-dashed border-border text-muted-foreground hover:border-primary hover:text-white mt-2">
                      <Icon name="Upload" size={14} className="mr-2" />Загрузить файл
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="access" className="px-6 pb-6">
                  <div className="space-y-3 py-4">
                    {activeProject.members.map((m, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-background border border-border">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary/20 text-primary text-sm">{m}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-white text-sm">Участник {m}</p>
                          <p className="text-muted-foreground text-xs">{i === 0 ? "Владелец" : "Редактор"}</p>
                        </div>
                        {i !== 0 && (
                          <Select defaultValue="editor">
                            <SelectTrigger className="w-32 h-8 bg-card border-border text-white text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="editor">Редактор</SelectItem>
                              <SelectItem value="viewer">Наблюдатель</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
