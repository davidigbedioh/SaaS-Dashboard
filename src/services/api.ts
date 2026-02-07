export type Kpi = {
  label: string
  value: number
  deltaPct: number
}

export type RevenuePoint = {
  day: string
  revenue: number
  mrr: number
}

export type Activity = {
  id: string
  ts: string
  title: string
  detail: string
  kind: 'good' | 'warn' | 'bad'
}

export type InvoiceStatus = 'Paid' | 'Pending' | 'Overdue'

export type Invoice = {
  id: string
  customer: string
  email: string
  plan: 'Starter' | 'Pro' | 'Enterprise'
  amount: number
  status: InvoiceStatus
  issued: string
}

function wait(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}

function seededRandom(seed: number) {
  // simple LCG for deterministic demo data
  let s = seed % 2147483647
  if (s <= 0) s += 2147483646
  return () => (s = (s * 16807) % 2147483647) / 2147483647
}

const rand = seededRandom(42)

function money(n: number) {
  return Math.round(n * 100) / 100
}

const customers = [
  ['NovaWorks', 'billing@novaworks.io'],
  ['Cobalt Labs', 'finance@cobaltlabs.com'],
  ['Aurum Studio', 'accounts@aurum.studio'],
  ['Vertex Retail', 'payments@vertexretail.co'],
  ['Nimbus Health', 'pay@nimbushealth.org'],
  ['Kinetic CRM', 'billing@kineticcrm.io'],
  ['Atlas Logistics', 'finance@atlaslogistics.com'],
  ['Cedar & Co', 'accounts@cedarco.co.uk'],
  ['Solace Media', 'billing@solacemedia.tv'],
  ['Pioneer AI', 'finance@pioneerai.dev'],
  ['Sable Finance', 'accounts@sablefinance.com'],
  ['Orbit Energy', 'billing@orbitenergy.io'],
  ['Helio Ventures', 'finance@helioventures.vc'],
  ['Mintside', 'payments@mintside.app'],
  ['Arclight', 'billing@arclight.design'],
]

const plans: Array<Invoice['plan']> = ['Starter', 'Pro', 'Enterprise']
const statuses: InvoiceStatus[] = ['Paid', 'Pending', 'Overdue']

function genInvoices(count = 68): Invoice[] {
  const list: Invoice[] = []
  for (let i = 0; i < count; i++) {
    const c = customers[Math.floor(rand() * customers.length)]
    const plan = plans[Math.floor(rand() * plans.length)]
    const status = statuses[Math.floor(rand() * statuses.length)]
    const base = plan === 'Starter' ? 29 : plan === 'Pro' ? 79 : 249
    const amount = money(base + rand() * (plan === 'Enterprise' ? 220 : 60))
    const daysAgo = Math.floor(rand() * 60)
    const issued = new Date(Date.now() - daysAgo * 86400000).toISOString().slice(0, 10)
    list.push({
      id: `INV-${String(1200 + i)}`,
      customer: c[0],
      email: c[1],
      plan,
      amount,
      status,
      issued,
    })
  }
  return list.sort((a, b) => (a.issued < b.issued ? 1 : -1))
}

function genRevenue(days = 14): RevenuePoint[] {
  const list: RevenuePoint[] = []
  let mrr = 18450
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000)
    const label = d.toLocaleDateString(undefined, { month: 'short', day: '2-digit' })
    const drift = (rand() - 0.45) * 900
    const spike = rand() > 0.92 ? 2600 * rand() : 0
    const revenue = Math.max(2800, 5200 + drift + spike)
    mrr = Math.max(15000, mrr + (rand() - 0.46) * 280)
    list.push({ day: label, revenue: Math.round(revenue), mrr: Math.round(mrr) })
  }
  return list
}

function genActivity(): Activity[] {
  const now = Date.now()
  const items: Activity[] = [
    { title: 'Pro plan upgrade', detail: 'Aurum Studio upgraded to Pro.', kind: 'good' },
    { title: 'Payment retried', detail: 'Atlas Logistics payment succeeded on retry.', kind: 'good' },
    { title: 'Invoice overdue', detail: 'Vertex Retail invoice is now overdue.', kind: 'warn' },
    { title: 'Churn risk', detail: 'Nimbus Health decreased usage 35% WoW.', kind: 'warn' },
    { title: 'Chargeback received', detail: 'Sable Finance opened a chargeback.', kind: 'bad' },
    { title: 'SSO enabled', detail: 'Helio Ventures enabled SSO for all users.', kind: 'good' },
  ]
  return items.map((it, idx) => ({
    id: `ACT-${idx}`,
    ts: new Date(now - (idx + 1) * 3600_000).toISOString(),
    ...it,
  }))
}

export async function fetchDashboard() {
  await wait(450 + rand() * 400)
  const revenue = genRevenue(14)
  const invoices = genInvoices(68)
  const paid = invoices.filter(i => i.status === 'Paid').length
  const overdue = invoices.filter(i => i.status === 'Overdue').length
  const arr = invoices.reduce((s, i) => s + i.amount, 0)
  const kpis: Kpi[] = [
    { label: 'Revenue (14d)', value: revenue.reduce((s, p) => s + p.revenue, 0), deltaPct: 6.8 },
    { label: 'MRR', value: revenue[revenue.length - 1]?.mrr ?? 0, deltaPct: 2.1 },
    { label: 'Paid invoices', value: paid, deltaPct: 3.4 },
    { label: 'Overdue', value: overdue, deltaPct: -1.2 },
  ]
  return {
    kpis,
    revenue,
    activity: genActivity(),
    invoices,
    arr: Math.round(arr),
  }
}

export async function fetchCustomers() {
  await wait(380 + rand() * 400)
  return customers.map(([name, email], idx) => ({
    id: `CUST-${100 + idx}`,
    name,
    email,
    seats: 3 + Math.floor(rand() * 40),
    plan: plans[Math.floor(rand() * plans.length)],
    health: rand() > 0.75 ? 'At Risk' : rand() > 0.35 ? 'Good' : 'Excellent',
  }))
}
