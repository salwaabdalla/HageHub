import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { contributors, questions as seedQuestions } from '../data/questions'
import { learnCourses, LEARN_TRACKS, LEARN_PROGRESS_KEY } from '../data/learn'
import { QuestionCard } from '../components/knowledge/QuestionCard'
import { AskModal } from '../components/knowledge/AskModal'
import { castVote } from '../lib/storage'

const QUESTION_STORAGE_KEY = 'hagehub_questions'
const COMMUNITY_FEED_KEY = 'hh_comments'
const THREAD_COMMENT_KEY = 'hh_thread_comments'
const AI_CHAT_KEY = 'hh_ai_messages'

const topNavItems = [
  { label: 'Ask', to: '/home', page: 'dashboard' },
  { label: 'Learn', to: '/learn', page: 'learn' },
  { label: 'Questions', to: '/ask', page: 'knowledge' },
  { label: 'AI', to: '/ai', page: 'ai' },
  { label: 'Connect', to: '/connect', page: 'connect' },
  { label: 'Build', to: '/build', page: 'build' },
  { label: 'Stories', to: '/stories', page: 'stories' },
]

const communitySeed = [
  {
    id: 'community-1',
    name: 'Hodan Mire',
    text: 'The Somali AI explainer is making it easier for new members to ask better questions.',
  },
  {
    id: 'community-2',
    name: 'Abdi Axmed',
    text: 'We should keep project-based cohorts visible for juniors building their first portfolio.',
  },
]

const mentorCards = [
  ['AA', 'Abdi Axmed', 'Senior SWE · Google', ['Algorithms', 'System Design'], 'San Francisco, CA', '#4189DD'],
  ['HM', 'Hodan Muuse', 'Product Manager · Meta', ['Product', 'Career Growth'], 'London, UK', '#1a5db5'],
  ['YI', 'Yusuf Ibraahim', 'Full-Stack · Shopify', ['React', 'Node.js'], 'Toronto, Canada', '#0f3d82'],
  ['FN', 'Faadumo Nuur', 'ML Engineer · Anthropic', ['AI/ML', 'Python'], 'Seattle, WA', '#6aaae8'],
]

const jobs = [
  ['AM', 'Amazon', 'Software Engineer — New Grad', 'Seattle, WA', '$140k–$165k', ['ft', 'som'], '#eaf2fd', '#1a5db5'],
  ['ST', 'Stripe', 'Frontend Engineering Intern', 'Remote', '$8k/month', ['int', 'rem'], '#e8f5ee', '#1a6b4a'],
  ['HB', 'Hormuud Telecom', 'Data Scientist — East Africa', 'Mogadishu', 'Competitive', ['ft', 'som'], '#f3f0ff', '#5b3fa0'],
  ['GG', 'Golis Tech', 'Backend Engineer', 'Hargeisa / Remote', 'Competitive', ['ft', 'rem', 'som'], '#fff3e0', '#a06010'],
]

const buildProjects = [
  {
    id: 'p1',
    title: 'Somali AI Tutor',
    description: 'An AI that explains CS concepts in Somali for the first time. Helping the next generation learn in their native language.',
    status: 'building',
    roles: ['Frontend', 'AI/ML', 'Somali Translation'],
    rolesOpen: ['AI/ML', 'Somali Translation'],
    tags: ['AI', 'Education', 'Somali'],
    members: [['AA', '#4189DD'], ['HM', '#1a5db5'], ['YI', '#0f3d82']],
    impact: 'Somalia · Diaspora',
  },
  {
    id: 'p2',
    title: 'Somali Job Platform',
    description: 'A dedicated job board connecting Somali engineers with opportunities in Somalia, the diaspora, and remote-first companies.',
    status: 'building',
    roles: ['Frontend', 'Backend', 'Product Design'],
    rolesOpen: ['Backend', 'Product Design'],
    tags: ['Web', 'Career', 'Community'],
    members: [['FN', '#6aaae8'], ['MH', '#4189DD']],
    impact: 'Global',
  },
  {
    id: 'p3',
    title: 'Cybersecurity Learning Lab',
    description: 'Hands-on CTF challenges and security labs built for East African students breaking into cybersecurity from scratch.',
    status: 'idea',
    roles: ['Backend', 'Security', 'UI/UX'],
    rolesOpen: ['Backend', 'Security', 'UI/UX'],
    tags: ['Security', 'CTF', 'Education'],
    members: [['CA', '#5b3fa0']],
    impact: 'East Africa',
  },
  {
    id: 'p4',
    title: 'Somali E-Learning Platform',
    description: 'Structured coding courses in Somali from zero to deployed. Think freeCodeCamp, built entirely for Somali learners.',
    status: 'idea',
    roles: ['Frontend', 'Curriculum Design', 'Video'],
    rolesOpen: ['Frontend', 'Curriculum Design', 'Video'],
    tags: ['Education', 'Somali', 'Full-Stack'],
    members: [],
    impact: 'Somalia · Diaspora',
  },
  {
    id: 'p5',
    title: 'HageHub Mobile App',
    description: 'Native mobile app for HageHub — Q&A, AI tutor, and mentor matching in your pocket. Built with React Native.',
    status: 'idea',
    roles: ['React Native', 'Backend', 'UI/UX'],
    rolesOpen: ['React Native', 'Backend', 'UI/UX'],
    tags: ['Mobile', 'React Native', 'Community'],
    members: [['YF', '#a06010']],
    impact: 'Global',
  },
  {
    id: 'p6',
    title: 'Somalia Fintech API',
    description: 'Open API for Somali mobile money (EVC, Zaad) to help developers build financial products across East Africa.',
    status: 'building',
    roles: ['Backend', 'API Design', 'Security'],
    rolesOpen: ['API Design'],
    tags: ['Fintech', 'API', 'Somalia'],
    members: [['AB', '#1a6b4a'], ['SO', '#0f3d82'], ['MD', '#4189DD']],
    impact: 'Somalia',
  },
]

const statusMeta = {
  idea: { label: 'Open Idea', color: '#7c3aed', bg: '#f5f3ff' },
  building: { label: 'Building Now', color: '#1a5db5', bg: '#eaf2fd' },
  complete: { label: 'Completed', color: '#1a6b4a', bg: '#e8f5ee' },
}

const stories = [
  ['#0f3d82', 'AA', 'A', 'Abdi Axmed', 'Mar 2024', 'From Mogadishu to Google: my 5-year journey', "I learned to code on a borrowed laptop in a cafe with spotty internet. Here's what nobody tells you about making it in tech from Somalia.", 'Career'],
  ['#1a5db5', 'HM', 'H', 'Hodan Muuse', 'Feb 2024', 'On being Somali in a room full of engineers', 'The subtle moments that make you question if you belong and why building this community changes everything.', 'Identity'],
  ['#255b99', 'YI', 'Y', 'Yusuf Ibraahim', 'Jan 2024', "Building Somalia's first fintech startup from Hargeisa", 'No VC network. No Silicon Valley backing. Just a real problem and a community worth building for.', 'Somalia'],
  ['#6aaae8', 'FN', 'F', 'Faadumo Nuur', 'Dec 2023', 'Why I turned down a $200k offer to work on Somali AI', 'The most important use of my ML skills is not somewhere far away. It is here.', 'AI / ML'],
]

function readStorage(key, fallback) {
  try {
    const stored = window.localStorage.getItem(key)
    return stored ? JSON.parse(stored) : fallback
  } catch {
    return fallback
  }
}

function writeStorage(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value))
}

function initials(name = 'User') {
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}

function normalizeQuestion(question) {
  if (question.poster) return question

  return {
    id: String(question.id),
    lang: 'both',
    title: question.title?.so || question.title?.en || 'Untitled',
    body: question.title?.en || question.title?.so || '',
    tags: question.tags || [],
    votes: question.upvotes || 0,
    answers: question.answers || 0,
    poster: {
      init: initials(question.author?.name || 'User'),
      name: question.author?.name || 'Community member',
      loc: question.author?.city || 'Online',
    },
    time: question.createdAt
      ? new Date(question.createdAt).toLocaleDateString()
      : 'Just now',
  }
}

function getAllQuestions() {
  return [
    ...readStorage(QUESTION_STORAGE_KEY, []).map(normalizeQuestion),
    ...seedQuestions.map(normalizeQuestion),
  ]
}

function getCurrentPage(pathname) {
  if (pathname === '/home') return 'dashboard'
  if (pathname === '/learn') return 'learn'
  if (pathname === '/ask') return 'knowledge'
  if (pathname === '/ai') return 'ai'
  if (pathname === '/connect') return 'connect'
  if (pathname === '/build') return 'build'
  if (pathname === '/stories') return 'stories'
  if (pathname === '/profile') return 'profile'
  if (pathname === '/settings') return 'settings'
  return 'dashboard'
}


