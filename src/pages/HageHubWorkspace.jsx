import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { contributors as seededContributors } from '../data/questions'
import { QuestionCard } from '../components/knowledge/QuestionCard'
import { AskModal } from '../components/knowledge/AskModal'
import { fetchQuestions, insertQuestion } from '../lib/db/questions'
import { fetchAnswerCounts, fetchAnswers, insertAnswer } from '../lib/db/answers'
import { fetchTopContributors } from '../lib/db/contributors'
import { fetchProjects, insertProject, joinProject, fetchUserProjects, fetchProjectMembers, fetchTopBuilders } from '../lib/db/projects'
import { supabase } from '../lib/supabase'
import { askHageAI, askHageAICustom } from '../lib/ai'

const COMMUNITY_FEED_KEY = 'hh_comments'
const BAD_TRANSLATIONS_KEY = 'hh_bad_translations'
const FALLBACK_TAGS = ['algorithms', 'python', 'react', 'web-dev', 'ai/ml', 'system-design', 'somalia-tech']
function aiChatKey(user) { return `hh_ai_messages_${user?.id || 'guest'}` }
const SOMALI_CODE_SYSTEM_PROMPT = `Adiga waxaad tahay macallin barnaamijyada ah 
oo Soomaali ah. Sharax koodkan si fudud oo 
Soomaali ah.

Ku raac hab-raacaan:
1. Marka hore sharax waxa koodku guud ahaan 
   sameeyo (1-2 jumlood)
2. Kadibna sharax khadka-khadka:
   - Tus khadka (sida: 'line 1: def greet(name):')
   - Sharax waxa uu sameeyo af Soomaali
3. Ugu dambayntii: 'Koodkan waxaa loo isticmaali 
   karaa marka...' (tusaale gaar ah)

Erayada farsamada (function, variable, loop, 
array, etc) u isticmaal Ingiriisi laakiin 
sharax Soomaali ku dar xiga.

Jawaabta ha ahaato mid fudud oo ardayga 
cusub fahmi karo.`
const ENGLISH_CODE_SYSTEM_PROMPT = `You are a programming teacher. Explain this code clearly for a beginner.

Follow this structure:
1. First explain what the code does overall in 1-2 sentences
2. Then explain it line by line:
   - Show the line (example: "line 1: def greet(name):")
   - Explain what it does in simple English
3. End with: "This code can be used when..." and give one practical example

Keep the explanation practical, friendly, and easy to follow.`

const topNavItems = [
  { label: 'Ask', icon: '🏠', to: '/home', page: 'dashboard' },
  { label: 'Learn', icon: '📚', to: '/learn', page: 'learn' },
  { label: 'Questions', icon: '💬', to: '/ask', page: 'knowledge' },
  { label: 'AI', icon: '🤖', to: '/ai', page: 'ai' },
  { label: 'Connect', icon: '🤝', to: '/connect', page: 'connect' },
  { label: 'Build', icon: '🛠️', to: '/build', page: 'build' },
  { label: 'Stories', icon: '📝', to: '/stories', page: 'stories' },
  { label: 'Jobs', icon: '💼', to: '/jobs', page: 'jobs' },
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
  ['AA', 'Abdi Axmed', 'Senior SWE - Google', ['Algorithms', 'System Design'], 'San Francisco, CA', '#4189DD'],
  ['HM', 'Hodan Muuse', 'Product Manager - Meta', ['Product', 'Career Growth'], 'London, UK', '#1a5db5'],
  ['YI', 'Yusuf Ibraahim', 'Full-Stack - Shopify', ['React', 'Node.js'], 'Toronto, Canada', '#0f3d82'],
  ['FN', 'Faadumo Nuur', 'ML Engineer - Anthropic', ['AI/ML', 'Python'], 'Seattle, WA', '#6aaae8'],
]

const jobs = [
  { logo: 'AM', company: 'Amazon', title: 'Software Engineer - New Grad', loc: 'Seattle, WA', salary: '$140k-$165k', tags: ['ft', 'som'], logoBg: '#eaf2fd', logoColor: '#1a5db5', type: 'Full-time', posted: '2 days ago', url: '#' },
  { logo: 'ST', company: 'Stripe', title: 'Frontend Engineering Intern', loc: 'Remote', salary: '$8k/month', tags: ['int', 'rem'], logoBg: '#e8f5ee', logoColor: '#1a6b4a', type: 'Internship', posted: '3 days ago', url: '#' },
  { logo: 'HB', company: 'Hormuud Telecom', title: 'Data Scientist - East Africa', loc: 'Mogadishu', salary: 'Competitive', tags: ['ft', 'som'], logoBg: '#f3f0ff', logoColor: '#5b3fa0', type: 'Full-time', posted: '1 week ago', url: '#' },
  { logo: 'GG', company: 'Golis Tech', title: 'Backend Engineer', loc: 'Hargeisa / Remote', salary: 'Competitive', tags: ['ft', 'rem', 'som'], logoBg: '#fff3e0', logoColor: '#a06010', type: 'Full-time', posted: '1 week ago', url: '#' },
  { logo: 'MS', company: 'Microsoft', title: 'Software Engineer II', loc: 'Redmond, WA', salary: '$160k-$190k', tags: ['ft', 'som'], logoBg: '#eaf2fd', logoColor: '#0f3d82', type: 'Full-time', posted: '4 days ago', url: '#' },
  { logo: 'GL', company: 'Google', title: 'STEP Intern - Software Engineering', loc: 'Remote / NYC', salary: '$7k/month', tags: ['int', 'rem', 'som'], logoBg: '#fef9ee', logoColor: '#b45309', type: 'Internship', posted: '5 days ago', url: '#' },
  { logo: 'DV', company: 'Dahabshiil', title: 'Mobile Developer (Flutter)', loc: 'Dubai / Remote', salary: 'Competitive', tags: ['ft', 'rem', 'som'], logoBg: '#f3f0ff', logoColor: '#5b3fa0', type: 'Full-time', posted: '2 weeks ago', url: '#' },
  { logo: 'CL', company: 'Cloudflare', title: 'Network Engineer Intern', loc: 'Remote', salary: '$7.5k/month', tags: ['int', 'rem'], logoBg: '#fff3e0', logoColor: '#a06010', type: 'Internship', posted: '1 week ago', url: '#' },
  { logo: 'SO', company: 'Somcable', title: 'Full-Stack Developer', loc: 'Mogadishu', salary: 'Competitive', tags: ['ft', 'som'], logoBg: '#e8f5ee', logoColor: '#1a6b4a', type: 'Full-time', posted: '3 days ago', url: '#' },
  { logo: 'VR', company: 'Vercel', title: 'Developer Experience Engineer', loc: 'Remote (Global)', salary: '$130k-$155k', tags: ['ft', 'rem', 'som'], logoBg: '#f4f7fb', logoColor: '#334155', type: 'Full-time', posted: '6 days ago', url: '#' },
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
    impact: 'Somalia - Diaspora',
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
    impact: 'Somalia - Diaspora',
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

const STATUS_KEY_MAP = { 'Open Idea': 'idea', 'Building Now': 'building', 'Completed': 'complete', idea: 'idea', building: 'building', complete: 'complete' }
function normalizeProject(row) {
  return {
    ...row,
    status: STATUS_KEY_MAP[row.status] || 'idea',
    roles: row.looking_for || [],
    rolesOpen: row.looking_for || [],
    tags: row.tags || [],
    members: [],
    members_count: row.members_count || 1,
    impact: row.impact_area || '',
  }
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

const getInitials = (name) => {
  if (!name) return '?'
  return name.split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

const getAvatarColor = (name) => {
  const colors = [
    '#4189DD', '#1a5db5', '#0f3d82',
    '#0d9488', '#7c3aed', '#e11d48',
    '#d97706', '#16a34a',
  ]
  let hash = 0
  for (const c of (name || '')) hash += c.charCodeAt(0)
  return colors[hash % colors.length]
}


function getCurrentPage(pathname) {
  if (pathname === '/home') return 'dashboard'
  if (pathname === '/learn') return 'learn'
  if (pathname === '/ask') return 'knowledge'
  if (pathname === '/ai') return 'ai'
  if (pathname === '/connect') return 'connect'
  if (pathname === '/build') return 'build'
  if (pathname === '/stories') return 'stories'
  if (pathname === '/jobs') return 'jobs'
  if (pathname === '/profile') return 'profile'
  if (pathname === '/settings') return 'settings'
  return 'dashboard'
}

function withTimeout(promise, ms, label) {
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      window.setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms)
    }),
  ])
}

function normalizeQuestion(row) {
  return {
    id: row.id,
    lang: row.lang,
    title: row.title,
    body: row.body,
    tags: row.tags ?? [],
    images: row.images ?? [],
    answers: row.answer_count ?? 0,
    poster: {
      init: row.poster_init,
      name: row.poster_name,
      loc: '',
      photo: row.poster_photo ?? '',
    },
    time: new Date(row.created_at).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'short', year: 'numeric',
    }),
  }
}

