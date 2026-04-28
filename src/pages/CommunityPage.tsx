import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Icon from "@/components/ui/icon"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

const CATEGORIES = ["Все", "Музыка", "Видео", "Фото", "Тексты", "Джинглы"]

const TEMPLATES = [
  { id: 1, title: "Энергичный рекламный джингл", category: "Джинглы", author: "Иван П.", uses: 234, emoji: "🎵", desc: "Настройки для создания цепляющего рекламного джингла в стиле поп" },
  { id: 2, title: "Кинематографичное видео", category: "Видео", author: "Анна К.", uses: 189, emoji: "🎬", desc: "Параметры для создания атмосферного видео с плавными переходами" },
  { id: 3, title: "Портрет в стиле аниме", category: "Фото", author: "Дмитрий С.", uses: 567, emoji: "🎨", desc: "Промпт для генерации аниме-портрета с детализированным фоном" },
  { id: 4, title: "Продающий пост для Instagram", category: "Тексты", author: "Мария В.", uses: 1024, emoji: "✍️", desc: "Шаблон для создания вовлекающего продающего поста с хэштегами" },
  { id: 5, title: "Lo-fi хип-хоп трек", category: "Музыка", author: "Алексей М.", uses: 341, emoji: "🎶", desc: "Создай расслабляющий lo-fi трек с пластинкой и дождём" },
  { id: 6, title: "Звуковой логотип для бренда", category: "Джинглы", author: "Ольга Н.", uses: 156, emoji: "🔊", desc: "5-секундный фирменный звук, запоминающийся и профессиональный" },
  { id: 7, title: "Слайд-шоу для свадьбы", category: "Видео", author: "Сергей Л.", uses: 289, emoji: "💍", desc: "Романтичное слайд-шоу из фотографий с нежной музыкой" },
  { id: 8, title: "Колоризация старых фото", category: "Фото", author: "Татьяна Р.", uses: 445, emoji: "🖼️", desc: "Оптимальные настройки для реалистичной колоризации ч/б снимков" },
]

const PROFILES = [
  { name: "Алексей Морозов", role: "Музыкальный продюсер", works: 47, emoji: "🎵" },
  { name: "Мария Соколова", role: "SMM-специалист", works: 132, emoji: "📱" },
  { name: "Дмитрий Иванов", role: "Видеоблогер", works: 89, emoji: "🎬" },
]

export default function CommunityPage() {
  const [activeCategory, setActiveCategory] = useState("Все")
  const [searchQuery, setSearchQuery] = useState("")
  const [copiedId, setCopiedId] = useState<number | null>(null)

  const filtered = TEMPLATES.filter(t =>
    (activeCategory === "Все" || t.category === activeCategory) &&
    t.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleCopy = (id: number) => {
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="dark min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-16 px-4 max-w-7xl mx-auto">
        <div className="mb-8 mt-6">
          <div className="flex items-center gap-3 mb-2">
            <Icon name="Users" size={28} className="text-primary" />
            <h1 className="text-3xl font-bold text-white font-orbitron">Сообщество и шаблоны</h1>
          </div>
          <p className="text-muted-foreground">Готовые промпты и настройки от сообщества — копируй и создавай</p>
        </div>

        <Tabs defaultValue="templates">
          <TabsList className="bg-card border border-border mb-6">
            <TabsTrigger value="templates" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              <Icon name="LayoutGrid" size={14} className="mr-2" />Шаблоны
            </TabsTrigger>
            <TabsTrigger value="profiles" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              <Icon name="Users" size={14} className="mr-2" />Авторы
            </TabsTrigger>
          </TabsList>

          <TabsContent value="templates">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Поиск шаблонов..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-card border-border text-white placeholder:text-muted-foreground"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {CATEGORIES.map((c) => (
                  <Badge
                    key={c}
                    variant={activeCategory === c ? "default" : "outline"}
                    className={`cursor-pointer ${activeCategory === c ? "bg-primary text-white" : "border-border text-muted-foreground hover:border-primary hover:text-white"}`}
                    onClick={() => setActiveCategory(c)}
                  >
                    {c}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {filtered.map((t) => (
                <Card key={t.id} className="bg-card border-border hover:border-primary/50 transition-colors group">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <span className="text-3xl">{t.emoji}</span>
                      <Badge variant="outline" className="border-border text-muted-foreground text-xs">{t.category}</Badge>
                    </div>
                    <h3 className="text-white font-medium text-sm leading-snug mt-2">{t.title}</h3>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-3">
                    <p className="text-muted-foreground text-xs leading-relaxed">{t.desc}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-muted-foreground text-xs">
                        <Icon name="TrendingUp" size={12} />
                        <span>{t.uses} использований</span>
                      </div>
                      <span className="text-muted-foreground text-xs">@{t.author}</span>
                    </div>
                    <Button
                      size="sm"
                      className={`w-full text-xs ${copiedId === t.id ? "bg-green-600 hover:bg-green-700" : "bg-primary hover:bg-primary/90"} text-white`}
                      onClick={() => handleCopy(t.id)}
                    >
                      {copiedId === t.id ? (
                        <><Icon name="Check" size={12} className="mr-1" />Скопировано</>
                      ) : (
                        <><Icon name="Copy" size={12} className="mr-1" />Использовать</>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="profiles">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {PROFILES.map((p, i) => (
                <Card key={i} className="bg-card border-border hover:border-primary/50 transition-colors">
                  <CardContent className="pt-6">
                    <div className="text-center mb-4">
                      <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-3xl mx-auto mb-3">
                        {p.emoji}
                      </div>
                      <h3 className="text-white font-semibold">{p.name}</h3>
                      <p className="text-muted-foreground text-sm mt-1">{p.role}</p>
                    </div>
                    <div className="flex justify-center gap-6 mb-4">
                      <div className="text-center">
                        <p className="text-white font-bold">{p.works}</p>
                        <p className="text-muted-foreground text-xs">Работ</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full border-border text-white hover:border-primary">
                      <Icon name="UserPlus" size={14} className="mr-2" />Подписаться
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  )
}
