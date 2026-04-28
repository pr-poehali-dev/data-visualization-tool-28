import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Icon from "@/components/ui/icon"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Link } from "react-router-dom"

const PLANS = [
  {
    name: "Бесплатный",
    price: "0 ₽",
    period: "навсегда",
    planKey: null,
    badge: null,
    color: "border-border",
    btnClass: "border-border text-white hover:border-primary",
    btnVariant: "outline" as const,
    features: [
      { text: "5 генераций в день", ok: true },
      { text: "Музыка и тексты", ok: true },
      { text: "Скачивание MP3 и TXT", ok: true },
      { text: "Базовые стили", ok: true },
      { text: "Видео и фото", ok: false },
      { text: "Джинглы", ok: false },
      { text: "История генераций", ok: false },
      { text: "Сообщество и коллаборации", ok: false },
    ],
  },
  {
    name: "Базовый",
    price: "490 ₽",
    period: "в месяц",
    planKey: "basic",
    badge: null,
    color: "border-border",
    btnClass: "border-primary text-primary hover:bg-primary hover:text-white",
    btnVariant: "outline" as const,
    features: [
      { text: "50 генераций в день", ok: true },
      { text: "Музыка, тексты, фото", ok: true },
      { text: "Все форматы скачивания", ok: true },
      { text: "Все стили и жанры", ok: true },
      { text: "Видео (до 15 сек)", ok: true },
      { text: "Джинглы", ok: false },
      { text: "История на 30 дней", ok: true },
      { text: "Сообщество", ok: true },
    ],
  },
  {
    name: "Профессиональный",
    price: "990 ₽",
    period: "в месяц",
    planKey: "pro",
    badge: "Популярный",
    color: "border-primary",
    btnClass: "bg-primary hover:bg-primary/90 text-white",
    btnVariant: "default" as const,
    features: [
      { text: "200 генераций в день", ok: true },
      { text: "Все инструменты", ok: true },
      { text: "Все форматы скачивания", ok: true },
      { text: "Приоритетная генерация", ok: true },
      { text: "Видео до 60 сек", ok: true },
      { text: "Все виды джинглов", ok: true },
      { text: "История без ограничений", ok: true },
      { text: "Коллаборации", ok: true },
    ],
  },
  {
    name: "Премиум",
    price: "2 490 ₽",
    period: "в месяц",
    planKey: "premium",
    badge: "Бизнес",
    color: "border-border",
    btnClass: "border-border text-white hover:border-primary",
    btnVariant: "outline" as const,
    features: [
      { text: "Безлимитные генерации", ok: true },
      { text: "Все инструменты + API", ok: true },
      { text: "Все форматы + исходники", ok: true },
      { text: "Мгновенная генерация", ok: true },
      { text: "Видео без ограничений", ok: true },
      { text: "Все виды джинглов + мастеринг", ok: true },
      { text: "Командный доступ", ok: true },
      { text: "Персональный менеджер", ok: true },
    ],
  },
]

const PAYMENT_METHODS = [
  { name: "Банковская карта", icon: "CreditCard" },
  { name: "СБП", icon: "Smartphone" },
  { name: "ЮMoney", icon: "Wallet" },
  { name: "Криптовалюта", icon: "Bitcoin" },
]

export default function PricingPage() {
  return (
    <div className="dark min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-16 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-12 mt-6">
          <h1 className="text-4xl md:text-5xl font-bold text-white font-orbitron mb-4">Тарифы</h1>
          <p className="text-muted-foreground text-xl max-w-2xl mx-auto">
            Начни бесплатно и переходи на нужный тариф по мере роста
          </p>
        </div>

        {/* Plans grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {PLANS.map((plan) => (
            <Card key={plan.name} className={`bg-card border-2 ${plan.color} relative flex flex-col`}>
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-white px-3">{plan.badge}</Badge>
                </div>
              )}
              <CardHeader className="pb-4">
                <CardTitle className="text-white text-lg">{plan.name}</CardTitle>
                <div className="mt-2">
                  <span className="text-3xl font-bold text-white">{plan.price}</span>
                  <span className="text-muted-foreground text-sm ml-2">/ {plan.period}</span>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col flex-1">
                <ul className="space-y-3 flex-1 mb-6">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <Icon
                        name={f.ok ? "Check" : "X"}
                        size={16}
                        className={`mt-0.5 flex-shrink-0 ${f.ok ? "text-primary" : "text-muted-foreground/40"}`}
                      />
                      <span className={`text-sm ${f.ok ? "text-white" : "text-muted-foreground/40"}`}>{f.text}</span>
                    </li>
                  ))}
                </ul>
                {plan.planKey ? (
                  <Link to={`/checkout?plan=${plan.planKey}`}>
                    <Button variant={plan.btnVariant} className={`w-full ${plan.btnClass} bg-transparent`}>
                      Выбрать тариф
                    </Button>
                  </Link>
                ) : (
                  <Link to="/music">
                    <Button variant={plan.btnVariant} className={`w-full ${plan.btnClass} bg-transparent`}>
                      Начать бесплатно
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* One-time */}
        <Card className="bg-card border-border mb-12">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="Zap" size={20} className="text-primary" />
                  <h3 className="text-white font-bold text-lg">Разовая генерация</h3>
                </div>
                <p className="text-muted-foreground">Нужно создать один файл без подписки? Оплати только одну генерацию.</p>
              </div>
              <div className="flex items-center gap-6">
                <div>
                  <p className="text-3xl font-bold text-white">от 49 ₽</p>
                  <p className="text-muted-foreground text-sm">за одну генерацию</p>
                </div>
                <Button className="bg-primary hover:bg-primary/90 text-white whitespace-nowrap">
                  Попробовать
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Feature comparison */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white text-center mb-6 font-orbitron">Сравнение тарифов</h2>
          <Card className="bg-card border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-4 text-muted-foreground font-normal text-sm">Функция</th>
                    {PLANS.map(p => (
                      <th key={p.name} className="p-4 text-center text-white text-sm font-semibold">{p.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Создание музыки", true, true, true, true],
                    ["Создание видео", false, true, true, true],
                    ["Работа с фото", true, true, true, true],
                    ["Написание текстов", true, true, true, true],
                    ["Создание джинглов", false, false, true, true],
                    ["Коллаборации", false, false, true, true],
                    ["API доступ", false, false, false, true],
                    ["Приоритетная поддержка", false, false, false, true],
                  ].map(([feature, ...vals], i) => (
                    <tr key={i} className={`border-b border-border/50 ${i % 2 === 0 ? "bg-background/30" : ""}`}>
                      <td className="p-4 text-white text-sm">{feature as string}</td>
                      {(vals as boolean[]).map((v, j) => (
                        <td key={j} className="p-4 text-center">
                          <Icon name={v ? "Check" : "Minus"} size={16} className={`mx-auto ${v ? "text-primary" : "text-muted-foreground/30"}`} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Payment methods */}
        <div className="text-center">
          <h2 className="text-xl font-bold text-white mb-6 font-orbitron">Способы оплаты</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {PAYMENT_METHODS.map((m) => (
              <div key={m.name} className="flex items-center gap-2 bg-card border border-border rounded-lg px-4 py-3">
                <Icon name={m.icon as "CreditCard"} size={18} className="text-primary" />
                <span className="text-white text-sm">{m.name}</span>
              </div>
            ))}
          </div>
          <p className="text-muted-foreground text-sm mt-4">Все платежи защищены. Отмена подписки в любой момент.</p>
        </div>
      </main>
      <Footer />
    </div>
  )
}