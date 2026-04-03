import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import FIELDS from '../data/learnFields'
import { useLearnState } from '../hooks/useLearnState'
import { supabase } from '../lib/supabase'

// ─── shared style tokens ───────────────────────────────────────────
const S = {
  blue: '#4189DD', blueDark: '#1a5db5', blueDeeper: '#0f3d82',
  blueLight: '#eaf2fd', blueMid: '#c8dff7', blueMuted: '#6aaae8',
  bg: '#f4f7fb', bg2: '#edf2f9',
  text: '#0c1220', textMid: '#3d4f6e', textSoft: '#8a9bbf',
  border: '#dce6f5', radius: 14, radiusLg: 20,
  green: '#16a34a', greenLight: '#dcfce7',
  amber: '#d97706', amberLight: '#fef3c7',
  rose: '#e11d48',
}

// ─── Toast ─────────────────────────────────────────────────────────
function Toast({ msg }) {
  if (!msg) return null
  return (
    <div style={{
      position: 'fixed', bottom: 24, left: '50%',
      transform: 'translateX(-50%)',
      background: S.text, color: '#fff',
      padding: '10px 22px', borderRadius: 100,
      fontSize: 13, fontWeight: 500, zIndex: 999,
      whiteSpace: 'nowrap', pointerEvents: 'none',
    }}>{msg}</div>
  )
}

// ─── Lesson Modal ──────────────────────────────────────────────────
function LessonModal({ lesson, completed, onMark, onClose, onAskAI }) {
  if (!lesson) return null
  const { fid, pi, ni, field } = lesson
  const node = field.phases[pi].nodes[ni]
  const key = `${fid}_${pi}_${ni}`
  const isDone = !!completed[key]

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0,
      background: 'rgba(12,18,32,.5)',
      zIndex: 200, display: 'flex',
      alignItems: 'flex-start', justifyContent: 'center',
      padding: '40px 20px', backdropFilter: 'blur(3px)',
      overflowY: 'auto',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: '#fff', borderRadius: S.radiusLg,
        width: '100%', maxWidth: 660,
      }}>
        <div style={{ padding: '22px 26px 0', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 700, color: S.text, lineHeight: 1.2 }}>
            {node.t}
          </div>
          <button onClick={onClose} style={{
            width: 30, height: 30, borderRadius: 8,
            border: `1px solid ${S.border}`, background: S.bg,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', fontSize: 13, color: S.textSoft,
            fontFamily: "'DM Sans', sans-serif",
          }}>✕</button>
        </div>
        <div style={{ padding: '18px 26px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: S.textSoft, marginBottom: 5 }}>English</div>
            <div style={{ fontSize: 13, color: S.textMid, lineHeight: 1.7 }}>
              {node.t} is a key topic in {field.name}. {node.s}. Mastering this gives you a strong foundation for the next steps in your learning journey.
            </div>
          </div>
          <div>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: S.textSoft, marginBottom: 5 }}>Af Soomaali</div>
            <div style={{ fontSize: 13, color: S.blueDeeper, lineHeight: 1.7, background: S.blueLight, padding: '12px 14px', borderRadius: 10, borderLeft: `3px solid ${S.blue}` }}>
              {node.t} waa mawduuc muhiim ah oo ku jira {field.name}. {node.s}. Bartaanku wuxuu kaa caawin doonaa tallaabooyinka xiga ee safarkaaga waxbarasho.
            </div>
          </div>
          <div>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: S.textSoft, marginBottom: 5 }}>Code Example</div>
            <pre style={{ background: '#0c1220', borderRadius: 10, padding: '14px 16px', fontFamily: 'monospace', fontSize: 12, color: '#a8d8a8', lineHeight: 1.7, overflowX: 'auto', margin: 0 }}>
              {`// ${node.t}\n// ${node.tags.join(', ')} · ${node.dur}\n\nconsole.log("Studying: ${node.t}");`}
            </pre>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, padding: '14px 26px 22px', borderTop: `1px solid ${S.border}` }}>
          <button onClick={onMark} style={{
            flex: 1, padding: 10,
            background: isDone ? S.green : S.blue,
            color: '#fff', border: 'none',
            borderRadius: 100, fontSize: 13, fontWeight: 600,
            cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
          }}>
            {isDone ? '✓ Already Complete' : '✓ Mark as Complete'}
          </button>
          <button onClick={onAskAI} style={{
            flex: 1, padding: 10, background: 'transparent',
            color: S.blue, border: `1.5px solid ${S.blueMid}`,
            borderRadius: 100, fontSize: 13, fontWeight: 600,
            cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
          }}>Ask Hage AI →</button>
        </div>
      </div>
    </div>
  )
}

// ─── Field Picker ──────────────────────────────────────────────────
function FieldPicker({ fields, allFields, joined, completed, searchQuery, onSearch, onOpen, onToggleJoin, showToast, getProgress, onGoHome, memberCounts = {} }) {
  return (
    <div style={{ maxWidth: 1140, margin: '0 auto', padding: '48px 24px' }}>
      <button
        onClick={onGoHome}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: '#8a9bbf',
          fontSize: 13,
          fontFamily: 'DM Sans, sans-serif',
          fontWeight: 500,
          padding: '16px 0 0 0',
          marginBottom: 8,
          transition: 'color 0.15s',
        }}
        onMouseOver={e => e.currentTarget.style.color = '#4189DD'}
        onMouseOut={e => e.currentTarget.style.color = '#8a9bbf'}
      >
        ← Back to Dashboard
      </button>

      {/* Hero */}
      <div style={{ marginBottom: 48 }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '2.5px', textTransform: 'uppercase', color: S.textSoft, marginBottom: 10 }}>Hage Hub Learn</div>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(36px,5vw,60px)', fontWeight: 700, color: S.text, lineHeight: 1.05, marginBottom: 14 }}>
          Pick your field.<br /><span style={{ color: S.blue }}>Own it.</span>
        </div>
        <div style={{ fontSize: 15, color: S.textMid, lineHeight: 1.7, maxWidth: 560 }}>
          Each field is a full community — <strong style={{ color: S.text }}>roadmap, group chat, multiple mentors, events, and a leaderboard</strong> of Somali developers on the same path as you.
        </div>
      </div>

      {/* Joined banner */}
      {joined.length > 0 && (
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', background: S.blueLight, border: `1px solid ${S.blueMid}`, borderRadius: S.radius, padding: '12px 18px', marginBottom: 28, flexWrap: 'wrap' }}>
          <p style={{ fontSize: 13, color: S.blueDark, flex: 1, margin: 0 }}>Your communities: <strong>{joined.length}</strong> joined</p>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {joined.map(id => {
              const f = allFields.find(x => x.id === id)
              return f ? (
                <span key={id} onClick={() => onOpen(id)} style={{ padding: '4px 12px', background: S.blue, color: '#fff', borderRadius: 100, fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>
                  {f.name}
                </span>
              ) : null
            })}
          </div>
        </div>
      )}

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 28, maxWidth: 400 }}>
        <input
          value={searchQuery}
          onChange={e => onSearch(e.target.value)}
          placeholder="Search fields..."
          style={{ width: '100%', padding: '10px 16px', border: `1.5px solid ${S.border}`, borderRadius: 100, fontSize: 13, fontFamily: "'DM Sans', sans-serif", color: S.text, background: '#fff', outline: 'none' }}
        />
      </div>

      {/* Grid */}
      <div className="fields-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14 }}>
        {fields.map(f => {
          const total = f.phases.reduce((s, p) => s + p.nodes.length, 0)
          const { done, pct } = getProgress(f.id, total)
          const isJoined = joined.includes(f.id)
          return (
            <FieldCard
              key={f.id}
              field={f}
              isJoined={isJoined}
              pct={pct}
              total={total}
              onOpen={() => onOpen(f.id)}
              onToggleJoin={e => { e.stopPropagation(); onToggleJoin(f.id); showToast(isJoined ? 'Left community' : 'Joined! Welcome to the community') }}
              memberCount={memberCounts[f.id]}
            />
          )
        })}
      </div>
    </div>
  )
}

