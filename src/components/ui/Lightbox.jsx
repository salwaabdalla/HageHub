import { useEffect } from 'react'

export function Lightbox({ src, onClose }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,.85)',
        zIndex: 500, display: 'flex', alignItems: 'center',
        justifyContent: 'center', cursor: 'zoom-out',
      }}
    >
      <button
        onClick={onClose}
        style={{
          position: 'absolute', top: 20, right: 24, color: '#fff',
          fontSize: 28, background: 'none', border: 'none',
          cursor: 'pointer', opacity: 0.7, lineHeight: 1,
        }}
      >
        ✕
      </button>
      <img
        src={src}
        alt="Full size"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '90vw', maxHeight: '90vh', borderRadius: 12,
          objectFit: 'contain', cursor: 'default',
        }}
      />
    </div>
  )
}

export default Lightbox
