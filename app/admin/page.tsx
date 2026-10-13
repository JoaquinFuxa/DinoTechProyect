import {
  Eye,
  MessageCircle,
  Package,
  ShoppingBag,
  TrendingUp,
  Users,
} from 'lucide-react'

const metrics = [
  { label: 'Visitas del mes', value: '12.480', delta: '+18%', icon: Eye },
  { label: 'Consultas WhatsApp', value: '326', delta: '+9%', icon: MessageCircle },
  { label: 'Productos activos', value: '48', delta: '+4', icon: Package },
  { label: 'Conversión estimada', value: '3.8%', delta: '+0.4%', icon: TrendingUp },
  { label: 'Clientes recurrentes', value: '214', delta: '+12%', icon: Users },
  { label: 'Ticket promedio', value: '$ 286.000', delta: '+6%', icon: ShoppingBag },
]

const topCategories = [
  { name: 'Celulares', sales: 42, share: 48 },
  { name: 'Consolas', sales: 27, share: 31 },
  { name: 'Accesorios', sales: 18, share: 21 },
]

const recentActivity = [
  { title: 'Consulta por iPhone 15 Pro Max', time: 'hace 12 min' },
  { title: 'Producto editado: PS5 Slim', time: 'hace 1 h' },
  { title: 'Nueva visita desde Instagram', time: 'hace 2 h' },
  { title: 'Consulta por HyperX Cloud III', time: 'hace 3 h' },
]

export default function AdminStatsPage() {
  return (
    <div className="admin-page">
      <header className="admin-page-head">
        <div>
          <p className="kicker">MÓDULO ESTADÍSTICAS</p>
          <h1>Resumen general</h1>
        </div>
        <span className="admin-pill">Datos mockeados</span>
      </header>

      <section className="admin-metrics">
        {metrics.map(({ label, value, delta, icon: Icon }) => (
          <article key={label} className="admin-metric-card">
            <div className="admin-metric-top">
              <Icon size={18} />
              <span>{delta}</span>
            </div>
            <strong>{value}</strong>
            <p>{label}</p>
          </article>
        ))}
      </section>

      <section className="admin-panels">
        <article className="admin-panel">
          <h2>Categorías más consultadas</h2>
          <ul className="admin-bars">
            {topCategories.map((item) => (
              <li key={item.name}>
                <div>
                  <strong>{item.name}</strong>
                  <span>{item.sales} consultas</span>
                </div>
                <div className="admin-bar-track">
                  <i style={{ width: `${item.share}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </article>

        <article className="admin-panel">
          <h2>Actividad reciente</h2>
          <ul className="admin-activity">
            {recentActivity.map((item) => (
              <li key={item.title}>
                <strong>{item.title}</strong>
                <span>{item.time}</span>
              </li>
            ))}
          </ul>
        </article>
      </section>
    </div>
  )
}
