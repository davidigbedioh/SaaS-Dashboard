import { useEffect } from 'react'
import { CheckCircle2 } from 'lucide-react'

type Props = { title: string; detail: string; onClose: () => void }

export default function Toast({ title, detail, onClose }: Props) {
  useEffect(() => {
    const t = window.setTimeout(onClose, 3200)
    return () => window.clearTimeout(t)
  }, [onClose])

  return (
    <div className="toast" role="status" aria-live="polite">
      <div style={{ marginTop: 2 }}>
        <CheckCircle2 size={18} color="rgba(61,255,181,.95)" />
      </div>
      <div>
        <p style={{ fontWeight: 650, marginBottom: 2 }}>{title}</p>
        <small>{detail}</small>
      </div>
      <button className="iconBtn" onClick={onClose} aria-label="Close toast" style={{ marginLeft: 'auto' }}>
        ✕
      </button>
    </div>
  )
}
