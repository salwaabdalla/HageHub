import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import styles from './Landing.module.css'

const journeySteps = [
  {
    name: 'Start',
    detail:
      'Join a space that understands Somali identity, ambition, and the reality of building across borders.',
  },
  {
    name: 'Learn',
    detail:
      'Break down hard topics in Somali and English so learning feels deep, not diluted.',
  },
  {
    name: 'Ask',
    detail:
      'Turn blockers into progress with clear questions and practical answers from the community.',
  },
  {
    name: 'Connect',
    detail:
      'Meet mentors, peers, and collaborators who can sharpen your next move.',
  },
  {
    name: 'Build',
    detail: 'Work on visible projects that move knowledge into proof.',
  },
  {
    name: 'Get Hired',
    detail:
      'Convert momentum into internships, freelance work, and long-term career growth.',
  },
]

const mentors = [
  {
    initials: 'AA',
    avatarStyle: undefined,
    name: 'Abdi Axmed',
    role: 'Senior SWE · Google',
    tags: ['Algorithms', 'System Design'],
    loc: 'San Francisco, CA',
  },
  {
    initials: 'HM',
    avatarStyle: { background: '#1a5db5' },
    name: 'Hodan Muuse',
    role: 'Product Manager · Meta',
    tags: ['Product', 'Career Growth'],
    loc: 'London, UK',
  },
  {
    initials: 'YI',
    avatarStyle: { background: '#0f3d82' },
    name: 'Yusuf Ibraahim',
    role: 'Full-Stack Engineer · Shopify',
    tags: ['React', 'Node.js'],
    loc: 'Toronto, Canada',
  },
  {
    initials: 'FN',
    avatarStyle: { background: '#6aaae8' },
    name: 'Faadumo Nuur',
    role: 'ML Engineer · Anthropic',
    tags: ['AI/ML', 'Python'],
    loc: 'Seattle, WA',
  },
]

const jobs = [
  {
    logo: 'AM',
    logoStyle: undefined,
    title: 'Software Engineer — New Grad',
    meta: ['Amazon', 'Seattle, WA', '$140k–$165k'],
    tags: [
      { text: 'Full-time', kind: 'fulltime' },
      { text: 'Somali-friendly', kind: 'somali' },
    ],
  },
  {
    logo: 'ST',
    logoStyle: { background: '#e8f5ee', color: '#1a6b4a' },
    title: 'Frontend Engineering Intern',
    meta: ['Stripe', 'Remote', '$8k/month'],
    tags: [
      { text: 'Internship', kind: 'intern' },
      { text: 'Remote', kind: 'remote' },
    ],
  },
  {
    logo: 'HB',
    logoStyle: { background: '#f5f0ff', color: '#6b3fa0' },
    title: 'Data Scientist — East Africa Markets',
    meta: ['Hormuud Telecom', 'Mogadishu', 'Competitive'],
    tags: [
      { text: 'Full-time', kind: 'fulltime' },
      { text: 'Somalia-based', kind: 'somali' },
    ],
  },
  {
    logo: 'GG',
    logoStyle: { background: '#fff3e0', color: '#b35c00' },
    title: 'Backend Engineer',
    meta: ['Golis Tech', 'Hargeisa / Remote', 'Competitive'],
    tags: [
      { text: 'Full-time', kind: 'fulltime' },
      { text: 'Remote OK', kind: 'remote' },
      { text: 'Somali-friendly', kind: 'somali' },
    ],
  },
]

const stories = [
  {
    imgBg: undefined,
    letter: 'G',
    cat: 'Career',
    title: 'From Mogadishu to Google: my 5-year journey',
    excerpt:
      'I learned to code on a borrowed laptop in a café with spotty internet. Here is what nobody tells you about making it in tech from Somalia.',
    av: 'AA',
    avStyle: undefined,
    author: 'Abdi Axmed',
    date: 'Mar 2024',
  },
  {
    imgBg: { background: '#0f3d82' },
    letter: 'I',
    cat: 'Identity',
    title: 'On being Somali in a room full of engineers',
    excerpt:
      'The subtle moments that make you question whether you belong — and why building this community changes everything.',
    av: 'HM',
    avStyle: { background: '#d0e5f8', color: '#0f3d82' },
    author: 'Hodan Muuse',
    date: 'Feb 2024',
  },
  {
    imgBg: { background: '#1a5db5' },
    letter: 'S',
    cat: 'Somalia',
    title: "Building Somalia's first fintech startup from Hargeisa",
    excerpt:
      'No VC funding. No Silicon Valley connections. Just a problem worth solving and a community that needed us to succeed.',
    av: 'YI',
    avStyle: { background: '#d0e5f8', color: '#1a5db5' },
    author: 'Yusuf Ibraahim',
    date: 'Jan 2024',
  },
]

