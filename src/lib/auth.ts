const TOKEN_KEY = "ai_studio_token"
const USER_KEY = "ai_studio_user"

export interface AuthUser {
  id: number
  email: string
  name: string
  role: string
  subscription?: string
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function getUser(): AuthUser | null {
  const raw = localStorage.getItem(USER_KEY)
  if (!raw) return null
  try { return JSON.parse(raw) } catch { return null }
}

export function saveAuth(token: string, user: AuthUser) {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

export function isAdmin(user: AuthUser | null): boolean {
  return user?.role === "admin" || user?.role === "owner"
}

export function authHeaders(): Record<string, string> {
  const token = getToken()
  return token ? { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" } : { "Content-Type": "application/json" }
}
