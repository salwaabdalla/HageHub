import { useState } from 'react'

export function useLearnState() {
  const [joined, setJoined] = useState(() =>
    JSON.parse(localStorage.getItem('hh_joined') || '[]')
  )
  const [completed, setCompleted] = useState(() =>
    JSON.parse(localStorage.getItem('hh_completed') || '{}')
  )
  const [rsvped, setRsvped] = useState(() =>
    JSON.parse(localStorage.getItem('hh_rsvp_all') || '{}')
  )

  function toggleJoin(fieldId) {
    const next = joined.includes(fieldId)
      ? joined.filter(x => x !== fieldId)
      : [...joined, fieldId]
    setJoined(next)
    localStorage.setItem('hh_joined', JSON.stringify(next))
  }

  function markComplete(fieldId, pi, ni) {
    const key = `${fieldId}_${pi}_${ni}`
    const next = { ...completed, [key]: true }
    setCompleted(next)
    localStorage.setItem('hh_completed', JSON.stringify(next))
  }

  function getProgress(fieldId, totalNodes) {
    const done = Object.keys(completed).filter(k => k.startsWith(fieldId + '_')).length
    return { done, pct: totalNodes > 0 ? Math.round((done / totalNodes) * 100) : 0 }
  }

  function getFieldDone(fieldId) {
    return Object.keys(completed).filter(k => k.startsWith(fieldId + '_')).length
  }

  function toggleRsvp(fieldId, eventIdx) {
    const current = rsvped[fieldId] || []
    const next = current.includes(eventIdx)
      ? current.filter(x => x !== eventIdx)
      : [...current, eventIdx]
    const nextAll = { ...rsvped, [fieldId]: next }
    setRsvped(nextAll)
    localStorage.setItem('hh_rsvp_all', JSON.stringify(nextAll))
  }

  function isRsvped(fieldId, eventIdx) {
    return (rsvped[fieldId] || []).includes(eventIdx)
  }

  return { joined, completed, toggleJoin, markComplete, getProgress, getFieldDone, toggleRsvp, isRsvped }
}
