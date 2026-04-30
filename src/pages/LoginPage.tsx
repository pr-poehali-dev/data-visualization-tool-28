import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Icon from "@/components/ui/icon"
import { AUTH_URL, saveAuth } from "@/lib/auth"

export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const res = await fetch(`${AUTH_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Ошибка входа")
        return
      }
      saveAuth(data.token, data.user)
      if (data.user.role === "owner" || data.user.role === "admin") {
        navigate("/admin")
      } else {
        navigate("/")
      }
    } catch {
      setError("Ошибка подключения к серверу")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="dark min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Link to="/" className="flex justify-center mb-8">
          <h1 className="font-orbitron text-2xl font-bold text-white">
            AI<span className="text-red-500"> Studio</span>
          </h1>
        </Link>

        <Card className="bg-card border-border">
          <CardHeader className="pb-4">
            <CardTitle className="text-white text-xl text-center">Вход в систему</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label className="text-muted-foreground text-sm mb-1.5 block">Email</Label>
                <Input
                  type="email"
                  placeholder="example@mail.ru"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-background border-border text-white placeholder:text-muted-foreground"
                  required
                  autoFocus
                />
              </div>
              <div>
                <Label className="text-muted-foreground text-sm mb-1.5 block">Пароль</Label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-background border-border text-white placeholder:text-muted-foreground"
                  required
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                  <Icon name="AlertCircle" size={14} />
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-white"
                disabled={loading}
              >
                {loading ? (
                  <><Icon name="Loader2" size={16} className="mr-2 animate-spin" />Входим...</>
                ) : "Войти"}
              </Button>
            </form>

            <div className="mt-4 pt-4 border-t border-border text-center">
              <Link to="/" className="text-muted-foreground text-sm hover:text-white transition-colors">
                ← Вернуться на сайт
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
