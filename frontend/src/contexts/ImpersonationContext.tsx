import { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { Tenant } from '../types/tenant'

interface ImpersonationContextType {
  impersonatedTenant: Tenant | null
  impersonate: (tenant: Tenant) => void
  exitImpersonation: () => void
  isImpersonating: boolean
}

const ImpersonationContext = createContext<ImpersonationContextType | undefined>(undefined)

export function ImpersonationProvider({ children }: { children: ReactNode }) {
  const [impersonatedTenant, setImpersonatedTenant] = useState<Tenant | null>(null)

  // ページロード時にlocalStorageから復元
  useEffect(() => {
    const storedTenant = localStorage.getItem('impersonated_tenant')
    if (storedTenant) {
      try {
        setImpersonatedTenant(JSON.parse(storedTenant))
      } catch (e) {
        localStorage.removeItem('impersonated_tenant')
      }
    }
  }, [])

  const impersonate = (tenant: Tenant) => {
    setImpersonatedTenant(tenant)
    localStorage.setItem('impersonated_tenant', JSON.stringify(tenant))
    // ダッシュボードにリダイレクト
    window.location.href = '/'
  }

  const exitImpersonation = () => {
    setImpersonatedTenant(null)
    localStorage.removeItem('impersonated_tenant')
    // スーパー管理者画面に戻る
    window.location.href = '/superadmin/tenants'
  }

  return (
    <ImpersonationContext.Provider
      value={{
        impersonatedTenant,
        impersonate,
        exitImpersonation,
        isImpersonating: !!impersonatedTenant,
      }}
    >
      {children}
    </ImpersonationContext.Provider>
  )
}

export function useImpersonation() {
  const context = useContext(ImpersonationContext)
  if (!context) {
    throw new Error('useImpersonation must be used within ImpersonationProvider')
  }
  return context
}