function FieldCard({ field: f, isJoined, pct, total, onOpen, onToggleJoin, memberCount }) {
  const [hover, setHover] = useState(false)
  return (
    <div
      onClick={onOpen}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: '#fff',
        border: `1.5px solid ${isJoined ? f.color + '55' : S.border}`,
        borderRadius: S.radiusLg,
        padding: 24, cursor: 'pointer',
        position: 'relative', overflow: 'hidden',
        transform: hover ? 'translateY(-3px)' : 'none',
        transition: 'all .22s',
      }}
    >
      {isJoined && (
        <span style={{ position: 'absolute', top: 14, right: 14, padding: '3px 10px', borderRadius: 100, fontSize: 10, fontWeight: 700, background: S.greenLight, color: S.green, border: '1px solid #bbf7d0' }}>✓ Joined</span>
      )}
      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 700, color: S.text, marginBottom: 4 }}>{f.name}</div>
      <div style={{ fontSize: 12, color: S.textSoft, lineHeight: 1.55, marginBottom: 14 }}>{f.desc}</div>
      <div style={{ display: 'flex', gap: 14, marginBottom: 14 }}>
        <span style={{ fontSize: 11, color: S.textSoft }}><span style={{ fontWeight: 700, color: S.textMid }}>{memberCount != null ? memberCount.toLocaleString() : '...'}</span> members</span>
        <span style={{ fontSize: 11, color: S.textSoft }}><span style={{ fontWeight: 700, color: S.textMid }}>{total}</span> lessons</span>
        <span style={{ fontSize: 11, color: S.textSoft }}><span style={{ fontWeight: 700, color: S.textMid }}>{f.mentors.length}</span> mentors</span>
      </div>
      <div style={{ height: 3, borderRadius: 100, background: S.border, overflow: 'hidden', marginBottom: 5 }}>
        <div style={{ height: '100%', borderRadius: 100, background: f.color, width: `${pct}%`, transition: 'width .5s' }} />
      </div>
      <div style={{ fontSize: 10, color: S.textSoft, marginBottom: 12 }}>{pct > 0 ? `${pct}% complete` : 'Not started'}</div>
      <button
        onClick={onToggleJoin}
        style={{
          width: '100%', padding: 9, borderRadius: 100,
          fontSize: 12, fontWeight: 600, cursor: 'pointer',
          fontFamily: "'DM Sans', sans-serif", transition: 'all .2s',
          border: isJoined ? '1.5px solid #bbf7d0' : `1.5px solid ${S.border}`,
          background: isJoined ? S.greenLight : 'transparent',
          color: isJoined ? S.green : S.textMid,
          marginTop: 'auto',
        }}
      >
        {isJoined ? '✓ Joined' : '+ Join Community'}
      </button>
    </div>
  )
}

// ─── Hub Sidebar ───────────────────────────────────────────────────
const HUB_NAV = [
  { id: 'overview', label: 'Overview' },
  { id: 'chat', label: 'Group Chat' },
  { id: 'mentors', label: 'Mentors' },
  { id: 'roadmap', label: 'Roadmap' },
  { id: 'leaderboard', label: 'Leaderboard' },
  { id: 'events', label: 'Events', badge: '2', badgeGreen: true },
]

function HubSidebar({ field: f, activePanel, onPanelChange, onBack, onlineCount, onlineUsers = [], activeCount, chatBadge, memberCount }) {
  return (
    <div className="hub-sidebar" style={{ width: 220, minWidth: 220, background: '#fff', borderRight: `1px solid ${S.border}`, display: 'flex', flexDirection: 'column', overflowY: 'auto', flexShrink: 0 }}>
      <div style={{ padding: '18px 16px 12px', borderBottom: `1px solid ${S.border}` }}>
        <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: S.textSoft, cursor: 'pointer', marginBottom: 14, background: 'none', border: 'none', fontFamily: "'DM Sans', sans-serif" }}>
          <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><polyline points="15 18 9 12 15 6" /></svg>
          All Fields
        </button>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 700, color: S.text, marginBottom: 2 }}>{f.name}</div>
        <div style={{ fontSize: 11, color: S.textSoft }}>
          <strong style={{ color: S.green, fontWeight: 700 }}>{memberCount != null ? memberCount.toLocaleString() : '...'}</strong> members
          {activeCount != null && activeCount > 0 && (
            <span style={{ color: S.textSoft }}> · <strong style={{ color: S.blue }}>{activeCount}</strong> active this week</span>
          )}
        </div>
      </div>

      <div style={{ padding: '10px 0', flex: 1 }}>
        <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: S.textSoft, padding: '10px 16px 4px' }}>Navigate</div>
        {HUB_NAV.map(item => {
          const active = activePanel === item.id
          const badge = item.id === 'chat' ? (chatBadge > 0 ? String(chatBadge) : null) : item.badge
          const badgeBg = item.id === 'chat' ? S.rose : (item.badgeGreen ? S.green : S.blue)
          return (
            <div key={item.id} onClick={() => onPanelChange(item.id)} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '9px 14px', cursor: 'pointer',
              color: active ? S.blue : S.textMid,
              fontSize: 13, fontWeight: active ? 600 : 500,
              borderRadius: 9, margin: '1px 6px',
              background: active ? S.blueLight : 'transparent',
              position: 'relative',
              transition: 'all .15s',
            }}>
              {active && <span style={{ position: 'absolute', left: -6, top: '50%', transform: 'translateY(-50%)', width: 3, height: 18, background: S.blue, borderRadius: '0 3px 3px 0' }} />}
              <span>{item.label}</span>
              {badge && (
                <span style={{ marginLeft: 'auto', background: badgeBg, color: '#fff', fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 100 }}>{badge}</span>
              )}
            </div>
          )
        })}
      </div>

      <div style={{ padding: '12px 16px', borderTop: `1px solid ${S.border}` }}>
        <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: S.textSoft, marginBottom: 10 }}>Online Now</div>
        {onlineUsers.length === 0 ? (
          <p style={{ fontSize: 12, color: S.textSoft, margin: 0 }}>No one online right now</p>
        ) : (
          onlineUsers.map(u => (
            <div key={u.id} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <div style={{ width: 26, height: 26, borderRadius: '50%', fontSize: 9, fontWeight: 600, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: S.blue, position: 'relative' }}>
                {u.init}
                <div style={{ position: 'absolute', bottom: 0, right: 0, width: 7, height: 7, borderRadius: '50%', background: S.green, border: '2px solid #fff' }} />
              </div>
              <div style={{ fontSize: 12, fontWeight: 500, color: S.textMid }}>{u.name}</div>
            </div>
          ))
        )}
        <div style={{ fontSize: 11, color: S.textSoft, marginTop: 8 }}>
          <span style={{ display: 'inline-block', width: 7, height: 7, borderRadius: '50%', background: S.green, marginRight: 5, verticalAlign: 'middle' }} />
          {onlineCount} online now
        </div>
      </div>
    </div>
  )
}

function MobileHubTabs({ activePanel, onPanelChange }) {
  return (
    <div className="mobile-hub-tabs" style={{
      display: 'flex',
      gap: 8,
      overflowX: 'auto',
      padding: '12px 16px',
      borderBottom: `1px solid ${S.border}`,
      background: 'white',
      scrollbarWidth: 'none',
      WebkitOverflowScrolling: 'touch',
      flexShrink: 0,
    }}>
      {['Overview', 'Chat', 'Mentors', 'Roadmap', 'Leaderboard', 'Events'].map((tab) => {
        const value = tab.toLowerCase()
        const active = activePanel === value
        return (
          <button
            key={tab}
            onClick={() => onPanelChange(value)}
            style={{
              padding: '8px 16px',
              borderRadius: 100,
              border: '1.5px solid',
              borderColor: active ? '#4189DD' : '#dce6f5',
              background: active ? '#4189DD' : 'white',
              color: active ? 'white' : '#8a9bbf',
              fontSize: 12,
              fontWeight: 600,
              whiteSpace: 'nowrap',
              cursor: 'pointer',
              fontFamily: 'DM Sans, sans-serif',
              flexShrink: 0,
            }}
          >
            {tab}
          </button>
        )
      })}
    </div>
  )
}

