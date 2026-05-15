import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import Icon from "@/components/ui/icon"

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent")
    if (!consent) setVisible(true)
  }, [])

  const accept = () => {
    localStorage.setItem("cookie_consent", "accepted")
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <div className="max-w-4xl mx-auto bg-card border border-border rounded-xl shadow-xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <Icon name="Cookie" size={20} className="text-primary shrink-0 mt-0.5 sm:mt-0" />
        <p className="text-sm text-muted-foreground flex-1">
          Мы используем файлы cookie для корректной работы сайта и улучшения вашего опыта.{" "}
          <button
            onClick={() => navigate("/cookie-policy")}
            className="text-primary hover:underline"
          >
            Узнать подробнее
          </button>
        </p>
        <div className="flex gap-2 shrink-0">
          <Button size="sm" variant="outline" onClick={() => { localStorage.setItem("cookie_consent", "declined"); setVisible(false) }}>
            Отклонить
          </Button>
          <Button size="sm" onClick={accept}>
            Принять
          </Button>
        </div>
      </div>
    </div>
  )
}
