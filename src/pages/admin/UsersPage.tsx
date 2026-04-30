import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import Icon from "@/components/ui/icon"

const MOCK_USERS = [
  { id: 1, email: "elenalazareva88@yandex.ru", name: "Elena Lazareva", role: "owner", status: "active", subscription: "premium", last_login_at: "2025-04-30 12:00", created_at: "2025-04-01" },
  { id: 2, email: "ivan@mail.ru", name: "Иван Петров", role: "user", status: "active", subscription: "pro", last_login_at: "2025-04-30 11:30", created_at: "2025-03-15" },
  { id: 3, email: "anna@gmail.com", name: "Анна Кузнецова", role: "user", status: "active", subscription: "basic", last_login_at: "2025-04-29 20:00", created_at: "2025-02-20" },
  { id: 4, email: "dmitry@yandex.ru", name: "Дмитрий Сидоров", role: "moderator", status: "active", subscription: "pro", last_login_at: "2025-04-30 09:00", created_at: "2025-01-10" },
  { id: 5, email: "olga@mail.ru", name: "Ольга Нова", role: "user", status: "blocked", subscription: "free", last_login_at: "2025-04-20 15:00", created_at: "2025-03-01" },
]

type User = typeof MOCK_USERS[0]

const roleColor = (role: string) => {
  if (role === "owner") return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
  if (role === "admin") return "bg-red-500/20 text-red-400 border-red-500/30"
  if (role === "moderator") return "bg-blue-500/20 text-blue-400 border-blue-500/30"
  return "bg-muted text-muted-foreground border-border"
}

const roleLabel = (role: string) => ({ owner: "Владелец", admin: "Админ", moderator: "Модератор", user: "Пользователь" }[role] || role)
const statusColor = (s: string) => s === "active" ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-red-500/20 text-red-400 border-red-500/30"
const subColor = (s: string) => s === "premium" ? "bg-yellow-500/20 text-yellow-400" : s === "pro" ? "bg-purple-500/20 text-purple-400" : s === "basic" ? "bg-blue-500/20 text-blue-400" : "bg-muted text-muted-foreground"

