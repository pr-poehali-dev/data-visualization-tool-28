import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import Icon from "@/components/ui/icon"

interface AuthModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AuthModal({ open, onOpenChange }: AuthModalProps) {
  const [loginData, setLoginData] = useState({ email: "", password: "" })
  const [registerData, setRegisterData] = useState({ name: "", email: "", phone: "", password: "", confirm: "" })
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("login")

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => { setIsLoading(false); onOpenChange(false) }, 1200)
  }

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => { setIsLoading(false); onOpenChange(false) }, 1200)
  }

  const socialButtons = [
    { label: "Google", icon: "Globe", color: "hover:border-blue-500" },
    { label: "ВКонтакте", icon: "Users", color: "hover:border-blue-400" },
    { label: "Яндекс", icon: "Search", color: "hover:border-yellow-500" },
    { label: "Mail.ru", icon: "Mail", color: "hover:border-orange-500" },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border border-border text-white max-w-md w-full mx-4">
        <DialogHeader>
          <DialogTitle className="text-center font-orbitron text-xl text-white">
            AI<span className="text-red-500"> Studio</span>
          </DialogTitle>
          <DialogDescription className="sr-only">
            Форма входа и регистрации в AI Studio
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-2">
          <TabsList className="w-full bg-background border border-border">
            <TabsTrigger value="login" className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-white text-muted-foreground">
              Вход
            </TabsTrigger>
            <TabsTrigger value="register" className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-white text-muted-foreground">
              Регистрация
            </TabsTrigger>
          </TabsList>

          {/* Login */}
          <TabsContent value="login" className="mt-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label className="text-muted-foreground text-sm mb-1.5 block">Email или телефон</Label>
                <Input
                  type="text"
                  placeholder="example@mail.ru"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  className="bg-background border-border text-white placeholder:text-muted-foreground"
                  required
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <Label className="text-muted-foreground text-sm">Пароль</Label>
                  <button type="button" className="text-primary text-xs hover:underline">Забыли пароль?</button>
                </div>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  className="bg-background border-border text-white placeholder:text-muted-foreground"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <><Icon name="Loader2" size={16} className="mr-2 animate-spin" />Входим...</>
                ) : "Войти"}
              </Button>
            </form>

            <div className="mt-4">
              <div className="relative">
                <Separator className="bg-border" />
                <span className="absolute left-1/2 -translate-x-1/2 -top-2.5 bg-card px-2 text-muted-foreground text-xs">или войти через</span>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {socialButtons.map((s) => (
                  <Button
                    key={s.label}
                    type="button"
                    variant="outline"
                    size="sm"
                    className={`border-border text-white bg-transparent ${s.color} transition-colors`}
                  >
                    <Icon name={s.icon as "Globe"} size={14} className="mr-2" />
                    {s.label}
                  </Button>
                ))}
              </div>
            </div>

            <p className="text-center text-muted-foreground text-sm mt-4">
              Нет аккаунта?{" "}
              <button className="text-primary hover:underline" onClick={() => setActiveTab("register")}>
                Зарегистрироваться
              </button>
            </p>
          </TabsContent>

          {/* Register */}
          <TabsContent value="register" className="mt-4">
            <form onSubmit={handleRegister} className="space-y-3">
              <div>
                <Label className="text-muted-foreground text-sm mb-1.5 block">Имя</Label>
                <Input
                  type="text"
                  placeholder="Ваше имя"
                  value={registerData.name}
                  onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                  className="bg-background border-border text-white placeholder:text-muted-foreground"
                  required
                />
              </div>
              <div>
                <Label className="text-muted-foreground text-sm mb-1.5 block">Email</Label>
                <Input
                  type="email"
                  placeholder="example@mail.ru"
                  value={registerData.email}
                  onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                  className="bg-background border-border text-white placeholder:text-muted-foreground"
                  required
                />
              </div>
              <div>
                <Label className="text-muted-foreground text-sm mb-1.5 block">Телефон</Label>
                <Input
                  type="tel"
                  placeholder="+7 (999) 000-00-00"
                  value={registerData.phone}
                  onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                  className="bg-background border-border text-white placeholder:text-muted-foreground"
                />
              </div>
              <div>
                <Label className="text-muted-foreground text-sm mb-1.5 block">Пароль</Label>
                <Input
                  type="password"
                  placeholder="Минимум 8 символов"
                  value={registerData.password}
                  onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                  className="bg-background border-border text-white placeholder:text-muted-foreground"
                  required
                />
              </div>
              <div>
                <Label className="text-muted-foreground text-sm mb-1.5 block">Подтвердите пароль</Label>
                <Input
                  type="password"
                  placeholder="Повторите пароль"
                  value={registerData.confirm}
                  onChange={(e) => setRegisterData({ ...registerData, confirm: e.target.value })}
                  className="bg-background border-border text-white placeholder:text-muted-foreground"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-white mt-1"
                disabled={isLoading}
              >
                {isLoading ? (
                  <><Icon name="Loader2" size={16} className="mr-2 animate-spin" />Регистрируем...</>
                ) : "Создать аккаунт"}
              </Button>
              <p className="text-muted-foreground text-xs text-center">
                Регистрируясь, вы принимаете{" "}
                <a href="#" className="text-primary hover:underline">условия использования</a>
              </p>
            </form>

            <div className="mt-4">
              <div className="relative">
                <Separator className="bg-border" />
                <span className="absolute left-1/2 -translate-x-1/2 -top-2.5 bg-card px-2 text-muted-foreground text-xs">или через</span>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {socialButtons.map((s) => (
                  <Button
                    key={s.label}
                    type="button"
                    variant="outline"
                    size="sm"
                    className={`border-border text-white bg-transparent ${s.color} transition-colors`}
                  >
                    <Icon name={s.icon as "Globe"} size={14} className="mr-2" />
                    {s.label}
                  </Button>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}