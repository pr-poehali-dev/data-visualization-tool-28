import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

const TERMS_SECTIONS = [
  {
    title: "1. Общие положения",
    items: [
      "1.1. Настоящее Пользовательское соглашение регулирует отношения между AIStudio (далее — «Сервис») и пользователем при использовании онлайн платформы для генерации контента.",
      "1.2. Используя Сервис, Пользователь подтверждает, что ознакомился с условиями Соглашения и принимает их в полном объёме.",
      "1.3. Сервис оставляет за собой право в одностороннем порядке вносить изменения в Соглашение. Продолжение использования Сервиса после публикации изменений означает принятие обновлённых условий.",
    ],
  },
  {
    title: "2. Предмет соглашения",
    items: [
      "2.1. Сервис предоставляет Пользователю доступ к инструментам генерации контента (текстов, изображений, аудио, видео и т. д.).",
      "2.2. Доступ предоставляется на платной/бесплатной основе в соответствии с выбранным тарифным планом.",
    ],
  },
  {
    title: "3. Обязанности пользователя",
    items: [
      "3.1. Создавать контент строго в рамках действующего законодательства РФ и норм общественной морали.",
      "3.2. Не использовать нецензурную лексику и грубые выражения.",
      "3.3. Не воспроизводить символику, запрещённую законодательством РФ (в т. ч. символику экстремистских и террористических организаций).",
      "3.4. Не генерировать контент с призывами к противоправным действиям, пропагандой экстремизма, побуждением к насилию или нарушению суверенитета РФ.",
      "3.5. Не распространять заведомо недостоверную информацию (фейки).",
      "3.6. Не нарушать права третьих лиц (авторские права, права на товарные знаки).",
      "3.7. Не предпринимать попыток обхода технических ограничений и систем модерации.",
    ],
  },
  {
    title: "4. Права сервиса",
    items: [
      "4.1. Осуществлять модерацию контента на предмет соответствия законодательству РФ.",
      "4.2. Блокировать доступ Пользователя при выявлении нарушений.",
      "4.3. Удалять запрещённый контент без предварительного уведомления.",
      "4.4. Отказывать в предоставлении услуг, если действия Пользователя создают риски для Сервиса.",
    ],
  },
  {
    title: "5. Ответственность сторон",
    items: [
      "5.1. Пользователь несёт полную ответственность за соблюдение законодательства РФ.",
      "5.2. Сервис не несёт ответственности за контент Пользователя, убытки от блокировки или технические сбои.",
      "5.3. При претензиях третьих лиц из-за действий Пользователя, Пользователь обязуется возместить все убытки, включая судебные издержки.",
    ],
  },
  {
    title: "6. Интеллектуальная собственность",
    items: [
      "6.1. Все права на программное обеспечение, алгоритмы и интерфейсы Сервиса принадлежат AIStudio.",
      "6.2. Права на сгенерированный контент регулируются выбранным тарифным планом.",
    ],
  },
  {
    title: "7. Порядок разрешения споров",
    items: [
      "7.1. Споры разрешаются путём переговоров между сторонами.",
      "7.2. При невозможности досудебного урегулирования — в суд по месту нахождения Сервиса.",
    ],
  },
  {
    title: "8. Заключительные положения",
    items: [
      "8.1. Соглашение составлено на русском языке и регулируется законодательством РФ.",
      "8.2. Вопросы, не урегулированные Соглашением, решаются в соответствии с законодательством РФ.",
    ],
  },
]

interface TermsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function TermsModal({ open, onOpenChange }: TermsModalProps) {
  const [accepted, setAccepted] = useState(false)

  const handleClose = () => {
    setAccepted(false)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border shrink-0">
          <DialogTitle className="text-xl font-bold">Пользовательское соглашение</DialogTitle>
          <p className="text-xs text-muted-foreground mt-1">Последнее обновление: 15 мая 2025 г.</p>
        </DialogHeader>

        {/* Прокручиваемый текст */}
        <div className="overflow-y-auto flex-1 px-6 py-4 space-y-6 text-sm leading-relaxed">
          {TERMS_SECTIONS.map((section) => (
            <section key={section.title}>
              <h3 className="font-semibold mb-2">{section.title}</h3>
              <div className="space-y-1.5">
                {section.items.map((item, i) => (
                  <p key={i} className="text-muted-foreground">{item}</p>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Галочка и кнопка */}
        <div className="px-6 py-4 border-t border-border shrink-0 space-y-4">
          <label className="flex items-start gap-3 cursor-pointer group">
            <Checkbox
              id="terms-accept"
              checked={accepted}
              onCheckedChange={(v) => setAccepted(!!v)}
              className="mt-0.5 shrink-0"
            />
            <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
              Я ознакомился с Пользовательским соглашением и принимаю его условия в полном объёме
            </span>
          </label>
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={handleClose}>Закрыть</Button>
            <Button disabled={!accepted} onClick={handleClose}>Принять</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