// ─── Overview Panel ────────────────────────────────────────────────
function OverviewPanel({ field: f, completed, onSwitchPanel, memberCount }) {
  const total = f.phases.reduce((s, p) => s + p.nodes.length, 0)
  const done = Object.keys(completed).filter(k => k.startsWith(f.id + '_')).length
  const pct = total > 0 ? Math.round((done / total) * 100) : 0

  return (
    <div style={{ padding: 28, maxWidth: 900 }}>
      <div style={{ background: '#fff', border: `1px solid ${S.border}`, borderTop: `3px solid ${f.color}`, borderRadius: S.radiusLg, padding: '28px 32px', marginBottom: 22 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
          <div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 700, color: S.text, marginBottom: 6 }}>{f.name}</div>
            <div style={{ fontSize: 14, color: S.textMid, lineHeight: 1.7, maxWidth: 560 }}>{f.desc}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {f.chips.map(c => (
            <span key={c} style={{ padding: '5px 14px', borderRadius: 100, fontSize: 12, fontWeight: 600, background: S.bg, border: `1px solid ${S.border}`, color: S.textMid }}>{c}</span>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 22 }}>
        {[
          { val: memberCount != null ? memberCount.toLocaleString() : '...', lbl: 'Members' },
          { val: f.mentors.length, lbl: 'Mentors' },
          { val: total, lbl: 'Lessons' },
          { val: `${pct}%`, lbl: 'Your Progress' },
        ].map(({ val, lbl }) => (
          <div key={lbl} style={{ background: '#fff', border: `1px solid ${S.border}`, borderRadius: S.radius, padding: '16px 18px' }}>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 700, color: f.color }}>{val}</div>
            <div style={{ fontSize: 11, color: S.textSoft, marginTop: 2 }}>{lbl}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div style={{ background: '#fff', border: `1px solid ${S.border}`, borderRadius: S.radius, padding: '18px 20px' }}>
          <div style={{ fontWeight: 700, fontSize: 13, color: S.text, marginBottom: 14, paddingBottom: 10, borderBottom: `1px solid ${S.border}` }}>Mentors in this field</div>
          {f.mentors.map((m, i) => (
            <div key={i} onClick={() => onSwitchPanel('mentors')} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', borderBottom: i < f.mentors.length - 1 ? `1px solid ${S.border}` : 'none', cursor: 'pointer' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', fontSize: 12, fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: m.color }}>{m.init}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: S.text }}>{m.name}</div>
                <div style={{ fontSize: 11, color: S.textSoft }}>{m.role} · {m.company}</div>
              </div>
              <div style={{ marginLeft: 'auto', width: 8, height: 8, borderRadius: '50%', background: m.online ? S.green : S.border, flexShrink: 0 }} />
            </div>
          ))}
        </div>
        <div style={{ background: '#fff', border: `1px solid ${S.border}`, borderRadius: S.radius, padding: '18px 20px' }}>
          <div style={{ fontWeight: 700, fontSize: 13, color: S.text, marginBottom: 14, paddingBottom: 10, borderBottom: `1px solid ${S.border}` }}>Upcoming Events</div>
          {f.events.slice(0, 2).map((e, i) => (
            <div key={i} onClick={() => onSwitchPanel('events')} style={{ display: 'flex', gap: 12, padding: '9px 0', borderBottom: i < Math.min(f.events.length, 2) - 1 ? `1px solid ${S.border}` : 'none', cursor: 'pointer' }}>
              <div style={{ width: 44, height: 44, background: S.blueLight, borderRadius: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 700, color: S.blue, lineHeight: 1 }}>{e.day}</div>
                <div style={{ fontSize: 9, fontWeight: 700, color: S.blueMuted, textTransform: 'uppercase', letterSpacing: '.5px' }}>{e.month}</div>
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: S.text, marginBottom: 2 }}>{e.title}</div>
                <div style={{ fontSize: 11, color: S.textSoft }}>{e.time} · {e.attendees} going</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Chat Panel ────────────────────────────────────────────────────
function getInitials(name) {
  if (!name) return '?'
  return name.split(' ').map((w) => w[0]).join('').toUpperCase().substring(0, 2)
}

function getAvatarColor(name) {
  const colors = ['#4189DD', '#1a5db5', '#0f3d82', '#0d9488', '#7c3aed', '#e11d48', '#d97706', '#16a34a']
  let hash = 0
  for (const c of (name || '')) hash += c.charCodeAt(0)
  return colors[hash % colors.length]
}

function normalizeFieldMsg(msg, userId) {
  const d = new Date(msg.created_at)
  const h = d.getHours(), mi = d.getMinutes()
  return {
    id: msg.id,
    init: msg.user_init || (msg.user_name || '').substring(0, 2).toUpperCase() || '??',
    name: msg.user_name || 'Member',
    color: getAvatarColor(msg.user_name),
    role: 'student',
    msg: msg.message,
    time: `${h}:${mi < 10 ? '0' : ''}${mi} ${h < 12 ? 'AM' : 'PM'}`,
    own: msg.user_id === userId,
    reactions: [],
    image: null,
    replyTo: null,
  }
}

function ChatPanel({ field: f, user, userName, onSwitchPanel, onNewMessage, onlineCount, onlineUsers = [], memberCount }) {
  const [messages, setMessages] = useState([])
  const [inputVal, setInputVal] = useState('')
  const [replyingTo, setReplyingTo] = useState(null)
  const [pendingImage, setPendingImage] = useState(null)
  const messagesEndRef = useRef(null)
  const fileInputRef = useRef(null)
  const textareaRef = useRef(null)

  // Load from Supabase + subscribe to realtime when field changes
  useEffect(() => {
    setMessages([])
    setReplyingTo(null)
    setPendingImage(null)
    setInputVal('')
    // Mark as read on open
    localStorage.setItem(`hh_lastread_${f.id}`, new Date().toISOString())

    supabase
      .from('field_messages')
      .select('*')
      .eq('field_id', f.id)
      .order('created_at', { ascending: true })
      .limit(50)
      .then(({ data }) => {
        setMessages(data && data.length > 0
          ? data.map(m => normalizeFieldMsg(m, user?.id))
          : [...f.chatMessages]
        )
      })

    const channel = supabase
      .channel('field-chat-' + f.id)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'field_messages',
        filter: 'field_id=eq.' + f.id,
      }, (payload) => {
        const msg = normalizeFieldMsg(payload.new, user?.id)
        setMessages(prev => {
          // If showing seeded messages (no id), replace with real ones
          const wasSeeded = prev.length > 0 && !prev[0].id
          return wasSeeded ? [msg] : [...prev, msg]
        })
        onNewMessage?.()
        setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
      })
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [f.id])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendMsg() {
    const text = inputVal.trim()
    if (!text && !pendingImage) return
    setInputVal('')
    setPendingImage(null)
    setReplyingTo(null)
    if (textareaRef.current) textareaRef.current.style.height = ''
    if (!user) return
    const name = user?.user_metadata?.name || userName || 'Member'
    await supabase.from('field_messages').insert([{
      field_id: f.id,
      user_id: user.id,
      user_name: name,
      user_init: name.substring(0, 2).toUpperCase(),
      message: text,
    }])
  }

  function handleImage(e) {
    const file = e.target.files[0]
    if (!file) return
    setPendingImage(URL.createObjectURL(file))
  }

  function toggleReaction(idx, emoji) {
    setMessages(prev => prev.map((m, i) => {
      if (i !== idx) return m
      const reactions = [...(m.reactions || [])]
      const existing = reactions.find(r => r.emoji === emoji)
      if (existing) {
        existing.mine = !existing.mine
        existing.count += existing.mine ? 1 : -1
        return { ...m, reactions: reactions.filter(r => r.count > 0) }
      }
      return { ...m, reactions: [...reactions, { emoji, count: 1, mine: true }] }
    }))
  }

  const initials = (user?.user_metadata?.name || userName || '').substring(0, 2).toUpperCase()

  return (
    <div className="chat-panel" style={{ display: 'flex', flex: 1, overflow: 'hidden', height: '100%' }}>
      {/* Main chat */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ padding: '14px 20px', borderBottom: `1px solid ${S.border}`, display: 'flex', alignItems: 'center', gap: 12, background: '#fff', flexShrink: 0 }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: S.text }}>{f.name} Community</div>
            <div style={{ fontSize: 11, color: S.textSoft }}>{memberCount != null ? memberCount.toLocaleString() : '...'} members</div>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: S.green, fontWeight: 600 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: S.green, display: 'inline-block' }} />
            {onlineCount} online now
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ textAlign: 'center', fontSize: 11, color: S.textSoft, margin: '12px 0', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ flex: 1, height: 1, background: S.border, display: 'block' }} />
            Today
            <span style={{ flex: 1, height: 1, background: S.border, display: 'block' }} />
          </div>
          {messages.map((m, i) => {
            const isOwn = m.own || false
            const grouped = i > 0 && messages[i - 1].name === m.name && !m.own
            return (
              <div key={m.id || i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '3px 0', flexDirection: isOwn ? 'row-reverse' : 'row' }}>
                <div style={{ width: 34, flexShrink: 0, opacity: grouped ? 0 : 1 }}>
                  <div style={{ width: 34, height: 34, borderRadius: '50%', fontSize: 11, fontWeight: 600, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', background: getAvatarColor(m.name || m.init) }}>
                    {getInitials(m.name) || m.init}
                  </div>
                </div>
                <div style={{ maxWidth: '68%' }}>
                  {!grouped && !isOwn && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 4, flexDirection: 'row' }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: S.text }}>{m.name}</span>
                      {m.role === 'mentor' && <span style={{ padding: '1px 7px', borderRadius: 100, fontSize: 9, fontWeight: 700, background: S.amberLight, color: S.amber }}>Mentor</span>}
                      <span style={{ fontSize: 10, color: S.textSoft }}>{m.time}</span>
                    </div>
                  )}
                  {isOwn && !grouped && (
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 4 }}>
                      <span style={{ fontSize: 10, color: S.textSoft }}>{m.time}</span>
                    </div>
                  )}
                  {m.replyTo && (
                    <div style={{ background: S.bg, borderLeft: `3px solid ${S.blue}`, borderRadius: 6, padding: '6px 10px', marginBottom: 5, fontSize: 11, color: S.textSoft }}>
                      <div style={{ fontWeight: 700, color: S.blueDark, marginBottom: 1 }}>{m.replyTo.name}</div>
                      {m.replyTo.text}
                    </div>
                  )}
                  <div style={{
                    padding: '10px 14px', borderRadius: 16,
                    fontSize: 13, lineHeight: 1.6, wordBreak: 'break-word',
                    background: isOwn ? S.blue : '#fff',
                    color: isOwn ? '#fff' : S.textMid,
                    border: isOwn ? 'none' : `1px solid ${S.border}`,
                    borderTopLeftRadius: !isOwn ? 4 : 16,
                    borderTopRightRadius: isOwn ? 4 : 16,
                  }}>{m.msg}</div>
                  {m.image && <img src={m.image} alt="" style={{ width: '100%', maxWidth: 260, borderRadius: 12, marginTop: 6, border: `1px solid ${S.border}` }} />}
                  {m.reactions && m.reactions.length > 0 && (
                    <div style={{ display: 'flex', gap: 4, marginTop: 5, flexWrap: 'wrap' }}>
                      {m.reactions.map((r, ri) => (
                        <span key={ri} onClick={() => toggleReaction(i, r.emoji)} style={{ display: 'inline-flex', alignItems: 'center', gap: 3, padding: '3px 8px', borderRadius: 100, fontSize: 11, background: r.mine ? S.blueLight : S.bg, border: `1px solid ${r.mine ? S.blueMid : S.border}`, cursor: 'pointer' }}>
                          {r.emoji} {r.count}
                        </span>
                      ))}
                    </div>
                  )}
                  {!isOwn && (
                    <div style={{ marginTop: 4 }}>
                      <button onClick={() => setReplyingTo(m)} style={{ fontSize: 11, color: S.textSoft, background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>↩ Reply</button>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div style={{ padding: '14px 16px', borderTop: `1px solid ${S.border}`, background: '#fff', flexShrink: 0 }}>
          {replyingTo && (
            <div style={{ background: S.blueLight, borderLeft: `3px solid ${S.blue}`, borderRadius: 8, padding: '7px 12px', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ fontSize: 12, color: S.blueDark, flex: 1 }}>Replying to {replyingTo.name}: "{replyingTo.msg.substring(0, 60)}{replyingTo.msg.length > 60 ? '...' : ''}"</div>
              <button onClick={() => setReplyingTo(null)} style={{ fontSize: 14, color: S.textSoft, background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
            </div>
          )}
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
            <textarea
              ref={textareaRef}
              value={inputVal}
              onChange={e => {
                setInputVal(e.target.value)
                e.target.style.height = 'auto'
                e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'
              }}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMsg() } }}
              placeholder="Message the community..."
              rows={1}
              style={{ flex: 1, padding: '10px 14px', border: `1.5px solid ${S.border}`, borderRadius: 14, fontSize: 13, fontFamily: "'DM Sans', sans-serif", color: S.text, background: S.bg, outline: 'none', resize: 'none', maxHeight: 120, overflowY: 'auto', lineHeight: 1.5 }}
            />
            <button onClick={sendMsg} style={{ width: 40, height: 40, borderRadius: 12, background: S.blue, border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
              <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.5}><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
            </button>
          </div>
        </div>
      </div>

      {/* Chat sidebar */}
      <div className="chat-sidebar" style={{ width: 240, borderLeft: `1px solid ${S.border}`, overflowY: 'auto', background: '#fff' }}>
        <div style={{ padding: '16px 16px 8px' }}>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: S.textSoft, marginBottom: 12 }}>Online Now</div>
          {onlineUsers.length === 0 ? (
            <p style={{ fontSize: 12, color: S.textSoft, margin: 0 }}>No one online right now</p>
          ) : (
            onlineUsers.map(u => (
              <div key={u.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0' }}>
                <div style={{ width: 30, height: 30, borderRadius: '50%', fontSize: 10, fontWeight: 600, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', flexShrink: 0, background: S.blue }}>
                  {u.init}
                  <span style={{ position: 'absolute', bottom: 0, right: 0, width: 7, height: 7, borderRadius: '50%', background: S.green, border: '2px solid #fff' }} />
                </div>
                <div style={{ fontSize: 12, fontWeight: 500, color: S.textMid }}>{u.name}</div>
              </div>
            ))
          )}
          <div style={{ fontSize: 11, color: S.textSoft, marginTop: 8 }}>
            <span style={{ display: 'inline-block', width: 7, height: 7, borderRadius: '50%', background: S.green, marginRight: 5, verticalAlign: 'middle' }} />
            {onlineCount} online now
          </div>
        </div>
        <div style={{ padding: '16px 16px 8px', borderTop: `1px solid ${S.border}` }}>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: S.textSoft, marginBottom: 12 }}>Mentors</div>
          {f.mentors.map((m, i) => (
            <div key={i} onClick={() => onSwitchPanel('mentors')} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', cursor: 'pointer' }}>
              <div style={{ width: 30, height: 30, borderRadius: '50%', fontSize: 10, fontWeight: 600, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', flexShrink: 0, background: m.color }}>
                {m.init}
                {m.online && <span style={{ position: 'absolute', bottom: 0, right: 0, width: 7, height: 7, borderRadius: '50%', background: S.green, border: '2px solid #fff' }} />}
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 500, color: S.textMid }}>{m.name}</div>
                <div style={{ fontSize: 10, color: S.textSoft }}>{m.company}</div>
              </div>
              <span style={{ marginLeft: 'auto', fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 100, background: S.amberLight, color: S.amber }}>Mentor</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Mentors Panel ─────────────────────────────────────────────────
function MentorsPanel({ field: f, onSwitchPanel, showToast }) {
  const [mentorModal, setMentorModal] = useState(null)
  const [modalMsg, setModalMsg] = useState('')
  const [sentRequests, setSentRequests] = useState(() => {
    try { return JSON.parse(localStorage.getItem('hh_mentor_reqs') || '{}') } catch { return {} }
  })

  function handleSendRequest() {
    if (modalMsg.trim().length < 20) return
    const newSent = { ...sentRequests, [mentorModal.name]: true }
    setSentRequests(newSent)
    localStorage.setItem('hh_mentor_reqs', JSON.stringify(newSent))
    showToast(`Request sent to ${mentorModal.name}!`)
    setMentorModal(null)
    setModalMsg('')
  }

  return (
    <div style={{ padding: 24, maxWidth: 900 }}>
      {mentorModal && (
        <div onClick={() => { setMentorModal(null); setModalMsg('') }} style={{ position: 'fixed', inset: 0, background: 'rgba(12,18,32,.5)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, backdropFilter: 'blur(3px)' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 20, width: '100%', maxWidth: 480, padding: '28px 32px', boxShadow: '0 24px 80px rgba(0,0,0,.18)' }}>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 700, color: S.text, marginBottom: 6 }}>Request Mentorship</div>
            <p style={{ fontSize: 13, color: S.textMid, marginBottom: 18, lineHeight: 1.6 }}>Send a request to <strong>{mentorModal.name}</strong>. Tell them about your goals and what you'd like to learn.</p>
            <textarea
              value={modalMsg}
              onChange={e => setModalMsg(e.target.value)}
              placeholder="Hi! I'm learning and would love guidance on..."
              style={{ width: '100%', minHeight: 110, padding: '12px 14px', border: `1.5px solid ${S.border}`, borderRadius: 12, fontSize: 13, fontFamily: "'DM Sans', sans-serif", color: S.text, background: S.bg, outline: 'none', resize: 'vertical', boxSizing: 'border-box', lineHeight: 1.6 }}
            />
            <div style={{ fontSize: 11, color: modalMsg.trim().length < 20 ? S.rose : S.green, marginTop: 4, marginBottom: 18 }}>
              {modalMsg.trim().length < 20 ? `${20 - modalMsg.trim().length} more characters needed` : '✓ Ready to send'}
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button onClick={() => { setMentorModal(null); setModalMsg('') }} style={{ padding: '10px 20px', border: `1.5px solid ${S.border}`, background: '#fff', borderRadius: 100, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", color: S.textMid }}>Cancel</button>
              <button onClick={handleSendRequest} disabled={modalMsg.trim().length < 20} style={{ padding: '10px 24px', border: 'none', background: modalMsg.trim().length >= 20 ? S.blue : S.border, color: modalMsg.trim().length >= 20 ? '#fff' : S.textSoft, borderRadius: 100, fontSize: 13, fontWeight: 600, cursor: modalMsg.trim().length >= 20 ? 'pointer' : 'not-allowed', fontFamily: "'DM Sans', sans-serif" }}>Send Request</button>
            </div>
          </div>
        </div>
      )}
      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 700, marginBottom: 6, color: S.text }}>{f.name} Mentors</div>
      <p style={{ fontSize: 14, color: S.textMid, marginBottom: 22 }}>{f.mentors.length} expert{f.mentors.length > 1 ? 's' : ''} ready to guide you. Request a mentorship or ask a public question in the community chat.</p>
      <div className="mentor-panel-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
        {f.mentors.map((m, i) => (
          <MentorCard key={i} mentor={m} sent={!!sentRequests[m.name]} onRequest={() => setMentorModal(m)} onChat={() => onSwitchPanel('chat')} />
        ))}
      </div>
    </div>
  )
}

function MentorCard({ mentor: m, onRequest, onChat, sent }) {
  const [hover, setHover] = useState(false)
  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={{ background: '#fff', border: `1.5px solid ${hover ? S.blueMid : S.border}`, borderRadius: S.radiusLg, padding: 22, transition: 'all .2s', cursor: 'pointer', transform: hover ? 'translateY(-2px)' : 'none', boxShadow: hover ? '0 8px 24px rgba(65,137,221,.1)' : 'none' }}>
      <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 14 }}>
        <div style={{ width: 52, height: 52, borderRadius: '50%', fontFamily: "'Cormorant Garamond', serif", fontSize: 17, fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, position: 'relative', background: m.color }}>
          {m.init}
          {m.online && <span style={{ position: 'absolute', bottom: 1, right: 1, width: 12, height: 12, borderRadius: '50%', background: S.green, border: '2px solid #fff' }} />}
        </div>
        <div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 700, color: S.text, marginBottom: 1 }}>{m.name}</div>
          <div style={{ fontSize: 12, color: S.blue, fontWeight: 600, marginBottom: 3 }}>{m.role}</div>
          <div style={{ fontSize: 11, color: S.textSoft }}>{m.company}</div>
        </div>
      </div>
      <div style={{ fontSize: 12, color: S.textMid, lineHeight: 1.6, marginBottom: 12 }}>{m.bio}</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 12 }}>
        {m.chips.map(c => <span key={c} style={{ padding: '3px 9px', background: S.blueLight, color: S.blueDark, borderRadius: 100, fontSize: 10, fontWeight: 600 }}>{c}</span>)}
      </div>
      <div style={{ display: 'flex', gap: 14, marginBottom: 14 }}>
        <span style={{ fontSize: 11, color: S.textSoft }}><strong style={{ color: S.textMid }}>{m.ans}</strong> answers</span>
        <span style={{ fontSize: 11, color: S.textSoft }}><strong style={{ color: S.textMid }}>{m.students}</strong> students</span>
        <span style={{ fontSize: 11, color: S.textSoft }}><strong style={{ color: S.textMid }}>{m.rating}</strong> ★</span>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={sent ? undefined : onRequest} style={{ flex: 1, padding: 9, borderRadius: 100, fontSize: 12, fontWeight: 600, cursor: sent ? 'default' : 'pointer', fontFamily: "'DM Sans', sans-serif", background: sent ? S.greenLight : S.blue, color: sent ? S.green : '#fff', border: sent ? '1px solid #bbf7d0' : 'none' }}>{sent ? '✓ Request Sent' : 'Request Mentorship'}</button>
        <button onClick={onChat} style={{ flex: 1, padding: 9, borderRadius: 100, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", background: 'transparent', color: S.blue, border: `1.5px solid ${S.blueMid}` }}>Message in Chat</button>
      </div>
    </div>
  )
}

// ─── Roadmap Panel ─────────────────────────────────────────────────
function RoadmapPanel({ field: f, completed, onOpenLesson }) {
  const total = f.phases.reduce((s, p) => s + p.nodes.length, 0)
  const done = Object.keys(completed).filter(k => k.startsWith(f.id + '_')).length
  const pct = total > 0 ? Math.round((done / total) * 100) : 0
  let nodeNum = 0

  return (
    <div className="roadmap-content" style={{ padding: 24, display: 'grid', gridTemplateColumns: '1fr 260px', gap: 20, alignItems: 'start', maxWidth: 1000 }}>
      <div>
        <div className="mobile-roadmap-progress" style={{ fontSize: 12, color: S.textSoft, marginBottom: 16 }}>{pct}% complete</div>
        {f.phases.map((ph, pi) => (
          <div key={pi} style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: S.textSoft, marginBottom: 12, paddingLeft: 42 }}>{ph.label}</div>
            {ph.nodes.map((n, ni) => {
              const key = `${f.id}_${pi}_${ni}`
              const isDone = !!completed[key]
              const num = ++nodeNum
              const isLast = pi === f.phases.length - 1 && ni === ph.nodes.length - 1
              return (
                <div key={ni} onClick={() => onOpenLesson({ fid: f.id, pi, ni, field: f })} style={{ display: 'flex', marginBottom: 8, cursor: 'pointer' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 42, flexShrink: 0 }}>
                    <div style={{ width: 30, height: 30, borderRadius: '50%', border: `2px solid ${isDone ? S.blue : S.border}`, background: isDone ? S.blue : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: isDone ? '#fff' : S.textSoft, zIndex: 1, transition: 'all .2s', boxShadow: !isDone ? undefined : undefined }}>
                      {isDone ? <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.5}><polyline points="20 6 9 17 4 12" /></svg> : num}
                    </div>
                    {!isLast && <div style={{ width: 2, flex: 1, minHeight: 16, background: isDone ? S.blueMid : S.border }} />}
                  </div>
                  <RoadmapNode node={n} isDone={isDone} />
                </div>
              )
            })}
          </div>
        ))}
      </div>

      <div className="roadmap-sidebar">
        <div style={{ background: '#fff', border: `1px solid ${S.border}`, borderRadius: S.radius, padding: '16px 18px', marginBottom: 14 }}>
          <div style={{ fontWeight: 700, fontSize: 12, color: S.text, marginBottom: 10, paddingBottom: 8, borderBottom: `1px solid ${S.border}` }}>Your Progress</div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 700, color: f.color }}>{pct}%</div>
          <div style={{ height: 5, background: S.border, borderRadius: 100, overflow: 'hidden', margin: '8px 0' }}>
            <div style={{ height: '100%', background: f.color, borderRadius: 100, width: `${pct}%`, transition: 'width .5s' }} />
          </div>
          <div style={{ fontSize: 11, color: S.textSoft }}>{done} of {total} lessons complete</div>
        </div>
        <div style={{ background: '#fff', border: `1px solid ${S.border}`, borderRadius: S.radius, padding: '16px 18px' }}>
          <div style={{ fontWeight: 700, fontSize: 12, color: S.text, marginBottom: 10, paddingBottom: 8, borderBottom: `1px solid ${S.border}` }}>Resources</div>
          {f.resources.map((r, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '7px 0', borderBottom: i < f.resources.length - 1 ? `1px solid ${S.border}` : 'none', cursor: 'pointer' }}>
              <div style={{ width: 28, height: 28, borderRadius: 7, background: S.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, flexShrink: 0 }}>{r.icon}</div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: S.textMid }}>{r.name}</div>
                <div style={{ fontSize: 10, color: S.textSoft }}>{r.type}</div>
              </div>
              {r.free && <span style={{ marginLeft: 'auto', fontSize: 9, fontWeight: 700, color: S.green, background: S.greenLight, padding: '2px 6px', borderRadius: 100 }}>Free</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function RoadmapNode({ node: n, isDone }) {
  const [hover, setHover] = useState(false)
  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={{ flex: 1, background: isDone ? '#eaf2fd' : '#fff', border: `1.5px solid ${isDone ? S.blueMid : hover ? S.blueMid : S.border}`, borderRadius: S.radius, padding: '12px 16px', marginLeft: 6, transition: 'all .2s', boxShadow: hover ? '0 3px 12px rgba(65,137,221,.08)' : 'none' }}>
      <div style={{ fontWeight: 600, fontSize: 13, color: S.text, display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
        {n.t}
        {isDone && <span style={{ fontSize: 10, fontWeight: 700, color: S.blue, marginLeft: 'auto' }}>✓ Done</span>}
        <span style={{ marginLeft: isDone ? 0 : 'auto', fontSize: 10, color: S.textSoft, flexShrink: 0, whiteSpace: 'nowrap' }}>{n.dur}</span>
      </div>
      <div style={{ fontSize: 11, color: S.textSoft, lineHeight: 1.5 }}>{n.s}</div>
      <div style={{ display: 'flex', gap: 4, marginTop: 7, flexWrap: 'wrap' }}>
        {n.tags.map(t => <span key={t} style={{ padding: '2px 7px', background: S.bg, border: `1px solid ${S.border}`, borderRadius: 100, fontSize: 9, fontWeight: 500, color: S.textSoft }}>{t}</span>)}
      </div>
    </div>
  )
}

// ─── Leaderboard Panel ─────────────────────────────────────────────
async function fetchLeaderboard(f) {
  const fieldTags = new Set([
    ...f.chips.map(c => c.toLowerCase()),
    ...f.phases.flatMap(ph => ph.nodes.flatMap(n => n.tags.map(t => t.toLowerCase())))
  ])

  const { data: allQuestions } = await supabase
    .from('questions')
    .select('id, user_id, poster_name, tags')
    .limit(200)

  const scores = {}
  const fieldQIds = []

  ;(allQuestions || []).forEach(q => {
    const qtags = (q.tags || []).map(t => t.toLowerCase())
    if (qtags.some(t => fieldTags.has(t))) {
      fieldQIds.push(q.id)
      if (q.user_id) {
        if (!scores[q.user_id]) scores[q.user_id] = { name: q.poster_name, score: 0 }
        scores[q.user_id].score += 10
      }
    }
  })

  if (fieldQIds.length > 0) {
    const { data: answers } = await supabase
      .from('answers')
      .select('user_id, author_name, question_id')
      .in('question_id', fieldQIds)
      .limit(200)
    ;(answers || []).forEach(a => {
      if (!a.user_id) return
      if (!scores[a.user_id]) scores[a.user_id] = { name: a.author_name, score: 0 }
      scores[a.user_id].score += 15
    })
  }

  return Object.entries(scores)
    .map(([id, data]) => ({ id, ...data }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)
}

function LeaderboardPanel({ field: f, completed, userName }) {
  const [realBoard, setRealBoard] = useState([])

  useEffect(() => {
    fetchLeaderboard(f).then(setRealBoard).catch(console.error)
  }, [f.id])

  const userDone = Object.keys(completed).filter(k => k.startsWith(f.id + '_')).length
  const userPoints = userDone * 10
  const userInitials = userName.substring(0, 2).toUpperCase()
  const userDisplayName = userName.charAt(0).toUpperCase() + userName.slice(1)

  // Merge real data with hardcoded fallback
  const realFormatted = realBoard.map(entry => ({
    name: entry.name || 'Member',
    init: (entry.name || 'M').substring(0, 2).toUpperCase(),
    loc: '',
    score: entry.score,
    color: getAvatarColor(entry.name),
    change: `+${entry.score}`,
  }))
  const staticBoard = f.leaderboard
  const lb = realFormatted.length >= 3
    ? realFormatted
    : [...realFormatted, ...staticBoard.slice(realFormatted.length)]

  const podium = lb.slice(0, 3)
  const rest = lb.slice(3)

  return (
    <div style={{ padding: 24, maxWidth: 700 }}>
      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 700, marginBottom: 6, color: S.text }}>Leaderboard</div>
      <p style={{ fontSize: 13, color: S.textMid, marginBottom: 22 }}>Points earned by completing lessons, answering questions, and helping the community.</p>

      {/* Podium */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr 1fr', gap: 10, marginBottom: 28, alignItems: 'end' }}>
        {/* 2nd */}
        {podium[1] ? (
          <div style={{ background: '#fff', border: `1px solid ${S.border}`, borderRadius: S.radius, padding: '18px 14px', textAlign: 'center', position: 'relative' }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', margin: '0 auto 8px', fontSize: 14, fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', background: podium[1].color }}>{podium[1].init}</div>
            <div style={{ fontWeight: 700, fontSize: 13, color: S.text, marginBottom: 2 }}>{podium[1].name}</div>
            <div style={{ fontSize: 10, color: S.textSoft, marginBottom: 6 }}>{podium[1].loc}</div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 700, color: S.blue }}>{podium[1].score.toLocaleString()}</div>
            <div style={{ position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)', fontSize: 10, fontWeight: 700, color: S.textSoft, letterSpacing: '.5px' }}>2ND</div>
          </div>
        ) : <div />}

        {/* 1st */}
        {podium[0] && (
          <div style={{ background: 'linear-gradient(135deg,#eaf2fd,#fff)', border: `1px solid ${S.blueMid}`, borderRadius: S.radius, padding: '18px 14px 22px', textAlign: 'center', position: 'relative' }}>
            <div style={{ width: 52, height: 52, borderRadius: '50%', margin: '0 auto 8px', fontSize: 16, fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', background: podium[0].color }}>{podium[0].init}</div>
            <div style={{ fontWeight: 700, fontSize: 13, color: S.text, marginBottom: 2 }}>{podium[0].name}</div>
            <div style={{ fontSize: 10, color: S.textSoft, marginBottom: 6 }}>{podium[0].loc}</div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 700, color: S.blue }}>{podium[0].score.toLocaleString()}</div>
            <div style={{ position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)', fontSize: 10, fontWeight: 700, color: S.textSoft, letterSpacing: '.5px' }}>1ST</div>
          </div>
        )}

        {/* 3rd */}
        {podium[2] ? (
          <div style={{ background: '#fff', border: `1px solid ${S.border}`, borderRadius: S.radius, padding: '18px 14px', textAlign: 'center', position: 'relative' }}>
            <div style={{ height: 20 }} />
            <div style={{ width: 40, height: 40, borderRadius: '50%', margin: '0 auto 8px', fontSize: 13, fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', background: podium[2].color }}>{podium[2].init}</div>
            <div style={{ fontWeight: 700, fontSize: 13, color: S.text, marginBottom: 2 }}>{podium[2].name}</div>
            <div style={{ fontSize: 10, color: S.textSoft, marginBottom: 6 }}>{podium[2].loc}</div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 700, color: S.blue }}>{podium[2].score.toLocaleString()}</div>
            <div style={{ position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)', fontSize: 10, fontWeight: 700, color: S.textSoft, letterSpacing: '.5px' }}>3RD</div>
          </div>
        ) : <div />}
      </div>

      {/* Rest */}
      {rest.map((m, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#fff', border: `1px solid ${S.border}`, borderRadius: S.radius, padding: '13px 16px', marginBottom: 8 }}>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 700, color: S.textSoft, minWidth: 28, textAlign: 'center' }}>{i + 4}</div>
          <div style={{ width: 36, height: 36, borderRadius: '50%', fontSize: 12, fontWeight: 600, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: m.color }}>{m.init}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: 13, color: S.text, marginBottom: 1 }}>{m.name}</div>
            <div style={{ fontSize: 11, color: S.textSoft }}>{m.loc}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 700, color: S.blue }}>{m.score.toLocaleString()}</div>
            <div style={{ fontSize: 10, fontWeight: 700, color: S.green }}>{m.change} this week</div>
          </div>
        </div>
      ))}

      {/* User row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: S.blueLight, border: `2px solid ${S.blueMid}`, borderRadius: S.radius, padding: '13px 16px' }}>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 700, color: S.blue, minWidth: 28, textAlign: 'center' }}>{lb.length + 1}</div>
        <div style={{ width: 36, height: 36, borderRadius: '50%', fontSize: 12, fontWeight: 600, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: S.blue }}>{userInitials}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, fontSize: 13, color: S.text, marginBottom: 1 }}>{userDisplayName} (You)</div>
          <div style={{ fontSize: 11, color: S.textSoft }}>Community member</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 700, color: S.blue }}>{userPoints}</div>
          <div style={{ fontSize: 10, fontWeight: 700, color: S.green }}>+{userPoints} total</div>
        </div>
      </div>
    </div>
  )
}

// ─── Events Panel ──────────────────────────────────────────────────
function EventsPanel({ field: f, isRsvped, onToggleRsvp, showToast }) {
  const typeStyle = {
    online: { background: '#eaf2fd', color: '#1a5db5', label: 'Online' },
    challenge: { background: '#fef3c7', color: '#d97706', label: 'Challenge' },
    live: { background: '#ffe4e6', color: '#e11d48', label: 'Live' },
  }

  return (
    <div style={{ padding: 24, maxWidth: 800 }}>
      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 700, marginBottom: 6, color: S.text }}>Upcoming Events</div>
      <p style={{ fontSize: 13, color: S.textMid, marginBottom: 22 }}>Live sessions, workshops, and challenges hosted by your mentors and community.</p>
      {f.events.map((e, i) => {
        const rsvped = isRsvped(f.id, i)
        const ts = typeStyle[e.type] || typeStyle.online
        return (
          <EventCard key={i} event={e} rsvped={rsvped} typeStyle={ts} onRsvp={() => {
            onToggleRsvp(f.id, i)
            if (!rsvped) showToast("You're going! Event saved ✓")
          }} />
        )
      })}
    </div>
  )
}

function EventCard({ event: e, rsvped, typeStyle, onRsvp }) {
  const [hover, setHover] = useState(false)
  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={{ background: '#fff', border: `1px solid ${hover ? S.blueMid : S.border}`, borderRadius: S.radiusLg, padding: 22, marginBottom: 14, display: 'flex', gap: 18, cursor: 'pointer', transition: 'all .2s', boxShadow: hover ? '0 6px 20px rgba(65,137,221,.09)' : 'none', transform: hover ? 'translateY(-1px)' : 'none' }}>
      <div style={{ width: 56, height: 56, background: S.blueLight, borderRadius: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: `1px solid ${S.blueMid}` }}>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 700, color: S.blue, lineHeight: 1 }}>{e.day}</div>
        <div style={{ fontSize: 9, fontWeight: 700, color: S.blueMuted, textTransform: 'uppercase', letterSpacing: '.5px' }}>{e.month}</div>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 700, color: S.text, marginBottom: 4 }}>{e.title}</div>
        <div style={{ fontSize: 13, color: S.textMid, lineHeight: 1.55, marginBottom: 10 }}>{e.desc}</div>
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ padding: '3px 10px', borderRadius: 100, fontSize: 10, fontWeight: 700, background: typeStyle.background, color: typeStyle.color }}>{typeStyle.label}</span>
          <span style={{ fontSize: 11, color: S.textSoft }}>{e.time}</span>
          <span style={{ fontSize: 11, color: S.textSoft }}>{e.host}</span>
          <span style={{ fontSize: 11, color: S.textSoft }}>{e.attendees} going</span>
        </div>
      </div>
      <button onClick={e2 => { e2.stopPropagation(); onRsvp() }} style={{ padding: '9px 20px', background: rsvped ? S.greenLight : S.blue, color: rsvped ? S.green : '#fff', border: rsvped ? '1px solid #bbf7d0' : 'none', borderRadius: 100, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", whiteSpace: 'nowrap', alignSelf: 'center', flexShrink: 0 }}>
        {rsvped ? '✓ Going' : 'RSVP'}
      </button>
    </div>
  )
}

// ─── Field Hub ─────────────────────────────────────────────────────
function FieldHub({ field, activePanel, onPanelChange, onBack, completed, markComplete, toggleRsvp, isRsvped, onOpenLesson, showToast, userName, user, navigate, memberCounts = {} }) {
  const [onlineUsers, setOnlineUsers] = useState([])
  const [chatUnread, setChatUnread] = useState(0)
  const [activeCount, setActiveCount] = useState(null)

  const onlineCount = onlineUsers.length

  // Clear unread badge when switching to chat
  useEffect(() => {
    if (activePanel === 'chat') {
      setChatUnread(0)
      localStorage.setItem(`hh_lastread_${field.id}`, new Date().toISOString())
    }
  }, [activePanel, field.id])

  // Supabase presence — track real online users in this field
  useEffect(() => {
    if (!field?.id) return
    const name = user?.user_metadata?.name || user?.name || 'Anonymous'
    const ch = supabase.channel('online-' + field.id, {
      config: { presence: { key: user?.id || 'guest' } }
    })
    ch.on('presence', { event: 'sync' }, () => {
      const state = ch.presenceState()
      const users = Object.values(state).flat().map(u => ({
        id: u.user_id,
        name: u.user_name,
        init: u.user_init,
      }))
      setOnlineUsers(users)
    })
    .subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        await ch.track({
          user_id: user?.id || 'guest',
          user_name: name,
          user_init: name.substring(0, 2).toUpperCase(),
          online_at: new Date().toISOString(),
        })
      }
    })
    return () => supabase.removeChannel(ch)
  }, [field?.id, user?.id])

  // Active members this week from field_messages
  useEffect(() => {
    if (!field?.id) return
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    supabase
      .from('field_messages')
      .select('user_id')
      .eq('field_id', field.id)
      .gte('created_at', weekAgo.toISOString())
      .then(({ data }) => {
        if (!data) return
        const unique = new Set(data.map(m => m.user_id).filter(Boolean))
        setActiveCount(unique.size)
      })
  }, [field?.id])

  function handleNewChatMessage() {
    if (activePanel !== 'chat') {
      setChatUnread(prev => prev + 1)
    }
  }

  return (
    <div className="hub-page" style={{ display: 'flex', height: 'calc(100vh - 64px)', overflow: 'hidden' }}>
      <HubSidebar field={field} activePanel={activePanel} onPanelChange={onPanelChange} onBack={onBack} onlineCount={onlineCount} onlineUsers={onlineUsers} activeCount={activeCount} chatBadge={chatUnread} memberCount={memberCounts[field.id]} />
      <div className="hub-main" style={{ flex: 1, overflowY: activePanel === 'chat' ? 'hidden' : 'auto', display: 'flex', flexDirection: 'column' }}>
        {/* Back bar — always visible above panels */}
        <div style={{ padding: '10px 20px', borderBottom: `1px solid ${S.border}`, background: '#fff', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <button
            onClick={onBack}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#8a9bbf',
              fontSize: 13,
              fontFamily: 'DM Sans, sans-serif',
              fontWeight: 500,
              padding: '16px 0 0 0',
              marginBottom: 8,
              transition: 'color 0.15s',
            }}
            onMouseOver={e => e.currentTarget.style.color = '#4189DD'}
            onMouseOut={e => e.currentTarget.style.color = '#8a9bbf'}
          >
            ← All Fields
          </button>
          <span style={{ fontSize: 12, color: S.textSoft }}>/</span>
          <span style={{ fontSize: 13, fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, color: S.text }}>{field.name}</span>
        </div>
        <MobileHubTabs activePanel={activePanel} onPanelChange={onPanelChange} />
        <div className="hub-panel">
          {activePanel === 'overview' && <OverviewPanel field={field} completed={completed} onSwitchPanel={onPanelChange} memberCount={memberCounts[field.id]} />}
          {activePanel === 'chat' && <ChatPanel field={field} user={user} userName={userName} onSwitchPanel={onPanelChange} onNewMessage={handleNewChatMessage} onlineCount={onlineCount} onlineUsers={onlineUsers} memberCount={memberCounts[field.id]} />}
          {activePanel === 'mentors' && <MentorsPanel field={field} onSwitchPanel={onPanelChange} showToast={showToast} />}
          {activePanel === 'roadmap' && <RoadmapPanel field={field} completed={completed} onOpenLesson={onOpenLesson} />}
          {activePanel === 'leaderboard' && <LeaderboardPanel field={field} completed={completed} userName={userName} />}
          {activePanel === 'events' && <EventsPanel field={field} isRsvped={isRsvped} onToggleRsvp={toggleRsvp} showToast={showToast} />}
        </div>
      </div>
    </div>
  )
}

