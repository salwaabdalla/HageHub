import { useState } from 'react'
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
  const [lightbox, setLightbox] = useState(null)

  if (!isOpen) return null

  async function handleSubmit() {
    if (!title.trim()) return
    const tagList = tags.split(',').map((t) => t.trim().replace(/^#/, '')).filter(Boolean)

    onSubmit({
      id: String(Date.now()),
      lang,
      title: title.trim(),
      body: body.trim(),
      tags: tagList,
      images: [],
      votes: 0,
      answers: 0,
      poster: {
        init: initials(user?.name),
        name: user?.name || 'Community member',
        loc: '',
      },
      time: 'Just now',
    })

    setLang('both')
    setTitle('')
    setBody('')
    setTags('')
    onClose()
  }

  const LANG_OPTS = [
    { val: 'both', label: 'Both', flags: 'SO + EN' },
    { val: 'so', label: 'Somali', flags: 'SO' },
    { val: 'en', label: 'English', flags: 'EN' },
  ]

  return (
    <>
      {lightbox && <Lightbox src={lightbox} onClose={() => setLightbox(null)} />}

      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, background: 'rgba(12,18,32,.5)',
          zIndex: 200, display: 'flex', alignItems: 'flex-start',
          justifyContent: 'center', padding: '60px 20px 20px',
          backdropFilter: 'blur(3px)', overflowY: 'auto',
        }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            background: '#fff', borderRadius: 20, width: '100%',
            maxWidth: 640, boxShadow: '0 24px 80px rgba(0,0,0,.18)',
            overflow: 'hidden', flexShrink: 0,
          }}
        >
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
              ×
            </button>
          </div>

          <div style={{ padding: '22px 32px 0', display: 'flex', flexDirection: 'column', gap: 18 }}>
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

            <FocusInput
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Question title (any language)"
              maxLength={180}
            />

            <FocusInput
              as="textarea"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="More details about your question (optional)"
            />

            <FocusInput
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Tags: react, api, career (comma separated)"
            />
          </div>

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
