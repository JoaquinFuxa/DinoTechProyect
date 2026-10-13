import { Suspense } from 'react'

export default function AdminLoginLayout({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<main className="admin-login-page">Cargando...</main>}>{children}</Suspense>
}
