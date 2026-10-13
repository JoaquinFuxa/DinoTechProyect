'use client'

import { FormEvent, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { isSupabaseConfigured } from '@/lib/supabase/env'

export default function AdminLoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    setError('')

    if (!isSupabaseConfigured()) {
      setError('Supabase no está configurado en este entorno.')
      return
    }

    setLoading(true)
    try {
      const supabase = createClient()
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })

      if (signInError) {
        setError('Credenciales inválidas. Revisá email y contraseña.')
        setLoading(false)
        return
      }

      const next = searchParams.get('next') || '/admin'
      router.replace(next.startsWith('/admin') ? next : '/admin')
      router.refresh()
    } catch {
      setError('No se pudo iniciar sesión. Intentá de nuevo.')
      setLoading(false)
    }
  }

  return (
    <main className="admin-login-page">
      <form className="admin-login-card" onSubmit={onSubmit}>
        <a href="/" className="logo" aria-label="DinoTech">
          <span>Dino</span>
          <b>Tech</b>
          <i>•</i>
        </a>
        <p className="kicker">PANEL ADMINISTRACIÓN</p>
        <h1>Ingresá al panel</h1>
        <p className="admin-login-copy">Acceso exclusivo para administrar el catálogo.</p>

        <label>
          Email
          <input
            className="service-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@dinotech.com"
            required
            autoComplete="username"
          />
        </label>
        <label>
          Contraseña
          <input
            className="service-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            autoComplete="current-password"
          />
        </label>

        {error ? (
          <p className="form-error" role="alert">
            {error}
          </p>
        ) : null}

        <button className="btn-primary form-submit" type="submit" disabled={loading}>
          {loading ? 'Ingresando...' : 'Iniciar sesión'} <ArrowRight size={16} />
        </button>
      </form>
    </main>
  )
}
