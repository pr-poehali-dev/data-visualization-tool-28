import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import Icon from "@/components/ui/icon"

export default function CookiePolicyPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <Button variant="ghost" className="mb-8 -ml-2" onClick={() => navigate(-1)}>
          <Icon name="ArrowLeft" size={16} className="mr-2" />
          Назад
        </Button>

        <h1 className="text-3xl font-bold mb-2">Политика использования файлов Cookie</h1>
        <p className="text-muted-foreground mb-10">Последнее обновление: 15 мая 2025 г.</p>

        <div className="space-y-8 text-sm leading-relaxed">

          <section>
            <h2 className="text-lg font-semibold mb-3">1. Что такое файлы cookie</h2>
            <p className="text-muted-foreground">
              Файлы cookie — это небольшие текстовые файлы, которые сохраняются на вашем устройстве (компьютере, телефоне или планшете) при посещении сайта AIStudio. Они помогают сайту работать корректно, запоминать ваши настройки и улучшать качество обслуживания.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">2. Какие файлы cookie мы используем</h2>
            <div className="space-y-4">

              <div className="border border-border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-green-500/20 text-green-400 text-xs px-2 py-0.5 rounded-full font-medium">Обязательные</span>
                </div>
                <h3 className="font-medium mb-1">Технические cookie</h3>
                <p className="text-muted-foreground">Необходимы для работы сайта. Обеспечивают авторизацию, сохранение сессии и базовую навигацию. Без них сайт не может функционировать. Не могут быть отключены.</p>
                <div className="mt-3 text-xs text-muted-foreground space-y-1">
                  <div className="flex justify-between"><span><code className="bg-muted px-1 rounded">auth_token</code></span><span>Токен авторизации пользователя</span><span>30 дней</span></div>
                  <div className="flex justify-between"><span><code className="bg-muted px-1 rounded">auth_user</code></span><span>Данные текущего пользователя</span><span>30 дней</span></div>
                  <div className="flex justify-between"><span><code className="bg-muted px-1 rounded">sidebar:state</code></span><span>Состояние боковой панели</span><span>7 дней</span></div>
                </div>
              </div>

              <div className="border border-border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-blue-500/20 text-blue-400 text-xs px-2 py-0.5 rounded-full font-medium">Функциональные</span>
                </div>
                <h3 className="font-medium mb-1">Настроечные cookie</h3>
                <p className="text-muted-foreground">Запоминают ваши предпочтения: язык интерфейса, тему оформления, настройки отображения контента.</p>
                <div className="mt-3 text-xs text-muted-foreground">
                  <div className="flex justify-between"><span><code className="bg-muted px-1 rounded">cookie_consent</code></span><span>Согласие с политикой cookie</span><span>1 год</span></div>
                </div>
              </div>

              <div className="border border-border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-yellow-500/20 text-yellow-400 text-xs px-2 py-0.5 rounded-full font-medium">Аналитические</span>
                </div>
                <h3 className="font-medium mb-1">Аналитические cookie</h3>
                <p className="text-muted-foreground">Помогают нам понимать, как пользователи взаимодействуют с сайтом: какие страницы посещают, как долго на них остаются. Данные используются только в агрегированном виде и не позволяют идентифицировать вас лично.</p>
              </div>

            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">3. Локальное хранилище (localStorage)</h2>
            <p className="text-muted-foreground">
              Помимо файлов cookie, AIStudio использует localStorage браузера для хранения токена авторизации и данных профиля. Эта информация хранится только на вашем устройстве и не передаётся третьим лицам.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">4. Сторонние cookie</h2>
            <p className="text-muted-foreground">
              При обработке платежей через сервис Robokassa на сайт могут устанавливаться cookie третьих сторон. Мы не контролируем эти файлы — ознакомьтесь с политикой конфиденциальности Robokassa на их официальном сайте.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">5. Управление файлами cookie</h2>
            <p className="text-muted-foreground mb-3">
              Вы можете управлять файлами cookie через настройки вашего браузера. Обратите внимание: отключение обязательных cookie может нарушить работу сайта, в том числе невозможность входа в аккаунт.
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
              <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="border border-border rounded px-3 py-2 hover:border-primary transition-colors flex items-center gap-2">
                <Icon name="ExternalLink" size={12} /> Google Chrome
              </a>
              <a href="https://support.mozilla.org/ru/kb/udalenie-kukov-i-dannyh-sajtov-v-firefox" target="_blank" rel="noopener noreferrer" className="border border-border rounded px-3 py-2 hover:border-primary transition-colors flex items-center gap-2">
                <Icon name="ExternalLink" size={12} /> Mozilla Firefox
              </a>
              <a href="https://support.apple.com/ru-ru/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="border border-border rounded px-3 py-2 hover:border-primary transition-colors flex items-center gap-2">
                <Icon name="ExternalLink" size={12} /> Safari
              </a>
              <a href="https://support.microsoft.com/ru-ru/microsoft-edge/удаление-файлов-cookie-в-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="border border-border rounded px-3 py-2 hover:border-primary transition-colors flex items-center gap-2">
                <Icon name="ExternalLink" size={12} /> Microsoft Edge
              </a>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">6. Изменения в политике</h2>
            <p className="text-muted-foreground">
              Мы можем обновлять настоящую политику. При существенных изменениях мы уведомим вас через сайт. Актуальная версия всегда доступна на этой странице.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">7. Контакты</h2>
            <p className="text-muted-foreground">
              Если у вас есть вопросы о нашей политике использования файлов cookie, свяжитесь с нами через раздел{" "}
              <button onClick={() => navigate("/support")} className="text-primary hover:underline">Поддержка</button>.
            </p>
          </section>

        </div>
      </div>
    </div>
  )
}
