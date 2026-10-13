'use client'

import { usePathname, useRouter } from 'next/navigation'
import { BarChart3, LogOut, Package } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const links = [
  { href: '/admin', label: 'Estadísticas', icon: BarChart3 },
  { href: '/admin/catalogo', label: 'Catálogo', icon: Package },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  async function logout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.replace('/admin/login')
    router.refresh()
  }

  return (
    <aside className="admin-sidebar">
      <a href="/" className="logo">
        <span>Dino</span>
        <b>Tech</b>
        <i>•</i>
      </a>
      <p className="admin-sidebar-label">Administración</p>
      <nav>
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href
          return (
            <a key={href} href={href} className={`admin-nav-link ${active ? 'active' : ''}`}>
              <Icon size={18} />
              {label}
            </a>
          )
        })}
      </nav>
      <button type="button" className="admin-logout" onClick={logout}>
        <LogOut size={16} />
        Cerrar sesión
      </button>
    </aside>
  )
}
