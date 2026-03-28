import { useState } from 'react'

function getInitials(name) {
  if (!name) return '?'
  return name.split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

function getAvatarColor(name) {
  const colors = [
    '#4189DD', '#1a5db5', '#0f3d82',
    '#0d9488', '#7c3aed', '#e11d48',
    '#d97706', '#16a34a',
  ]
  let hash = 0
  for (const c of (name || '')) hash += c.charCodeAt(0)
  return colors[hash % colors.length]
}

function LangBadge({ lang }) {
  const base = {
    display: 'inline-flex', alignItems: 'center', gap: 5,
    padding: '4px 11px', borderRadius: 100, fontSize: 10, fontWeight: 700,
  }
  if (lang === 'so') return <span style={{ ...base, background: '#eaf2fd', color: '#1a5db5', border: '1px solid #c8dff7' }}>SO Somali</span>
  if (lang === 'en') return <span style={{ ...base, background: '#f0f0ee', color: '#555', border: '1px solid #e0e0dc' }}>EN English</span>
  return <span style={{ ...base, background: '#eaf2fd', color: '#1a5db5', border: '1px solid #c8dff7' }}>SO + EN Both</span>
}

export function QuestionCard({ question, onOpen, userVote: initialUserVote = 0, onVote }) {
  const [votes, setVotes] = useState(question.votes ?? 0)
  const [userVote, setUserVote] = useState(initialUserVote)
  const [hovered, setHovered] = useState(false)

  const realAnswerCount = question.answers ?? 0

  async function handleVote(e, val) {
    e.stopPropagation()
    const nextVote = userVote === val ? 0 : val
    const delta = nextVote - userVote
    setVotes((v) => v + delta)
    setUserVote(nextVote)
    if (onVote) {
      const result = await onVote(question.id, val)
      if (result) {
        setVotes(result.newVoteCount)
        setUserVote(result.userVote)
      }
    }
  }

  return (
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
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0, width: 3,
        background: '#4189DD', borderRadius: '0 3px 3px 0',
        transform: hovered ? 'scaleY(1)' : 'scaleY(0)',
        transformOrigin: 'center', transition: 'transform .22s',
      }} />

      <div style={{ display: 'flex' }}>
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
          padding: '20px 16px 20px 18px', borderRight: '1px solid #dce6f5',
          background: '#f4f7fb', minWidth: 60, flexShrink: 0,
        }}>
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

          <span style={{
            fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 700, lineHeight: 1,
            color: votes > 0 ? '#4189DD' : votes < 0 ? '#c94040' : '#3d4f6e',
          }}>
            {votes}
          </span>

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

        <div style={{ flex: 1, padding: '18px 22px', display: 'flex', flexDirection: 'column', gap: 10, minWidth: 0 }}>
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

          <div style={{
            fontFamily: "'Cormorant Garamond', serif", fontSize: 21, fontWeight: 600,
            color: hovered ? '#1a5db5' : '#0c1220', lineHeight: 1.25,
            letterSpacing: '-.2px', transition: 'color .15s',
          }}>
            {question.title}
          </div>

          {question.body && (
            <div style={{
              fontSize: 13, color: '#3d4f6e', lineHeight: 1.6,
              overflow: 'hidden', display: '-webkit-box',
              WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
            }}>
              {question.body}
            </div>
          )}

              {question.images?.[0] &&
            !question.images[0].startsWith('data:') && (
              <img
                src={question.images[0]}
                alt="attachment"
                style={{
                  width: '100%',
                  maxHeight: 280,
                  objectFit: 'cover',
                  borderRadius: 10,
                  marginTop: 10,
                  border: '1px solid #dce6f5',
                }}
              />
          )}

          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            paddingTop: 10, borderTop: '1px solid #dce6f5', marginTop: 'auto',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <div style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: getAvatarColor(question.poster?.name),
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 10,
                fontWeight: 600,
                color: '#fff',
                flexShrink: 0,
              }}>
                {getInitials(question.poster?.name)}
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
  )
}

export default QuestionCard
