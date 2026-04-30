import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import Icon from "@/components/ui/icon"
import { ADMIN_URL, getToken } from "@/lib/auth"

interface User {
  id: number
  email: string
  name: string
  role: string
  status: string
  subscription: string
  last_login_at: string | null
  created_at: string
}

const ROLE_LABELS: Record<string, string> = { owner: "Владелец", admin: "Админ", moderator: "Модератор", user: "Пользователь" }
const STATUS_COLOR: Record<string, string> = { active: "text-green-400 bg-green-500/10 border-green-500/20", blocked: "text-red-400 bg-red-500/10 border-red-500/20" }
const SUB_COLOR: Record<string, string> = { premium: "text-yellow-400", pro: "text-blue-400", basic: "text-muted-foreground", free: "text-muted-foreground" }

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [roleFilter, setRoleFilter] = useState("")
  const [selected, setSelected] = useState<User | null>(null)
  const [actionResult, setActionResult] = useState("")

  const load = async () => {
    setLoading(true)
    const token = getToken()
    const params = new URLSearchParams()
    if (search) params.set("search", search)
    if (statusFilter) params.set("status", statusFilter)
    if (roleFilter) params.set("role", roleFilter)
    const res = await fetch(`${ADMIN_URL}/users?${params}`, {
      headers: { "Authorization": `Bearer ${token}` }
    })
    const data = await res.json()
    setUsers(data.users || [])
    setTotal(data.total || 0)
    setLoading(false)
  }

  useEffect(() => { load() }, [search, statusFilter, roleFilter])

  const doAction = async (action: string, extra: Record<string, unknown> = {}) => {
    const token = getToken()
    const res = await fetch(`${ADMIN_URL}/user-action`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: selected?.id, action, ...extra })
    })
    const data = await res.json()
    if (data.new_password) {
      setActionResult(`Новый пароль: ${data.new_password}`)
    } else {
      setActionResult("Выполнено успешно")
      load()
      setSelected(null)
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white font-orbitron mb-1">Пользователи</h2>
          <p className="text-muted-foreground text-sm">Всего: {total}</p>
        </div>
      </div>

      <Card className="bg-card border-border">
        <CardContent className="pt-4 pb-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Icon name="Search" size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Поиск по email или имени..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9 bg-background border-border text-white placeholder:text-muted-foreground"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40 bg-background border-border text-white">
                <SelectValue placeholder="Статус" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Все статусы</SelectItem>
                <SelectItem value="active">Активные</SelectItem>
                <SelectItem value="blocked">Заблокированные</SelectItem>
              </SelectContent>
            </Select>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-40 bg-background border-border text-white">
                <SelectValue placeholder="Роль" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Все роли</SelectItem>
                <SelectItem value="owner">Владелец</SelectItem>
                <SelectItem value="admin">Админ</SelectItem>
                <SelectItem value="moderator">Модератор</SelectItem>
                <SelectItem value="user">Пользователь</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-4 py-3 text-muted-foreground text-xs font-medium">Пользователь</th>
                  <th className="text-left px-4 py-3 text-muted-foreground text-xs font-medium">Роль</th>
                  <th className="text-left px-4 py-3 text-muted-foreground text-xs font-medium">Статус</th>
                  <th className="text-left px-4 py-3 text-muted-foreground text-xs font-medium">Подписка</th>
                  <th className="text-left px-4 py-3 text-muted-foreground text-xs font-medium">Последний вход</th>
                  <th className="text-left px-4 py-3 text-muted-foreground text-xs font-medium">Действия</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} className="text-center text-muted-foreground py-12">
                    <Icon name="Loader2" size={20} className="animate-spin mx-auto" />
                  </td></tr>
                ) : users.length === 0 ? (
                  <tr><td colSpan={6} className="text-center text-muted-foreground py-12">Пользователи не найдены</td></tr>
                ) : users.map((u) => (
                  <tr key={u.id} className="border-b border-border/50 hover:bg-background/50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="text-white text-sm font-medium">{u.name || "—"}</p>
                      <p className="text-muted-foreground text-xs">{u.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-white text-sm">{ROLE_LABELS[u.role] || u.role}</span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className={`text-xs ${STATUS_COLOR[u.status] || "border-border text-muted-foreground"}`}>
                        {u.status === "active" ? "Активен" : "Заблокирован"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-sm font-medium ${SUB_COLOR[u.subscription] || "text-muted-foreground"}`}>
                        {u.subscription || "free"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">
                      {u.last_login_at ? new Date(u.last_login_at).toLocaleDateString("ru") : "Не входил"}
                    </td>
                    <td className="px-4 py-3">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-muted-foreground hover:text-white"
                        onClick={() => { setSelected(u); setActionResult("") }}
                      >
                        <Icon name="MoreHorizontal" size={16} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* User action dialog */}
      <Dialog open={!!selected} onOpenChange={() => { setSelected(null); setActionResult("") }}>
        <DialogContent className="bg-card border-border text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">Управление пользователем</DialogTitle>
            <DialogDescription className="text-muted-foreground text-sm">
              {selected?.email}
            </DialogDescription>
          </DialogHeader>
          {actionResult ? (
            <div className="space-y-4">
              <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 text-white text-sm font-mono">{actionResult}</div>
              <Button className="w-full bg-primary hover:bg-primary/90 text-white" onClick={() => { setSelected(null); setActionResult(""); load() }}>
                Закрыть
              </Button>
            </div>
          ) : (
            <div className="space-y-3 mt-2">
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-border text-white hover:border-primary"
                  onClick={() => doAction(selected?.status === "blocked" ? "unblock" : "block")}
                >
                  <Icon name={selected?.status === "blocked" ? "Unlock" : "Lock"} size={14} className="mr-2" />
                  {selected?.status === "blocked" ? "Разблокировать" : "Заблокировать"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-border text-white hover:border-primary"
                  onClick={() => doAction("reset_password")}
                >
                  <Icon name="Key" size={14} className="mr-2" />
                  Сбросить пароль
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-border text-white hover:border-primary"
                  onClick={() => doAction("force_logout")}
                >
                  <Icon name="LogOut" size={14} className="mr-2" />
                  Выйти из сессии
                </Button>
              </div>
              <div>
                <Label className="text-muted-foreground text-xs mb-1.5 block">Изменить роль</Label>
                <div className="flex gap-2">
                  {["user", "moderator", "admin"].map(r => (
                    <Button
                      key={r}
                      variant="outline"
                      size="sm"
                      className={`flex-1 border-border text-xs ${selected?.role === r ? "border-primary text-primary" : "text-white hover:border-primary"}`}
                      onClick={() => doAction("set_role", { role: r })}
                    >
                      {ROLE_LABELS[r]}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
