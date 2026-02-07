# Premium SaaS Dashboard (React + Vite)

A dark, premium, product-like dashboard that showcases frontend fundamentals:
- Responsive layout (sticky sidebar on desktop)
- KPI cards, charts (Recharts), tables with filtering/pagination/sorting
- Async data loading with React Query (mock API)
- Polished design using CSS variables + glassy panels

## Run locally
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
npm run preview
```

## Where to customise
- `src/services/api.ts` for data + API integration
- `src/pages/Dashboard.tsx` for table and chart logic
- `src/styles/app.css` for theme and components

## Notes
This project uses mocked async calls to mimic real SaaS behaviour. Replace the mock functions with your own backend/API and keep the UI intact.
