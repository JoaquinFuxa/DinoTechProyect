'use client'

import { FormEvent, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { isSupabaseConfigured } from '@/lib/supabase/env'
import { ArrowLeft, ArrowRight, Check, ChevronRight, Clock3, Gamepad2, Headphones, Laptop, MapPin, Monitor, Smartphone, Watch, Wrench } from 'lucide-react'

const WA = '5493518193051'
const devices = [
  ['Celular', Smartphone], ['Consola PlayStation', Gamepad2], ['Joystick/Control', Gamepad2], ['Notebook / PC', Laptop],
  ['Smartwatch', Watch], ['Proyector', Monitor], ['Parlante', Headphones], ['Otro', Wrench],
] as const

function Header() { return <header className="header service-header"><a href="/" className="logo" aria-label="DinoTech, inicio"><span>Dino</span><b>Tech</b><i>•</i></a><nav className="nav service-nav"><a href="/">Catálogo</a><a href="/#categorias">Categorías</a><a href="/#nosotros">Nosotros</a><a href="/#ubicacion">Encontranos</a></nav><a className="header-cta" href="/">Volver al inicio <ArrowLeft size={16} /></a></header> }
function Footer() { return <footer className="footer service-footer"><div><a href="/" className="logo"><span>Dino</span><b>Tech</b><i>•</i></a><p>La tecnología del futuro,<br />más cerca de vos.</p></div><div className="footer-links"><a href="/">Catálogo</a><a href="/#categorias">Categorías</a><a href="/#nosotros">Nosotros</a><a href="/#ubicacion">Ubicación</a></div><div className="footer-contact"><span>¿Preferís escribirnos directamente?</span><a href={`https://wa.me/${WA}`} target="_blank" rel="noreferrer">Escribinos por WhatsApp <ArrowRight size={15} /></a></div><div className="footer-bottom"><span>© 2024 DinoTech. Córdoba, Argentina.</span><span>Hecho para descubrir.</span></div></footer> }

export default function ServicePage() {
  const [device, setDevice] = useState('')
  const [other, setOther] = useState('')
  const [model, setModel] = useState('')
  const [description, setDescription] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const selectedDevice = device === 'Otro' ? other.trim() : device
  const phoneValid = !phone || /^(?:549?351|351)\d{6,8}$/.test(phone.replace(/[^\d]/g, ''))
  const canSend = Boolean(selectedDevice && description.trim().length >= 1 && name.trim().length >= 2 && phoneValid && !honeypot)
  const descriptionCount = description.length
  const message = useMemo(() => `Hola DinoTech! Quiero consultar por servicio técnico.\nDispositivo: ${selectedDevice}${model.trim() ? ` ${model.trim()}` : ''}\nDetalle: ${description.trim()}\nNombre: ${name.trim()}`, [selectedDevice, model, description, name])

  function submit(event: FormEvent) {
    event.preventDefault()
    if (!canSend) { setError('Completá los campos obligatorios para enviar la consulta.'); return }
    if (sessionStorage.getItem('dinotech-service-sent') === '1') { setError('Ya recibimos una consulta en esta sesión. Escribinos por WhatsApp si necesitás agregar algo.'); return }

    setError('')
    const whatsappUrl = `https://wa.me/${WA}?text=${encodeURIComponent(message)}`
    const whatsappWindow = window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
    if (!whatsappWindow) window.location.href = whatsappUrl
    sessionStorage.setItem('dinotech-service-sent', '1')
    setSent(true)

    if (!isSupabaseConfigured()) return

    try {
      const supabase = createClient()
      void Promise.race([
        supabase.from('service_requests').insert({ name: name.trim(), phone: phone.trim() || null, device_type: selectedDevice, brand_model: model.trim() || null, description: description.trim(), photos: [], status: 'nuevo' }),
        new Promise((resolve) => window.setTimeout(resolve, 5000)),
      ]).then((result) => {
        if (result && typeof result === 'object' && 'error' in result && result.error) console.error('[v0] No se pudo guardar la consulta en Supabase:', result.error)
      }).catch((saveError) => console.error('[v0] Error guardando la consulta en Supabase:', saveError))
    } catch (saveError) {
      console.error('[v0] Error guardando la consulta en Supabase:', saveError)
    }
  }
  if (sent) return <main className="site-shell service-page"><Header /><section className="service-success"><div className="success-icon"><Check /></div><p className="kicker">CONSULTA RECIBIDA</p><h1>¡Listo!<br /><em>Te abrimos WhatsApp.</em></h1><p>Seguimos la consulta con vos por WhatsApp para conocer mejor tu equipo y ayudarte más rápido.</p><div className="service-actions"><a className="btn-primary" href="/">Volver al inicio <ArrowRight size={17} /></a><button className="btn-outline" onClick={() => { sessionStorage.removeItem('dinotech-service-sent'); setSent(false); setDevice(''); setDescription(''); setName(''); }}>Enviar otra consulta</button></div></section><Footer /></main>
  return <main className="site-shell service-page"><Header /><div className="service-wrap"><div className="breadcrumb"><a href="/">Home</a><ChevronRight size={13} /> Servicio técnico</div><section className="service-hero"><p className="kicker">ASISTENCIA DINOTECH</p><h1>SERVICIO <em>TÉCNICO</em></h1><p>Contanos qué le pasa a tu equipo y te respondemos por WhatsApp.</p></section><div className="service-layout"><form className="service-form" onSubmit={submit} noValidate><div className="form-heading"><div><p className="kicker">01 / TU EQUIPO</p><h2>¿Qué necesitás reparar?</h2></div><span>Los campos con * son obligatorios</span></div><fieldset><legend>Tipo de dispositivo *</legend><div className="device-grid">{devices.map(([label, Icon]) => <button type="button" className={`device-option ${device === label ? 'selected' : ''}`} key={label} onClick={() => setDevice(label)} aria-pressed={device === label}><Icon /><span>{label}</span></button>)}</div>{device === 'Otro' && <input className="service-input other-input" value={other} onChange={e => setOther(e.target.value)} placeholder="¿Qué dispositivo es?" aria-label="Especificar dispositivo" />}</fieldset><div className="form-fields"><label>Marca y modelo <span>(opcional)</span><input className="service-input" value={model} onChange={e => setModel(e.target.value)} placeholder="Ej. Samsung A54 o PS5 slim" /></label><label>Nombre *<input className="service-input" value={name} onChange={e => setName(e.target.value)} placeholder="¿Cómo te llamamos?" required /></label><label>Teléfono <span>(opcional)</span><input className="service-input" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Ej. 351 819 3051" inputMode="tel" aria-invalid={Boolean(phone) && !phoneValid} />{phone && !phoneValid && <small className="field-error">Ingresá un teléfono de Córdoba válido.</small>}</label></div><label className="description-label">Descripción del problema *<textarea className="service-input" value={description} onChange={e => setDescription(e.target.value.slice(0, 3000))} placeholder="Contanos qué le pasa" rows={5} required /><span className="counter">{descriptionCount}/3000</span></label><label className="honeypot" aria-hidden="true">No completar<input tabIndex={-1} autoComplete="off" value={honeypot} onChange={e => setHoneypot(e.target.value)} /></label>{error && <p className="form-error" role="alert">{error}</p>}<button className="btn-primary form-submit" type="submit">Enviar consulta <ArrowRight size={17} /></button></form><aside className="service-info"><div className="info-mark"><Wrench /></div><p className="kicker">ESTAMOS PARA AYUDARTE</p><h2>Tu equipo,<br /><em>en buenas manos.</em></h2><p>Te orientamos para encontrar la mejor solución, con atención clara y sin vueltas.</p><div className="info-item"><Clock3 /><strong>Horarios</strong>Todos los días de 10 a 22 hs</div><div className="info-item"><MapPin /><strong>Encontranos</strong>Av. Fuerza Aérea Argentina 1700<br />Loc. 101, Córdoba</div><a className="btn-outline info-whatsapp" href={`https://wa.me/${WA}`} target="_blank" rel="noreferrer">Escribinos por WhatsApp <ArrowRight size={16} /></a></aside></div></div><Footer /></main>
}
