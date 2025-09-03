import { createContext, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import LoginModal from '../components/auth/LoginModal'
import RegisterModal from '../components/auth/RegisterModal'

type ModalCtx = {
  showLogin: () => void
  showRegister: () => void
}

const ModalContext = createContext<ModalCtx | undefined>(undefined)

export function ModalProvider({ children }: { children: ReactNode }) {
  const [loginOpen, setLoginOpen] = useState(false)
  const [registerOpen, setRegisterOpen] = useState(false)

  const value = useMemo<ModalCtx>(
    () => ({
      showLogin: () => setLoginOpen(true),
      showRegister: () => setRegisterOpen(true),
    }),
    []
  )

  return (
    <ModalContext.Provider value={value}>
      {children}
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} onSwitchRegister={() => { setLoginOpen(false); setRegisterOpen(true) }} />
      <RegisterModal open={registerOpen} onClose={() => setRegisterOpen(false)} onSwitchLogin={() => { setRegisterOpen(false); setLoginOpen(true) }} />
    </ModalContext.Provider>
  )
}

export function useModal() {
  const ctx = useContext(ModalContext)
  if (!ctx) throw new Error('useModal must be used within ModalProvider')
  return ctx
}

