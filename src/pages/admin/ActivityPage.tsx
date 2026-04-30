import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Icon from "@/components/ui/icon"
import { ADMIN_URL, getToken } from "@/lib/auth"

interface LogEntry {
  id: number
  user_id: number | null
  email: string | null
  action: string
  details: string | null
  ip: string | null
  created_at: string
}

const ACTION_COLOR: Record<string, string> = {
  login: "text-green-400 bg-green-500/10 border-green-500/20",
  register: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  admin_block: "text-red-400 bg-red-500/10 border-red-500/20",
  admin_reset_password: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
  account_created: "text-purple-400 bg-purple-500/10 border-purple-500/20",
}

export default function ActivityPage() {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    const token = getToken()
    fetch(`${ADMIN_URL}/activity?limit=200`, {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(d => setLogs(d.logs || []))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white font-orbitron mb-1">Журнал активности</h2>
          <p className="text-muted-foreground text-sm">Все действия пользователей и администраторов</p>
        </div>
        <Button variant="outline" size="sm" className="border-border text-white hover:border-primary" onClick={load}>
          <Icon name="RefreshCw" size={14} className="mr-2" />Обновить
        </Button>
      </div>

      <Card className="bg-card border-border">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-4 py-3 text-muted-foreground text-xs">Пользователь</th>
                  <th className="text-left px-4 py-3 text-muted-foreground text-xs">Действие</th>
                  <th className="text-left px-4 py-3 text-muted-foreground text-xs">Детали</th>
                  <th className="text-left px-4 py-3 text-muted-foreground text-xs">IP</th>
                  <th className="text-left px-4 py-3 text-muted-foreground text-xs">Время</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={5} className="text-center py-12">
                    <Icon name="Loader2" size={20} className="animate-spin mx-auto text-muted-foreground" />
                  </td></tr>
                ) : logs.length === 0 ? (
                  <tr><td colSpan={5} className="text-center text-muted-foreground py-12">Действий пока нет</td></tr>
                ) : logs.map((l) => (
                  <tr key={l.id} className="border-b border-border/40 hover:bg-background/40">
                    <td className="px-4 py-2.5 text-white text-sm">{l.email || `id:${l.user_id}`}</td>
                    <td className="px-4 py-2.5">
                      <Badge variant="outline" className={`text-xs ${ACTION_COLOR[l.action] || "border-border text-muted-foreground"}`}>
                        {l.action}
                      </Badge>
                    </td>
                    <td className="px-4 py-2.5 text-muted-foreground text-xs max-w-xs truncate">{l.details || "—"}</td>
                    <td className="px-4 py-2.5 text-muted-foreground text-xs">{l.ip || "—"}</td>
                    <td className="px-4 py-2.5 text-muted-foreground text-xs">
                      {new Date(l.created_at).toLocaleString("ru")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
