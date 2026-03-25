import { useState } from 'react'
import { castVote, getUserVote } from '../../lib/storage'
import { Lightbox } from '../ui/Lightbox'

const POSTER_COLORS = ['#4189DD', '#1a5db5', '#0f3d82', '#6aaae8', '#2d6fa3']

function posterColor(init = '') {
  let hash = 0
  for (const c of init) hash += c.charCodeAt(0)
  return POSTER_COLORS[hash % POSTER_COLORS.length]
}

function LangBadge({ lang }) {
  const base = {
    display: 'inline-flex', alignItems: 'center', gap: 5,
    padding: '4px 11px', borderRadius: 100, fontSize: 10, fontWeight: 700,
  }
  if (lang === 'so') return <span style={{ ...base, background: '#eaf2fd', color: '#1a5db5', border: '1px solid #c8dff7' }}>🇸🇴 Somali</span>
  if (lang === 'en') return <span style={{ ...base, background: '#f0f0ee', color: '#555', border: '1px solid #e0e0dc' }}>🇬🇧 English</span>
  return <span style={{ ...base, background: '#eaf2fd', color: '#1a5db5', border: '1px solid #c8dff7' }}>🇸🇴 + 🇬🇧 Both</span>
}

export function QuestionCard({ question, threadComments, onOpen }) {
  const [votes, setVotes] = useState(question.votes ?? 0)
  const [userVote, setUserVote] = useState(() => getUserVote(question.id))
  const [hovered, setHovered] = useState(false)
  const [lightbox, setLightbox] = useState(null)

  const realAnswerCount = (question.answers ?? 0) + (threadComments?.[question.id]?.length ?? 0)
  const images = question.images?.length ? question.images : question.image ? [question.image] : []

  function handleVote(e, val) {
    e.stopPropagation()
    const result = castVote(question.id, val)
    setVotes(result.newVotes)
    setUserVote(result.userVote)
  }

  return (
    <>
      {lightbox && <Lightbox src={lightbox} onClose={() => setLightbox(null)} />}

      <div
        onClick={onOpen}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: '#fff',
          border: `1px solid ${hovered ? '#c8dff7' : '#dce6f5'}`,
          borderRadius: 20,
          overflow: 'hidden',
          cursor: 'pointer',
          transition: 'all .22s',
          position: 'relative',
          boxShadow: hovered ? '0 8px 32px rgba(65,137,221,.1)' : 'none',
          transform: hovered ? 'translateY(-2px)' : 'none',
        }}
      >
        {/* Hover: 3px blue left accent */}
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0, width: 3,
          background: '#4189DD', borderRadius: '0 3px 3px 0',
          transform: hovered ? 'scaleY(1)' : 'scaleY(0)',
          transformOrigin: 'center', transition: 'transform .22s',
        }} />

        <div style={{ display: 'flex' }}>
          {/* ── Vote column ── */}
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
            padding: '20px 16px 20px 18px', borderRight: '1px solid #dce6f5',
            background: '#f4f7fb', minWidth: 60, flexShrink: 0,
          }}>
            {/* Up */}
            <button
              type="button"
              onClick={(e) => handleVote(e, 1)}
              title="Upvote"
              style={{
                width: 28, height: 28, borderRadius: 8,
                border: `1.5px solid ${userVote === 1 ? '#4189DD' : '#dce6f5'}`,
                background: userVote === 1 ? '#eaf2fd' : '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: userVote === 1 ? '#4189DD' : '#8a9bbf', transition: 'all .15s',
              }}
            >
              <svg viewBox="0 0 24 24" width={14} height={14} stroke="currentColor" strokeWidth={2.5} fill="none">
                <polyline points="18 15 12 9 6 15" />
              </svg>
            </button>

            {/* Vote count */}
            <span style={{
              fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 700, lineHeight: 1,
              color: votes > 0 ? '#4189DD' : votes < 0 ? '#c94040' : '#3d4f6e',
            }}>
              {votes}
            </span>

            {/* Down */}
            <button
              type="button"
              onClick={(e) => handleVote(e, -1)}
              title="Downvote"
              style={{
                width: 28, height: 28, borderRadius: 8,
                border: `1.5px solid ${userVote === -1 ? '#e87070' : '#dce6f5'}`,
                background: userVote === -1 ? '#fdf0f0' : '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: userVote === -1 ? '#c94040' : '#8a9bbf', transition: 'all .15s',
              }}
            >
              <svg viewBox="0 0 24 24" width={14} height={14} stroke="currentColor" strokeWidth={2.5} fill="none">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {/* Answer count */}
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              marginTop: 8, paddingTop: 8, borderTop: '1px solid #dce6f5', width: '100%',
            }}>
              <span style={{
                fontFamily: "'Cormorant Garamond', serif", fontSize: 16, fontWeight: 700,
                color: realAnswerCount > 0 ? '#1a5db5' : '#8a9bbf',
              }}>
                {realAnswerCount}
              </span>
              <span style={{
                fontSize: 9, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase',
                color: realAnswerCount > 0 ? '#6aaae8' : '#8a9bbf', marginTop: 1,
              }}>
                ans
              </span>
            </div>
          </div>

          {/* ── Card body ── */}
          <div style={{ flex: 1, padding: '18px 22px', display: 'flex', flexDirection: 'column', gap: 10, minWidth: 0 }}>
            {/* Tags row */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, flexWrap: 'wrap' }}>
              <LangBadge lang={question.lang} />
              {question.tags?.slice(0, 5).map((tag) => (
                <span key={tag} style={{
                  display: 'inline-flex', alignItems: 'center', padding: '4px 10px',
                  borderRadius: 100, fontSize: 10, fontWeight: 600,
                  background: '#f4f7fb', border: '1px solid #dce6f5', color: '#8a9bbf',
                }}>
                  #{tag}
                </span>
              ))}
            </div>

            {/* Title */}
            <div style={{
              fontFamily: "'Cormorant Garamond', serif", fontSize: 21, fontWeight: 600,
              color: hovered ? '#1a5db5' : '#0c1220', lineHeight: 1.25,
              letterSpacing: '-.2px', transition: 'color .15s',
            }}>
              {question.title}
            </div>

            {/* Body preview */}
            {question.body && (
              <div style={{
                fontSize: 13, color: '#3d4f6e', lineHeight: 1.6,
                overflow: 'hidden', display: '-webkit-box',
                WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
              }}>
                {question.body}
              </div>
            )}

            {/* Image thumbnails */}
            {images.length > 0 && (
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 2 }}>
                {images.slice(0, 3).map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`attachment ${i + 1}`}
                    onClick={(e) => { e.stopPropagation(); setLightbox(img) }}
                    style={{
                      width: 72, height: 56, borderRadius: 8, objectFit: 'cover',
                      border: '1px solid #dce6f5', cursor: 'zoom-in', transition: 'all .15s',
                    }}
                  />
                ))}
                {images.length > 3 && (
                  <div style={{
                    width: 72, height: 56, borderRadius: 8, background: '#f4f7fb',
                    border: '1px solid #dce6f5', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#8a9bbf', cursor: 'pointer',
                  }}>
                    +{images.length - 3}
                  </div>
                )}
              </div>
            )}

            {/* Footer */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              paddingTop: 10, borderTop: '1px solid #dce6f5', marginTop: 'auto',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <div style={{
                  width: 24, height: 24, borderRadius: '50%',
                  background: posterColor(question.poster?.init ?? ''),
                  fontSize: 9, fontWeight: 700, color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  overflow: 'hidden', position: 'relative', flexShrink: 0,
                }}>
                  {question.poster?.photo
                    ? <img src={question.poster.photo} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                    : question.poster?.init}
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#3d4f6e' }}>{question.poster?.name}</span>
                {question.poster?.loc && <span style={{ fontSize: 11, color: '#8a9bbf' }}>· {question.poster.loc}</span>}
                <span style={{ fontSize: 11, color: '#8a9bbf' }}>{question.time}</span>
              </div>
              <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#8a9bbf' }}>
                <svg viewBox="0 0 24 24" width={13} height={13} stroke="currentColor" strokeWidth={2} fill="none" style={{ opacity: 0.6 }}>
                  <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                </svg>
                {realAnswerCount} {realAnswerCount === 1 ? 'answer' : 'answers'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default QuestionCard
