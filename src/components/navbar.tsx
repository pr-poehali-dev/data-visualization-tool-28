import { useState } from "react"
import { Button } from "@/components/ui/button"
import Icon from "@/components/ui/icon"
import { Link, useLocation } from "react-router-dom"
import { AuthModal } from "@/components/auth-modal"

const TOOLS = [
  { label: "Музыка", path: "/music", icon: "Music" },
  { label: "Видео", path: "/video", icon: "Video" },
  { label: "Фото", path: "/photo", icon: "Image" },
  { label: "Тексты", path: "/text", icon: "FileText" },
  { label: "Джинглы", path: "/jingle", icon: "Radio" },
]

const NAV_LINKS = [
  { label: "Сообщество", path: "/community" },
  { label: "Коллаборации", path: "/collab" },
  { label: "Обучение", path: "/learn" },
  { label: "Чат", path: "/chat" },
  { label: "Тарифы", path: "/pricing" },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [toolsOpen, setToolsOpen] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  const location = useLocation()

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[9999] bg-black/95 backdrop-blur-md border-b border-red-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0">
              <h1 className="font-orbitron text-xl font-bold text-white">
                AI<span className="text-red-500"> Studio</span>
              </h1>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-5">
              {/* Tools dropdown */}
              <div className="relative">
                <button
                  className="font-geist text-white hover:text-red-500 transition-colors duration-200 flex items-center gap-1"
                  onMouseEnter={() => setToolsOpen(true)}
                  onMouseLeave={() => setToolsOpen(false)}
                >
                  Инструменты
                  <Icon name="ChevronDown" size={14} />
                </button>
                {toolsOpen && (
                  <div
                    className="absolute top-full left-0 mt-1 bg-black/98 border border-red-500/20 rounded-lg py-2 min-w-[160px] shadow-xl"
                    onMouseEnter={() => setToolsOpen(true)}
                    onMouseLeave={() => setToolsOpen(false)}
                  >
                    {TOOLS.map((t) => (
                      <Link
                        key={t.path}
                        to={t.path}
                        className="flex items-center gap-2 px-4 py-2 text-white hover:text-red-500 hover:bg-red-500/10 transition-colors text-sm"
                      >
                        <Icon name={t.icon as "Music"} size={14} className="text-red-500" />
                        {t.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {NAV_LINKS.map((l) => (
                <Link
                  key={l.path}
                  to={l.path}
                  className={`font-geist text-sm transition-colors duration-200 ${location.pathname === l.path ? "text-red-500" : "text-white hover:text-red-500"}`}
                >
                  {l.label}
                </Link>
              ))}
            </div>

            {/* CTA Button */}
            <div className="hidden lg:flex items-center gap-3">
              <Button
                variant="ghost"
                className="text-white hover:text-red-500 font-geist"
                onClick={() => setAuthOpen(true)}
              >
                Войти
              </Button>
              <Button
                className="bg-red-500 hover:bg-red-600 text-white font-geist border-0"
                onClick={() => setAuthOpen(true)}
              >
                Начать бесплатно
              </Button>
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-white hover:text-red-500 transition-colors duration-200"
              >
                <Icon name={isOpen ? "X" : "Menu"} size={24} />
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isOpen && (
            <div className="lg:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 bg-black/98 border-t border-red-500/20">
                <p className="px-3 py-1 text-red-500 text-xs font-semibold uppercase tracking-wider">Инструменты</p>
                {TOOLS.map((t) => (
                  <Link
                    key={t.path}
                    to={t.path}
                    className="flex items-center gap-2 px-3 py-2 font-geist text-white hover:text-red-500 transition-colors duration-200 text-sm"
                    onClick={() => setIsOpen(false)}
                  >
                    <Icon name={t.icon as "Music"} size={14} className="text-red-500" />
                    {t.label}
                  </Link>
                ))}
                <div className="border-t border-red-500/20 mt-2 pt-2">
                  {NAV_LINKS.map((l) => (
                    <Link
                      key={l.path}
                      to={l.path}
                      className="block px-3 py-2 font-geist text-white hover:text-red-500 transition-colors duration-200"
                      onClick={() => setIsOpen(false)}
                    >
                      {l.label}
                    </Link>
                  ))}
                </div>
                <div className="px-3 py-2 flex flex-col gap-2">
                  <Button
                    variant="outline"
                    className="w-full border-border text-white font-geist bg-transparent"
                    onClick={() => { setAuthOpen(true); setIsOpen(false) }}
                  >
                    Войти
                  </Button>
                  <Button
                    className="w-full bg-red-500 hover:bg-red-600 text-white font-geist border-0"
                    onClick={() => { setAuthOpen(true); setIsOpen(false) }}
                  >
                    Начать бесплатно
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
    </>
  )
}
