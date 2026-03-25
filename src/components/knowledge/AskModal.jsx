import { useRef, useState } from 'react'
import { Lightbox } from '../ui/Lightbox'

function initials(name = '') {
  return name.split(' ').slice(0, 2).map((p) => p[0]).join('').toUpperCase() || '??'
}

const INPUT_STYLE = {
  width: '100%', padding: '12px 16px',
  border: '1.5px solid #dce6f5', borderRadius: 12,
  fontSize: 14, fontFamily: 'DM Sans, sans-serif',
  color: '#0c1220', background: '#f4f7fb', outline: 'none',
  transition: 'all .2s', boxSizing: 'border-box',
}

function FocusInput({ as: Tag = 'input', ...props }) {
  return (
    <Tag
      {...props}
      style={{ ...INPUT_STYLE, ...(Tag === 'textarea' ? { resize: 'vertical', minHeight: 110, lineHeight: 1.6 } : {}), ...props.style }}
      onFocus={(e) => {
        e.target.style.borderColor = '#4189DD'
        e.target.style.background = '#fff'
        e.target.style.boxShadow = '0 0 0 3px rgba(65,137,221,.1)'
        props.onFocus?.(e)
      }}
      onBlur={(e) => {
        e.target.style.borderColor = '#dce6f5'
        e.target.style.background = '#f4f7fb'
        e.target.style.boxShadow = 'none'
        props.onBlur?.(e)
      }}
    />
  )
}