const mapDots = [
  { left: '18%', top: '55%', delay: '0s', label: 'Minneapolis' },
  { left: '12%', top: '48%', delay: '0.4s', label: null },
  { left: '44%', top: '32%', delay: '0.8s', label: 'London' },
  { left: '48%', top: '28%', delay: '0.2s', label: null },
  { left: '46%', top: '36%', delay: '1s', label: null },
  { left: '56%', top: '52%', delay: '0.6s', label: 'Nairobi' },
  { left: '60%', top: '44%', delay: '0.3s', label: 'Mogadishu' },
  { left: '58%', top: '40%', delay: '0.9s', label: null },
  { left: '57%', top: '36%', delay: '0.5s', label: 'Hargeisa' },
  { left: '22%', top: '52%', delay: '0.7s', label: 'Toronto' },
  { left: '8%', top: '44%', delay: '1.1s', label: null },
  { left: '72%', top: '38%', delay: '0.15s', label: 'Dubai' },
  { left: '80%', top: '55%', delay: '0.85s', label: null },
]

function Reveal({ children, className = '', delayClass = '' }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ob = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setVisible(true)
        })
      },
      { threshold: 0.1 },
    )
    ob.observe(el)
    return () => ob.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`${styles.reveal} ${visible ? styles.revealVisible : ''} ${delayClass} ${className}`.trim()}
    >
      {children}
    </div>
  )
}

