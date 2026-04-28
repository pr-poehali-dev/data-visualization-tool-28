import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import Icon from "@/components/ui/icon"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

const VIDEOS = [
  { id: 1, title: "Как создать свой первый трек за 5 минут", duration: "5:20", category: "Музыка", views: "12K", level: "Начинающий", emoji: "🎵" },
  { id: 2, title: "Секреты идеального промпта для видео", duration: "8:45", category: "Видео", views: "8.3K", level: "Средний", emoji: "🎬" },
  { id: 3, title: "Колоризация фото: пошаговый гайд", duration: "6:12", category: "Фото", views: "15K", level: "Начинающий", emoji: "🎨" },
  { id: 4, title: "Создаём джингл для бизнеса с нуля", duration: "12:30", category: "Джинглы", views: "4.2K", level: "Средний", emoji: "🔊" },
  { id: 5, title: "Копирайтинг с ИИ: полный курс", duration: "18:00", category: "Тексты", views: "9.7K", level: "Начинающий", emoji: "✍️" },
  { id: 6, title: "Профессиональные эффекты в видео", duration: "10:15", category: "Видео", views: "6.1K", level: "Продвинутый", emoji: "⚡" },
]

const GUIDES = [
  { title: "Как писать промпты для музыки", desc: "Подробное руководство по созданию описаний, которые дают нужный результат с первого раза", category: "Музыка", readTime: "5 мин" },
  { title: "Форматы для соцсетей: шпаргалка", desc: "Какой формат выбирать для Instagram, TikTok, YouTube и других платформ", category: "Видео", readTime: "3 мин" },
  { title: "10 идей для промптов изображений", desc: "Готовые шаблоны описаний для генерации красивых изображений в разных стилях", category: "Фото", readTime: "4 мин" },
  { title: "Структура продающего текста", desc: "Как с помощью ИИ написать текст, который убеждает и продаёт", category: "Тексты", readTime: "7 мин" },
]

const PROMPT_EXAMPLES = [
  { tool: "Музыка", prompt: "Энергичная поп-музыка, 120 BPM, яркий синтезатор, позитивное настроение, для рекламного ролика кофейни", result: "Готовый трек за 30 сек" },
  { tool: "Видео", prompt: "Замедленная съёмка морских волн на закате, тёплые тона, кинематографичный стиль, фоновая музыка", result: "15-секундный ролик" },
  { tool: "Фото", prompt: "Портрет молодой женщины в стиле ретро 1970-х, плёночный эффект, мягкое боковое освещение", result: "Изображение 1024×1024" },
  { tool: "Джингл", prompt: "Звуковой логотип 5 секунд, радостный, фортепиано + колокольчики, запоминающийся мотив для кофейни", result: "Фирменный звук" },
]

const FAQ_LEARN = [
  { q: "С чего начать, если я совсем новичок?", a: "Начните с раздела «Создание музыки» — это самый простой инструмент. Посмотрите видеоурок «Как создать первый трек за 5 минут» и попробуйте сами." },
  { q: "Как получить лучший результат от ИИ?", a: "Чем подробнее описание — тем лучше результат. Укажите стиль, настроение, темп, инструменты и цель использования. Используйте готовые промпты из раздела «Примеры промптов»." },
  { q: "Можно ли использовать контент в коммерческих целях?", a: "Да, все созданные материалы на тарифах Базовый и выше доступны для коммерческого использования. На бесплатном тарифе — только для личных нужд." },
  { q: "Как улучшить качество генерации?", a: "Пробуйте разные формулировки, используйте конкретные термины из музыки/видео, добавляйте примеры (например, «в стиле Daft Punk» или «как в фильмах Marvel»)." },
]

const CATEGORIES = ["Все", "Музыка", "Видео", "Фото", "Тексты", "Джинглы"]
const LEVELS = ["Все", "Начинающий", "Средний", "Продвинутый"]

