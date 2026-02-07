import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchCustomers } from '../services/api'

type Health = 'Excellent' | 'Good' | 'At Risk'

function healthDot(h: Health) {
  if (h === 'Excellent') return 'dotGood'
  if (h === 'Good') return 'dotWarn'
  return 'dotBad'
}

export default function Customers() {
  const { data, isLoading } = useQuery({
    queryKey: ['customers'],
    queryFn: fetchCustomers,
  })
  const [q, setQ] = useState('')

  const list = useMemo(() => {
    const rows = data ?? []
    const term = q.trim().toLowerCase()
    if (!term) return rows
    return rows.filter((r) => r.name.toLowerCase().includes(term) || r.email.toLowerCase().includes(term))
  }, [data, q])

  return (
    <section className="panel card">
      <div className="cardHeader">
        <h3>Customers</h3>
        <span>{isLoading ? 'Loading…' : `${list.length} shown`}</span>
      </div>
      <div className="hr" />

      <div className="tableTools">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search customers…"
          className="select"
          style={{ minWidth: 260 }}
          aria-label="Search customers"
        />
        <div className="mini">Demo dataset. Hook this up to your CRM API for a real build.</div>
      </div>

      <div className="tableWrap">
        <table style={{ minWidth: 760 }}>
          <thead>
            <tr>
              <th>Customer</th>
              <th>Plan</th>
              <th>Seats</th>
              <th>Health</th>
              <th>ID</th>
            </tr>
          </thead>
          <tbody>
            {(list ?? []).map((c) => (
              <tr key={c.id} className="rowHover">
                <td>
                  <div style={{ fontWeight: 650 }}>{c.name}</div>
                  <div className="mini">{c.email}</div>
                </td>
                <td><span className="tag">{c.plan}</span></td>
                <td style={{ fontWeight: 650 }}>{c.seats}</td>
                <td>
                  <span className="tag">
                    <span className={`tagDot ${healthDot(c.health as Health)}`} />
                    {c.health}
                  </span>
                </td>
                <td className="mini">{c.id}</td>
              </tr>
            ))}
            {isLoading && (
              <tr>
                <td colSpan={5} className="mini" style={{ padding: 18 }}>
                  Loading customers…
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}
