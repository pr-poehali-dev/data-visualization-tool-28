import { useState } from "react"
import { useSearchParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Icon from "@/components/ui/icon"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { PaymentButton } from "@/components/extensions/robokassa/PaymentButton"

const PLANS: Record<string, { name: string; price: number; features: string[] }> = {
  basic: {
    name: "Базовый",
    price: 490,
    features: ["50 генераций в день", "Музыка, тексты, фото", "Видео до 15 сек", "История на 30 дней"],
  },
  pro: {
    name: "Профессиональный",
    price: 990,
    features: ["200 генераций в день", "Все инструменты", "Видео до 60 сек", "Все виды джинглов", "Коллаборации"],
  },
  premium: {
    name: "Премиум",
    price: 2490,
    features: ["Безлимитные генерации", "Все инструменты + API", "Видео без ограничений", "Командный доступ", "Персональный менеджер"],
  },
  single: {
    name: "Разовая генерация",
    price: 49,
    features: ["1 генерация любого контента", "Без подписки", "Все форматы скачивания"],
  },
}

const ROBOKASSA_URL = "https://functions.poehali.dev/a728de2f-dbc9-4ea3-b987-9154b2e2973b"

export default function CheckoutPage() {
  const [params] = useSearchParams()
  const planKey = params.get("plan") || "pro"
  const plan = PLANS[planKey] || PLANS.pro

  const [form, setForm] = useState({ name: "", email: "", phone: "" })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.name.trim()) e.name = "Введите имя"
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = "Введите корректный email"
    if (!form.phone.trim()) e.phone = "Введите телефон"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }))
  }

  const cartItems = [{ id: planKey, name: `Тариф «${plan.name}»`, price: plan.price, quantity: 1 }]

  return (
    <div className="dark min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-16 px-4 max-w-4xl mx-auto">
        <div className="mb-8 mt-6">
          <div className="flex items-center gap-3 mb-2">
            <Icon name="CreditCard" size={28} className="text-primary" />
            <h1 className="text-3xl font-bold text-white font-orbitron">Оформление подписки</h1>
          </div>
          <p className="text-muted-foreground">Заполните данные и перейдите к оплате</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <div className="space-y-5">
            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-base flex items-center gap-2">
                  <Icon name="User" size={16} className="text-primary" />
                  Ваши данные
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-muted-foreground text-sm mb-1.5 block">Имя *</Label>
                  <Input
                    placeholder="Иван Иванов"
                    value={form.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className={`bg-background border-border text-white placeholder:text-muted-foreground ${errors.name ? "border-red-500" : ""}`}
                  />
                  {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                </div>
                <div>
                  <Label className="text-muted-foreground text-sm mb-1.5 block">Email *</Label>
                  <Input
                    type="email"
                    placeholder="ivan@example.com"
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className={`bg-background border-border text-white placeholder:text-muted-foreground ${errors.email ? "border-red-500" : ""}`}
                  />
                  {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                </div>
                <div>
                  <Label className="text-muted-foreground text-sm mb-1.5 block">Телефон *</Label>
                  <Input
                    type="tel"
                    placeholder="+7 (999) 000-00-00"
                    value={form.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    className={`bg-background border-border text-white placeholder:text-muted-foreground ${errors.phone ? "border-red-500" : ""}`}
                  />
                  {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-base flex items-center gap-2">
                  <Icon name="Shield" size={16} className="text-primary" />
                  Безопасная оплата
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3 mb-4">
                  {["Банковская карта", "СБП", "ЮMoney"].map((m) => (
                    <div key={m} className="flex items-center gap-2 bg-background border border-border rounded-lg px-3 py-2">
                      <Icon name="CreditCard" size={14} className="text-primary" />
                      <span className="text-white text-xs">{m}</span>
                    </div>
                  ))}
                </div>
                <p className="text-muted-foreground text-xs flex items-center gap-1.5">
                  <Icon name="Lock" size={12} className="text-primary" />
                  Оплата защищена шифрованием SSL. Данные карты не сохраняются.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Order summary */}
          <div>
            <Card className="bg-card border-primary/30 border-2 sticky top-24">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-base flex items-center gap-2">
                  <Icon name="ShoppingCart" size={16} className="text-primary" />
                  Ваш заказ
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-background rounded-lg p-4 border border-border">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-white font-semibold">Тариф «{plan.name}»</span>
                    <Badge className="bg-primary/20 text-primary border-primary/30 border">В месяц</Badge>
                  </div>
                  <ul className="space-y-1.5 mb-4">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-2 text-muted-foreground text-sm">
                        <Icon name="Check" size={13} className="text-primary flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div className="border-t border-border pt-3 flex items-center justify-between">
                    <span className="text-muted-foreground text-sm">Итого</span>
                    <span className="text-white text-2xl font-bold">{plan.price} ₽</span>
                  </div>
                </div>

                <PaymentButton
                  apiUrl={ROBOKASSA_URL}
                  amount={plan.price}
                  userName={form.name}
                  userEmail={form.email}
                  userPhone={form.phone}
                  cartItems={cartItems}
                  orderComment={`Тариф: ${plan.name}`}
                  successUrl={`${window.location.origin}/payment-success`}
                  failUrl={`${window.location.origin}/pricing`}
                  onSuccess={(orderNum) => console.log("Оплачен заказ:", orderNum)}
                  onError={(err) => console.error("Ошибка оплаты:", err)}
                  buttonText={`Оплатить ${plan.price} ₽`}
                  disabled={!form.name || !form.email || !form.phone}
                  className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-base"
                />

                <p className="text-muted-foreground text-xs text-center">
                  Нажимая «Оплатить», вы принимаете{" "}
                  <a href="#" className="text-primary hover:underline">условия использования</a>{" "}
                  и даёте согласие на обработку персональных данных
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