// ─── Main Learn Page ───────────────────────────────────────────────
async function getMemberCount(fieldId) {
  const { count } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .contains('joined_fields', [fieldId])
  return count || 0
}

export default function Learn({ user }) {
  const [currentField, setCurrentField] = useState(null)
  const [activePanel, setActivePanel] = useState('overview')
  const [lessonModal, setLessonModal] = useState(null)
  const [toast, setToast] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [memberCounts, setMemberCounts] = useState({})
  const { joined, completed, toggleJoin, markComplete, getProgress, toggleRsvp, isRsvped } = useLearnState()
  const navigate = useNavigate()

  const userName = user?.name || localStorage.getItem('hh_name') || 'student'

  // Load real member counts from profiles.joined_fields
  useEffect(() => {
    async function loadCounts() {
      const counts = {}
      for (const field of FIELDS) {
        counts[field.id] = await getMemberCount(field.id)
      }
      setMemberCounts(counts)
    }
    loadCounts()
  }, [])

  // Migrate localStorage joined fields → Supabase on login
  useEffect(() => {
    if (!user?.id) return
    const localJoined = JSON.parse(localStorage.getItem('hh_joined') || '[]')
    if (localJoined.length === 0) return
    supabase
      .from('profiles')
      .select('joined_fields')
      .eq('id', user.id)
      .single()
      .then(({ data }) => {
        const merged = [...new Set([...(data?.joined_fields || []), ...localJoined])]
        supabase.from('profiles').update({ joined_fields: merged }).eq('id', user.id)
      })
  }, [user?.id])

  function showToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }

  async function handleToggleJoin(fieldId) {
    const isJoined = joined.includes(fieldId)
    toggleJoin(fieldId) // localStorage + local state
    showToast(isJoined ? 'Left community' : 'Joined! Welcome to the community')
    if (!user?.id) return
    const { data: profile } = await supabase
      .from('profiles')
      .select('joined_fields')
      .eq('id', user.id)
      .single()
    const current = profile?.joined_fields || []
    if (isJoined) {
      await supabase
        .from('profiles')
        .update({ joined_fields: current.filter(f => f !== fieldId) })
        .eq('id', user.id)
      setMemberCounts(prev => ({ ...prev, [fieldId]: Math.max((prev[fieldId] || 0) - 1, 0) }))
    } else {
      if (!current.includes(fieldId)) {
        await supabase
          .from('profiles')
          .update({ joined_fields: [...current, fieldId] })
          .eq('id', user.id)
        setMemberCounts(prev => ({ ...prev, [fieldId]: (prev[fieldId] || 0) + 1 }))
      }
    }
  }

  function openField(id) {
    const f = FIELDS.find(f => f.id === id)
    if (!f) return
    if (!joined.includes(id)) handleToggleJoin(id)
    setCurrentField(f)
    setActivePanel('overview')
    window.scrollTo(0, 0)
  }

  const filteredFields = FIELDS.filter(f =>
    !searchQuery ||
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.desc.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: S.bg, minHeight: 'calc(100vh - 64px)', color: S.text }}>
      <Toast msg={toast} />

      {lessonModal && (
        <LessonModal
          lesson={lessonModal}
          completed={completed}
          onMark={() => {
            if (!completed[`${lessonModal.fid}_${lessonModal.pi}_${lessonModal.ni}`]) {
              markComplete(lessonModal.fid, lessonModal.pi, lessonModal.ni)
              showToast('Lesson complete ✓ +10 points')
            }
            setLessonModal(null)
          }}
          onClose={() => setLessonModal(null)}
          onAskAI={() => { setLessonModal(null); navigate('/ai') }}
        />
      )}

      {!currentField ? (
        <FieldPicker
          fields={filteredFields}
          allFields={FIELDS}
          joined={joined}
          completed={completed}
          searchQuery={searchQuery}
          onSearch={setSearchQuery}
          onOpen={openField}
          onToggleJoin={id => handleToggleJoin(id)}
          showToast={showToast}
          getProgress={getProgress}
          memberCounts={memberCounts}
          onGoHome={() => navigate('/home')}
        />
      ) : (
        <FieldHub
          field={currentField}
          activePanel={activePanel}
          onPanelChange={setActivePanel}
          onBack={() => setCurrentField(null)}
          joined={joined}
          completed={completed}
          markComplete={markComplete}
          toggleRsvp={toggleRsvp}
          isRsvped={isRsvped}
          onOpenLesson={setLessonModal}
          showToast={showToast}
          userName={userName}
          user={user}
          navigate={navigate}
          memberCounts={memberCounts}
        />
      )}
    </div>
  )
}