export function AskModal({ isOpen, onClose, onSubmit, user }) {
  const [lang, setLang] = useState('both')
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [tags, setTags] = useState('')
  const [images, setImages] = useState([])
  const [lightbox, setLightbox] = useState(null)
  const [dragOver, setDragOver] = useState(false)
  const fileRef = useRef(null)

  if (!isOpen) return null

  function processFiles(files) {
    const remaining = 4 - images.length
    if (remaining <= 0) return
    files.slice(0, remaining).forEach((file) => {
      if (!file.type.startsWith('image/')) return
      const reader = new FileReader()
      reader.onload = (e) => setImages((prev) => [...prev, e.target.result])
      reader.readAsDataURL(file)
    })
  }

  function handleSubmit() {
    if (!title.trim()) return
    const tagList = tags.split(',').map((t) => t.trim().replace(/^#/, '')).filter(Boolean)
    const profilePic = localStorage.getItem(`hh_pic_${user?.name}`) || ''
    onSubmit({
      id: String(Date.now()),
      lang,
      title: title.trim(),
      body: body.trim(),
      tags: tagList,
      images: [...images],
      votes: 0,
      answers: 0,
      poster: {
        init: initials(user?.name),
        name: user?.name || 'Community member',
        loc: '',
        photo: profilePic,
      },
      time: 'Just now',
    })
    setLang('both'); setTitle(''); setBody(''); setTags(''); setImages([])
    onClose()
  }

  const LANG_OPTS = [
    { val: 'both', label: 'Both', flags: '🇸🇴🇬🇧' },
    { val: 'so', label: 'Somali', flags: '🇸🇴' },
    { val: 'en', label: 'English', flags: '🇬🇧' },
  ]

  return (
    <>
      {lightbox && <Lightbox src={lightbox} onClose={() => setLightbox(null)} />}

      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, background: 'rgba(12,18,32,.5)',
          zIndex: 200, display: 'flex', alignItems: 'flex-start',
          justifyContent: 'center', padding: '60px 20px 20px',
          backdropFilter: 'blur(3px)', overflowY: 'auto',
        }}
      >
        {/* Modal */}
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            background: '#fff', borderRadius: 20, width: '100%',
            maxWidth: 640, boxShadow: '0 24px 80px rgba(0,0,0,.18)',
            overflow: 'hidden', flexShrink: 0,
          }}
        >
          {/* Header */}
          <div style={{ padding: '28px 32px 0', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 600, color: '#0c1220', letterSpacing: '-.3px' }}>
              Ask a Question
            </div>
            <button
              type="button"
              onClick={onClose}
              style={{
                width: 32, height: 32, borderRadius: 8, border: '1px solid #dce6f5',
                background: '#f4f7fb', display: 'flex', alignItems: 'center',
                justifyContent: 'center', cursor: 'pointer', fontSize: 14,
                color: '#8a9bbf', fontFamily: 'DM Sans, sans-serif', flexShrink: 0,
              }}
            >
              ✕
            </button>
          </div>

          {/* Body */}
          <div style={{ padding: '22px 32px 0', display: 'flex', flexDirection: 'column', gap: 18 }}>

            {/* Language */}
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: '#8a9bbf', marginBottom: 10 }}>
                Language
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {LANG_OPTS.map(({ val, label, flags }) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setLang(val)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      padding: '9px 18px', borderRadius: 100,
                      border: `1.5px solid ${lang === val ? '#4189DD' : '#dce6f5'}`,
                      background: lang === val ? '#4189DD' : '#fff',
                      fontSize: 13, fontWeight: lang === val ? 600 : 500,
                      color: lang === val ? '#fff' : '#3d4f6e',
                      cursor: 'pointer', transition: 'all .15s',
                      fontFamily: 'DM Sans, sans-serif',
                    }}
                  >
                    {flags} {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <FocusInput
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Question title (any language)"
              maxLength={180}
            />

            {/* Body */}
            <FocusInput
              as="textarea"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="More details about your question (optional)"
            />

            {/* Tags */}
            <FocusInput
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Tags: react, api, career (comma separated)"
            />

            {/* Image upload */}
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: '#8a9bbf', marginBottom: 10 }}>
                Attach Images
              </div>

              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                multiple
                style={{ display: 'none' }}
                onChange={(e) => { processFiles(Array.from(e.target.files)); e.target.value = '' }}
              />

              {images.length < 4 && (
                <div
                  onClick={() => fileRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault()
                    setDragOver(false)
                    processFiles(Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith('image/')))
                  }}
                  style={{
                    border: `2px dashed ${dragOver ? '#4189DD' : '#dce6f5'}`,
                    borderRadius: 12, padding: 20, cursor: 'pointer',
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    gap: 8, textAlign: 'center',
                    background: dragOver ? '#eaf2fd' : '#f4f7fb',
                    transition: 'all .2s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#4189DD'; e.currentTarget.style.background = '#eaf2fd' }}
                  onMouseLeave={(e) => { if (!dragOver) { e.currentTarget.style.borderColor = '#dce6f5'; e.currentTarget.style.background = '#f4f7fb' } }}
                >
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: '#eaf2fd', border: '1px solid #c8dff7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg viewBox="0 0 24 24" width={18} height={18} stroke="#4189DD" strokeWidth={2} fill="none">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: '#3d4f6e' }}>Click to upload or drag &amp; drop</div>
                  <div style={{ fontSize: 11, color: '#8a9bbf' }}>PNG, JPG, GIF up to 10MB each · max 4 images</div>
                </div>
              )}

              {images.length > 0 && (
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: images.length < 4 ? 10 : 0 }}>
                  {images.map((src, i) => (
                    <div key={i} style={{ position: 'relative', flexShrink: 0 }}>
                      <img
                        src={src}
                        alt={`preview ${i + 1}`}
                        onClick={() => setLightbox(src)}
                        style={{ width: 80, height: 64, borderRadius: 10, objectFit: 'cover', border: '1.5px solid #dce6f5', display: 'block', cursor: 'zoom-in' }}
                      />
                      <button
                        type="button"
                        onClick={() => setImages((prev) => prev.filter((_, idx) => idx !== i))}
                        style={{
                          position: 'absolute', top: -6, right: -6, width: 18, height: 18,
                          borderRadius: '50%', background: '#0c1220', color: '#fff',
                          border: '2px solid #fff', display: 'flex', alignItems: 'center',
                          justifyContent: 'center', fontSize: 10, cursor: 'pointer',
                          fontWeight: 700, lineHeight: 1,
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 32px 26px' }}>
            <div style={{ fontSize: 12, color: '#8a9bbf', maxWidth: 300, lineHeight: 1.5 }}>
              Your question will be answered by the community and{' '}
              <strong style={{ color: '#1a5db5' }}>Hage AI</strong>.
            </div>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!title.trim()}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: title.trim() ? '#4189DD' : '#dce6f5',
                color: title.trim() ? '#fff' : '#8a9bbf',
                border: 'none', padding: '12px 28px', borderRadius: 100,
                fontSize: 14, fontWeight: 600,
                cursor: title.trim() ? 'pointer' : 'not-allowed',
                fontFamily: 'DM Sans, sans-serif', transition: 'all .2s',
                boxShadow: title.trim() ? '0 4px 14px rgba(65,137,221,.3)' : 'none',
              }}
            >
              Post Question
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default AskModal