function HageHubWorkspace({ user, onLogout }) {
  const navigate = useNavigate()
  const { pathname, state: routerState } = useLocation()
  const currentPage = getCurrentPage(pathname)
  const [activeThreadId, setActiveThreadId] = useState(routerState?.threadId ?? null)
  const [knowledgeFilter, setKnowledgeFilter] = useState('all')
  const [connectTab, setConnectTab] = useState(
    user?.role === 'mentor' ? 'requests' : 'browse',
  )
  const [workTab, setWorkTab] = useState('all')
  const [buildTab, setBuildTab] = useState('all')
  const [learnTrack, setLearnTrack] = useState('all')
  const [learnCourseId, setLearnCourseId] = useState(null)
  const [learnLessonId, setLearnLessonId] = useState(null)
  const [learnProgress, setLearnProgress] = useState(() => readStorage(LEARN_PROGRESS_KEY, {}))
  const [joinedProjects, setJoinedProjects] = useState(() => new Set())
  const [profileTab, setProfileTab] = useState('activity')
  const [showAskModal, setShowAskModal] = useState(false)
  const [communityComments, setCommunityComments] = useState(() =>
    readStorage(COMMUNITY_FEED_KEY, communitySeed),
  )
  const [threadComments, setThreadComments] = useState(() =>
    readStorage(THREAD_COMMENT_KEY, {}),
  )
  const [aiMessages, setAiMessages] = useState(() =>
    readStorage(AI_CHAT_KEY, [
      {
        id: 'welcome',
        role: 'assistant',
        content:
          "Salaan. I'm Hage AI. Ask a CS question in Somali or English and I will keep it practical.",
      },
    ]),
  )
  const [aiInput, setAiInput] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [threadAiAnswers, setThreadAiAnswers] = useState({})
  const [threadAiLoading, setThreadAiLoading] = useState(false)
  const [profilePic, setProfilePic] = useState(() => readStorage(`hh_pic_${user?.name}`, null))
  const profilePicRef = useRef(null)
  const [questionsVersion, setQuestionsVersion] = useState(0)
  const [threadReply, setThreadReply] = useState('')

  const questions = getAllQuestions()
  const activeThread = questions.find((question) => question.id === activeThreadId)

  useEffect(() => {
    if (!activeThreadId || !activeThread) return
    if (threadAiAnswers[activeThreadId]) return
    setThreadAiLoading(true)
    const prompt = activeThread.title + (activeThread.body ? '\n\n' + activeThread.body : '')
    fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content:
              'You are Hage AI, a bilingual CS tutor for the Somali tech community. Answer the question below in BOTH languages. Lead with "🇸🇴 Somali:" then "🇬🇧 English:". Keep it practical, beginner-friendly, and under 150 words per language.',
          },
          { role: 'user', content: prompt },
        ],
        max_tokens: 600,
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        const answer =
          data.choices?.[0]?.message?.content ||
          '🇸🇴 Waan ka xumahay, jawaab ma helin.\n🇬🇧 Sorry, no answer available.'
        setThreadAiAnswers((prev) => ({ ...prev, [activeThreadId]: answer }))
      })
      .catch(() => {
        setThreadAiAnswers((prev) => ({
          ...prev,
          [activeThreadId]: '🇸🇴 Xiriirka AI-ga wuu jabay.\n🇬🇧 AI connection failed. Please try again.',
        }))
      })
      .finally(() => setThreadAiLoading(false))
  }, [activeThreadId])

  function handleLogout() {
    onLogout()
    navigate('/login')
  }

  function markLessonComplete(lessonId) {
    const next = { ...learnProgress, [lessonId]: true }
    setLearnProgress(next)
    writeStorage(LEARN_PROGRESS_KEY, next)
  }

  function handleVote(id, delta) {
    const result = castVote(id, delta > 0 ? 1 : -1)
    setQuestionsVersion((v) => v + 1)
    return result
  }

  function handlePostQuestion(questionData) {
    const stored = readStorage(QUESTION_STORAGE_KEY, [])
    writeStorage(QUESTION_STORAGE_KEY, [questionData, ...stored])
    setQuestionsVersion((v) => v + 1)
    setShowAskModal(false)
  }

  function postCommunityComment(text) {
    const next = [
      ...communityComments,
      { id: String(Date.now()), name: user?.name || 'Community member', text },
    ]
    setCommunityComments(next)
    writeStorage(COMMUNITY_FEED_KEY, next)
  }

  function postThreadReply(event) {
    event.preventDefault()
    if (!activeThreadId || !threadReply.trim()) return
    const next = {
      ...threadComments,
      [activeThreadId]: [
        ...(threadComments[activeThreadId] || []),
        { id: String(Date.now()), name: user?.name || 'Community member', text: threadReply.trim() },
      ],
    }
    setThreadComments(next)
    writeStorage(THREAD_COMMENT_KEY, next)
    postCommunityComment(threadReply.trim())
    setThreadReply('')
  }

  async function sendAi(event) {
    event.preventDefault()
    if (!aiInput.trim() || aiLoading) return
    const userText = aiInput.trim()
    const userMsg = { id: `u-${Date.now()}`, role: 'user', content: userText }
    const withUser = [...aiMessages, userMsg]
    setAiMessages(withUser)
    setAiInput('')
    setAiLoading(true)
    postCommunityComment(userText)
    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'system',
              content:
                'You are Hage AI, a bilingual CS tutor built for the Somali tech community. Always answer in BOTH Somali (af Soomaali) and English. Lead with the Somali explanation labelled "🇸🇴 Somali:", then follow with the English explanation labelled "🇬🇧 English:". Keep answers practical, concise, and encouraging. You are part of HageHub — the first digital infrastructure for Somali technologists worldwide.',
            },
            ...withUser.map(({ role, content }) => ({ role, content })),
          ],
          max_tokens: 1024,
        }),
      })
      const data = await res.json()
      const reply =
        data.choices?.[0]?.message?.content ||
        '🇸🇴 Somali: Waan ka xumahay, jawaab ma helin.\n🇬🇧 English: Sorry, no response was received.'
      const assistantMsg = { id: `a-${Date.now()}`, role: 'assistant', content: reply }
      const next = [...withUser, assistantMsg]
      setAiMessages(next)
      writeStorage(AI_CHAT_KEY, next)
    } catch {
      const errMsg = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        content:
          '🇸🇴 Somali: Waan ka xumahay, xiriirka API-ga wuu jabay.\n🇬🇧 English: Sorry, the connection failed. Please try again.',
      }
      setAiMessages([...withUser, errMsg])
    } finally {
      setAiLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#f4f7fb] text-slate-900">
      <header className="sticky top-0 z-40 border-b border-[#dce6f5] bg-white">
        <div className="mx-auto flex max-w-[1240px] flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <Link to="/" className="font-display text-3xl tracking-tight text-slate-950">
            Hage Hub
          </Link>
          <nav className="flex flex-wrap items-center gap-2 rounded-full border border-[#dce6f5] bg-[#f4f7fb] p-1">
            {topNavItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.to}
                className={`rounded-full px-4 py-2 text-sm font-medium ${
                  currentPage === item.page
                    ? 'bg-[#4189DD] text-white shadow-[0_6px_18px_rgba(65,137,221,0.28)]'
                    : 'text-slate-500 hover:bg-white'
                }`}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="flex flex-wrap items-center gap-3">
            <NavLink to="/profile" className="flex items-center gap-3 rounded-full bg-white px-3 py-2">
              <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full">
                {profilePic ? (
                  <img src={profilePic} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-[#4189DD] text-xs font-semibold text-white">{initials(user?.name)}</div>
                )}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">{user?.name}</p>
                <p className="text-xs text-slate-500">{user?.role || 'student'}</p>
              </div>
            </NavLink>
            <NavLink to="/settings" className="rounded-full border border-[#dce6f5] bg-white px-4 py-2 text-sm font-medium text-slate-700">
              Settings
            </NavLink>
            <button type="button" onClick={handleLogout} className="rounded-full border border-[#dce6f5] bg-white px-4 py-2 text-sm font-medium text-slate-700">
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1240px] px-4 py-8 sm:px-6 lg:px-8">
        {currentPage === 'dashboard' ? (
          <>
            <section className="relative overflow-hidden rounded-[28px] border border-[#dce6f5] bg-white px-6 py-8 shadow-[0_18px_60px_rgba(65,137,221,0.08)] sm:px-8 lg:px-11">
              <div className="pointer-events-none absolute -right-16 -top-20 h-72 w-72 rounded-full bg-[#eaf2fd]" />
              <div className="relative grid gap-8 lg:grid-cols-[1fr_320px] lg:items-end">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">
                    Dashboard
                  </p>
                  <h1 className="mt-4 font-display text-5xl leading-none tracking-tight text-slate-950 sm:text-6xl">
                    Asc, <span className="text-[#4189DD]">{user?.name}</span>
                  </h1>
                  <p className="mt-4 max-w-2xl text-[15px] leading-8 text-slate-600">
                    Your next step in Hage Hub is shaped by what you want to learn, answer, and build with the community.
                  </p>
                  <div className="mt-8 flex flex-wrap items-center gap-0 overflow-x-auto pb-2">
                    {['Start', 'Learn', 'Ask', 'Connect', 'Build', 'Get Hired'].map((step, index) => {
                      const current = user?.role === 'mentor' ? 3 : 1
                      return (
                        <div key={step} className="flex items-center">
                          <div className={`rounded-full border px-5 py-3 text-sm font-medium ${index === current ? 'border-[#4189DD] bg-[#4189DD] text-white shadow-[0_8px_22px_rgba(65,137,221,0.28)]' : index < current ? 'border-[#c8dff7] bg-[#eaf2fd] text-[#1a5db5]' : 'border-[#dce6f5] bg-white text-slate-400'}`}>
                            {step}
                          </div>
                          {index < 5 ? <div className="h-px w-8 bg-[#dce6f5] sm:w-10" /> : null}
                        </div>
                      )
                    })}
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="rounded-[24px] border border-[#dce6f5] bg-[#f4f7fb] p-5">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-400">
                      Shared activity
                    </p>
                    <p className="mt-3 font-display text-3xl text-slate-950">
                      {communityComments.length} community comments
                    </p>
                    <p className="mt-2 text-sm leading-7 text-slate-600">
                      Shared discussion remains visible after logout, so another user still sees the community history.
                    </p>
                  </div>
                  <div className="rounded-[24px] bg-[#0f3d82] p-5 text-white">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/55">
                      Current mode
                    </p>
                    <p className="mt-3 font-display text-3xl">
                      {user?.role === 'mentor' ? 'Guide the community' : 'Grow your path'}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_300px]">
              <div>
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                  Recent Questions
                </p>
                <h2 className="mb-4 font-display text-4xl text-slate-950">Keep the conversation moving</h2>
                <button type="button" onClick={() => setShowAskModal(true)} className="mb-4 rounded-full bg-[#4189DD] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#1a5db5]">
                  + Ask a Question
                </button>
                <div className="space-y-3">
                  {questions.slice(0, 4).map((question) => (
                    <article key={question.id} className="cursor-pointer rounded-[20px] border border-[#dce6f5] bg-white px-5 py-5 transition hover:-translate-y-0.5 hover:border-[#c8dff7] hover:shadow-[0_8px_24px_rgba(65,137,221,0.08)]" onClick={() => navigate('/ask', { state: { threadId: question.id } })}>
                      <div className="flex gap-4">
                        <div className="flex min-w-8 flex-col items-center gap-1">
                          <button type="button" onClick={(event) => { event.stopPropagation(); handleVote(question.id, 1) }} className="flex h-7 w-7 items-center justify-center rounded-[10px] border border-[#dce6f5] bg-[#f4f7fb] text-xs text-slate-400">▲</button>
                          <span className="text-sm font-bold text-slate-600">{question.votes}</span>
                          <button type="button" onClick={(event) => { event.stopPropagation(); handleVote(question.id, -1) }} className="flex h-7 w-7 items-center justify-center rounded-[10px] border border-[#dce6f5] bg-[#f4f7fb] text-xs text-slate-400">▼</button>
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="rounded-full bg-[#eaf2fd] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#1a5db5]">
                            {question.lang === 'both' ? 'Both' : question.lang}
                          </span>
                          <h3 className="mt-2 font-display text-2xl leading-tight text-slate-950">{question.title}</h3>
                          <p className="mt-1 text-sm leading-7 text-slate-600">{question.body}</p>
                          <div className="mt-4 flex flex-wrap items-center gap-2">
                            {question.tags.map((tag) => (
                              <span key={tag} className="rounded-full bg-[#eaf2fd] px-3 py-1 text-xs font-medium text-[#1a5db5]">{tag}</span>
                            ))}
                            <div className="ml-auto flex flex-wrap items-center gap-3 text-xs text-slate-400">
                              <span>{question.poster.name}</span>
                              <span>{question.answers} answers</span>
                              <span>{question.time}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
              <aside className="space-y-4">
                <section className="rounded-[20px] border border-[#dce6f5] bg-white p-5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">Top Contributors</p>
                  <div className="mt-4 space-y-3">
                    {contributors.map((contributor, index) => (
                      <div key={contributor.name} className="flex items-center gap-3 border-b border-[#dce6f5] pb-3 last:border-b-0 last:pb-0">
                        <span className="w-5 font-display text-xl text-slate-400">{index + 1}.</span>
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#4189DD] text-xs font-semibold text-white">{initials(contributor.name)}</div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-slate-900">{contributor.name}</p>
                          <p className="text-xs text-slate-400">{contributor.city}</p>
                        </div>
                        <span className="font-display text-2xl text-[#4189DD]">{contributor.points}</span>
                      </div>
                    ))}
                  </div>
                </section>
                <section className="rounded-[20px] border border-[#dce6f5] bg-white p-5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">Popular Tags</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {['algorithms', 'python', 'react', 'web-dev', 'ai/ml', 'system-design', 'somalia-tech'].map((tag) => (
                      <span key={tag} className="rounded-full border border-[#dce6f5] bg-[#f4f7fb] px-3 py-2 text-xs font-medium text-slate-600">{tag}</span>
                    ))}
                  </div>
                </section>
                <section className="rounded-[20px] bg-[#0f3d82] p-5 text-white">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/55">My Cohort</p>
                  <p className="mt-3 font-display text-3xl">Abdi Axmed · Mentor</p>
                  <p className="mt-2 text-sm text-white/70">Interview Prep · Week 3 of 8</p>
                  <div className="mt-4 h-2 rounded-full bg-white/10"><div className="h-full w-[37.5%] rounded-full bg-[#6aaae8]" /></div>
                </section>
              </aside>
            </section>
          </>
        ) : null}

        {currentPage === 'knowledge' ? (
          activeThread ? (
            /* ── Question Detail / Thread View ── */
            <div className="mx-auto max-w-4xl">
              <button type="button" onClick={() => setActiveThreadId(null)} className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-slate-400 transition hover:text-[#4189DD]">
                ← Back to questions
              </button>

              {/* Question header card */}
              <div className="rounded-[24px] border border-[#dce6f5] bg-white p-6 sm:p-8">
                {/* Language badge + tags */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-[#eaf2fd] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#1a5db5]">
                    {activeThread.lang === 'both' ? 'Somali + English' : activeThread.lang === 'so' ? 'Somali' : 'English'}
                  </span>
                  {activeThread.tags.map((tag) => (
                    <span key={tag} className="rounded-full border border-[#dce6f5] bg-[#f4f7fb] px-3 py-1 text-xs font-medium text-slate-500">#{tag}</span>
                  ))}
                </div>

                {/* Title — bilingual for seed questions, plain for user questions */}
                {activeThread.lang === 'both' && activeThread.body ? (
                  <div className="mt-4 space-y-3">
                    <div className="flex items-start gap-2">
                      <span className="mt-1 text-base">🇸🇴</span>
                      <h1 className="font-display text-3xl leading-snug text-slate-950 sm:text-4xl">{activeThread.title}</h1>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="mt-1 text-base">🇬🇧</span>
                      <p className="text-lg leading-8 text-slate-600">{activeThread.body}</p>
                    </div>
                  </div>
                ) : (
                  <h1 className="mt-4 font-display text-3xl leading-snug text-slate-950 sm:text-4xl">{activeThread.title}</h1>
                )}

                {/* Meta row */}
                <div className="mt-5 flex flex-wrap items-center gap-4 border-b border-[#dce6f5] pb-5">
                  <div className="flex items-center gap-2.5">
                    {profilePic && activeThread.poster.name === user?.name ? (
                      <img src={profilePic} alt="" className="h-9 w-9 rounded-full object-cover" />
                    ) : (
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#4189DD] text-xs font-semibold text-white">
                        {activeThread.poster.init}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{activeThread.poster.name}</p>
                      {activeThread.poster.loc && <p className="text-xs text-slate-400">{activeThread.poster.loc}</p>}
                    </div>
                  </div>
                  <span className="text-xs text-slate-400">{activeThread.time}</span>
                  <div className="ml-auto flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                      <button type="button" onClick={() => handleVote(activeThread.id, 1)} className="flex h-8 w-8 items-center justify-center rounded-[10px] border border-[#dce6f5] bg-[#f4f7fb] text-xs text-slate-400 transition hover:border-[#4189DD] hover:text-[#4189DD]">▲</button>
                      <span className="min-w-[2ch] text-center text-sm font-bold text-slate-700">{activeThread.votes}</span>
                      <button type="button" onClick={() => handleVote(activeThread.id, -1)} className="flex h-8 w-8 items-center justify-center rounded-[10px] border border-[#dce6f5] bg-[#f4f7fb] text-xs text-slate-400 transition hover:border-red-300 hover:text-red-400">▼</button>
                    </div>
                    <span className="text-sm text-slate-400">
                      {(threadComments[activeThreadId] || []).length} {(threadComments[activeThreadId] || []).length === 1 ? 'answer' : 'answers'}
                    </span>
                  </div>
                </div>

                {/* Body — only for user-created questions (not bilingual ones already shown above) */}
                {activeThread.body && activeThread.lang !== 'both' && (
                  <p className="mt-5 text-[15px] leading-8 text-slate-600">{activeThread.body}</p>
                )}
                {/* Attached images */}
                {(() => {
                  const imgs = activeThread.images?.length ? activeThread.images : activeThread.image ? [activeThread.image] : []
                  return imgs.length > 0 ? (
                    <div className="mt-5 flex flex-wrap gap-3">
                      {imgs.map((src, i) => (
                        <img key={i} src={src} alt={`Attachment ${i + 1}`} className="max-h-80 max-w-full rounded-[12px] object-contain border border-[#dce6f5]" />
                      ))}
                    </div>
                  ) : null
                })()}
              </div>

              {/* AI Answer */}
              <div className="mt-4 rounded-[24px] bg-[#0f3d82] p-6 text-white">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#6aaae8]/20 text-xs font-bold text-[#6aaae8]">AI</div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#6aaae8]">Hage AI — Suggested Answer</p>
                </div>
                {threadAiLoading ? (
                  <div className="mt-4 flex items-center gap-1.5">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-[#6aaae8] [animation-delay:0ms]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-[#6aaae8] [animation-delay:150ms]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-[#6aaae8] [animation-delay:300ms]" />
                  </div>
                ) : (
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-8 text-white/85">
                    {threadAiAnswers[activeThreadId] || ''}
                  </p>
                )}
              </div>

              {/* Community answers / comments */}
              <div className="mt-6">
                <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                  Community Answers ({(threadComments[activeThreadId] || []).length})
                </p>

                {(threadComments[activeThreadId] || []).length === 0 ? (
                  <div className="rounded-[20px] border border-dashed border-[#dce6f5] bg-white p-8 text-center text-sm text-slate-400">
                    No answers yet — be the first to help.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {(threadComments[activeThreadId] || []).map((comment) => (
                      <div key={comment.id} className="flex gap-4 rounded-[20px] border border-[#dce6f5] bg-white p-5">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#eaf2fd] text-[10px] font-semibold text-[#1a5db5]">{initials(comment.name)}</div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{comment.name}</p>
                          <p className="mt-1.5 text-sm leading-7 text-slate-600">{comment.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <form onSubmit={postThreadReply} className="mt-4 flex gap-3">
                  <input value={threadReply} onChange={(event) => setThreadReply(event.target.value)} placeholder="Write your answer..." className="min-w-0 flex-1 rounded-[12px] border border-[#dce6f5] bg-white px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-[#4189DD] focus:ring-1 focus:ring-[#4189DD]" />
                  <button type="submit" className="rounded-[12px] bg-[#4189DD] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#1a5db5]">Post</button>
                </form>
              </div>
            </div>
          ) : (
            /* ── Questions List View ── */
            <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
              <div>
                {/* Page header */}
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-400">Community</p>
                    <h1 className="font-display text-4xl text-slate-950">Questions</h1>
                  </div>
                  <button type="button" onClick={() => setShowAskModal(true)} className="rounded-full bg-[#4189DD] px-5 py-3 text-sm font-medium text-white shadow-[0_6px_18px_rgba(65,137,221,0.28)] transition hover:bg-[#1a5db5]">
                    + Ask a Question
                  </button>
                </div>

                {/* Filter tabs */}
                <div className="mb-5 flex flex-wrap gap-2">
                  {[
                    ['all', 'All Questions'],
                    ['so', 'Somali'],
                    ['en', 'English'],
                    ['mine', 'My Questions'],
                  ].map(([value, label]) => (
                    <button key={value} type="button" onClick={() => setKnowledgeFilter(value)} className={`rounded-full px-4 py-2 text-sm font-medium transition ${knowledgeFilter === value ? 'bg-[#4189DD] text-white shadow-[0_4px_12px_rgba(65,137,221,0.25)]' : 'border border-[#dce6f5] bg-white text-slate-500 hover:border-[#c8dff7]'}`}>
                      {label}
                    </button>
                  ))}
                </div>

                {/* Questions list */}
                <div className="space-y-3">
                  {questions
                    .filter((question) => {
                      if (knowledgeFilter === 'so') return question.lang === 'so' || question.lang === 'both'
                      if (knowledgeFilter === 'en') return question.lang === 'en' || question.lang === 'both'
                      if (knowledgeFilter === 'mine') return question.poster.name === user?.name
                      return true
                    })
                    .map((question) => (
                      <QuestionCard
                        key={question.id}
                        question={question}
                        threadComments={threadComments}
                        onOpen={() => setActiveThreadId(question.id)}
                      />
                    ))}
                </div>
              </div>

              {/* Sidebar */}
              <aside className="space-y-4">
                <section className="rounded-[20px] border border-[#dce6f5] bg-white p-5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">Top Contributors</p>
                  <div className="mt-4 space-y-3">
                    {contributors.slice(0, 3).map((contributor, index) => (
                      <div key={contributor.name} className="flex items-center gap-3">
                        <span className="w-5 font-display text-xl text-slate-400">{index + 1}.</span>
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#4189DD] text-xs font-semibold text-white">{initials(contributor.name)}</div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-slate-900">{contributor.name}</p>
                          <p className="text-xs text-slate-400">{contributor.city}</p>
                        </div>
                        <span className="font-display text-lg text-[#4189DD]">{contributor.points}</span>
                      </div>
                    ))}
                  </div>
                </section>
                <section className="rounded-[20px] border border-[#dce6f5] bg-white p-5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">Popular Tags</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {['algorithms', 'python', 'react', 'web-dev', 'ai/ml', 'system-design', 'somalia-tech'].map((tag) => (
                      <span key={tag} className="rounded-full border border-[#dce6f5] bg-[#f4f7fb] px-3 py-1.5 text-xs font-medium text-slate-600">#{tag}</span>
                    ))}
                  </div>
                </section>
              </aside>
            </div>
          )
        ) : null}

        {currentPage === 'learn' ? (() => {
          const activeCourse = learnCourses.find((c) => c.id === learnCourseId)
          const activeLesson = activeCourse?.lessons.find((l) => l.id === learnLessonId)
          const filteredCourses = learnTrack === 'all' ? learnCourses : learnCourses.filter((c) => c.track === learnTrack)

          // ── Lesson detail view ──
          if (activeCourse && activeLesson) {
            const lessonIndex = activeCourse.lessons.indexOf(activeLesson)
            const prevLesson = activeCourse.lessons[lessonIndex - 1]
            const nextLesson = activeCourse.lessons[lessonIndex + 1]
            const isDone = learnProgress[activeLesson.id]
            return (
              <div className="mx-auto max-w-3xl">
                {/* Breadcrumb */}
                <div className="mb-6 flex items-center gap-2 text-sm text-slate-400">
                  <button type="button" onClick={() => { setLearnCourseId(null); setLearnLessonId(null) }} className="transition hover:text-[#4189DD]">Kayd Learn</button>
                  <span>/</span>
                  <button type="button" onClick={() => setLearnLessonId(null)} className="transition hover:text-[#4189DD]">{activeCourse.title.en}</button>
                  <span>/</span>
                  <span className="text-slate-600">{activeLesson.title.en}</span>
                </div>

                <div className="rounded-[24px] border border-[#dce6f5] bg-white overflow-hidden">
                  {/* Lesson header */}
                  <div style={{ background: activeCourse.color }} className="px-8 py-6">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                        Lesson {lessonIndex + 1} of {activeCourse.lessons.length}
                      </span>
                      {isDone && (
                        <span className="flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white">
                          ✓ Completed
                        </span>
                      )}
                    </div>
                    <h1 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="mt-3 text-3xl font-semibold text-white leading-snug">
                      {activeLesson.title.en}
                    </h1>
                    <p className="mt-1 text-white/70 text-sm">{activeLesson.title.so}</p>
                  </div>

                  {/* Bilingual body */}
                  <div className="p-8 space-y-6">
                    <div className="grid gap-5 lg:grid-cols-2">
                      <div className="rounded-[16px] bg-[#eaf2fd] p-5 border border-[#c8dff7]">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-lg">🇸🇴</span>
                          <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#1a5db5]">Af Soomaali</span>
                        </div>
                        <p className="text-sm leading-7 text-[#0c1220] whitespace-pre-line">{activeLesson.body.so}</p>
                      </div>
                      <div className="rounded-[16px] bg-[#f4f7fb] p-5 border border-[#dce6f5]">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-lg">🇬🇧</span>
                          <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">English</span>
                        </div>
                        <p className="text-sm leading-7 text-slate-700 whitespace-pre-line">{activeLesson.body.en}</p>
                      </div>
                    </div>

                    {/* Code block */}
                    {activeLesson.code && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Code Example</span>
                        </div>
                        <pre className="rounded-[16px] bg-[#0c1220] p-5 overflow-x-auto text-[13px] leading-6 text-[#e2e8f0]" style={{ fontFamily: 'monospace' }}>
                          <code>{activeLesson.code}</code>
                        </pre>
                      </div>
                    )}

                    {/* Ask AI + Complete row */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#dce6f5]">
                      <button
                        type="button"
                        onClick={() => {
                          const q = `Explain "${activeLesson.title.en}" — ${activeCourse.title.en}`
                          setAiMessages((prev) => [...prev, { id: `u-${Date.now()}`, role: 'user', content: q }])
                          navigate('/ai')
                        }}
                        className="flex items-center gap-2 rounded-full border border-[#c8dff7] bg-[#eaf2fd] px-4 py-2 text-sm font-medium text-[#1a5db5] transition hover:bg-[#dbeeff]"
                      >
                        <span className="text-base">🤖</span> Ask Hage AI about this lesson
                      </button>

                      {!isDone ? (
                        <button
                          type="button"
                          onClick={() => markLessonComplete(activeLesson.id)}
                          style={{ background: activeCourse.color }}
                          className="rounded-full px-5 py-2.5 text-sm font-semibold text-white shadow-[0_4px_14px_rgba(65,137,221,0.3)] transition hover:opacity-90"
                        >
                          ✓ Mark as Complete
                        </button>
                      ) : (
                        <span className="rounded-full bg-[#e8f5ee] px-5 py-2.5 text-sm font-semibold text-[#1a6b4a]">
                          ✓ Completed
                        </span>
                      )}
                    </div>

                    {/* Prev / Next navigation */}
                    <div className="flex items-center justify-between gap-4 pt-2">
                      {prevLesson ? (
                        <button type="button" onClick={() => setLearnLessonId(prevLesson.id)} className="flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-[#4189DD]">
                          ← {prevLesson.title.en}
                        </button>
                      ) : <div />}
                      {nextLesson ? (
                        <button type="button" onClick={() => { markLessonComplete(activeLesson.id); setLearnLessonId(nextLesson.id) }} style={{ background: activeCourse.color }} className="flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90">
                          Next: {nextLesson.title.en} →
                        </button>
                      ) : (
                        <button type="button" onClick={() => setLearnLessonId(null)} className="flex items-center gap-2 rounded-full bg-[#0f3d82] px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90">
                          ← Back to course
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          }

          // ── Course detail / lesson list view ──
          if (activeCourse) {
            const completedCount = activeCourse.lessons.filter((l) => learnProgress[l.id]).length
            const pct = Math.round((completedCount / activeCourse.lessons.length) * 100)
            return (
              <div className="mx-auto max-w-3xl">
                <button type="button" onClick={() => setLearnCourseId(null)} className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-slate-400 transition hover:text-[#4189DD]">
                  ← Back to Kayd Learn
                </button>

                {/* Course header */}
                <div className="rounded-[24px] overflow-hidden border border-[#dce6f5] mb-6">
                  <div style={{ background: activeCourse.color }} className="px-8 py-7">
                    <div className="flex items-start gap-4">
                      <span className="text-4xl">{activeCourse.emoji}</span>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white capitalize">{activeCourse.difficulty}</span>
                          {activeCourse.tags.map((t) => (
                            <span key={t} className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/80">{t}</span>
                          ))}
                        </div>
                        <h1 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-3xl font-semibold text-white leading-snug">{activeCourse.title.en}</h1>
                        <p className="mt-1 text-white/70 text-sm">{activeCourse.title.so}</p>
                        <p className="mt-3 text-white/80 text-sm leading-6">{activeCourse.description}</p>
                      </div>
                    </div>
                    {completedCount > 0 && (
                      <div className="mt-5">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs text-white/70">{completedCount} of {activeCourse.lessons.length} lessons complete</span>
                          <span className="text-xs font-bold text-white">{pct}%</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-white/20">
                          <div className="h-full rounded-full bg-white transition-all" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Lesson list */}
                <div className="space-y-3">
                  {activeCourse.lessons.map((lesson, i) => {
                    const done = learnProgress[lesson.id]
                    return (
                      <div
                        key={lesson.id}
                        onClick={() => setLearnLessonId(lesson.id)}
                        className="flex items-center gap-5 rounded-[20px] border border-[#dce6f5] bg-white p-5 cursor-pointer transition hover:-translate-y-0.5 hover:border-[#c8dff7] hover:shadow-[0_8px_24px_rgba(65,137,221,0.08)]"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold" style={{ background: done ? activeCourse.color : '#f4f7fb', color: done ? '#fff' : '#8a9bbf', border: `1.5px solid ${done ? activeCourse.color : '#dce6f5'}` }}>
                          {done ? '✓' : i + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-xl font-semibold text-slate-900">{lesson.title.en}</p>
                          <p className="text-xs text-slate-400 mt-0.5">{lesson.title.so}</p>
                        </div>
                        <svg viewBox="0 0 24 24" width={16} height={16} stroke="#8a9bbf" strokeWidth={2} fill="none" className="shrink-0">
                          <polyline points="9 18 15 12 9 6" />
                        </svg>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          }

          // ── Course catalog view ──
          return (
            <div>
              {/* Page header */}
              <div className="mb-8">
                <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-400">Layer 1</p>
                <h1 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="mt-1 text-5xl font-semibold text-slate-950 tracking-tight">Kayd · Learn</h1>
                <p className="mt-3 max-w-xl text-[15px] leading-7 text-slate-500">
                  Structured CS courses in both Somali and English. From your first line of code to interview-ready.
                </p>
              </div>

              {/* Track filter */}
              <div className="mb-6 flex flex-wrap gap-2">
                {LEARN_TRACKS.map(({ id, label }) => (
                  <button key={id} type="button" onClick={() => setLearnTrack(id)} className={`rounded-full px-4 py-2 text-sm font-medium transition ${learnTrack === id ? 'bg-[#4189DD] text-white shadow-[0_4px_12px_rgba(65,137,221,0.25)]' : 'border border-[#dce6f5] bg-white text-slate-500 hover:border-[#c8dff7]'}`}>
                    {label}
                  </button>
                ))}
              </div>

              {/* Course grid */}
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {filteredCourses.map((course) => {
                  const completedCount = course.lessons.filter((l) => learnProgress[l.id]).length
                  const pct = Math.round((completedCount / course.lessons.length) * 100)
                  const started = completedCount > 0
                  return (
                    <div
                      key={course.id}
                      onClick={() => setLearnCourseId(course.id)}
                      className="flex flex-col rounded-[20px] border border-[#dce6f5] bg-white overflow-hidden cursor-pointer transition hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(65,137,221,0.12)] hover:border-[#c8dff7]"
                    >
                      {/* Color strip */}
                      <div className="h-2" style={{ background: course.color }} />
                      <div className="flex-1 p-6 flex flex-col gap-4">
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-3xl">{course.emoji}</span>
                          <span className="rounded-full border border-[#dce6f5] bg-[#f4f7fb] px-3 py-1 text-[10px] font-semibold capitalize text-slate-500">{course.difficulty}</span>
                        </div>
                        <div>
                          <h3 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-2xl font-semibold text-slate-950 leading-snug">{course.title.en}</h3>
                          <p className="text-xs text-slate-400 mt-0.5">{course.title.so}</p>
                          <p className="mt-2 text-sm leading-6 text-slate-500 line-clamp-2">{course.description}</p>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {course.tags.map((t) => (
                            <span key={t} className="rounded-full bg-[#f4f7fb] border border-[#dce6f5] px-2.5 py-0.5 text-[10px] font-medium text-slate-500">#{t}</span>
                          ))}
                        </div>

                        {/* Progress or lesson count */}
                        <div className="mt-auto">
                          {started ? (
                            <>
                              <div className="flex items-center justify-between mb-1.5">
                                <span className="text-xs text-slate-400">{completedCount}/{course.lessons.length} lessons</span>
                                <span className="text-xs font-bold" style={{ color: course.color }}>{pct}%</span>
                              </div>
                              <div className="h-1.5 rounded-full bg-[#f4f7fb]">
                                <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: course.color }} />
                              </div>
                            </>
                          ) : (
                            <p className="text-xs text-slate-400">{course.lessons.length} lessons</p>
                          )}
                        </div>
                      </div>
                      <div className="px-6 pb-5">
                        <div className="flex items-center justify-between rounded-[12px] px-4 py-3 text-sm font-semibold text-white" style={{ background: course.color }}>
                          {started ? (pct === 100 ? '✓ Completed' : 'Continue →') : 'Start Course →'}
                          <span className="text-white/70 text-xs font-normal">{course.lessons.length} lessons</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })() : null}

        {currentPage === 'ai' ? (
          <section className="rounded-[28px] border border-[#dce6f5] bg-white shadow-[0_18px_60px_rgba(65,137,221,0.08)]">
            <div className="flex flex-col gap-4 border-b border-[#dce6f5] px-6 py-5 sm:flex-row sm:items-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-[#0f3d82] text-white">AI</div>
              <div className="flex-1">
                <p className="font-display text-3xl text-slate-950">Hage AI Assistant</p>
                <p className="text-sm text-slate-400">Ask anything in Somali or English.</p>
              </div>
            </div>
            <div className="flex min-h-[420px] flex-col gap-4 px-6 py-6">
              <div className="flex-1 space-y-4 overflow-y-auto">
                {aiMessages.map((message) => (
                  <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] whitespace-pre-wrap rounded-[16px] px-4 py-3 text-sm leading-7 ${message.role === 'user' ? 'bg-[#4189DD] text-white' : 'border border-[#dce6f5] bg-[#f4f7fb] text-slate-600'}`}>
                      {message.content}
                    </div>
                  </div>
                ))}
                {aiLoading && (
                  <div className="flex justify-start">
                    <div className="flex items-center gap-1.5 rounded-[16px] border border-[#dce6f5] bg-[#f4f7fb] px-4 py-3">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-[#4189DD] [animation-delay:0ms]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-[#4189DD] [animation-delay:150ms]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-[#4189DD] [animation-delay:300ms]" />
                    </div>
                  </div>
                )}
              </div>
              <form onSubmit={sendAi} className="flex gap-3">
                <textarea rows={2} value={aiInput} onChange={(event) => setAiInput(event.target.value)} placeholder="Ask a CS question in Somali or English..." className="min-h-[52px] flex-1 resize-none rounded-[12px] border border-[#dce6f5] bg-[#f4f7fb] px-4 py-3 text-sm outline-none focus:border-[#4189DD]" />
                <button type="submit" disabled={aiLoading} className="h-[52px] rounded-[12px] bg-[#4189DD] px-5 text-sm font-medium text-white transition disabled:opacity-50">
                  {aiLoading ? '...' : 'Send'}
                </button>
              </form>
            </div>
          </section>
        ) : null}

        {currentPage === 'connect' ? (
          <div>
            <div className="mb-5 flex flex-wrap gap-2">
              {(user?.role === 'mentor'
                ? [
                    ['requests', 'Requests'],
                    ['active', 'Active Cohorts'],
                    ['profile', 'Mentor Profile'],
                  ]
                : [
                    ['browse', 'Browse Mentors'],
                    ['cohort', 'My Cohort'],
                    ['pending', 'My Requests'],
                  ]
              ).map(([value, label]) => (
                <button key={value} type="button" onClick={() => setConnectTab(value)} className={`rounded-full px-4 py-2 text-sm font-medium ${connectTab === value ? 'bg-[#4189DD] text-white' : 'border border-[#dce6f5] bg-white text-slate-500'}`}>
                  {label}
                </button>
              ))}
            </div>
            {user?.role === 'mentor' ? (
              connectTab === 'requests' ? (
                <div className="space-y-4">
                  {[
                    ['MH', 'Mohamed Hassan', 'Student · Minneapolis', 'I am struggling with interview prep and would love mentorship on system design.'],
                    ['HA', 'Halimo Ahmed', 'Student · London', 'I would like guidance on structuring my career over the next two years.'],
                  ].map(([init, name, role, msg]) => (
                    <div key={name} className="rounded-[20px] border border-[#dce6f5] bg-white p-5">
                      <div className="flex gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#4189DD] text-sm font-semibold text-white">{init}</div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-slate-900">{name}</p>
                          <p className="text-xs text-slate-400">{role}</p>
                          <p className="mt-3 text-sm leading-7 text-slate-600">"{msg}"</p>
                          <div className="mt-4 flex gap-2">
                            <button className="rounded-full bg-[#4189DD] px-4 py-2 text-sm font-medium text-white">Accept</button>
                            <button className="rounded-full border border-[#dce6f5] px-4 py-2 text-sm text-slate-500">Decline</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : connectTab === 'active' ? (
                <div className="space-y-4">
                  {[
                    ['MH', 'Mohamed Hassan', 'Minneapolis', 5, 'Interview Prep'],
                    ['HA', 'Halimo Ahmed', 'London', 2, 'Web Dev'],
                    ['YN', 'Yusuf Nur', 'Hargeisa', 1, 'Fundamentals'],
                  ].map(([init, name, loc, week, focus]) => (
                    <div key={name} className="rounded-[20px] border border-[#dce6f5] bg-white p-5">
                      <div className="mb-4 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#4189DD] text-xs font-semibold text-white">{init}</div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{name}</p>
                          <p className="text-xs text-slate-400">{loc} · {focus}</p>
                        </div>
                        <span className="ml-auto rounded-full bg-[#eaf2fd] px-3 py-1 text-xs font-semibold text-[#1a5db5]">Week {week}/8</span>
                      </div>
                      <div className="h-2 rounded-full bg-[#dce6f5]"><div className="h-full rounded-full bg-[#4189DD]" style={{ width: `${Number(week) * 12.5}%` }} /></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-[20px] border border-[#dce6f5] bg-white p-5">
                  <label className="block text-sm text-slate-600">Capacity<input className="mt-2 w-full rounded-[12px] border border-[#dce6f5] bg-[#f4f7fb] px-4 py-3 outline-none" defaultValue="5 mentees maximum" /></label>
                </div>
              )
            ) : connectTab === 'cohort' ? (
              <div className="rounded-[20px] bg-[#0f3d82] p-6 text-white">
                <h3 className="font-display text-3xl">Cohort with Abdi Axmed</h3>
                <p className="mt-2 text-sm text-white/70">Focus: Interview Prep + System Design · Started March 1, 2024</p>
                <div className="mt-4 h-2 rounded-full bg-white/10"><div className="h-full w-[37.5%] rounded-full bg-[#6aaae8]" /></div>
                <p className="mt-2 text-xs text-white/45">Week 3 of 8 complete</p>
              </div>
            ) : connectTab === 'pending' ? (
              <div className="rounded-[20px] border border-[#dce6f5] bg-white p-10 text-center text-slate-400">You have 1 pending request to Hodan Muuse — awaiting response.</div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {mentorCards.map(([init, name, role, tags, loc, bg]) => (
                  <article key={name} className="rounded-[20px] border border-[#dce6f5] bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(65,137,221,0.08)]">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full text-sm font-semibold text-white" style={{ backgroundColor: bg }}>{init}</div>
                    <h3 className="font-display text-2xl text-slate-950">{name}</h3>
                    <p className="mt-1 text-sm text-slate-400">{role}</p>
                    <div className="mt-4 flex flex-wrap gap-2">{tags.map((tag) => <span key={tag} className="rounded-full bg-[#eaf2fd] px-3 py-1 text-xs font-semibold text-[#1a5db5]">{tag}</span>)}</div>
                    <p className="mt-4 text-sm text-slate-500">📍 {loc}</p>
                    <button className="mt-5 w-full rounded-full border border-[#c8dff7] px-4 py-3 text-sm font-medium text-[#4189DD] transition hover:bg-[#4189DD] hover:text-white">Request Mentorship</button>
                  </article>
                ))}
              </div>
            )}
          </div>
        ) : null}

        {currentPage === 'build' ? (
          <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
            <div>
              {/* Header */}
              <div className="mb-6">
                <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-400">HageHub Build</p>
                <h1 className="mt-1 font-display text-4xl text-slate-950">Build with the community.</h1>
                <p className="mt-2 text-[15px] text-slate-500">Real projects. Real people. No experience required to start.</p>
              </div>

              {/* Stats bar */}
              <div className="mb-6 flex flex-wrap gap-4">
                {[
                  ['6', 'active projects'],
                  ['12+', 'builders'],
                  ['4', 'Somalia-focused'],
                ].map(([num, label]) => (
                  <div key={label} className="flex items-baseline gap-1.5">
                    <span className="font-display text-2xl text-[#4189DD]">{num}</span>
                    <span className="text-sm text-slate-500">{label}</span>
                  </div>
                ))}
              </div>

              {/* Filter tabs */}
              <div className="mb-5 flex flex-wrap gap-2">
                {[
                  ['all', 'All Projects'],
                  ['idea', 'Open Ideas'],
                  ['building', 'Building Now'],
                  ['mine', 'Joined'],
                ].map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setBuildTab(value)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${buildTab === value ? 'bg-[#4189DD] text-white shadow-[0_4px_12px_rgba(65,137,221,0.25)]' : 'border border-[#dce6f5] bg-white text-slate-500 hover:border-[#c8dff7]'}`}
                  >
                    {label}
                    {value === 'mine' && joinedProjects.size > 0 && (
                      <span className="ml-1.5 rounded-full bg-white/25 px-1.5 py-0.5 text-[10px] font-bold">{joinedProjects.size}</span>
                    )}
                  </button>
                ))}
              </div>

              {/* Project grid */}
              <div className="grid gap-4 md:grid-cols-2">
                {buildProjects
                  .filter((p) => {
                    if (buildTab === 'idea') return p.status === 'idea'
                    if (buildTab === 'building') return p.status === 'building'
                    if (buildTab === 'mine') return joinedProjects.has(p.id)
                    return true
                  })
                  .map((project) => {
                    const sm = statusMeta[project.status]
                    const joined = joinedProjects.has(project.id)
                    return (
                      <article key={project.id} className={`flex flex-col rounded-[20px] border bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(65,137,221,0.08)] ${joined ? 'border-[#4189DD]' : 'border-[#dce6f5]'}`}>
                        {/* Status + impact row */}
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <span className="rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em]" style={{ color: sm.color, backgroundColor: sm.bg }}>
                            {sm.label}
                          </span>
                          <span className="text-[10px] font-medium text-slate-400">{project.impact}</span>
                        </div>

                        {/* Title + description */}
                        <h3 className="font-display text-2xl leading-snug text-slate-950">{project.title}</h3>
                        <p className="mt-2 flex-1 text-sm leading-7 text-slate-500">{project.description}</p>

                        {/* Tags */}
                        <div className="mt-4 flex flex-wrap gap-1.5">
                          {project.tags.map((tag) => (
                            <span key={tag} className="rounded-full border border-[#dce6f5] bg-[#f4f7fb] px-2.5 py-0.5 text-[10px] font-medium text-slate-500">#{tag}</span>
                          ))}
                        </div>

                        {/* Open roles */}
                        <div className="mt-4">
                          <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">Roles needed</p>
                          <div className="flex flex-wrap gap-1.5">
                            {project.roles.map((role) => {
                              const open = project.rolesOpen.includes(role)
                              return (
                                <span key={role} className={`rounded-full px-3 py-1 text-xs font-medium ${open ? 'bg-[#eaf2fd] text-[#1a5db5]' : 'bg-[#f4f7fb] text-slate-400 line-through'}`}>
                                  {role}
                                </span>
                              )
                            })}
                          </div>
                        </div>

                        {/* Footer: members + join */}
                        <div className="mt-5 flex items-center justify-between gap-3 border-t border-[#f4f7fb] pt-4">
                          <div className="flex items-center gap-2">
                            <div className="flex -space-x-1.5">
                              {project.members.slice(0, 4).map(([init, bg]) => (
                                <div key={init} className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white text-[9px] font-bold text-white" style={{ backgroundColor: bg }}>{init}</div>
                              ))}
                              {project.members.length === 0 && (
                                <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-dashed border-[#dce6f5] text-[9px] text-slate-400">+</div>
                              )}
                            </div>
                            <span className="text-xs text-slate-400">
                              {project.members.length === 0 ? 'Be the first' : `${project.members.length} builder${project.members.length === 1 ? '' : 's'}`}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setJoinedProjects((prev) => {
                              const next = new Set(prev)
                              joined ? next.delete(project.id) : next.add(project.id)
                              return next
                            })}
                            className={`rounded-full px-4 py-2 text-sm font-medium transition ${joined ? 'bg-[#eaf2fd] text-[#1a5db5]' : 'bg-[#4189DD] text-white hover:bg-[#1a5db5]'}`}
                          >
                            {joined ? '✓ Joined' : 'Join Project'}
                          </button>
                        </div>
                      </article>
                    )
                  })}

                {/* Empty state for "Joined" tab */}
                {buildTab === 'mine' && joinedProjects.size === 0 && (
                  <div className="col-span-2 rounded-[20px] border border-dashed border-[#dce6f5] bg-white p-10 text-center">
                    <p className="font-display text-2xl text-slate-400">You have not joined a project yet.</p>
                    <p className="mt-2 text-sm text-slate-400">Browse the list and hit "Join Project" — no experience required.</p>
                    <button type="button" onClick={() => setBuildTab('all')} className="mt-4 rounded-full bg-[#4189DD] px-5 py-2.5 text-sm font-medium text-white">Browse Projects</button>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <aside className="space-y-4">
              {/* Start a project CTA */}
              <div className="rounded-[20px] bg-[#0f3d82] p-5 text-white">
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#6aaae8]">Got an idea?</p>
                <h3 className="mt-2 font-display text-3xl">Start a project.</h3>
                <p className="mt-2 text-sm leading-7 text-white/70">You don't need a team yet. Post the idea and the right people will find you.</p>
                <button type="button" className="mt-4 w-full rounded-full bg-[#4189DD] py-3 text-sm font-medium text-white transition hover:bg-[#6aaae8]">
                  + Propose a Project
                </button>
              </div>

              {/* How it works */}
              <div className="rounded-[20px] border border-[#dce6f5] bg-white p-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">How it works</p>
                <div className="mt-4 space-y-4">
                  {[
                    ['1', 'Browse projects that interest you'],
                    ['2', 'Hit "Join Project" — no CV needed'],
                    ['3', 'Connect with your team and start building'],
                  ].map(([step, text]) => (
                    <div key={step} className="flex gap-3">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#eaf2fd] font-display text-sm font-bold text-[#1a5db5]">{step}</div>
                      <p className="text-sm leading-7 text-slate-600">{text}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills in demand */}
              <div className="rounded-[20px] border border-[#dce6f5] bg-white p-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">Skills in demand</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {['React', 'Python', 'AI/ML', 'Backend', 'UI/UX', 'Somali Translation', 'React Native', 'Security'].map((skill) => (
                    <span key={skill} className="rounded-full bg-[#eaf2fd] px-3 py-1.5 text-xs font-medium text-[#1a5db5]">{skill}</span>
                  ))}
                </div>
              </div>

              {/* Encouragement */}
              <div className="rounded-[20px] border border-[#dce6f5] bg-white p-5">
                <p className="font-display text-2xl text-slate-950">"You don't need experience to start — you gain it by starting."</p>
                <p className="mt-3 text-xs text-slate-400">Every builder on HageHub started somewhere.</p>
              </div>
            </aside>
          </div>
        ) : null}

        {currentPage === 'work' ? (
          <div>
            <div className="mb-5 flex flex-wrap gap-2">
              {[
                ['all', 'All Jobs'],
                ['intern', 'Internships'],
                ['remote', 'Remote'],
                ['somalia', 'Somalia'],
                ['saved', 'Saved'],
              ].map(([value, label]) => (
                <button key={value} type="button" onClick={() => setWorkTab(value)} className={`rounded-full px-4 py-2 text-sm font-medium ${workTab === value ? 'bg-[#4189DD] text-white' : 'border border-[#dce6f5] bg-white text-slate-500'}`}>
                  {label}
                </button>
              ))}
            </div>
            {jobs.filter((job) => {
              if (workTab === 'intern') return job[5].includes('int')
              if (workTab === 'remote') return job[5].includes('rem')
              if (workTab === 'somalia') return job[5].includes('som')
              if (workTab === 'saved') return false
              return true
            }).length ? (
              <div className="space-y-3">
                {jobs.filter((job) => {
                  if (workTab === 'intern') return job[5].includes('int')
                  if (workTab === 'remote') return job[5].includes('rem')
                  if (workTab === 'somalia') return job[5].includes('som')
                  if (workTab === 'saved') return false
                  return true
                }).map(([logo, company, title, loc, salary, tags, logoBg, logoColor]) => (
                  <article key={`${company}-${title}`} className="flex items-center gap-4 rounded-[20px] border border-[#dce6f5] bg-white px-5 py-4 transition hover:translate-x-1 hover:border-[#4189DD]">
                    <div className="flex h-12 w-12 items-center justify-center rounded-[14px] font-display text-sm font-bold" style={{ backgroundColor: logoBg, color: logoColor }}>{logo}</div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-900">{title}</p>
                      <p className="text-xs text-slate-400">{company} · {loc} · {salary}</p>
                      <div className="mt-2 flex flex-wrap gap-2">{tags.map((tag) => <span key={tag} className="rounded-full bg-[#f4f7fb] px-3 py-1 text-[10px] font-semibold uppercase text-slate-600">{tag}</span>)}</div>
                    </div>
                    <span className="text-slate-400">→</span>
                  </article>
                ))}
              </div>
            ) : (
              <div className="rounded-[20px] border border-[#dce6f5] bg-white p-10 text-center text-slate-400">Saved jobs appear here.</div>
            )}
          </div>
        ) : null}

        {currentPage === 'stories' ? (
          <div>
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">Stories</p>
                <h2 className="font-display text-4xl text-slate-950">Somali excellence, out loud.</h2>
              </div>
              <button className="rounded-full bg-[#4189DD] px-5 py-3 text-sm font-medium text-white">Write a Story</button>
            </div>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {stories.map(([bg, init, sInit, name, date, title, excerpt, cat]) => (
                <article key={title} className="overflow-hidden rounded-[20px] border border-[#dce6f5] bg-white transition hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(65,137,221,0.08)]">
                  <div className="relative flex h-36 items-end overflow-hidden p-4" style={{ backgroundColor: bg }}>
                    <div className="absolute inset-0 flex items-center justify-center font-display text-[110px] font-bold text-white/10">{sInit}</div>
                    <span className="relative rounded-full bg-white/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white backdrop-blur">{cat}</span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-display text-2xl leading-tight text-slate-950">{title}</h3>
                    <p className="mt-2 text-sm leading-7 text-slate-600">{excerpt}</p>
                    <div className="mt-4 flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#eaf2fd] text-[10px] font-bold text-[#1a5db5]">{init}</div>
                      <span className="text-sm font-medium text-slate-600">{name}</span>
                      <span className="ml-auto text-xs text-slate-400">{date}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        ) : null}

        {currentPage === 'profile' ? (
          <div>
            <section className="rounded-[24px] border border-[#dce6f5] bg-white p-6">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                <button
                  type="button"
                  onClick={() => profilePicRef.current?.click()}
                  className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full"
                  title="Click to change photo"
                >
                  {profilePic ? (
                    <img src={profilePic} alt="Profile" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-[#4189DD] text-2xl font-semibold text-white">{initials(user?.name)}</div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/30 opacity-0 transition hover:opacity-100">
                    <span className="text-xs font-semibold text-white">Edit</span>
                  </div>
                </button>
                <input
                  ref={profilePicRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (!file) return
                    const reader = new FileReader()
                    reader.onload = (ev) => {
                      const dataUrl = ev.target.result
                      setProfilePic(dataUrl)
                      writeStorage(`hh_pic_${user?.name}`, dataUrl)
                    }
                    reader.readAsDataURL(file)
                  }}
                />
                <div>
                  <h2 className="font-display text-4xl text-slate-950">{user?.name}</h2>
                  <p className="mt-2 text-sm text-slate-500">{user?.role === 'mentor' ? 'Mentor · Senior SWE' : 'Student · Somali Tech Community'}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {(user?.role === 'mentor' ? ['Mentor', 'Google SWE', 'San Francisco', '124 Answers'] : ['Student', 'Mogadishu', '7 Questions', '3 Answers']).map((chip) => (
                      <span key={chip} className="rounded-full bg-[#f4f7fb] px-3 py-2 text-xs font-medium text-slate-600">{chip}</span>
                    ))}
                  </div>
                </div>
              </div>
            </section>
            <div className="mb-5 mt-5 flex flex-wrap gap-2">
              {[
                ['activity', 'Activity'],
                ['questions', 'Questions'],
                ['edit', 'Edit Profile'],
              ].map(([value, label]) => (
                <button key={value} type="button" onClick={() => setProfileTab(value)} className={`rounded-full px-4 py-2 text-sm font-medium ${profileTab === value ? 'bg-[#4189DD] text-white' : 'border border-[#dce6f5] bg-white text-slate-500'}`}>
                  {label}
                </button>
              ))}
            </div>
            {profileTab === 'activity' ? (
              <div className="rounded-[20px] border border-[#dce6f5] bg-white p-5">
                {[
                  ['Asked: Maxaa loo isticmaalaa recursion-ka?', '2h ago'],
                  ['Answered: How do I use useEffect correctly?', 'Yesterday'],
                  ['Joined mentorship cohort with Abdi Axmed', '3 days ago'],
                  ['AI translated your question to Somali', '4 days ago'],
                ].map(([text, time]) => (
                  <div key={text} className="flex gap-3 border-b border-[#dce6f5] py-3 last:border-b-0">
                    <div className="mt-2 h-2 w-2 rounded-full bg-[#4189DD]" />
                    <div>
                      <p className="text-sm text-slate-600">{text}</p>
                      <p className="mt-1 text-xs text-slate-400">{time}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : profileTab === 'questions' ? (
              <div className="space-y-3">
                {questions.slice(0, 2).map((question) => (
                  <div key={question.id} className="rounded-[20px] border border-[#dce6f5] bg-white p-5">
                    <h3 className="font-display text-2xl text-slate-950">{question.title}</h3>
                    <p className="mt-2 text-sm text-slate-600">{question.body}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-[20px] border border-[#dce6f5] bg-white p-5">
                <div className="space-y-4">
                  <label className="block text-sm text-slate-600">Display Name<input className="mt-2 w-full rounded-[12px] border border-[#dce6f5] bg-[#f4f7fb] px-4 py-3 outline-none" defaultValue={user?.name} /></label>
                  <label className="block text-sm text-slate-600">Bio<textarea className="mt-2 min-h-28 w-full rounded-[12px] border border-[#dce6f5] bg-[#f4f7fb] px-4 py-3 outline-none" defaultValue={user?.role === 'mentor' ? 'Senior Software Engineer passionate about giving back to the Somali tech community.' : 'CS student passionate about building technology for Somalia.'} /></label>
                </div>
              </div>
            )}
          </div>
        ) : null}

        {currentPage === 'settings' ? (
          <div className="max-w-2xl">
            <h2 className="mb-6 font-display text-4xl text-slate-950">Settings</h2>
            <div className="space-y-4">
              <section className="rounded-[20px] border border-[#dce6f5] bg-white p-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">Notifications</p>
                <div className="mt-4 space-y-4">
                  {['New answers on my questions', 'New mentor requests', 'Job alerts', 'Community digest', 'AI translations ready'].map((item) => (
                    <div key={item} className="flex items-center justify-between gap-4">
                      <span className="text-sm text-slate-600">{item}</span>
                      <div className="h-7 w-12 rounded-full bg-[#4189DD]/20 p-1"><div className="h-5 w-5 rounded-full bg-[#4189DD]" /></div>
                    </div>
                  ))}
                </div>
              </section>
              <section className="rounded-[20px] border border-[#dce6f5] bg-white p-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">Language</p>
                <div className="mt-4 space-y-4">
                  <label className="block text-sm text-slate-600">Default AI response language<select className="mt-2 w-full rounded-[12px] border border-[#dce6f5] bg-[#f4f7fb] px-4 py-3 outline-none"><option>Both (English + Somali)</option><option>English only</option><option>Somali only</option></select></label>
                  <label className="block text-sm text-slate-600">Interface language<select className="mt-2 w-full rounded-[12px] border border-[#dce6f5] bg-[#f4f7fb] px-4 py-3 outline-none"><option>English</option><option>Somali (af Soomaali)</option></select></label>
                </div>
              </section>
            </div>
          </div>
        ) : null}
      </div>

      <AskModal
        isOpen={showAskModal}
        onClose={() => setShowAskModal(false)}
        onSubmit={handlePostQuestion}
        user={user}
      />
    </main>
  )
}

export default HageHubWorkspace