export default function LearnPage() {
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("Все")
  const [levelFilter, setLevelFilter] = useState("Все")
  const [playingId, setPlayingId] = useState<number | null>(null)

  const filteredVideos = VIDEOS.filter(v =>
    (categoryFilter === "Все" || v.category === categoryFilter) &&
    (levelFilter === "Все" || v.level === levelFilter) &&
    v.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="dark min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-16 px-4 max-w-7xl mx-auto">
        <div className="mb-8 mt-6">
          <div className="flex items-center gap-3 mb-2">
            <Icon name="GraduationCap" size={28} className="text-primary" />
            <h1 className="text-3xl font-bold text-white font-orbitron">Обучение</h1>
          </div>
          <p className="text-muted-foreground">Видеоуроки, гайды и примеры промптов для быстрого старта</p>
        </div>

        <Tabs defaultValue="videos">
          <TabsList className="bg-card border border-border mb-6">
            <TabsTrigger value="videos" className="data-[state=active]:bg-primary data-[state=active]:text-white text-muted-foreground">
              <Icon name="Play" size={14} className="mr-2" />Видеоуроки
            </TabsTrigger>
            <TabsTrigger value="guides" className="data-[state=active]:bg-primary data-[state=active]:text-white text-muted-foreground">
              <Icon name="BookOpen" size={14} className="mr-2" />Гайды
            </TabsTrigger>
            <TabsTrigger value="prompts" className="data-[state=active]:bg-primary data-[state=active]:text-white text-muted-foreground">
              <Icon name="Lightbulb" size={14} className="mr-2" />Промпты
            </TabsTrigger>
            <TabsTrigger value="faq" className="data-[state=active]:bg-primary data-[state=active]:text-white text-muted-foreground">
              <Icon name="HelpCircle" size={14} className="mr-2" />FAQ
            </TabsTrigger>
          </TabsList>

          {/* Videos */}
          <TabsContent value="videos">
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Поиск уроков..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 bg-card border-border text-white placeholder:text-muted-foreground"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {CATEGORIES.map(c => (
                  <Badge key={c} variant={categoryFilter === c ? "default" : "outline"}
                    className={`cursor-pointer ${categoryFilter === c ? "bg-primary text-white" : "border-border text-muted-foreground hover:border-primary hover:text-white"}`}
                    onClick={() => setCategoryFilter(c)}>{c}</Badge>
                ))}
              </div>
              <div className="flex gap-2 flex-wrap">
                {LEVELS.map(l => (
                  <Badge key={l} variant={levelFilter === l ? "default" : "outline"}
                    className={`cursor-pointer ${levelFilter === l ? "bg-primary text-white" : "border-border text-muted-foreground hover:border-primary hover:text-white"}`}
                    onClick={() => setLevelFilter(l)}>{l}</Badge>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVideos.map((v) => (
                <Card key={v.id} className="bg-card border-border hover:border-primary/50 transition-colors group">
                  <CardHeader className="p-0">
                    <div
                      className="aspect-video bg-gradient-to-br from-background to-primary/10 rounded-t-lg flex items-center justify-center cursor-pointer relative overflow-hidden"
                      onClick={() => setPlayingId(playingId === v.id ? null : v.id)}
                    >
                      <span className="text-5xl">{v.emoji}</span>
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                          <Icon name={playingId === v.id ? "Pause" : "Play"} size={20} className="text-white ml-0.5" />
                        </div>
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">{v.duration}</div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4 pb-4">
                    <div className="flex gap-2 mb-2">
                      <Badge variant="outline" className="border-border text-muted-foreground text-xs">{v.category}</Badge>
                      <Badge variant="outline" className={`text-xs border ${v.level === "Начинающий" ? "border-green-500/30 text-green-400" : v.level === "Средний" ? "border-yellow-500/30 text-yellow-400" : "border-red-500/30 text-red-400"}`}>{v.level}</Badge>
                    </div>
                    <h3 className="text-white text-sm font-medium leading-snug">{v.title}</h3>
                    <p className="text-muted-foreground text-xs mt-1 flex items-center gap-1">
                      <Icon name="Eye" size={12} />{v.views} просмотров
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Guides */}
          <TabsContent value="guides">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {GUIDES.map((g, i) => (
                <Card key={i} className="bg-card border-border hover:border-primary/50 transition-colors cursor-pointer group">
                  <CardContent className="pt-6 pb-5">
                    <div className="flex items-start justify-between mb-3">
                      <Badge variant="outline" className="border-border text-muted-foreground text-xs">{g.category}</Badge>
                      <span className="text-muted-foreground text-xs flex items-center gap-1">
                        <Icon name="Clock" size={12} />{g.readTime}
                      </span>
                    </div>
                    <h3 className="text-white font-semibold mb-2 group-hover:text-primary transition-colors">{g.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{g.desc}</p>
                    <p className="text-primary text-sm mt-4 flex items-center gap-1">
                      Читать <Icon name="ArrowRight" size={14} />
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Prompts */}
          <TabsContent value="prompts">
            <div className="mb-6">
              <p className="text-muted-foreground">Готовые примеры промптов — копируйте и используйте в любом инструменте</p>
            </div>
            <div className="space-y-4">
              {PROMPT_EXAMPLES.map((p, i) => (
                <Card key={i} className="bg-card border-border">
                  <CardContent className="pt-5 pb-5">
                    <div className="flex items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <Badge className="bg-primary/20 text-primary border-primary/30 border text-xs">{p.tool}</Badge>
                          <span className="text-muted-foreground text-xs">→ {p.result}</span>
                        </div>
                        <div className="bg-background rounded-lg p-4 border border-border">
                          <p className="text-white text-sm leading-relaxed font-space-mono">"{p.prompt}"</p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-border text-white hover:border-primary flex-shrink-0"
                        onClick={() => navigator.clipboard?.writeText(p.prompt)}
                      >
                        <Icon name="Copy" size={14} className="mr-1" />Копировать
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* FAQ */}
          <TabsContent value="faq">
            <div className="max-w-3xl">
              <Accordion type="single" collapsible className="w-full">
                {FAQ_LEARN.map((item, i) => (
                  <AccordionItem key={i} value={`item-${i}`} className="border-border mb-3">
                    <AccordionTrigger className="text-left text-base font-semibold text-white hover:text-red-400 font-orbitron px-4 py-4">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-300 leading-relaxed px-4 pb-4">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  )
}
