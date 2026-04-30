import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import Icon from "@/components/ui/icon"
import { useState } from "react"

const MOCK_CONTENT = [
  { id: 1, type: "Музыка", user: "ivan@mail.ru", name: "Рекламный джингл.mp3", date: "Сегодня", status: "published" },
  { id: 2, type: "Видео", user: "anna@gmail.com", name: "Слайд-шоу свадьба.mp4", date: "Вчера", status: "published" },
  { id: 3, type: "Фото", user: "dmitry@yandex.ru", name: "Портрет_аниме.jpg", date: "Вчера", status: "pending" },
  { id: 4, type: "Текст", user: "maria@mail.ru", name: "Продающий пост.txt", date: "2 дня назад", status: "published" },
]

const AI_SERVICES = [
  { name: "OpenAI GPT-4", type: "Тексты", enabled: true },
  { name: "Yandex GPT", type: "Тексты", enabled: true },
  { name: "Stable Diffusion", type: "Изображения", enabled: true },
  { name: "Suno AI", type: "Музыка", enabled: false },
  { name: "Runway ML", type: "Видео", enabled: true },
]

export default function ContentPage() {
  const [services, setServices] = useState(AI_SERVICES)
  const [temperature, setTemperature] = useState([0.7])
  const [maxTokens, setMaxTokens] = useState([2000])

  const toggleService = (i: number) => {
    setServices(prev => prev.map((s, idx) => idx === i ? { ...s, enabled: !s.enabled } : s))
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-white font-orbitron mb-1">Контент и ИИ</h2>
        <p className="text-muted-foreground text-sm">Модерация контента и управление ИИ-моделями</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-base flex items-center gap-2">
              <Icon name="Layout" size={16} className="text-primary" />
              Сгенерированный контент
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {MOCK_CONTENT.map(c => (
                <div key={c.id} className="flex items-center gap-3 px-4 py-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon name={c.type === "Музыка" ? "Music" : c.type === "Видео" ? "Video" : c.type === "Фото" ? "Image" : "FileText"} size={15} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm truncate">{c.name}</p>
                    <p className="text-muted-foreground text-xs">{c.user} · {c.date}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={`text-xs ${c.status === "published" ? "text-green-400 border-green-500/30" : "text-yellow-400 border-yellow-500/30"}`}>
                      {c.status === "published" ? "Опубликован" : "На проверке"}
                    </Badge>
                    <Button size="sm" variant="ghost" className="text-muted-foreground hover:text-red-400 h-7 w-7 p-0">
                      <Icon name="Trash2" size={13} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-base flex items-center gap-2">
                <Icon name="Cpu" size={16} className="text-primary" />
                ИИ-сервисы
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {services.map((s, i) => (
                <div key={s.name} className="flex items-center justify-between py-1">
                  <div>
                    <p className="text-white text-sm">{s.name}</p>
                    <p className="text-muted-foreground text-xs">{s.type}</p>
                  </div>
                  <Switch checked={s.enabled} onCheckedChange={() => toggleService(i)} />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-base flex items-center gap-2">
                <Icon name="SlidersHorizontal" size={16} className="text-primary" />
                Параметры генерации
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-muted-foreground text-sm mb-2 block">Температура: {temperature[0]}</Label>
                <Slider value={temperature} onValueChange={setTemperature} min={0} max={2} step={0.1} />
              </div>
              <div>
                <Label className="text-muted-foreground text-sm mb-2 block">Макс. токенов: {maxTokens[0]}</Label>
                <Slider value={maxTokens} onValueChange={setMaxTokens} min={100} max={8000} step={100} />
              </div>
              <Button className="w-full bg-primary hover:bg-primary/90 text-white" size="sm">
                Сохранить настройки
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