function HageHubWorkspace({ user, onLogout }) {
  const navigate = useNavigate()
  const { pathname, state: routerState } = useLocation()
  const currentPage = getCurrentPage(pathname)
  const [activeThreadId, setActiveThreadId] = useState(routerState?.threadId ?? null)
  const [knowledgeFilter, setKnowledgeFilter] = useState('all')
  const [selectedTag, setSelectedTag] = useState('all')
  const [connectTab, setConnectTab] = useState(
    user?.role === 'mentor' ? 'requests' : 'browse',
  )
  const [workTab, setWorkTab] = useState('all')
  const [buildTab, setBuildTab] = useState('all')
  const [projects, setProjects] = useState([])
  const [joinedProjects, setJoinedProjects] = useState([])
  const [activeProject, setActiveProject] = useState(null)
  const [activeProjectMembers, setActiveProjectMembers] = useState([])
  const [projectMessages, setProjectMessages] = useState([])
  const [chatInput, setChatInput] = useState('')
  const chatEndRef = useRef(null)
  const [projectComments, setProjectComments] = useState({})
  const [projectCommentInput, setProjectCommentInput] = useState('')
  const [topBuilders, setTopBuilders] = useState([])
  const [showProposeModal, setShowProposeModal] = useState(false)
  const [proposeForm, setProposeForm] = useState({ title: '', description: '', category: '', tags: '', lookingFor: '', impactArea: '', status: 'Open Idea', githubUrl: '' })
  const [proposeLoading, setProposeLoading] = useState(false)
  const [toastMsg, setToastMsg] = useState('')
  const [profileTab, setProfileTab] = useState('activity')
  const [showAskModal, setShowAskModal] = useState(false)
  const [showMoreDrawer, setShowMoreDrawer] = useState(false)
  const [communityComments, setCommunityComments] = useState(() =>
    readStorage(COMMUNITY_FEED_KEY, communitySeed),
  )
  const AI_WELCOME = [{ id: 'welcome', role: 'assistant', content: "Salaan. I'm Hage AI. Ask a CS question in Somali or English and I will keep it practical." }]
  const [aiMessages, setAiMessages] = useState(() => readStorage(aiChatKey(user), AI_WELCOME))

  // Reset AI chat when user changes (logout / login as different account)
  useEffect(() => {
    setAiMessages(readStorage(aiChatKey(user), AI_WELCOME))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id])
  const [aiInput, setAiInput] = useState('')
  const [aiLanguage, setAiLanguage] = useState('both')
  const [aiTab, setAiTab] = useState('chat')
  const [aiLoading, setAiLoading] = useState(false)
  const [codeInput, setCodeInput] = useState('')
  const [codeLanguage, setCodeLanguage] = useState('Python')
  const [codeExplainLoading, setCodeExplainLoading] = useState(false)
  const [codeExplanation, setCodeExplanation] = useState(null)
  const [codeExplainNotice, setCodeExplainNotice] = useState('')
  const [threadAiAnswers, setThreadAiAnswers] = useState({})
  const [threadAiLoading, setThreadAiLoading] = useState(false)
  const [aiExpanded, setAiExpanded] = useState(false)
  const [showAI, setShowAI] = useState(false)
  const [messageTranslations, setMessageTranslations] = useState({})
  const [translatingId, setTranslatingId] = useState('')
  const [threadReply, setThreadReply] = useState('')
  const [settingsForm, setSettingsForm] = useState(() => ({
    notifications: {
      answers: true,
      mentorRequests: true,
      jobAlerts: true,
      communityDigest: true,
      aiTranslations: true,
    },
    aiLanguage: 'Both (English + Somali)',
    interfaceLanguage: 'English',
  }))
  const [settingsSaving, setSettingsSaving] = useState(false)
  const [settingsMessage, setSettingsMessage] = useState('')
  const [profileForm, setProfileForm] = useState({ name: user?.name ?? '', bio: '' })
  const [profileSaving, setProfileSaving] = useState(false)
  const [profileMessage, setProfileMessage] = useState('')

  // Supabase state
  const [questions, setQuestions] = useState([])
  const [questionsLoading, setQuestionsLoading] = useState(true)
  const [threadAnswers, setThreadAnswers] = useState([])
  const [threadAnswersLoading, setThreadAnswersLoading] = useState(false)
  const [topContributors, setTopContributors] = useState([])
  const userMeta = user?.metadata ?? {}

  const activeThread = questions.find((q) => q.id === activeThreadId)
  const currentNavItem = topNavItems.find((item) => item.page === currentPage) ?? topNavItems[0]
  const availableTags = [...new Set(questions.flatMap((question) => question.tags ?? []))]
  const sidebarTags = availableTags.length ? availableTags : FALLBACK_TAGS
  const visibleContributors = topContributors.length ? topContributors : seededContributors
  const filteredQuestions = questions
    .filter((question) => {
      if (knowledgeFilter === 'so') return question.lang === 'so' || question.lang === 'both'
      if (knowledgeFilter === 'en') return question.lang === 'en' || question.lang === 'both'
      if (knowledgeFilter === 'mine') return question.poster.name === user?.name
      return true
    })
    .filter((question) => {
      if (selectedTag === 'all') return true
      return question.tags?.includes(selectedTag)
    })
  const showQuestionsLoading = questionsLoading && questions.length === 0
  const showQuestionsEmpty = !questionsLoading && filteredQuestions.length === 0

  // Load questions from Supabase on mount
  useEffect(() => {
    async function load() {
      setQuestionsLoading(true)
      try {
        const rows = await withTimeout(fetchQuestions(), 15000, 'Questions fetch')
        const answerCounts = await withTimeout(
          fetchAnswerCounts(rows.map((row) => row.id)),
          10000,
          'Answer counts fetch',
        )
        const normalized = rows.map((row) => ({
          ...normalizeQuestion(row),
          answers: answerCounts[row.id] ?? 0,
        }))
        setQuestions(normalized)
      } catch (err) {
        console.error('Failed to load questions:', err)
        // Keep the last good question state if a fetch fails.
        setQuestions((prev) => prev)
      } finally {
        setQuestionsLoading(false)
      }
    }
    load()
  }, [user?.id])

  useEffect(() => {
    setSettingsForm({
      notifications: {
        answers: userMeta.notify_answers ?? true,
        mentorRequests: userMeta.notify_mentor_requests ?? true,
        jobAlerts: userMeta.notify_job_alerts ?? true,
        communityDigest: userMeta.notify_community_digest ?? true,
        aiTranslations: userMeta.notify_ai_translations ?? true,
      },
      aiLanguage: userMeta.ai_language ?? 'Both (English + Somali)',
      interfaceLanguage: userMeta.interface_language ?? 'English',
    })
  }, [
    userMeta.ai_language,
    userMeta.interface_language,
    userMeta.notify_ai_translations,
    userMeta.notify_answers,
    userMeta.notify_community_digest,
    userMeta.notify_job_alerts,
    userMeta.notify_mentor_requests,
  ])

  useEffect(() => {
    setProfileForm({
      name: userMeta.name || user?.name || '',
      bio: userMeta.bio || '',
    })
  }, [user?.name, userMeta.bio, userMeta.name])

  useEffect(() => {
    fetchTopContributors()
      .then((rows) => {
        if (rows?.length) setTopContributors(rows)
      })
      .catch((err) => {
        console.error('Failed to load contributors:', err)
        setTopContributors((prev) => (prev.length ? prev : seededContributors))
      })
  }, [])

  // Load answers whenever the active thread changes — no guard on activeThread
  // so answers load even if questions haven't finished rendering yet.
  useEffect(() => {
    if (!activeThreadId) return
    setThreadAnswers([]) // reset so stale answers from previous thread don't show
    setThreadAnswersLoading(true)
    withTimeout(fetchAnswers(activeThreadId), 10000, 'Answers fetch')
      .then((answers) => {
        setThreadAnswers(answers)
        setQuestions((prev) =>
          prev.map((question) => (
            question.id === activeThreadId
              ? { ...question, answers: answers.length }
              : question
          )),
        )
      })
      .catch(console.error)
      .finally(() => setThreadAnswersLoading(false))
  }, [activeThreadId])

  useEffect(() => {
    setAiExpanded(false)
  }, [activeThreadId])

  useEffect(() => {
    setCodeExplainNotice('')
  }, [codeExplanation])

  useEffect(() => {
    setShowMoreDrawer(false)
  }, [pathname])
  // Reset AI visibility when switching threads
  useEffect(() => {
    setShowAI(false)
    setAiExpanded(false)
  }, [activeThreadId])

  // Fetch projects from Supabase
  useEffect(() => {
    fetchProjects()
      .then((rows) => setProjects(rows.map(normalizeProject)))
      .catch(console.error)
    fetchTopBuilders().then(setTopBuilders).catch(console.error)
    if (user?.id) {
      fetchUserProjects(user.id).then(setJoinedProjects).catch(console.error)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id])

  // Reload members whenever the active project changes
  useEffect(() => {
    if (!activeProject?.id) return
    setActiveProjectMembers([])
    supabase
      .from('project_members')
      .select('user_id, user_name, joined_at')
      .eq('project_id', activeProject.id)
      .then(({ data }) => {
        setActiveProjectMembers(data || [])
      })
  }, [activeProject?.id])

  // Real-time chat: fetch history + subscribe on project open
  useEffect(() => {
    if (!activeProject?.id) return
    setProjectMessages([])
    setChatInput('')

    supabase
      .from('project_messages')
      .select('*')
      .eq('project_id', activeProject.id)
      .order('created_at', { ascending: true })
      .then(({ data }) => {
        if (data) setProjectMessages(data)
        setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
      })

    const channel = supabase
      .channel('project-chat-' + activeProject.id)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'project_messages',
        filter: 'project_id=eq.' + activeProject.id,
      }, (payload) => {
        setProjectMessages((prev) => [...prev, payload.new])
        setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
      })
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [activeProject?.id])

  function showToast(msg) {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(''), 4000)
  }

  async function handleProjectClick(project) {
    setActiveProject(project)
    setProjectCommentInput('')
    const members = await fetchProjectMembers(project.id).catch(() => [])
    setActiveProjectMembers(members)
  }

  async function handleJoinProject(project) {
    try {
      await joinProject(project.id, user.id, user?.user_metadata?.name || user?.name || 'Builder')
      const userName = user?.user_metadata?.name || user?.name || 'Builder'
      setJoinedProjects((prev) => [...prev, project.id])
      setProjects((prev) =>
        prev.map((p) =>
          p.id === project.id ? { ...p, members_count: (p.members_count || 1) + 1 } : p,
        ),
      )
      setActiveProjectMembers((prev) => [...prev, { user_id: user.id, user_name: userName, joined_at: new Date().toISOString() }])
      showToast("You joined! Connect with the team in the Connect tab or wait for the creator to reach out.")
    } catch (err) {
      console.error('Failed to join project:', err)
    }
  }

  async function sendMessage() {
    const text = chatInput.trim()
    if (!text || !user || !activeProject) return
    setChatInput('')
    await supabase.from('project_messages').insert({
      project_id: activeProject.id,
      user_id: user.id,
      user_name: user?.user_metadata?.name || user?.name || 'Builder',
      message: text,
    })
  }

  async function handleMarkAsBuilding() {
    if (!activeProject || !user || user.id !== activeProject.creator_id) return
    const { error } = await supabase
      .from('projects')
      .update({ status: 'Building Now' })
      .eq('id', activeProject.id)
    if (!error) {
      setActiveProject((prev) => ({ ...prev, status: 'building' }))
      setProjects((prev) => prev.map((p) => p.id === activeProject.id ? { ...p, status: 'building' } : p))
      showToast('Status updated to Building Now!')
    }
  }

  function handleAddProjectComment(projectId) {
    const text = projectCommentInput.trim()
    if (!text) return
    const comment = {
      id: Date.now(),
      text,
      author: user?.user_metadata?.name || user?.name || 'Builder',
      at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
    setProjectComments((prev) => ({ ...prev, [projectId]: [...(prev[projectId] || []), comment] }))
    setProjectCommentInput('')
  }

  async function handleProposeProject(e) {
    e.preventDefault()
    if (!user?.id) return
    setProposeLoading(true)
    try {
      const row = await insertProject({
        title: proposeForm.title,
        description: proposeForm.description,
        category: proposeForm.category,
        tags: proposeForm.tags.split(',').map((t) => t.trim()).filter(Boolean),
        looking_for: proposeForm.lookingFor.split(',').map((r) => r.trim()).filter(Boolean),
        impact_area: proposeForm.impactArea,
        github_url: proposeForm.githubUrl || null,
        creator_id: user.id,
        creator_name: user?.user_metadata?.name || user?.name || 'Community member',
        status: proposeForm.status,
        members_count: 1,
      })
      await supabase.from('project_members').insert([{
        project_id: row.id,
        user_id: user.id,
        user_name: user?.user_metadata?.name || user?.name || 'Community member',
      }])
      setProjects((prev) => [normalizeProject(row), ...prev])
      setJoinedProjects((prev) => [...prev, row.id])
      setProposeForm({ title: '', description: '', category: '', tags: '', lookingFor: '', impactArea: '', status: 'Open Idea', githubUrl: '' })
      setShowProposeModal(false)
      showToast('Project posted!')
    } catch (err) {
      console.error('Failed to post project:', err)
    } finally {
      setProposeLoading(false)
    }
  }

  function handleGetAI() {
    setShowAI(true)
    const thread = questions.find(q => q.id === activeThreadId)
    if (!activeThreadId || !thread) return
    if (threadAiAnswers[activeThreadId]) return
    setThreadAiLoading(true)
    const prompt = thread.title + (thread.body ? '\n\n' + thread.body : '')
    const threadLang = thread.lang === 'so' ? 'so' : thread.lang === 'en' ? 'en' : 'both'
    askHageAI(prompt, threadLang)
      .then((answer) => {
        setThreadAiAnswers((prev) => ({ ...prev, [activeThreadId]: answer }))
      })
      .catch(() => {
        setThreadAiAnswers((prev) => ({
          ...prev,
          [activeThreadId]: {
            content: 'Af Soomaali: Xiriirka AI-ga wuu jabay.\n---\nEnglish: AI connection failed. Check your Groq API key.',
            warning: '',
          },
        }))
      })
      .finally(() => setThreadAiLoading(false))
  }

  async function handleLogout() {
    await onLogout()
    navigate('/login')
  }

  // Post a new question to Supabase
  async function handlePostQuestion(questionData) {
    try {
      const row = await insertQuestion({
        user_id: user?.id ?? null,
        lang: questionData.lang,
        title: questionData.title,
        body: questionData.body,
        tags: questionData.tags,
        images: questionData.images,
        poster_name: questionData.poster?.name || user?.name || 'Community member',
        poster_init: questionData.poster?.init || initials(user?.name),
        poster_photo: questionData.poster?.photo || '',
      })
      setQuestions((prev) => [normalizeQuestion(row), ...prev])
      setKnowledgeFilter('all')
      setSelectedTag('all')
    } catch (err) {
      console.error('Failed to post question:', err)
    }
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

  // Post an answer to the active thread via Supabase
  async function postThreadReply(event) {
    event.preventDefault()
    if (!activeThreadId || !threadReply.trim()) return
    const text = threadReply.trim()
    setThreadReply('')
    try {
      const row = await insertAnswer({
        question_id: activeThreadId,
        user_id: user?.id ?? null,
        body: text,
        poster_name: user?.name || 'Community member',
        poster_init: initials(user?.name),
      })
      setThreadAnswers((prev) => [...prev, row])
      // Bump local answer count
      setQuestions((prev) =>
        prev.map((q) => q.id === activeThreadId ? { ...q, answers: q.answers + 1 } : q)
      )
      postCommunityComment(text)
    } catch (err) {
      console.error('Failed to post answer:', err)
    }
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
      const reply = await askHageAI(
        userText,
        aiLanguage,
        withUser.slice(-6).map(({ role, content }) => ({ role, content })),
      )
      const assistantMsg = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        content: reply.content,
        warning: reply.warning,
      }
      const next = [...withUser, assistantMsg]
      setAiMessages(next)
      writeStorage(aiChatKey(user), next)
    } catch (err) {
      console.error('Groq fetch failed:', err)
      const errMsg = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        content: `Waan ka xumahay, jawaabta AI-ga way fashilantay. Fadlan mar kale isku day. Faahfaahin: ${err.message}`,
        warning: '',
      }
      setAiMessages([...withUser, errMsg])
    } finally {
      setAiLoading(false)
    }
  }

  async function saveSettings() {
    setSettingsSaving(true)
    setSettingsMessage('')
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          ...userMeta,
          ai_language: settingsForm.aiLanguage,
          interface_language: settingsForm.interfaceLanguage,
          notify_answers: settingsForm.notifications.answers,
          notify_mentor_requests: settingsForm.notifications.mentorRequests,
          notify_job_alerts: settingsForm.notifications.jobAlerts,
          notify_community_digest: settingsForm.notifications.communityDigest,
          notify_ai_translations: settingsForm.notifications.aiTranslations,
        },
      })
      if (error) throw error
      setSettingsMessage('Settings saved.')
    } catch (err) {
      console.error('Failed to save settings:', err)
      setSettingsMessage('Could not save settings.')
    } finally {
      setSettingsSaving(false)
    }
  }

  async function saveProfile() {
    setProfileSaving(true)
    setProfileMessage('')
    try {
      const trimmedName = profileForm.name.trim() || user?.name || 'User'
      const trimmedBio = profileForm.bio.trim()

      const { error: authError } = await supabase.auth.updateUser({
        data: {
          ...userMeta,
          name: trimmedName,
          bio: trimmedBio,
        },
      })
      if (authError) throw authError

      if (user?.id) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ name: trimmedName })
          .eq('id', user.id)
        if (profileError) throw profileError
      }

      setProfileMessage('Profile saved.')
    } catch (err) {
      console.error('Failed to save profile:', err)
      setProfileMessage('Could not save profile.')
    } finally {
      setProfileSaving(false)
    }
  }

  function reportBadTranslation(payload) {
    const existing = readStorage(BAD_TRANSLATIONS_KEY, [])
    const next = [
      ...existing,
      {
        id: Date.now(),
        userId: user?.id ?? null,
        userName: user?.name ?? 'User',
        createdAt: new Date().toISOString(),
        ...payload,
      },
    ]
    writeStorage(BAD_TRANSLATIONS_KEY, next)
  }

  async function translateAiResponse(id, content, targetLang) {
    setTranslatingId(id)
    try {
      const reply = await askHageAI(
        `Translate this response into ${targetLang === 'so' ? 'natural Somali' : 'clear English'} while preserving the meaning:\n\n${content}`,
        targetLang,
      )
      setMessageTranslations((prev) => ({
        ...prev,
        [id]: {
          content: reply.content,
          warning: reply.warning,
          targetLang,
        },
      }))
    } catch (err) {
      setMessageTranslations((prev) => ({
        ...prev,
        [id]: {
          content: `Translation failed: ${err.message}`,
          warning: '',
          targetLang,
        },
      }))
    } finally {
      setTranslatingId('')
    }
  }

  async function explainCode(outputLang) {
    if (!codeInput.trim() || codeExplainLoading) return
    setCodeExplainLoading(true)
    setCodeExplainNotice('')
    try {
      const prompt = `Language: ${codeLanguage}\n\nCode:\n${codeInput.trim()}`
      const reply = await askHageAICustom(
        prompt,
        outputLang === 'so' ? SOMALI_CODE_SYSTEM_PROMPT : ENGLISH_CODE_SYSTEM_PROMPT,
        outputLang,
      )
      setCodeExplanation({
        language: codeLanguage,
        outputLang,
        code: codeInput.trim(),
        content: reply.content,
        warning: reply.warning,
      })
    } catch (err) {
      setCodeExplanation({
        language: codeLanguage,
        outputLang,
        code: codeInput.trim(),
        content: `Could not explain this code right now. ${err.message}`,
        warning: '',
      })
    } finally {
      setCodeExplainLoading(false)
    }
  }

  async function copyCodeExplanation(mode = 'copy') {
    if (!codeExplanation) return
    const shareText = `Somali Code Explainer

Language: ${codeExplanation.language}
Output: ${codeExplanation.outputLang === 'so' ? 'Somali' : 'English'}

Code:
${codeExplanation.code}

Explanation:
${codeExplanation.content}`
    try {
      await navigator.clipboard.writeText(mode === 'share' ? shareText : codeExplanation.content)
      setCodeExplainNotice(mode === 'share' ? 'Share text copied.' : 'Explanation copied.')
    } catch {
      setCodeExplainNotice('Could not copy right now.')
    }
  }

  const mainNavItems = [
    { icon: '🏠', label: 'Home', page: 'dashboard', action: () => navigate('/home') },
    { icon: '💬', label: 'Ask', page: 'ask-action', action: () => setShowAskModal(true) },
    { icon: '🤖', label: 'AI', page: 'ai', action: () => navigate('/ai') },
    { icon: '❓', label: 'Questions', page: 'knowledge', action: () => navigate('/ask') },
    { icon: '•••', label: 'More', page: 'more', action: () => setShowMoreDrawer(true) },
  ]

  const moreItems = [
    { icon: '📚', label: 'Learn', page: 'learn', action: () => navigate('/learn') },
    { icon: '🤝', label: 'Connect', page: 'connect', action: () => navigate('/connect') },
    { icon: '🔨', label: 'Build', page: 'build', action: () => navigate('/build') },
    { icon: '✨', label: 'Stories', page: 'stories', action: () => navigate('/stories') },
    { icon: '💼', label: 'Jobs', page: 'jobs', action: () => navigate('/jobs') },
    { icon: '👤', label: 'Profile', page: 'profile', action: () => navigate('/profile') },
    { icon: '⚙️', label: 'Settings', page: 'settings', action: () => navigate('/settings') },
  ]

  return (
    <main className="min-h-screen bg-[#f4f7fb] text-slate-900">
      <header className="sticky top-0 z-40 border-b border-[#dce6f5] bg-white">
        <div className="mx-auto flex max-w-[1240px] items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="max-w-full truncate font-display text-2xl tracking-tight text-slate-950 sm:text-3xl">
            Hage Hub
          </Link>
          <nav className="nav-tabs-desktop hidden flex-wrap items-center gap-2 rounded-full border border-[#dce6f5] bg-[#f4f7fb] p-1 md:flex">
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
          <div className="flex items-center justify-between gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#dce6f5] bg-[#f4f7fb] text-lg md:hidden">
              {currentNavItem.icon}
            </div>
            <NavLink to="/profile" className="flex items-center gap-3 rounded-full bg-white px-3 py-2">
              <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full">
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: getAvatarColor(user?.metadata?.name || user?.name),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: 13,
                  fontWeight: 600,
                  color: '#fff',
                  flexShrink: 0,
                  cursor: 'pointer',
                }}>
                  {getInitials(user?.metadata?.name || user?.name)}
                </div>
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-semibold text-slate-900">{user?.name}</p>
                <p className="text-xs text-slate-500">{user?.role || 'student'}</p>
              </div>
            </NavLink>
            <NavLink to="/settings" className="hidden rounded-full border border-[#dce6f5] bg-white px-4 py-2 text-sm font-medium text-slate-700 md:inline-flex">
              Settings
            </NavLink>
            <button type="button" onClick={handleLogout} className="hidden rounded-full border border-[#dce6f5] bg-white px-4 py-2 text-sm font-medium text-slate-700 md:inline-flex">
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="main-content mx-auto max-w-[1240px] px-4 py-6 pb-24 sm:px-6 lg:px-8">
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
                      Knowledge Layer
                    </p>
                    <p className="mt-3 font-display text-3xl text-slate-950">
                      {questions.length}
                    </p>
                    <p className="mt-2 text-sm leading-7 text-slate-600">
                      Real questions from the community knowledge feed are synced here so you can jump straight into what matters.
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

            <section className="page-two-col mt-6 grid gap-6 lg:grid-cols-[1fr_300px]">
              <div>
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                  Recent Questions
                </p>
                <h2 className="mb-4 font-display text-4xl text-slate-950">Keep the conversation moving</h2>
                <button type="button" onClick={() => setShowAskModal(true)} className="mb-4 rounded-full bg-[#4189DD] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#1a5db5]">
                  + Ask a Question
                </button>
                <div className="space-y-3">
                  {questions.slice(0, 3).map((question) => (
                    <article key={question.id} className="cursor-pointer rounded-[20px] border border-[#dce6f5] bg-white px-4 py-4 transition hover:-translate-y-0.5 hover:border-[#c8dff7] hover:shadow-[0_8px_24px_rgba(65,137,221,0.08)] sm:px-5 sm:py-5" onClick={() => navigate('/ask', { state: { threadId: question.id } })}>
                      <div className="min-w-0">
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
                    </article>
                  ))}
                </div>
              </div>
              <aside className="sidebar-right space-y-4">
                <section className="rounded-[20px] border border-[#dce6f5] bg-white p-4 sm:p-5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">Top Contributors</p>
                  <div className="mt-4 space-y-3">
                    {topContributors.map((contributor, index) => (
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
                <section className="rounded-[20px] border border-[#dce6f5] bg-white p-4 sm:p-5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">Popular Tags</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {['algorithms', 'python', 'react', 'web-dev', 'ai/ml', 'system-design', 'somalia-tech'].map((tag) => (
                      <span key={tag} className="rounded-full border border-[#dce6f5] bg-[#f4f7fb] px-3 py-2 text-xs font-medium text-slate-600">{tag}</span>
                    ))}
                  </div>
                </section>
                <section className="rounded-[20px] bg-[#0f3d82] p-4 text-white sm:p-5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/55">My Cohort</p>
                  <p className="mt-3 font-display text-3xl">No active cohort yet</p>
                  <p className="mt-2 text-sm text-white/70">Find a mentor in Connect ?</p>
                  <NavLink to="/connect" className="mt-4 inline-flex rounded-full bg-[#4189DD] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#6aaae8]">Find a mentor in Connect ?</NavLink>
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
                    <div style={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      background: getAvatarColor(activeThread.poster.name),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: 'DM Sans, sans-serif',
                      fontSize: 13,
                      fontWeight: 600,
                      color: '#fff',
                      flexShrink: 0,
                    }}>
                      {getInitials(activeThread.poster.name)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{activeThread.poster.name}</p>
                      {activeThread.poster.loc && <p className="text-xs text-slate-400">{activeThread.poster.loc}</p>}
                    </div>
                  </div>
                  <span className="text-xs text-slate-400">{activeThread.time}</span>
                  <div className="ml-auto flex items-center gap-4">
                    <span className="text-sm text-slate-400">
                      {threadAnswers.length} {threadAnswers.length === 1 ? 'answer' : 'answers'}
                    </span>
                  </div>
                </div>

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
              {showAI ? (
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
                  <>
                    <div
                      style={{
                        maxHeight: aiExpanded ? 'none' : '80px',
                        overflow: 'hidden',
                        position: 'relative',
                        marginTop: 12,
                      }}
                    >
                      <p className="whitespace-pre-wrap text-sm leading-8 text-white/85">
                        {threadAiAnswers[activeThreadId]?.content || ''}
                      </p>
                      {!aiExpanded && threadAiAnswers[activeThreadId]?.content ? (
                        <div
                          style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: 40,
                            background: 'linear-gradient(transparent, #0f3d82)',
                          }}
                        />
                      ) : null}
                    </div>
                    {threadAiAnswers[activeThreadId]?.content ? (
                      <button
                        type="button"
                        onClick={() => setAiExpanded((prev) => !prev)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'rgba(255,255,255,0.7)',
                          fontSize: 13,
                          cursor: 'pointer',
                          marginTop: 8,
                          fontFamily: 'DM Sans, sans-serif',
                          padding: 0,
                        }}
                      >
                        {aiExpanded ? '▲ Show less' : '▼ Show full answer'}
                      </button>
                    ) : null}
                  </>
                )}
                {threadAiAnswers[activeThreadId]?.warning ? <p className="mt-3 text-xs text-amber-200">{threadAiAnswers[activeThreadId].warning}</p> : null}
                {threadAiAnswers[activeThreadId]?.content ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => translateAiResponse(`thread-${activeThreadId}`, threadAiAnswers[activeThreadId].content, activeThread?.lang === 'so' ? 'en' : 'so')}
                      className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white"
                    >
                      {translatingId === `thread-${activeThreadId}` ? 'Translating...' : 'Translate'}
                    </button>
                    <button
                      type="button"
                      onClick={() => reportBadTranslation({ source: 'thread-ai', content: threadAiAnswers[activeThreadId].content, warning: threadAiAnswers[activeThreadId].warning, questionId: activeThreadId })}
                      className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white"
                    >
                      Report bad translation
                    </button>
                  </div>
                ) : null}
                {messageTranslations[`thread-${activeThreadId}`] ? (
                  <div className="mt-4 rounded-[16px] bg-white/10 px-4 py-3 text-sm text-white/90">
                    <p className="font-semibold">{messageTranslations[`thread-${activeThreadId}`].targetLang === 'so' ? 'Somali translation' : 'English translation'}</p>
                    <p className="mt-2 whitespace-pre-wrap">{messageTranslations[`thread-${activeThreadId}`].content}</p>
                    {messageTranslations[`thread-${activeThreadId}`].warning ? <p className="mt-2 text-xs text-amber-200">{messageTranslations[`thread-${activeThreadId}`].warning}</p> : null}
                  </div>
                ) : null}
              </div>
              ) : (
                <button
                  type="button"
                  onClick={handleGetAI}
                  className="w-full sm:w-auto"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    padding: '12px 20px',
                    background: '#0f3d82',
                    border: 'none',
                    borderRadius: 12,
                    color: 'white',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontFamily: 'DM Sans, sans-serif',
                    margin: '16px 0',
                  }}
                >
                  🤖 Get AI suggested answer
                </button>
              )}

              {/* Community answers */}
              <div className="mt-6">
                <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                  Community Answers ({threadAnswers.length})
                </p>

                {threadAnswersLoading ? (
                  <div className="rounded-[20px] border border-[#dce6f5] bg-white p-8 text-center text-sm text-slate-400">
                    Loading answers…
                  </div>
                ) : threadAnswers.length === 0 ? (
                  <div className="rounded-[20px] border border-dashed border-[#dce6f5] bg-white p-8 text-center text-sm text-slate-400">
                    No answers yet — be the first to help.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {threadAnswers.map((answer) => (
                      <div key={answer.id} className="flex gap-4 rounded-[20px] border border-[#dce6f5] bg-white p-5">
                        <div style={{
                          width: 28,
                          height: 28,
                          borderRadius: '50%',
                          background: getAvatarColor(answer.poster_name),
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 10,
                          fontWeight: 600,
                          color: '#fff',
                          flexShrink: 0,
                        }}>
                          {getInitials(answer.poster_name)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{answer.poster_name}</p>
                          <p className="mt-1.5 text-sm leading-7 text-slate-600">{answer.body}</p>
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
            <div className="page-two-col grid gap-6 lg:grid-cols-[1fr_280px]">
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

                <div className="mb-5 flex flex-wrap gap-2">
                  <button type="button" onClick={() => setSelectedTag('all')} className={`rounded-full px-4 py-2 text-sm font-medium transition ${selectedTag === 'all' ? 'bg-[#4189DD] text-white shadow-[0_4px_12px_rgba(65,137,221,0.25)]' : 'border border-[#dce6f5] bg-white text-slate-500 hover:border-[#c8dff7]'}`}>
                    All tags
                  </button>
                  {sidebarTags.map((tag) => (
                    <button key={tag} type="button" onClick={() => setSelectedTag(tag)} className={`rounded-full px-4 py-2 text-sm font-medium transition ${selectedTag === tag ? 'bg-[#4189DD] text-white shadow-[0_4px_12px_rgba(65,137,221,0.25)]' : 'border border-[#dce6f5] bg-white text-slate-500 hover:border-[#c8dff7]'}`}>
                      #{tag}
                    </button>
                  ))}
                </div>

                {/* Questions list */}
                <div className="space-y-3">
                  {showQuestionsLoading ? (
                    <div className="rounded-[20px] border border-[#dce6f5] bg-white p-10 text-center text-sm text-slate-400">
                      Loading questions...
                    </div>
                  ) : showQuestionsEmpty ? (
                    <div className="rounded-[20px] border border-dashed border-[#dce6f5] bg-white p-10 text-center">
                      <p className="text-sm text-slate-500">
                        {questions.length === 0 ? 'No questions yet. Be the first to ask one!' : 'No questions match the current filters.'}
                      </p>
                      <button type="button" onClick={() => setShowAskModal(true)} className="mt-4 rounded-full bg-[#4189DD] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#1a5db5]">
                        Ask a Question
                      </button>
                    </div>
                  ) : (
                    filteredQuestions.map((question) => (
                      <QuestionCard
                        key={question.id}
                        question={question}
                        onOpen={() => setActiveThreadId(question.id)}
                      />
                    ))
                  )}
                </div>
              </div>

              {/* Sidebar */}
              <aside className="sidebar-right space-y-4">
                <section className="rounded-[20px] border border-[#dce6f5] bg-white p-5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">Top Contributors</p>
                  <div className="mt-4 space-y-3">
                    {visibleContributors.slice(0, 3).map((contributor, index) => (
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
                    {sidebarTags.map((tag) => (
                      <button key={tag} type="button" onClick={() => setSelectedTag(tag)} className={`rounded-full border px-3 py-1.5 text-xs font-medium ${selectedTag === tag ? 'border-[#4189DD] bg-[#4189DD] text-white' : 'border-[#dce6f5] bg-[#f4f7fb] text-slate-600'}`}>#{tag}</button>
                    ))}
                  </div>
                </section>
              </aside>
            </div>
          )
        ) : null}

        {currentPage === 'ai' ? (
          <section className="rounded-[28px] border border-[#dce6f5] bg-white shadow-[0_18px_60px_rgba(65,137,221,0.08)]">
            <div className="flex flex-col gap-4 border-b border-[#dce6f5] px-6 py-5 sm:flex-row sm:items-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-[#0f3d82] text-white">AI</div>
              <div className="flex-1">
                <p className="font-display text-3xl text-slate-950">Hage AI Assistant</p>
                <p className="text-sm text-slate-400">Ask anything in Somali or English, or paste code for a guided explanation.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  ['chat', 'Ask Hage AI'],
                  ['code', 'Explain Code'],
                ].map(([value, label]) => (
                  <button key={value} type="button" onClick={() => setAiTab(value)} className={`rounded-full px-4 py-2 text-sm font-medium ${aiTab === value ? 'bg-[#4189DD] text-white' : 'border border-[#dce6f5] bg-white text-slate-500'}`}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
            {aiTab === 'chat' ? (
              <div className="flex min-h-[420px] flex-col gap-4 px-6 py-6">
                <div className="flex flex-wrap gap-2">
                  {[
                    ['both', 'Both'],
                    ['en', 'English'],
                    ['so', 'Somali'],
                  ].map(([value, label]) => (
                    <button key={value} type="button" onClick={() => setAiLanguage(value)} className={`rounded-full px-4 py-2 text-sm font-medium ${aiLanguage === value ? 'bg-[#4189DD] text-white' : 'border border-[#dce6f5] bg-white text-slate-500'}`}>
                      {label}
                    </button>
                  ))}
                </div>
                <div className="flex-1 space-y-4 overflow-y-auto">
                  {aiMessages.map((message) => (
                    <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] rounded-[16px] px-4 py-3 text-sm leading-7 ${message.role === 'user' ? 'bg-[#4189DD] text-white' : 'border border-[#dce6f5] bg-[#f4f7fb] text-slate-600'}`}>
                        <div className="whitespace-pre-wrap">{message.content}</div>
                        {message.warning ? <p className="mt-3 text-xs text-amber-600">{message.warning}</p> : null}
                        {message.role === 'assistant' ? (
                          <div className="mt-3 flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => translateAiResponse(message.id, message.content, aiLanguage === 'so' ? 'en' : 'so')}
                              className="rounded-full border border-[#dce6f5] bg-white px-3 py-1 text-xs font-medium text-slate-600"
                            >
                              {translatingId === message.id ? 'Translating...' : 'Translate'}
                            </button>
                            <button
                              type="button"
                              onClick={() => reportBadTranslation({ source: 'ai-chat', content: message.content, warning: message.warning })}
                              className="rounded-full border border-[#dce6f5] bg-white px-3 py-1 text-xs font-medium text-slate-600"
                            >
                              Report bad translation
                            </button>
                          </div>
                        ) : null}
                        {messageTranslations[message.id] ? (
                          <div className="mt-3 rounded-[12px] border border-[#dce6f5] bg-white px-3 py-2 text-xs text-slate-600">
                            <p className="font-semibold text-slate-700">{messageTranslations[message.id].targetLang === 'so' ? 'Somali translation' : 'English translation'}</p>
                            <p className="mt-1 whitespace-pre-wrap">{messageTranslations[message.id].content}</p>
                            {messageTranslations[message.id].warning ? <p className="mt-2 text-amber-600">{messageTranslations[message.id].warning}</p> : null}
                          </div>
                        ) : null}
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
            ) : (
              <div className="px-6 py-6">
                <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
                  <div className="space-y-4">
                    <textarea
                      value={codeInput}
                      onChange={(event) => setCodeInput(event.target.value)}
                      placeholder="Paste any code here - Python, JavaScript, HTML, anything..."
                      style={{
                        width: '100%',
                        minHeight: 180,
                        fontFamily: 'monospace',
                        fontSize: 13,
                        padding: 16,
                        border: '1.5px solid #dce6f5',
                        borderRadius: 12,
                        background: '#0c1220',
                        color: '#a8d8a8',
                        resize: 'vertical',
                        outline: 'none',
                      }}
                    />
                    <select value={codeLanguage} onChange={(event) => setCodeLanguage(event.target.value)} className="w-full rounded-[12px] border border-[#dce6f5] bg-white px-4 py-3 text-sm text-slate-700 outline-none">
                      {['Python', 'JavaScript', 'HTML/CSS', 'Java', 'C++', 'SQL', 'Other'].map((option) => (
                        <option key={option}>{option}</option>
                      ))}
                    </select>
                    <div className="flex flex-wrap gap-3">
                      <button type="button" onClick={() => explainCode('so')} disabled={codeExplainLoading} className="rounded-[12px] bg-[#4189DD] px-5 py-3 text-sm font-medium text-white transition disabled:opacity-50">
                        🇸🇴 Explain in Somali
                      </button>
                      <button type="button" onClick={() => explainCode('en')} disabled={codeExplainLoading} className="rounded-[12px] border border-[#dce6f5] bg-white px-5 py-3 text-sm font-medium text-slate-600 transition disabled:opacity-50">
                        🇬🇧 Explain in English
                      </button>
                    </div>
                  </div>
                  <div className="rounded-[22px] border border-[#193150] bg-[#0f1d35] p-5 text-white shadow-[0_16px_40px_rgba(15,29,53,0.24)]">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-[#17345e] px-3 py-1 text-[11px] font-semibold text-[#c8dff7]">
                        {codeExplanation?.outputLang === 'en' ? '🇬🇧 English Explanation' : '🇸🇴 Somali Explanation'}
                      </span>
                      {codeExplanation?.language ? (
                        <span className="rounded-full border border-[#2f4d73] px-3 py-1 text-[11px] font-medium text-white/75">
                          {codeExplanation.language}
                        </span>
                      ) : null}
                    </div>
                    <pre className="mt-4 overflow-x-auto rounded-[16px] border border-[#1c3559] bg-[#09111f] p-4 text-xs leading-6 text-[#a8d8a8]">
                      <code>{codeExplanation?.code || '// Your code will appear here before the explanation.'}</code>
                    </pre>
                    <div className="mt-4 whitespace-pre-wrap text-sm leading-7 text-white/85">
                      {codeExplainLoading ? 'Explaining code...' : (codeExplanation?.content || 'Choose a language and click one of the explain buttons to get a guided walkthrough.')}
                    </div>
                    {codeExplanation?.warning ? <p className="mt-3 text-xs text-amber-200">{codeExplanation.warning}</p> : null}
                    <div className="mt-5 flex flex-wrap gap-2">
                      <button type="button" onClick={() => copyCodeExplanation('copy')} disabled={!codeExplanation} className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white disabled:opacity-40">
                        Copy explanation
                      </button>
                      <button type="button" onClick={() => copyCodeExplanation('share')} disabled={!codeExplanation} className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white disabled:opacity-40">
                        Share
                      </button>
                    </div>
                    {codeExplainNotice ? <p className="mt-3 text-xs text-[#c8dff7]">{codeExplainNotice}</p> : null}
                  </div>
                </div>
              </div>
            )}
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
                <NavLink to="/connect" className="mt-4 inline-flex rounded-full bg-[#4189DD] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#6aaae8]">Find a mentor in Connect ?</NavLink>
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
                  [String(projects.length || 0), 'active projects'],
                  [String(projects.reduce((s, p) => s + (p.members_count || 0), 0)), 'builders'],
                  [String(projects.filter((p) => p.impact_area?.toLowerCase().includes('somalia')).length), 'Somalia-focused'],
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
                    {value === 'mine' && joinedProjects.length > 0 && (
                      <span className="ml-1.5 rounded-full bg-white/25 px-1.5 py-0.5 text-[10px] font-bold">{joinedProjects.length}</span>
                    )}
                  </button>
                ))}
              </div>

              {/* Project grid */}
              <div className="grid gap-4 md:grid-cols-2">
                {projects
                  .filter((p) => {
                    if (buildTab === 'idea') return p.status === 'idea'
                    if (buildTab === 'building') return p.status === 'building'
                    if (buildTab === 'mine') return joinedProjects.includes(p.id)
                    return true
                  })
                  .map((project) => {
                    const sm = statusMeta[project.status] || statusMeta.idea
                    const joined = joinedProjects.includes(project.id)
                    const memberCount = project.members?.length || project.members_count || 0
                    return (
                      <article key={project.id} onClick={() => handleProjectClick(project)} className={`flex flex-col rounded-[20px] border bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(65,137,221,0.08)] cursor-pointer ${joined ? 'border-[#4189DD]' : 'border-[#dce6f5]'}`}>
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
                              {(project.members || []).slice(0, 4).map(([init, bg]) => (
                                <div key={init} className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white text-[9px] font-bold text-white" style={{ backgroundColor: bg }}>{init}</div>
                              ))}
                              {memberCount === 0 && (
                                <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-dashed border-[#dce6f5] text-[9px] text-slate-400">+</div>
                              )}
                            </div>
                            <span className="text-xs text-slate-400">
                              {memberCount === 0 ? 'Be the first' : `${memberCount} builder${memberCount === 1 ? '' : 's'}`}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); if (!joined) handleJoinProject(project) }}
                            className={`rounded-full px-4 py-2 text-sm font-medium transition ${joined ? 'bg-[#eaf2fd] text-[#1a5db5]' : 'bg-[#4189DD] text-white hover:bg-[#1a5db5]'}`}
                          >
                            {joined ? '✓ Joined' : 'Join Project'}
                          </button>
                        </div>
                        {joined && (
                          <div className="mt-3 flex items-center gap-2 border-t border-[#f4f7fb] pt-3">
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#4189DD] text-[9px] font-bold text-white">
                              {initials(user?.user_metadata?.name || user?.name || 'You')}
                            </div>
                            <span className="text-xs text-[#1a5db5] font-medium">
                              You{memberCount > 1 ? ` + ${memberCount - 1} other${memberCount - 1 === 1 ? '' : 's'}` : ' — be the first!'}
                            </span>
                          </div>
                        )}
                      </article>
                    )
                  })}

                {/* Empty state for "Joined" tab */}
                {buildTab === 'mine' && joinedProjects.length === 0 && (
                  <div className="col-span-2 rounded-[20px] border border-dashed border-[#dce6f5] bg-white p-10 text-center">
                    <p className="font-display text-2xl text-slate-400">You have not joined a project yet.</p>
                    <p className="mt-2 text-sm text-slate-400">Browse the list and hit "Join Project" — no experience required.</p>
                    <button type="button" onClick={() => setBuildTab('all')} className="mt-4 rounded-full bg-[#4189DD] px-5 py-2.5 text-sm font-medium text-white">Browse Projects</button>
                  </div>
                )}
              </div>

              {/* Top Builders leaderboard */}
              {topBuilders.length > 0 && (
                <div className="mt-8 rounded-[20px] border border-[#dce6f5] bg-white p-5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">Top Builders</p>
                  <div className="mt-4 space-y-3">
                    {topBuilders.map((builder, i) => (
                      <div key={builder.user_name + i} className="flex items-center gap-3">
                        <span className="w-4 text-center text-xs font-bold text-slate-300">{i + 1}</span>
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#eaf2fd] text-xs font-bold text-[#1a5db5]">
                          {initials(builder.user_name)}
                        </div>
                        <span className="flex-1 text-sm font-medium text-slate-700">{builder.user_name}</span>
                        <span className="rounded-full bg-[#f4f7fb] px-2.5 py-1 text-[11px] font-semibold text-slate-500">
                          {builder.count} project{builder.count === 1 ? '' : 's'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside className="space-y-4">
              {/* Start a project CTA */}
              <div className="rounded-[20px] bg-[#0f3d82] p-5 text-white">
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#6aaae8]">Got an idea?</p>
                <h3 className="mt-2 font-display text-3xl">Start a project.</h3>
                <p className="mt-2 text-sm leading-7 text-white/70">You don't need a team yet. Post the idea and the right people will find you.</p>
                <button type="button" onClick={() => setShowProposeModal(true)} className="mt-4 w-full rounded-full bg-[#4189DD] py-3 text-sm font-medium text-white transition hover:bg-[#6aaae8]">
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

        {currentPage === 'jobs' ? (
          <div>
            {/* Header */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">Fursan - Opportunities</p>
                <h2 className="font-display text-4xl text-slate-950">Jobs &amp; Internships</h2>
                <p className="mt-2 text-sm text-slate-500">Curated for Somali technologists — remote, diaspora, and East Africa.</p>
              </div>
              <button
                type="button"
                className="shrink-0 rounded-full bg-[#4189DD] px-5 py-3 text-sm font-medium text-white shadow-[0_6px_18px_rgba(65,137,221,0.28)] transition hover:bg-[#1a5db5]"
              >
                + Post a Job
              </button>
            </div>

            {/* Filters */}
            <div className="mb-5 flex flex-wrap gap-2">
              {[
                ['all', 'All Jobs'],
                ['ft', 'Full-time'],
                ['int', 'Internships'],
                ['rem', 'Remote'],
                ['som', 'Somalia - Diaspora'],
              ].map(([value, label]) => (
                <button key={value} type="button" onClick={() => setWorkTab(value)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${workTab === value ? 'bg-[#4189DD] text-white shadow-[0_4px_12px_rgba(65,137,221,0.24)]' : 'border border-[#dce6f5] bg-white text-slate-500 hover:border-[#4189DD] hover:text-[#4189DD]'}`}>
                  {label}
                </button>
              ))}
            </div>

            {/* Job cards */}
            {(() => {
              const filtered = jobs.filter((job) => {
                if (workTab === 'all') return true
                return job.tags.includes(workTab)
              })
              if (!filtered.length) {
                return (
                  <div className="rounded-[20px] border border-[#dce6f5] bg-white p-12 text-center">
                    <p className="text-slate-400">No jobs match this filter right now.</p>
                  </div>
                )
              }
              return (
                <div className="grid gap-4 lg:grid-cols-2">
                  {filtered.map((job) => (
                    <article key={`${job.company}-${job.title}`}
                      className="flex gap-4 rounded-[20px] border border-[#dce6f5] bg-white p-5 transition hover:-translate-y-0.5 hover:border-[#4189DD] hover:shadow-[0_10px_28px_rgba(65,137,221,0.08)]">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] font-display text-sm font-bold"
                        style={{ backgroundColor: job.logoBg, color: job.logoColor }}>
                        {job.logo}
                      </div>
                      <div className="flex flex-1 flex-col gap-2">
                        <div>
                          <p className="font-semibold text-slate-900">{job.title}</p>
                          <p className="text-sm text-slate-500">{job.company} · {job.loc}</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-[#eaf2fd] px-3 py-1 text-[11px] font-semibold text-[#1a5db5]">{job.type}</span>
                          <span className="rounded-full bg-[#f4f7fb] px-3 py-1 text-[11px] font-semibold text-slate-600">{job.salary}</span>
                          {job.tags.includes('rem') && (
                            <span className="rounded-full bg-[#e8f5ee] px-3 py-1 text-[11px] font-semibold text-[#1a6b4a]">Remote</span>
                          )}
                          {job.tags.includes('som') && (
                            <span className="rounded-full bg-[#f3f0ff] px-3 py-1 text-[11px] font-semibold text-[#5b3fa0]">🇸🇴 Somali-friendly</span>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] text-slate-400">Posted {job.posted}</span>
                          <a href={job.url} target="_blank" rel="noopener noreferrer"
                            className="rounded-full bg-[#4189DD] px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-[#1a5db5]">
                            Apply {'->'}
                          </a>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )
            })()}

            {/* Bottom call-to-action */}
            <div className="mt-8 rounded-[20px] border border-[#dce6f5] bg-white p-6 text-center">
              <p className="font-display text-2xl text-slate-950">Hiring Somali talent?</p>
              <p className="mt-2 text-sm text-slate-500">Post your role and reach engineers, designers, and founders in the diaspora and East Africa.</p>
              <button type="button" className="mt-4 rounded-full bg-[#4189DD] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#1a5db5]">
                Post a Job — Free
              </button>
            </div>
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
                <div style={{
                  width: 88,
                  height: 88,
                  borderRadius: '50%',
                  background: getAvatarColor(user?.metadata?.name || user?.name),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'Cormorant Garamond, serif',
                  fontSize: 32,
                  fontWeight: 700,
                  color: '#fff',
                }}>
                  {getInitials(user?.metadata?.name || user?.name)}
                </div>
                <div>
                  <h2 className="font-display text-4xl text-slate-950">{user?.name}</h2>
                  <p className="mt-2 text-sm text-slate-500">{user?.role === 'mentor' ? 'Mentor - Senior SWE' : 'Student - Somali Tech Community'}</p>
                  <p className="mt-2 text-xs text-slate-400">Profile photos coming soon</p>
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
                  <label className="block text-sm text-slate-600">Display Name<input value={profileForm.name} onChange={(event) => setProfileForm((prev) => ({ ...prev, name: event.target.value }))} className="mt-2 w-full rounded-[12px] border border-[#dce6f5] bg-[#f4f7fb] px-4 py-3 outline-none" /></label>
                  <label className="block text-sm text-slate-600">Bio<textarea value={profileForm.bio} onChange={(event) => setProfileForm((prev) => ({ ...prev, bio: event.target.value }))} className="mt-2 min-h-28 w-full rounded-[12px] border border-[#dce6f5] bg-[#f4f7fb] px-4 py-3 outline-none" /></label>
                  <div className="flex items-center gap-3">
                    <button type="button" onClick={saveProfile} disabled={profileSaving} className="rounded-full bg-[#4189DD] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#1a5db5] disabled:opacity-50">
                      {profileSaving ? 'Saving...' : 'Save profile'}
                    </button>
                    {profileMessage ? <p className="text-sm text-slate-500">{profileMessage}</p> : null}
                  </div>
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
                  {[
                    ['answers', 'New answers on my questions'],
                    ['mentorRequests', 'New mentor requests'],
                    ['jobAlerts', 'Job alerts'],
                    ['communityDigest', 'Community digest'],
                    ['aiTranslations', 'AI translations ready'],
                  ].map(([key, item]) => (
                    <div key={item} className="flex items-center justify-between gap-4">
                      <span className="text-sm text-slate-600">{item}</span>
                      <button
                        type="button"
                        onClick={() => setSettingsForm((prev) => ({
                          ...prev,
                          notifications: {
                            ...prev.notifications,
                            [key]: !prev.notifications[key],
                          },
                        }))}
                        className={`h-7 w-12 rounded-full p-1 transition ${settingsForm.notifications[key] ? 'bg-[#4189DD]/20' : 'bg-slate-200'}`}
                      >
                        <div className={`h-5 w-5 rounded-full transition ${settingsForm.notifications[key] ? 'translate-x-5 bg-[#4189DD]' : 'translate-x-0 bg-white'}`} />
                      </button>
                    </div>
                  ))}
                </div>
              </section>
              <section className="rounded-[20px] border border-[#dce6f5] bg-white p-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">Language</p>
                <div className="mt-4 space-y-4">
                  <label className="block text-sm text-slate-600">Default AI response language<select value={settingsForm.aiLanguage} onChange={(event) => setSettingsForm((prev) => ({ ...prev, aiLanguage: event.target.value }))} className="mt-2 w-full rounded-[12px] border border-[#dce6f5] bg-[#f4f7fb] px-4 py-3 outline-none"><option>Both (English + Somali)</option><option>English only</option><option>Somali only</option></select></label>
                  <label className="block text-sm text-slate-600">Interface language<select value={settingsForm.interfaceLanguage} onChange={(event) => setSettingsForm((prev) => ({ ...prev, interfaceLanguage: event.target.value }))} className="mt-2 w-full rounded-[12px] border border-[#dce6f5] bg-[#f4f7fb] px-4 py-3 outline-none"><option>English</option><option>Somali (af Soomaali)</option></select></label>
                </div>
              </section>
              <div className="flex items-center gap-3">
                <button type="button" onClick={saveSettings} disabled={settingsSaving} className="rounded-full bg-[#4189DD] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#1a5db5] disabled:opacity-50">
                  {settingsSaving ? 'Saving...' : 'Save settings'}
                </button>
                {settingsMessage ? <p className="text-sm text-slate-500">{settingsMessage}</p> : null}
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <div className="mobile-bottom-nav">
        <div
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            height: 64,
            background: 'white',
            borderTop: '1px solid #dce6f5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            zIndex: 100,
            paddingBottom: 'env(safe-area-inset-bottom)',
          }}
        >
          {mainNavItems.map((item) => (
            <button
              key={item.page}
              type="button"
              onClick={() => {
                item.action()
                if (item.page !== 'more') setShowMoreDrawer(false)
              }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 3,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '6px 10px',
                color: currentPage === item.page ? '#4189DD' : '#8a9bbf',
                flex: 1,
              }}
            >
              <span style={{ fontSize: 22 }}>{item.icon}</span>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  fontFamily: 'DM Sans, sans-serif',
                  letterSpacing: 0.3,
                }}
              >
                {item.label}
              </span>
            </button>
          ))}
        </div>

        {showMoreDrawer && (
          <>
            <div
              onClick={() => setShowMoreDrawer(false)}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(12,18,32,0.5)',
                zIndex: 150,
              }}
            />
            <div
              style={{
                position: 'fixed',
                bottom: 64,
                left: 0,
                right: 0,
                background: 'white',
                borderRadius: '20px 20px 0 0',
                borderTop: '1px solid #dce6f5',
                zIndex: 200,
                padding: '12px 0 20px',
                animation: 'slideUp 0.2s ease',
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 4,
                  background: '#dce6f5',
                  borderRadius: 2,
                  margin: '0 auto 16px',
                }}
              />
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr',
                  gap: 4,
                  padding: '0 16px',
                }}
              >
                {moreItems.map((item) => (
                  <button
                    key={item.page}
                    type="button"
                    onClick={() => {
                      item.action()
                      setShowMoreDrawer(false)
                    }}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 6,
                      padding: '14px 8px',
                      background: currentPage === item.page ? '#eaf2fd' : 'transparent',
                      border: '1px solid',
                      borderColor: currentPage === item.page ? '#c8dff7' : 'transparent',
                      borderRadius: 12,
                      cursor: 'pointer',
                      color: currentPage === item.page ? '#4189DD' : '#3d4f6e',
                    }}
                  >
                    <span style={{ fontSize: 24 }}>{item.icon}</span>
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        fontFamily: 'DM Sans, sans-serif',
                      }}
                    >
                      {item.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      <AskModal
        isOpen={showAskModal}
        onClose={() => setShowAskModal(false)}
        onSubmit={handlePostQuestion}
        user={user}
      />

      {/* Propose a Project Modal */}
      {showProposeModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}
          onClick={(e) => e.target === e.currentTarget && setShowProposeModal(false)}
        >
          <div className="hh-modal-body w-full max-w-lg rounded-[24px] bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-display text-2xl text-slate-950">Propose a Project</h2>
              <button type="button" onClick={() => setShowProposeModal(false)} className="text-slate-400 hover:text-slate-600 text-xl leading-none">×</button>
            </div>
            <form onSubmit={handleProposeProject} className="space-y-4">
              <div>
                <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Project Title *</label>
                <input
                  required
                  value={proposeForm.title}
                  onChange={(e) => setProposeForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="e.g. Somali AI Tutor"
                  className="w-full rounded-[12px] border border-[#dce6f5] px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-[#4189DD]"
                />
              </div>
              <div>
                <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Description *</label>
                <textarea
                  required
                  rows={3}
                  value={proposeForm.description}
                  onChange={(e) => setProposeForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="What are you building and why does it matter?"
                  className="w-full rounded-[12px] border border-[#dce6f5] px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-[#4189DD] resize-none"
                />
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Category</label>
                  <input
                    value={proposeForm.category}
                    onChange={(e) => setProposeForm((f) => ({ ...f, category: e.target.value }))}
                    placeholder="e.g. AI, Web, Mobile"
                    className="w-full rounded-[12px] border border-[#dce6f5] px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-[#4189DD]"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Impact Area</label>
                  <input
                    value={proposeForm.impactArea}
                    onChange={(e) => setProposeForm((f) => ({ ...f, impactArea: e.target.value }))}
                    placeholder="e.g. Somalia, Global"
                    className="w-full rounded-[12px] border border-[#dce6f5] px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-[#4189DD]"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Tags (comma-separated)</label>
                <input
                  value={proposeForm.tags}
                  onChange={(e) => setProposeForm((f) => ({ ...f, tags: e.target.value }))}
                  placeholder="AI, Education, Somali"
                  className="w-full rounded-[12px] border border-[#dce6f5] px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-[#4189DD]"
                />
              </div>
              <div>
                <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Roles Needed (comma-separated)</label>
                <input
                  value={proposeForm.lookingFor}
                  onChange={(e) => setProposeForm((f) => ({ ...f, lookingFor: e.target.value }))}
                  placeholder="Frontend, AI/ML, Designer"
                  className="w-full rounded-[12px] border border-[#dce6f5] px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-[#4189DD]"
                />
              </div>
              <div>
                <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Status</label>
                <select
                  value={proposeForm.status}
                  onChange={(e) => setProposeForm((f) => ({ ...f, status: e.target.value }))}
                  className="w-full rounded-[12px] border border-[#dce6f5] px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-[#4189DD] bg-white"
                >
                  <option value="Open Idea">Open Idea</option>
                  <option value="Building Now">Building Now</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">GitHub URL (optional)</label>
                <input
                  type="url"
                  value={proposeForm.githubUrl}
                  onChange={(e) => setProposeForm((f) => ({ ...f, githubUrl: e.target.value }))}
                  placeholder="https://github.com/your-repo"
                  className="w-full rounded-[12px] border border-[#dce6f5] px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-[#4189DD]"
                />
              </div>
              <button
                type="submit"
                disabled={proposeLoading}
                className="w-full rounded-full bg-[#0f3d82] py-3 text-sm font-semibold text-white transition hover:bg-[#1a5db5] disabled:opacity-60"
              >
                {proposeLoading ? 'Posting...' : 'Post Project'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Project Detail Panel */}
      {activeProject && (
        <div
          className="fixed inset-0 z-50 flex items-stretch justify-end"
          style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}
          onClick={(e) => e.target === e.currentTarget && setActiveProject(null)}
        >
          <div
            className="flex w-full flex-col bg-white shadow-2xl sm:max-w-lg overflow-y-auto"
            style={{ animation: 'slideInRight 0.22s ease' }}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-3 border-b border-[#f4f7fb] p-5">
              <div className="flex-1 min-w-0">
                {(() => {
                  const sm = statusMeta[activeProject.status] || statusMeta.idea
                  return (
                    <span className="rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em]" style={{ color: sm.color, backgroundColor: sm.bg }}>
                      {sm.label}
                    </span>
                  )
                })()}
                <h2 className="mt-2 font-display text-2xl leading-snug text-slate-950">{activeProject.title}</h2>
                <p className="mt-1 text-xs text-slate-400">
                  by {activeProject.creator_name || 'Community member'}
                  {activeProject.created_at ? ` · ${new Date(activeProject.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}` : ''}
                </p>
              </div>
              <button type="button" onClick={() => setActiveProject(null)} className="shrink-0 rounded-full p-2 text-slate-400 hover:bg-[#f4f7fb] hover:text-slate-600 text-xl leading-none">×</button>
            </div>

            <div className="flex-1 space-y-5 overflow-y-auto p-5">
              {/* Description */}
              <p className="text-sm leading-7 text-slate-600">{activeProject.description}</p>

              {/* GitHub */}
              {activeProject.github_url && (
                <a href={activeProject.github_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-[10px] border border-[#dce6f5] px-4 py-2 text-sm font-medium text-slate-700 hover:border-[#4189DD] hover:text-[#4189DD]">
                  <span>⎇</span> View on GitHub
                </a>
              )}

              {/* Tags */}
              {activeProject.tags?.length > 0 && (
                <div>
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">Tags</p>
                  <div className="flex flex-wrap gap-1.5">
                    {activeProject.tags.map((tag) => (
                      <span key={tag} className="rounded-full border border-[#dce6f5] bg-[#f4f7fb] px-2.5 py-0.5 text-[10px] font-medium text-slate-500">#{tag}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Roles */}
              {activeProject.roles?.length > 0 && (
                <div>
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">Roles Needed</p>
                  <div className="flex flex-wrap gap-1.5">
                    {activeProject.roles.map((role) => (
                      <span key={role} className="rounded-full bg-[#eaf2fd] px-3 py-1 text-xs font-medium text-[#1a5db5]">{role}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Members */}
              <div>
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Members ({activeProjectMembers.length || activeProject.members_count || 0})
                </p>
                {activeProjectMembers.length === 0 ? (
                  <p className="text-sm text-slate-400">No members yet — be the first!</p>
                ) : (
                  <div className="space-y-2">
                    {activeProjectMembers.map((m) => (
                      <div key={m.user_id || m.user_name} className="flex items-center gap-2.5">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#eaf2fd] text-[9px] font-bold text-[#1a5db5]">
                          {initials(m.user_name || 'Builder')}
                        </div>
                        <span className="text-sm text-slate-700">{m.user_name || 'Builder'}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Real-time Chat */}
              <div>
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">Team Chat</p>
                <div className="space-y-3 mb-3 max-h-64 overflow-y-auto pr-1">
                  {projectMessages.length === 0 ? (
                    <p className="text-sm text-slate-400">No messages yet — say hi!</p>
                  ) : (
                    projectMessages.map((msg) => {
                      const isOwn = msg.user_id === user?.id
                      return (
                        <div key={msg.id} className={`flex gap-2 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
                          <div style={{ width: 28, height: 28, borderRadius: '50%', background: isOwn ? '#4189DD' : '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: isOwn ? 'white' : '#475569', flexShrink: 0 }}>
                            {initials(msg.user_name || 'U')}
                          </div>
                          <div className={`max-w-[75%] flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
                            <div className={`rounded-2xl px-3 py-2 text-sm ${isOwn ? 'bg-[#4189DD] text-white rounded-tr-sm' : 'bg-[#f4f7fb] text-slate-700 rounded-tl-sm'}`}>
                              {msg.message}
                            </div>
                            <span className="text-[10px] text-slate-400 mt-0.5">
                              {msg.user_name} · {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                      )
                    })
                  )}
                  <div ref={chatEndRef} />
                </div>
                {user ? (
                  <div className="flex gap-2">
                    <input
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                      placeholder="Send a message..."
                      className="flex-1 rounded-[12px] border border-[#dce6f5] px-3 py-2 text-sm outline-none focus:border-[#4189DD]"
                    />
                    <button
                      type="button"
                      onClick={sendMessage}
                      className="rounded-[12px] bg-[#4189DD] px-4 py-2 text-sm font-medium text-white hover:bg-[#1a5db5]"
                    >
                      Send
                    </button>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">Sign in to chat</p>
                )}
              </div>
            </div>

           
              {/* Mark as Building Now */}
              {user?.id === activeProject.creator_id && activeProject.status !== 'building' && (
                <button
                  type="button"
                  onClick={handleMarkAsBuilding}
                  className="w-full rounded-full border border-[#4189DD] py-2 text-xs font-medium text-[#4189DD] hover:bg-[#eaf2fd]"
                >
                  Mark as Building Now
                </button>
              )}
              {/* Join */}
              {joinedProjects.includes(activeProject.id) ? (
                <div className="flex items-center justify-center gap-2 rounded-full bg-[#eaf2fd] py-3 text-sm font-semibold text-[#1a5db5]">
                  ✓ You have joined this project
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => user && handleJoinProject(activeProject)}
                  className="w-full rounded-full bg-[#0f3d82] py-3 text-sm font-semibold text-white transition hover:bg-[#1a5db5]"
                >
                  {user ? 'Join Project' : 'Sign in to Join'}
                </button>
              )}
            </div>
          </div>
      )}

      {/* Toast */}
      {toastMsg && (
        <div
          className="hh-toast"
          style={{
            position: 'fixed',
            bottom: 28,
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#0f3d82',
            color: 'white',
            padding: '12px 24px',
            borderRadius: 12,
            fontSize: 14,
            fontWeight: 600,
            fontFamily: 'DM Sans, sans-serif',
            zIndex: 9999,
            boxShadow: '0 8px 24px rgba(15,61,130,0.35)',
            whiteSpace: 'nowrap',
          }}
        >
          {toastMsg}
        </div>
      )}
    </main>
  )
}

export default HageHubWorkspace



