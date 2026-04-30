import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Icon from "@/components/ui/icon"

const MOCK_CONTENT = [
  { id: 1, type: "music", user: "ivan@mail.ru", title: "Energetic Pop Track", created: "2025-04-30 11:00", status: "ok", size: "4.2 МБ" },
  { id: 2, type: "video", user: "anna@gmail.com", title: "Instagram Reel Sunset", created: "2025-04-30 10:30", status: "ok", size: "12.1 МБ" },
  { id: 3, type: "photo", user: "dmitry@yandex.ru", title: "Anime Portrait", created: "2025-04-30 10:00", status: "review", size: "2.4 МБ" },
  { id: 4, type: "text", user: "maria@gmail.com", title: "Статья о здоровье", created: "2025-04-29 20:00", status: "ok", size: "8 КБ" },
  { id: 5, type: "jingle", user: "oleg@mail.ru", title: "Coffee Shop Jingle", created: "2025-04-29 18:00", status: "ok", size: "1.8 МБ" },
]

const AI_MODELS = [
  { id: "openai", name: "OpenAI GPT-4", type: "Текст", enabled: true, requests: 1247 },
  { id: "yandex_gpt", name: "Yandex GPT", type: "Текст", enabled: true, requests: 892 },
  { id: "stable_diffusion", name: "Stable Diffusion", type: "Изображение", enabled: true, requests: 3421 },
  { id: "suno", name: "Suno AI", type: "Музыка", enabled: true, requests: 654 },
  { id: "runway", name: "Runway ML", type: "Видео", enabled: false, requests: 0 },
]

const typeIcon = (t: string) => ({ music: "Music", video: "Video", photo: "Image", text: "FileText", jingle: "Radio" }[t] || "File")
const typeColor = (t: string) => ({ music: "text-purple-400", video: "text-orange-400", photo: "text-blue-400", text: "text-green-400", jingle: "text-yellow-400" }[t] || "text-muted-foreground")
const typeLabel = (t: string) => ({ music: "Музыка", video: "Видео", photo: "Фото", text: "Текст", jingle: "Джингл" }[t] || t)

export default function ContentPage() {
  const [models, setModels] = useState(AI_MODELS)
  const [content, setContent] = useState(MOCK_CONTENT)

  const toggleModel = (id: string) => {
    setModels(prev => prev.map(m => m.id === id ? { ...m, enabled: !m.enabled } : m))
  }

  const moderateContent = (id: number, action: "approve" | "reject") => {
    setContent(prev => prev.map(c => c.id === id ? { ...c, status: action === "approve" ? "ok" : "rejected" } : c))
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-white font-orbitron">Контент и ИИ</h2>
        <p className="text-muted-foreground text-sm mt-1">Просмотр и модерация контента, управление моделями</p>
      </div>

      <Tabs defaultValue="content">
        <TabsList className="bg-card border border-border">
          <TabsTrigger value="content" className="data-[state=active]:bg-primary data-[state=active]:text-white text-muted-foreground">
            <Icon name="Grid" size={14} className="mr-2" />Контент
          </TabsTrigger>
          <TabsTrigger value="models" className="data-[state=active]:bg-primary data-[state=active]:text-white text-muted-foreground">
            <Icon name="Cpu" size={14} className="mr-2" />ИИ-модели
          </TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="mt-4 space-y-3">
          {content.map((c) => (
            <Card key={c.id} className="bg-card border-border">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg bg-background flex items-center justify-center flex-shrink-0 ${typeColor(c.type)}`}>
                    <Icon name={typeIcon(c.type) as "Music"} size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-white text-sm font-medium truncate">{c.title}</p>
                      <Badge variant="outline" className="border-border text-muted-foreground text-xs flex-shrink-0">{typeLabel(c.type)}</Badge>
                      {c.status === "review" && <Badge variant="outline" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs flex-shrink-0">На проверке</Badge>}
                      {c.status === "rejected" && <Badge variant="outline" className="bg-red-500/20 text-red-400 border-red-500/30 text-xs flex-shrink-0">Отклонён</Badge>}
                    </div>
                    <p className="text-muted-foreground text-xs">{c.user} • {c.size} • {c.created}</p>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <Button size="sm" variant="ghost" className="h-7 px-2 text-muted-foreground hover:text-white"><Icon name="Eye" size={13} /></Button>
                    {c.status === "review" && (
                      <>
                        <Button size="sm" variant="ghost" className="h-7 px-2 text-muted-foreground hover:text-green-400" onClick={() => moderateContent(c.id, "approve")}><Icon name="Check" size={13} /></Button>
                        <Button size="sm" variant="ghost" className="h-7 px-2 text-muted-foreground hover:text-red-400" onClick={() => moderateContent(c.id, "reject")}><Icon name="X" size={13} /></Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="models" className="mt-4">
          <div className="space-y-3">
            {models.map((m) => (
              <Card key={m.id} className="bg-card border-border">
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center flex-shrink-0">
                      <Icon name="Cpu" size={18} className="text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-white font-medium text-sm">{m.name}</p>
                        <Badge variant="outline" className="border-border text-muted-foreground text-xs">{m.type}</Badge>
                      </div>
                      <p className="text-muted-foreground text-xs mt-0.5">{m.requests.toLocaleString()} запросов за месяц</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="text-muted-foreground text-xs">{m.enabled ? "Активна" : "Выключена"}</Label>
                      <Switch checked={m.enabled} onCheckedChange={() => toggleModel(m.id)} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
