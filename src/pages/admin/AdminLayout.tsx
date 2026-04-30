import { useState, useEffect } from "react"
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import Icon from "@/components/ui/icon"
import { getUser, clearAuth, isAdmin } from "@/lib/auth"

const NAV = [
  { path: "/admin", label: "Дашборд", icon: "LayoutDashboard", exact: true },
  { path: "/admin/users", label: "Пользователи", icon: "Users" },
  { path: "/admin/activity", label: "Активность", icon: "Activity" },
  { path: "/admin/subscriptions", label: "Подписки", icon: "CreditCard" },
  { path: "/admin/finance", label: "Финансы", icon: "DollarSign" },
  { path: "/admin/content", label: "Контент и ИИ", icon: "Sparkles" },
  { path: "/admin/chat", label: "Чаты", icon: "MessageSquare" },
  { path: "/admin/tickets", label: "Техподдержка", icon: "LifeBuoy" },
  { path: "/admin/settings", label: "Настройки", icon: "Settings" },
  { path: "/admin/analytics", label: "Аналитика", icon: "BarChart3" },
]

export default function AdminLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const user = getUser()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    if (!user || !isAdmin(user)) {
      navigate("/")
    }
  }, [user, navigate])

  const handleLogout = () => {
    clearAuth()
    navigate("/")
  }

  const isActive = (path: string, exact?: boolean) =>
    exact ? location.pathname === path : location.pathname.startsWith(path)

  if (!user || !isAdmin(user)) return null

  return (
    <div className="dark min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? "w-64" : "w-16"} bg-card border-r border-border flex flex-col transition-all duration-200 flex-shrink-0`}>
        {/* Logo */}
        <div className="h-16 flex items-center px-4 border-b border-border gap-3">
          <Link to="/" className="flex items-center gap-2 flex-1 min-w-0">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
              <Icon name="Shield" size={16} className="text-white" />
            </div>
            {sidebarOpen && <span className="text-white font-orbitron font-bold text-sm truncate">Admin Panel</span>}
          </Link>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-muted-foreground hover:text-white flex-shrink-0">
            <Icon name={sidebarOpen ? "PanelLeftClose" : "PanelLeftOpen"} size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
          {NAV.map((item) => {
            const active = isActive(item.path, item.exact)
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group ${active ? "bg-primary text-white" : "text-muted-foreground hover:bg-background hover:text-white"}`}
                title={!sidebarOpen ? item.label : undefined}
              >
                <Icon name={item.icon as "Shield"} size={18} className="flex-shrink-0" />
                {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        {/* User */}
        <div className="p-3 border-t border-border">
          <div className={`flex items-center gap-3 ${!sidebarOpen ? "justify-center" : ""}`}>
            <Avatar className="h-8 w-8 flex-shrink-0">
              <AvatarFallback className="bg-primary/30 text-primary text-xs">
                {user.name?.split(" ").map((n: string) => n[0]).join("").slice(0, 2) || "AD"}
              </AvatarFallback>
            </Avatar>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-white text-xs font-medium truncate">{user.name || user.email}</p>
                <Badge className="bg-primary/20 text-primary border-primary/30 border text-xs mt-0.5">{user.role === "owner" ? "Владелец" : "Админ"}</Badge>
              </div>
            )}
            {sidebarOpen && (
              <button onClick={handleLogout} className="text-muted-foreground hover:text-red-400 flex-shrink-0">
                <Icon name="LogOut" size={16} />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-auto">
        <div className="h-14 bg-card border-b border-border flex items-center px-6 gap-4">
          <div className="flex-1">
            <h1 className="text-white font-semibold text-sm">
              {NAV.find(n => isActive(n.path, n.exact))?.label || "Admin"}
            </h1>
          </div>
          <Link to="/" className="text-muted-foreground hover:text-white text-sm flex items-center gap-1">
            <Icon name="ExternalLink" size={14} />На сайт
          </Link>
        </div>
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
