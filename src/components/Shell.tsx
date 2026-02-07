import { ReactNode, useMemo, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { Bell, LayoutDashboard, Settings, Users, Search, Sparkles } from 'lucide-react'
import Toast from './Toast'

type Props = { children: ReactNode }

export default function Shell({ children }: Props) {
  const [toast, setToast] = useState<{ title: string; detail: string } | null>(null)
  const loc = useLocation()

  const pageTitle = useMemo(() => {
    if (loc.pathname.startsWith('/customers')) return 'Customers'
    if (loc.pathname.startsWith('/settings')) return 'Settings'
    return 'Dashboard'
  }, [loc.pathname])

  return (
    <div className="container">
      <div className="shell">
        <aside className="panel sidebar" aria-label="Sidebar">
          <div className="brand">
            <div className="brandLeft">
              <div className="logoMark" aria-hidden="true" />
              <div className="brandText">
                <strong>OrbitSuite</strong>
                <span>Revenue console</span>
              </div>
            </div>
            <button
              className="iconBtn"
              onClick={() => setToast({ title: 'Notifications', detail: 'All caught up. No critical alerts.' })}
              aria-label="Open notifications"
            >
              <Bell size={18} />
            </button>
          </div>

          <nav className="nav">
            <NavLink to="/" end data-active={loc.pathname === '/'}>
              <LayoutDashboard size={18} />
              Overview
              <span className="badge">Live</span>
            </NavLink>

            <NavLink to="/customers" data-active={loc.pathname.startsWith('/customers')}>
              <Users size={18} />
              Customers
              <span className="badge">15</span>
            </NavLink>

            <NavLink to="/settings" data-active={loc.pathname.startsWith('/settings')}>
              <Settings size={18} />
              Settings
            </NavLink>
          </nav>

          <div style={{ marginTop: 14 }} className="panel card">
            <div className="cardHeader">
              <h3 style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <Sparkles size={16} /> Quick action
              </h3>
              <span>1-click</span>
            </div>
            <div className="hr" />
            <button
              className="pill"
              onClick={() => setToast({ title: 'Report generated', detail: 'A fresh executive summary is ready.' })}
              style={{ width: '100%' }}
            >
              Generate weekly report
            </button>
          </div>
        </aside>

        <main className="panel main" aria-label="Main content">
          <header className="panel topbar">
            <div className="titleRow">
              <div className="kicker">Tealeats</div>
              <h1 className="h1">{pageTitle}</h1>
              <div className="sub">Eat. laugh. teal</div>
            </div>

            <div className="searchRow">
              <div className="search" role="search">
                <Search size={18} color="rgba(232,233,255,.65)" />
                <input
                  placeholder="Search invoices, customers, IDs…"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const v = (e.target as HTMLInputElement).value.trim()
                      setToast({
                        title: v ? `Search: “${v}”` : 'Search',
                        detail: v ? 'Demo UI only. Wire this to your API in minutes.' : 'Type something and press Enter.',
                      })
                    }
                  }}
                  aria-label="Search"
                />
              </div>
              <button
                className="pill"
                onClick={() => setToast({ title: 'Synced', detail: 'Your dashboard is up to date.' })}
              >
                Refresh
              </button>
            </div>
          </header>

          {children}

          {toast && <Toast title={toast.title} detail={toast.detail} onClose={() => setToast(null)} />}
        </main>
      </div>
    </div>
  )
}