function Landing() {
  const [menuOpen, setMenuOpen] = useState(false)

  const closeMenu = () => setMenuOpen(false)

  const jobTagClass = (kind) => {
    if (kind === 'fulltime') return styles.tagFulltime
    if (kind === 'intern') return styles.tagIntern
    if (kind === 'remote') return styles.tagRemote
    if (kind === 'somali') return styles.tagSomali
    return ''
  }

  return (
    <div className={styles.page}>
      <nav className={styles.nav}>
        <a className={styles.navLogo} href="#home" onClick={closeMenu}>
          Hage Hub<span>.</span>
        </a>
        <ul className={styles.navLinks}>
          <li>
            <a href="#journey">Platform</a>
          </li>
          <li>
            <a href="#connect">Mentorship</a>
          </li>
          <li>
            <a href="#work">Jobs</a>
          </li>
          <li>
            <a href="#stories">Stories</a>
          </li>
          <li>
            <a href="#map">Community</a>
          </li>
        </ul>
        <Link className={styles.navCta} to="/signup">
          Join Hage Hub
        </Link>
        <button
          type="button"
          className={styles.navHamburger}
          aria-label="Open menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((o) => !o)}
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      <div
        className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuOpen : ''}`.trim()}
      >
        <a href="#journey" onClick={closeMenu}>
          Platform
        </a>
        <a href="#connect" onClick={closeMenu}>
          Mentorship
        </a>
        <a href="#work" onClick={closeMenu}>
          Jobs
        </a>
        <a href="#stories" onClick={closeMenu}>
          Stories
        </a>
        <a href="#map" onClick={closeMenu}>
          Community
        </a>
        <Link className={styles.navCta} to="/signup" onClick={closeMenu}>
          Join Hage Hub
        </Link>
      </div>

      <section className={styles.hero} id="home">
        <div className={styles.heroBg}>
          <div className={`${styles.heroCircle} ${styles.heroCircle1}`} />
          <div className={`${styles.heroCircle} ${styles.heroCircle2}`} />
          <div className={styles.heroDots} />
        </div>
        <div className={styles.heroInner}>
          <div className={styles.heroBadge}>
            <div className={styles.heroBadgeDot} />
            Now Building — Join the First Wave
          </div>
          <h1 className={styles.heroTitle}>
            The Home
            <br />
            of <span className={styles.heroTitleBlue}>Somali</span>
            <br />
            <span className={styles.heroTitleOutline}>Tech.</span>
          </h1>
          <p className={styles.heroSub}>
            25 million Somali speakers deserve infrastructure built for them. Hage Hub is the home
            for learning, asking, and connecting in Somali and English — from Mogadishu to
            Minneapolis — so ambition and identity move in the same direction.
          </p>
          <div className={styles.heroActions}>
            <a href="#journey" className={styles.btnPrimary}>
              Explore the journey →
            </a>
            <a href="#connect" className={styles.btnSecondary}>
              Find a Mentor
            </a>
          </div>
          <div className={styles.heroStats}>
            <div>
              <div className={styles.heroStatVal}>25M+</div>
              <div className={styles.heroStatLabel}>Somali speakers</div>
            </div>
            <div>
              <div className={styles.heroStatVal}>6</div>
              <div className={styles.heroStatLabel}>Journey steps</div>
            </div>
            <div>
              <div className={styles.heroStatVal}>4+</div>
              <div className={styles.heroStatLabel}>Diaspora cities</div>
            </div>
            <div>
              <div className={styles.heroStatVal}>0</div>
              <div className={styles.heroStatLabel}>Reason to go it alone</div>
            </div>
          </div>
        </div>
      </section>

      <Reveal>
        <section className={`${styles.section} ${styles.journeySection}`} id="journey">
          <div className={styles.journeyGrid}>
            <div>
              <div className={styles.sectionLabel}>The Flywheel</div>
              <h2 className={styles.sectionTitle}>
                One platform.
                <br />
                The full journey.
              </h2>
              <p className={styles.sectionSub} style={{ marginBottom: 0 }}>
                Every person who succeeds feeds the next person. Hage Hub gets stronger with every
                hire, every mentor, and every contribution — baro, waydii, isku xidh, oo dhis.
              </p>
            </div>
            <div className={styles.journeyFlow}>
              {journeySteps.map((step, i) => (
                <div key={step.name} className={styles.journeyStep}>
                  <div className={styles.jDot}>{i + 1}</div>
                  <div>
                    <div className={styles.jTitle}>{step.name}</div>
                    <div className={styles.jDesc}>{step.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className={styles.section} id="knowledge">
          <div className={styles.sectionHead}>
            <div className={styles.sectionLabel}>Knowledge</div>
            <h2 className={styles.sectionTitle}>
              CS explained
              <br />
              in Somali. First time, ever.
            </h2>
            <p className={styles.sectionSub}>
              Ask questions and get answers in Somali or English. An AI that understands both —
              and explains recursion, APIs, and data structures in af Soomaali.
            </p>
          </div>
          <div className={styles.demoGrid}>
            <div className={styles.demoPhone}>
              <div className={styles.demoPhoneHeader}>
                <div>
                  <div className={styles.demoPhoneBack}>← Knowledge</div>
                  <div className={styles.demoPhoneTitle}>Maxaa loo isticmaalaa recursion?</div>
                </div>
              </div>
              <div className={styles.qCard}>
                <span className={`${styles.qLang} ${styles.qLangSo}`}>Soomaali</span>
                <div className={styles.qText}>
                  Maxay tahay farsamada recursion-ka oo la isticmaalo marka la baranayo
                  programming-ka? Tusaale ii sii.
                </div>
                <div className={styles.qMeta}>
                  <div className={styles.qAvatar}>FA</div>
                  <div className={styles.qName}>Faadumo A. · Mogadishu</div>
                  <div className={styles.qVotes}>↑ 14</div>
                </div>
              </div>
              <div className={styles.aiCard}>
                <div className={styles.aiLabel}>Hage Hub AI · Af Soomaali</div>
                <div className={styles.aiText}>
                  Recursion waa habka ay function-ku isu wacdo. Tusaale ahaan, haddaad xisaabinayso
                  factorial-ka 5, waxaad ku qori kartaa:
                  <br />
                  <br />
                  factorial(5) = 5 × factorial(4) = 5 × 4 × factorial(3)...
                  <br />
                  <br />
                  Waxay sii socdaa ilaa ay gaarto base case-ka (0 ama 1).
                </div>
              </div>
              <div className={styles.qCard} style={{ marginTop: 12 }}>
                <span className={`${styles.qLang} ${styles.qLangEn}`}>English</span>
                <div className={styles.qText}>
                  How do I pick between React and Next.js for my first project?
                </div>
                <div className={styles.qMeta}>
                  <div className={styles.qAvatar} style={{ background: '#6aaae8' }}>
                    MH
                  </div>
                  <div className={styles.qName}>Mohamed H. · Minneapolis</div>
                  <div className={styles.qVotes}>↑ 9</div>
                </div>
              </div>
            </div>
            <div className={styles.demoInfo}>
              <div className={styles.demoFeature}>
                <div className={styles.dfIcon}>🌐</div>
                <div>
                  <div className={styles.dfTitle}>Fully bilingual — Somali + English</div>
                  <div className={styles.dfDesc}>
                    Every question, answer, and AI response works in both languages. Filter by
                    language or browse both at once.
                  </div>
                </div>
              </div>
              <div className={styles.demoFeature}>
                <div className={styles.dfIcon}>🤖</div>
                <div>
                  <div className={styles.dfTitle}>AI that speaks Somali</div>
                  <div className={styles.dfDesc}>
                    Click &quot;Explain in Somali&quot; on any concept — the AI breaks it down in af
                    Soomaali, using terms a beginner actually understands.
                  </div>
                </div>
              </div>
              <div className={styles.demoFeature}>
                <div className={styles.dfIcon}>📖</div>
                <div>
                  <div className={styles.dfTitle}>Building a language corpus</div>
                  <div className={styles.dfDesc}>
                    Every contribution creates the first ever corpus of Somali technical language —
                    historically significant beyond just a Q&A platform.
                  </div>
                </div>
              </div>
              <div className={styles.demoFeature}>
                <div className={styles.dfIcon}>⬆️</div>
                <div>
                  <div className={styles.dfTitle}>Community-verified answers</div>
                  <div className={styles.dfDesc}>
                    Upvote the best answers. Accepted answers rise to the top. The community
                    quality-controls itself.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className={`${styles.section} ${styles.mentorsSection}`} id="connect">
          <div className={styles.sectionHead}>
            <div className={styles.sectionLabel}>Connect</div>
            <h2 className={styles.sectionTitle}>
              Your mentor is
              <br />
              already out there.
            </h2>
            <p className={styles.sectionSub}>
              Structured paths matching Somali students with Somali professionals worldwide.
              Accountability built in. Pay-it-forward model baked in.
            </p>
          </div>
          <div className={styles.mentorsGrid}>
            {mentors.map((m, i) => (
              <Reveal
                key={m.name}
                delayClass={
                  i === 1
                    ? styles.revealDelay1
                    : i === 2
                      ? styles.revealDelay2
                      : i === 3
                        ? styles.revealDelay3
                        : ''
                }
              >
                <div className={styles.mentorCard}>
                  <div className={styles.mentorAvatar} style={m.avatarStyle}>
                    {m.initials}
                  </div>
                  <div className={styles.mentorName}>{m.name}</div>
                  <div className={styles.mentorRole}>{m.role}</div>
                  <div className={styles.mentorTags}>
                    {m.tags.map((t) => (
                      <span key={t} className={styles.mentorTag}>
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className={styles.mentorLoc}>{m.loc}</div>
                  <button type="button" className={styles.mentorBtn}>
                    Request Mentorship
                  </button>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className={styles.section} id="work">
          <div className={styles.sectionHead}>
            <div className={styles.sectionLabel}>Work</div>
            <h2 className={styles.sectionTitle}>
              Opportunities built
              <br />
              for Somali talent.
            </h2>
            <p className={styles.sectionSub}>
              Jobs, internships, and freelance projects — curated for Somali developers. Companies
              who want diverse Somali talent come here.
            </p>
          </div>
          <div className={styles.jobList}>
            {jobs.map((job, i) => (
              <Reveal
                key={job.title}
                delayClass={
                  i === 1 ? styles.revealDelay1 : i === 2 ? styles.revealDelay2 : ''
                }
              >
                <div className={styles.jobCard}>
                  <div className={styles.jobCoLogo} style={job.logoStyle}>
                    {job.logo}
                  </div>
                  <div className={styles.jobInfo}>
                    <div className={styles.jobTitle}>{job.title}</div>
                    <div className={styles.jobMeta}>
                      {job.meta.map((x, j) => (
                        <span key={`${job.title}-${x}-${j}`}>
                          {j > 0 ? (
                            <>
                              <span> · </span>
                            </>
                          ) : null}
                          {x}
                        </span>
                      ))}
                    </div>
                    <div className={styles.jobTags}>
                      {job.tags.map((t) => (
                        <span
                          key={t.text}
                          className={`${styles.jobTag} ${jobTagClass(t.kind)}`}
                        >
                          {t.text}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className={styles.jobArrow}>→</div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className={styles.mapSection} id="map">
          <div className={styles.mapInner}>
            <div className={styles.mapText}>
              <div className={styles.sectionLabel}>The Community</div>
              <h2 className={styles.sectionTitle}>
                Somali tech talent,
                <br />
                mapped worldwide.
              </h2>
              <p className={styles.sectionSub}>
                From Mogadishu to Minneapolis, London to Nairobi — the global Somali tech community,
                finally visible in one place.
              </p>
              <a href="#map" className={styles.btnWhite}>
                View the full map →
              </a>
              <div className={styles.mapStatRow}>
                <div>
                  <div className={styles.mapStatVal}>15+</div>
                  <div className={styles.mapStatLbl}>Cities worldwide</div>
                </div>
                <div>
                  <div className={styles.mapStatVal}>500+</div>
                  <div className={styles.mapStatLbl}>Engineers mapped</div>
                </div>
              </div>
            </div>
            <div className={styles.mapVisual}>
              <div className={styles.mapDots}>
                {mapDots.map((d, idx) => (
                  <div
                    key={`${d.left}-${d.top}-${idx}`}
                    className={styles.mapDot}
                    style={{ left: d.left, top: d.top, animationDelay: d.delay }}
                  >
                    {d.label ? (
                      <div className={styles.cityLabel}>{d.label}</div>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className={styles.section} id="stories">
          <div className={styles.sectionHead}>
            <div className={styles.sectionLabel}>Stories</div>
            <h2 className={styles.sectionTitle}>
              You don&apos;t have to choose
              <br />
              between being Somali and
              <br />
              being a technologist.
            </h2>
          </div>
          <div className={styles.storiesGrid}>
            {stories.map((s, i) => (
              <Reveal
                key={s.title}
                delayClass={
                  i === 1 ? styles.revealDelay1 : i === 2 ? styles.revealDelay2 : ''
                }
              >
                <div className={styles.storyCard}>
                  <div className={styles.storyImg} style={s.imgBg}>
                    <div className={styles.storyImgBg}>{s.letter}</div>
                    <span className={styles.storyCat}>{s.cat}</span>
                  </div>
                  <div className={styles.storyBody}>
                    <div className={styles.storyTitle}>{s.title}</div>
                    <div className={styles.storyExcerpt}>{s.excerpt}</div>
                    <div className={styles.storyAuthor}>
                      <div className={styles.storyAv} style={s.avStyle}>
                        {s.av}
                      </div>
                      <div className={styles.storyName}>{s.author}</div>
                      <div className={styles.storyDate}>{s.date}</div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className={styles.ctaSection}>
          <div className={styles.sectionLabel}>Join the Movement</div>
          <h2 className={styles.ctaTitle}>
            The home base
            <br />
            starts here.
          </h2>
          <p className={styles.ctaSub}>
            Be part of the first wave. Whether you&apos;re a student just starting out or a senior
            engineer ready to give back — Hage Hub is yours.
          </p>
          <div className={styles.ctaActions}>
            <Link className={styles.btnWhite} to="/signup">
              Join as a Student →
            </Link>
            <Link className={styles.btnOutlineWhite} to="/signup">
              Join as a Mentor
            </Link>
          </div>
        </section>
      </Reveal>

      <footer className={styles.footer}>
        <div className={styles.footerGrid}>
          <div className={styles.footerBrand}>
            <div className={styles.footerBrandLogo}>Hage Hub.</div>
            <p>
              Bilingual infrastructure for Somali developers: learn, ask, connect, build, and grow
              into opportunity — one community, one complete journey.
            </p>
          </div>
          <div className={styles.footerCol}>
            <h4>Platform</h4>
            <a href="#knowledge">Knowledge</a>
            <a href="#connect">Connect</a>
            <a href="#work">Work</a>
            <a href="#stories">Stories</a>
          </div>
          <div className={styles.footerCol}>
            <h4>Community</h4>
            <a href="#map">Global Map</a>
            <a href="#stories">Events</a>
            <a href="#work">Hackathons</a>
            <a href="#journey">Hage Hub Local</a>
          </div>
          <div className={styles.footerCol}>
            <h4>Company</h4>
            <a href="#home">About</a>
            <a href="#stories">Blog</a>
            <a href="#home">Contact</a>
            <a href="#work">Careers</a>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p>
            © {new Date().getFullYear()} Hage Hub. Built for the Somali tech community, by the Somali
            tech community.
          </p>
          <div className={styles.footerStar}>★</div>
        </div>
      </footer>
    </div>
  )
}

export default Landing
