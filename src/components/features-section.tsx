import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Icon from "@/components/ui/icon"

const features = [
  {
    title: "Создание музыки",
    description: "Генерируй треки по текстовому описанию, добавляй вокал — мужской, женский или дуэт. Поддержка всех музыкальных стилей и озвучка треков с микрофона.",
    icon: "Music",
    badge: "Аудио",
  },
  {
    title: "Генерация видео",
    description: "Создавай видео из текста или фото, редактируй загруженные клипы. Вертикальный формат для соцсетей, эффекты и работа с таймингом.",
    icon: "Video",
    badge: "Видео",
  },
  {
    title: "Работа с фото",
    description: "Оживляй изображения, колоризируй ч/б фото, создавай слайд-шоу с музыкой. Генерация изображений по описанию и добавление текста с выбором шрифта.",
    icon: "Image",
    badge: "Фото",
  },
  {
    title: "Написание текстов",
    description: "Создавай статьи, сценарии, посты и любые другие тексты по запросу. Редактируй и улучшай собственные тексты с помощью ИИ.",
    icon: "FileText",
    badge: "Текст",
  },
  {
    title: "Создание джинглов",
    description: "Музыкальные, вокальные и смешанные джинглы. Звуковые логотипы от 3 секунд до радиороликов. Настройка BPM, жанра, инструментов и голосовых эффектов.",
    icon: "Radio",
    badge: "Джинглы",
  },
  {
    title: "Все нейросети в одном месте",
    description: "Интеграция со всеми актуальными ИИ-сервисами: текстовыми, аудио, видео и графическими. Регистрация через Google, VK, Яндекс и другие сервисы.",
    icon: "Sparkles",
    badge: "ИИ",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-24 px-6 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4 font-sans">Всё для вашего творчества</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Музыка, видео, фото, тексты и джинглы — создавай контент любого формата с помощью ИИ
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="glow-border hover:shadow-lg transition-all duration-300 slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Icon name={feature.icon} size={32} className="text-primary" fallback="Star" />
                  <Badge variant="secondary" className="bg-accent text-accent-foreground">
                    {feature.badge}
                  </Badge>
                </div>
                <CardTitle className="text-xl font-bold text-card-foreground">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
