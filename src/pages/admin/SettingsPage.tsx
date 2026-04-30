import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import Icon from "@/components/ui/icon"

export default function SettingsPage() {
  const [siteName, setSiteName] = useState("AI Studio")
  const [siteEmail, setSiteEmail] = useState("support@aistudio.ru")
  const [twoFactor, setTwoFactor] = useState(false)
  const [loginLimit, setLoginLimit] = useState("10")
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const [rules, setRules] = useState("1. Запрещено создавать контент 18+\n2. Запрещен спам\n3. Соблюдайте авторские права")
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-2xl font-bold text-white font-orbitron">Системные настройки</h2>
        <p className="text-muted-foreground text-sm mt-1">Общие параметры сайта и безопасность</p>
      </div>

      {saved && <div className="bg-green-500/20 border border-green-500/30 text-green-400 px-4 py-2 rounded-lg text-sm">Настройки сохранены</div>}

      {/* General */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-base flex items-center gap-2">
            <Icon name="Globe" size={16} className="text-primary" />
            Общие настройки
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-muted-foreground text-sm mb-1.5 block">Название сайта</Label>
            <Input value={siteName} onChange={e => setSiteName(e.target.value)} className="bg-background border-border text-white" />
          </div>
          <div>
            <Label className="text-muted-foreground text-sm mb-1.5 block">Email поддержки</Label>
            <Input value={siteEmail} onChange={e => setSiteEmail(e.target.value)} type="email" className="bg-background border-border text-white" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-white text-sm">Режим обслуживания</Label>
              <p className="text-muted-foreground text-xs">Сайт будет недоступен для пользователей</p>
            </div>
            <Switch checked={maintenanceMode} onCheckedChange={setMaintenanceMode} />
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-base flex items-center gap-2">
            <Icon name="Shield" size={16} className="text-primary" />
            Безопасность
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-white text-sm">Двухфакторная аутентификация</Label>
              <p className="text-muted-foreground text-xs">Обязательная 2FA для всех администраторов</p>
            </div>
            <Switch checked={twoFactor} onCheckedChange={setTwoFactor} />
          </div>
          <div>
            <Label className="text-muted-foreground text-sm mb-1.5 block">Лимит попыток входа</Label>
            <Input value={loginLimit} onChange={e => setLoginLimit(e.target.value)} type="number" className="bg-background border-border text-white w-32" />
          </div>
        </CardContent>
      </Card>

      {/* Rules */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-base flex items-center gap-2">
            <Icon name="FileText" size={16} className="text-primary" />
            Правила использования
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea value={rules} onChange={e => setRules(e.target.value)} rows={6} className="bg-background border-border text-white resize-none" />
        </CardContent>
      </Card>

      {/* Backups */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-base flex items-center gap-2">
            <Icon name="Database" size={16} className="text-primary" />
            Резервные копии
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: "backup_2025-04-30.sql", size: "124 МБ", date: "Сегодня 03:00" },
              { name: "backup_2025-04-29.sql", size: "121 МБ", date: "Вчера 03:00" },
              { name: "backup_2025-04-28.sql", size: "118 МБ", date: "28 апр 03:00" },
            ].map((b, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-background border border-border">
                <Icon name="HardDrive" size={16} className="text-primary flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-white text-sm">{b.name}</p>
                  <p className="text-muted-foreground text-xs">{b.size} • {b.date}</p>
                </div>
                <Button size="sm" variant="ghost" className="text-muted-foreground hover:text-white">
                  <Icon name="Download" size={13} />
                </Button>
              </div>
            ))}
            <Button variant="outline" size="sm" className="w-full border-border text-white hover:border-primary bg-transparent">
              <Icon name="Plus" size={14} className="mr-2" />Создать резервную копию
            </Button>
          </div>
        </CardContent>
      </Card>

      <Button className="bg-primary hover:bg-primary/90 text-white" onClick={handleSave}>
        <Icon name="Save" size={16} className="mr-2" />Сохранить изменения
      </Button>
    </div>
  )
}