export default function UsersPage() {
  const [users, setUsers] = useState(MOCK_USERS)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [roleFilter, setRoleFilter] = useState("all")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [actionMsg, setActionMsg] = useState("")

  const filtered = users.filter(u =>
    (statusFilter === "all" || u.status === statusFilter) &&
    (roleFilter === "all" || u.role === roleFilter) &&
    (u.email.toLowerCase().includes(search.toLowerCase()) || u.name.toLowerCase().includes(search.toLowerCase()))
  )

  const doAction = (action: string, userId: number) => {
    setUsers(prev => prev.map(u => {
      if (u.id !== userId) return u
      if (action === "block") return { ...u, status: "blocked" }
      if (action === "unblock") return { ...u, status: "active" }
      return u
    }))
    setActionMsg(`Действие "${action}" применено`)
    setTimeout(() => setActionMsg(""), 2000)
  }

  const setRole = (userId: number, role: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role } : u))
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white font-orbitron">Пользователи</h2>
          <p className="text-muted-foreground text-sm mt-1">{users.length} зарегистрировано</p>
        </div>
      </div>

      {actionMsg && (
        <div className="bg-green-500/20 border border-green-500/30 text-green-400 px-4 py-2 rounded-lg text-sm">{actionMsg}</div>
      )}

      {/* Filters */}
      <Card className="bg-card border-border">
        <CardContent className="pt-4 pb-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Icon name="Search" size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Поиск по email или имени..." value={search} onChange={e => setSearch(e.target.value)}
                className="pl-9 bg-background border-border text-white placeholder:text-muted-foreground" />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40 bg-background border-border text-white">
                <SelectValue placeholder="Статус" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все статусы</SelectItem>
                <SelectItem value="active">Активные</SelectItem>
                <SelectItem value="blocked">Заблокированные</SelectItem>
              </SelectContent>
            </Select>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-44 bg-background border-border text-white">
                <SelectValue placeholder="Роль" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все роли</SelectItem>
                <SelectItem value="owner">Владелец</SelectItem>
                <SelectItem value="admin">Админ</SelectItem>
                <SelectItem value="moderator">Модератор</SelectItem>
                <SelectItem value="user">Пользователь</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="bg-card border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-background/50">
                <th className="text-left px-4 py-3 text-muted-foreground text-xs font-medium">Пользователь</th>
                <th className="text-left px-4 py-3 text-muted-foreground text-xs font-medium">Роль</th>
                <th className="text-left px-4 py-3 text-muted-foreground text-xs font-medium">Статус</th>
                <th className="text-left px-4 py-3 text-muted-foreground text-xs font-medium">Подписка</th>
                <th className="text-left px-4 py-3 text-muted-foreground text-xs font-medium">Последний вход</th>
                <th className="text-left px-4 py-3 text-muted-foreground text-xs font-medium">Действия</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id} className="border-b border-border/50 hover:bg-background/30 transition-colors">
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-white text-sm font-medium">{u.name}</p>
                      <p className="text-muted-foreground text-xs">{u.email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className={`text-xs ${roleColor(u.role)}`}>{roleLabel(u.role)}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className={`text-xs ${statusColor(u.status)}`}>
                      {u.status === "active" ? "Активен" : "Заблокирован"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className={`text-xs ${subColor(u.subscription)}`}>{u.subscription}</Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">{u.last_login_at || "—"}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" className="h-7 px-2 text-muted-foreground hover:text-white" onClick={() => setSelectedUser(u)}>
                        <Icon name="Eye" size={13} />
                      </Button>
                      {u.status === "active" ? (
                        <Button size="sm" variant="ghost" className="h-7 px-2 text-muted-foreground hover:text-red-400" onClick={() => doAction("block", u.id)}>
                          <Icon name="UserX" size={13} />
                        </Button>
                      ) : (
                        <Button size="sm" variant="ghost" className="h-7 px-2 text-muted-foreground hover:text-green-400" onClick={() => doAction("unblock", u.id)}>
                          <Icon name="UserCheck" size={13} />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* User detail dialog */}
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="bg-card border-border text-white max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-white">Детали пользователя</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                {[
                  ["Email", selectedUser.email],
                  ["Имя", selectedUser.name],
                  ["Роль", roleLabel(selectedUser.role)],
                  ["Статус", selectedUser.status === "active" ? "Активен" : "Заблокирован"],
                  ["Подписка", selectedUser.subscription],
                  ["Регистрация", selectedUser.created_at],
                  ["Последний вход", selectedUser.last_login_at || "—"],
                ].map(([k, v]) => (
                  <div key={k}>
                    <Label className="text-muted-foreground text-xs">{k}</Label>
                    <p className="text-white mt-0.5">{v}</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-border pt-4">
                <Label className="text-muted-foreground text-xs mb-2 block">Изменить роль</Label>
                <Select value={selectedUser.role} onValueChange={(val) => { setRole(selectedUser.id, val); setSelectedUser({ ...selectedUser, role: val }) }}>
                  <SelectTrigger className="bg-background border-border text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">Пользователь</SelectItem>
                    <SelectItem value="moderator">Модератор</SelectItem>
                    <SelectItem value="admin">Админ</SelectItem>
                    <SelectItem value="owner">Владелец</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                {selectedUser.status === "active" ? (
                  <Button variant="destructive" size="sm" onClick={() => { doAction("block", selectedUser.id); setSelectedUser(null) }}>
                    <Icon name="UserX" size={14} className="mr-2" />Заблокировать
                  </Button>
                ) : (
                  <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => { doAction("unblock", selectedUser.id); setSelectedUser(null) }}>
                    <Icon name="UserCheck" size={14} className="mr-2" />Разблокировать
                  </Button>
                )}
                <Button variant="outline" size="sm" className="border-border text-white hover:border-primary">
                  <Icon name="Key" size={14} className="mr-2" />Сбросить пароль
                </Button>
                <Button variant="outline" size="sm" className="border-border text-white hover:border-primary">
                  <Icon name="LogOut" size={14} className="mr-2" />Выйти из сессий
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
