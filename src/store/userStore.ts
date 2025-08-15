import { create } from "zustand"

interface User { // opcional '?' apenas para teste, remover posteriormente
  name: string
  cpf?: string
  grad?: string
  roles?: string[]
  codPm?: number
  isAdmin: boolean
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean;
  login: (user: User, token: string) => void
  logout: () => void
}

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  login: (user, token) => set({ user, token, isAuthenticated: true }),
  logout: () => set({ user: null, token: null, isAuthenticated: false }),
}))

export default useAuthStore
