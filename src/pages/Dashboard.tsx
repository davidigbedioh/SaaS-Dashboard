import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { fetchDashboard, type Invoice, type InvoiceStatus } from '../services/api'
import { formatMoney, formatPct } from '../utils/format'

type SortKey = 'issued' | 'customer' | 'amount' | 'status'
type SortDir = 'asc' | 'desc'

function statusDot(status: InvoiceStatus) {
  if (status === 'Paid') return 'dotGood'
  if (status === 'Pending') return 'dotWarn'
  return 'dotBad'
}

export default function Dashboard() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['dashboard'],
    queryFn: fetchDashboard,
  })

  const [status, setStatus] = useState<InvoiceStatus | 'All'>('All')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [sortKey, setSortKey] = useState<SortKey>('issued')
  const [sortDir, setSortDir] = useState<SortDir>('desc')

  const invoices = data?.invoices ?? []

  const filtered = useMemo(() => {
    const byStatus = status === 'All' ? invoices : invoices.filter((i) => i.status === status)
    const sorted = [...byStatus].sort((a, b) => {
      const dir = sortDir === 'asc' ? 1 : -1
      const av = a[sortKey]
      const bv = b[sortKey]
      if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * dir
      return String(av).localeCompare(String(bv)) * dir
    })
    return sorted
  }, [invoices, status, sortKey, sortDir])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const pageSafe = Math.min(page, totalPages)
  const pageItems = filtered.slice((pageSafe - 1) * pageSize, pageSafe * pageSize)

  function toggleSort(k: SortKey) {
    if (k === sortKey) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else {
      setSortKey(k)
      setSortDir('desc')
    }
  }

  if (isError) {
    return (
      <div className="panel card">
        <div className="cardHeader">
          <h3>Something went wrong</h3>
          <span>Try refresh</span>
        </div>
        <div className="hr" />
        <div className="mini">The demo API failed. In a real app, you’d show retry actions and incident context.</div>
      </div>
    )
  }

  return (
    <>
      <section className="stats" aria-label="KPI cards">
        {(isLoading ? Array.from({ length: 4 }) : data?.kpis ?? []).map((kpi, idx) => (
          <div className="stat panel" key={idx}>
            <div className="statTop">
              <span>{isLoading ? 'Loading…' : kpi.label}</span>
              <span className="mini">Last 14 days</span>
            </div>
            <div className="statVal">
              {isLoading ? '—' : idx < 2 ? formatMoney(kpi.value) : kpi.value.toLocaleString()}
            </div>
            <div className={`statDelta ${!isLoading && kpi.deltaPct >= 0 ? 'deltaUp' : 'deltaDown'}`}>
              {isLoading ? '—' : `${formatPct(kpi.deltaPct)} vs prior period`}
            </div>
          </div>
        ))}
      </section>

      <section className="grid2" aria-label="Charts and activity">
        <div className="panel card">
          <div className="cardHeader">
            <h3>Revenue trend</h3>
            <span>Daily revenue + MRR</span>
          </div>
          <div className="hr" />
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.revenue ?? []} margin={{ left: 0, right: 10, top: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(124,124,255,.55)" />
                    <stop offset="100%" stopColor="rgba(124,124,255,0)" />
                  </linearGradient>
                  <linearGradient id="fillMrr" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(61,255,181,.35)" />
                    <stop offset="100%" stopColor="rgba(61,255,181,0)" />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,.06)" vertical={false} />
                <XAxis dataKey="day" tick={{ fill: 'rgba(232,233,255,.55)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'rgba(232,233,255,.55)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(12,13,25,.95)',
                    border: '1px solid rgba(255,255,255,.10)',
                    borderRadius: 14,
                    color: 'rgba(232,233,255,.92)',
                  }}
                  labelStyle={{ color: 'rgba(232,233,255,.65)' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="rgba(124,124,255,.95)" fill="url(#fillRevenue)" strokeWidth={2} />
                <Area type="monotone" dataKey="mrr" stroke="rgba(61,255,181,.85)" fill="url(#fillMrr)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mini" style={{ marginTop: 10 }}>
            Tip: this chart is wired to a mocked async API via React Query, so the structure matches real production data loading.
          </div>
        </div>

        <div className="panel card">
          <div className="cardHeader">
            <h3>Activity</h3>
            <span>Last few hours</span>
          </div>
          <div className="hr" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {(data?.activity ?? []).map((a) => (
              <div key={a.id} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <div className={`tagDot ${a.kind === 'good' ? 'dotGood' : a.kind === 'warn' ? 'dotWarn' : 'dotBad'}`} style={{ marginTop: 6 }} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 650 }}>{a.title}</div>
                  <div className="mini">{a.detail}</div>
                </div>
                <div className="mini" style={{ marginLeft: 'auto' }}>
                  {new Date(a.ts).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="panel card" style={{ marginTop: 14 }} aria-label="Invoices table">
        <div className="cardHeader">
          <h3>Invoices</h3>
          <span>{isLoading ? 'Loading…' : `${filtered.length} total`}</span>
        </div>
        <div className="hr" />

        <div className="tableTools">
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            <select
              className="select"
              value={status}
              onChange={(e) => {
                setStatus(e.target.value as any)
                setPage(1)
              }}
              aria-label="Filter by status"
            >
              <option value="All">All statuses</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Overdue">Overdue</option>
            </select>

            <select
              className="select"
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value))
                setPage(1)
              }}
              aria-label="Rows per page"
            >
              <option value={10}>10 rows</option>
              <option value={15}>15 rows</option>
              <option value={25}>25 rows</option>
            </select>

            <div className="mini">Sort: <strong style={{ color: 'rgba(232,233,255,.85)' }}>{sortKey}</strong> ({sortDir})</div>
          </div>

          <div className="pagination">
            <button className="pageBtn" disabled={pageSafe <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
              Prev
            </button>
            <div className="pageNum">
              Page <strong style={{ color: 'rgba(232,233,255,.85)' }}>{pageSafe}</strong> of {totalPages}
            </div>
            <button className="pageBtn" disabled={pageSafe >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
              Next
            </button>
          </div>
        </div>

        <div className="tableWrap">
          <table>
            <thead>
              <tr>
                <th style={{ cursor: 'pointer' }} onClick={() => toggleSort('issued')}>Issued</th>
                <th style={{ cursor: 'pointer' }} onClick={() => toggleSort('customer')}>Customer</th>
                <th>Plan</th>
                <th style={{ cursor: 'pointer' }} onClick={() => toggleSort('amount')}>Amount</th>
                <th style={{ cursor: 'pointer' }} onClick={() => toggleSort('status')}>Status</th>
                <th>Invoice</th>
              </tr>
            </thead>
            <tbody>
              {(isLoading ? [] : pageItems).map((inv: Invoice) => (
                <tr className="rowHover" key={inv.id}>
                  <td>{inv.issued}</td>
                  <td>
                    <div style={{ fontWeight: 650 }}>{inv.customer}</div>
                    <div className="mini">{inv.email}</div>
                  </td>
                  <td><span className="tag">{inv.plan}</span></td>
                  <td style={{ fontWeight: 650 }}>{formatMoney(inv.amount)}</td>
                  <td>
                    <span className="tag">
                      <span className={`tagDot ${statusDot(inv.status)}`} />
                      {inv.status}
                    </span>
                  </td>
                  <td className="mini">{inv.id}</td>
                </tr>
              ))}
              {!isLoading && pageItems.length === 0 && (
                <tr>
                  <td colSpan={6} className="mini" style={{ padding: 18 }}>
                    No invoices match this filter.
                  </td>
                </tr>
              )}
              {isLoading && (
                <tr>
                  <td colSpan={6} className="mini" style={{ padding: 18 }}>
                    Loading invoices…
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}
