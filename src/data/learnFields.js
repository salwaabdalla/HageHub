const FIELDS = [
  {
    id: 'webdev', name: 'Web Development', emoji: '🌐', color: '#4189DD', bg: '#eaf2fd',
    desc: 'HTML, CSS, JavaScript, React, Node.js — build anything on the web.',
    chips: ['Frontend', 'Backend', 'Full-Stack'], lessons: 18,
    mentors: [
      { init: 'YI', name: 'Yusuf Ibraahim', role: 'Full-Stack Eng.', company: 'Shopify', bio: '6 years building web apps. From Hargeisa to Shopify. I know the full journey.', chips: ['React', 'Node.js', 'TypeScript'], ans: 127, students: 23, rating: 4.9, online: true, color: '#4189DD' },
      { init: 'AA', name: 'Abdi Axmed', role: 'Senior SWE', company: 'Google', bio: 'Building web infrastructure at Google. Focused on performance and scalability.', chips: ['Next.js', 'Go', 'System Design'], ans: 89, students: 18, rating: 4.8, online: false, color: '#1a5db5' },
      { init: 'HM', name: 'Hodan Muuse', role: 'Frontend Lead', company: 'Vercel', bio: 'Frontend specialist, open source contributor, CSS wizard.', chips: ['CSS', 'React', 'Design Systems'], ans: 64, students: 12, rating: 4.9, online: true, color: '#6aaae8' },
    ],
    phases: [
      { label: 'Phase 1 — Foundations', nodes: [{ t: 'HTML & CSS Basics', s: 'Structure, styling, layouts', tags: ['HTML', 'CSS'], dur: '2w' }, { t: 'JavaScript Fundamentals', s: 'Variables, functions, DOM, events', tags: ['JS'], dur: '3w' }, { t: 'Responsive Design', s: 'Flexbox, Grid, mobile-first', tags: ['CSS'], dur: '1w' }] },
      { label: 'Phase 2 — Frameworks', nodes: [{ t: 'React Fundamentals', s: 'Components, state, hooks', tags: ['React'], dur: '3w' }, { t: 'Node.js & APIs', s: 'Express, REST, middleware', tags: ['Node'], dur: '2w' }, { t: 'Databases', s: 'SQL, PostgreSQL, Supabase', tags: ['SQL'], dur: '2w' }] },
      { label: 'Phase 3 — Professional', nodes: [{ t: 'TypeScript', s: 'Types, interfaces, generics', tags: ['TS'], dur: '2w' }, { t: 'Testing & CI/CD', s: 'Jest, GitHub Actions', tags: ['Test'], dur: '1w' }, { t: 'Capstone Project', s: 'Build & deploy full-stack app', tags: ['Project'], dur: '3w' }] },
    ],
    resources: [{ icon: '📺', name: 'The Odin Project', type: 'Course', free: true }, { icon: '📺', name: 'freeCodeCamp', type: 'Course', free: true }, { icon: '📖', name: 'MDN Web Docs', type: 'Docs', free: true }, { icon: '🎥', name: 'Fireship', type: 'YouTube', free: true }],
    leaderboard: [
      { init: 'FA', name: 'Faadumo A.', loc: 'Mogadishu', score: 1240, change: '+12', color: '#4189DD' },
      { init: 'MH', name: 'Mohamed H.', loc: 'Minneapolis', score: 1180, change: '+8', color: '#1a5db5' },
      { init: 'HA', name: 'Halimo A.', loc: 'London', score: 960, change: '+24', color: '#0f3d82' },
      { init: 'YN', name: 'Yusuf N.', loc: 'Hargeisa', score: 840, change: '+5', color: '#6aaae8' },
      { init: 'OM', name: 'Omar M.', loc: 'Nairobi', score: 720, change: '+18', color: '#4189DD' },
      { init: 'SA', name: 'Sagal A.', loc: 'Toronto', score: 650, change: '+3', color: '#1a5db5' },
    ],
    events: [
      { day: '12', month: 'Apr', title: 'React Hooks Deep Dive', desc: 'Live session with Yusuf covering useEffect, useCallback, and custom hooks. Bring your questions!', time: '7pm EAT', host: 'Yusuf Ibraahim', attendees: 34, type: 'online' },
      { day: '19', month: 'Apr', title: 'Web Dev Hackathon — Somalia Edition', desc: '48-hour hackathon. Build something that solves a real problem for Somali people. Prizes for top 3.', time: 'Starts Fri 6pm', host: 'Hage Hub', attendees: 67, type: 'challenge' },
      { day: '26', month: 'Apr', title: 'CSS Art & Animation Night', desc: 'Learn to make beautiful CSS animations. Fun, creative, 90 minutes.', time: '8pm EAT', host: 'Hodan Muuse', attendees: 21, type: 'online' },
    ],
    chatMessages: [
      { init: 'FA', name: 'Faadumo A.', color: '#4189DD', role: 'student', msg: 'Just deployed my first React app! A Somali recipe tracker 🎉', time: '2:14 PM', reactions: [{ emoji: '🎉', count: 8, mine: false }, { emoji: '🔥', count: 5, mine: true }] },
      { init: 'YI', name: 'Yusuf Ibraahim', color: '#0f3d82', role: 'mentor', msg: "That's amazing Faadumo! Share the link so we can all see it 🙌", time: '2:17 PM', reactions: [] },
      { init: 'MH', name: 'Mohamed H.', color: '#1a5db5', role: 'student', msg: 'Question — should I learn Vue or stick with React?', time: '2:31 PM', reactions: [] },
      { init: 'AA', name: 'Abdi Axmed', color: '#0f3d82', role: 'mentor', msg: "Stick with React for the job market. Vue is great but React has 10x more job listings globally — and that gap is even bigger if you're applying internationally.", time: '2:35 PM', reactions: [{ emoji: '👆', count: 12, mine: false }] },
      { init: 'HA', name: 'Halimo A.', color: '#6aaae8', role: 'student', msg: "Also just finished the TypeScript module. The types feel annoying at first but now I can't imagine coding without them", time: '3:02 PM', reactions: [{ emoji: '💯', count: 6, mine: false }] },
    ],
    onlineMembers: [],
  },
  {
    id: 'cyber', name: 'Cybersecurity', emoji: '🔒', color: '#e11d48', bg: '#ffe4e6',
    desc: 'Ethical hacking, threat analysis, network security, and defense.',
    chips: ['Blue Team', 'Red Team', 'OSCP'], lessons: 16,
    mentors: [
      { init: 'AM', name: 'Amina Hassan', role: 'Security Engineer', company: 'CrowdStrike', bio: 'Red team specialist. 7 years in threat intelligence across Africa and the Gulf.', chips: ['Penetration Testing', 'OSCP', 'Threat Intel'], ans: 89, students: 15, rating: 4.8, online: true, color: '#e11d48' },
      { init: 'SO', name: 'Sagal Osman', role: 'SOC Analyst', company: 'Microsoft', bio: 'Blue team expert. Built SOC infrastructure for three African banks.', chips: ['SIEM', 'Incident Response', 'CompTIA'], ans: 56, students: 11, rating: 4.7, online: false, color: '#c01038' },
    ],
    phases: [
      { label: 'Phase 1 — Foundations', nodes: [{ t: 'Networking Basics', s: 'TCP/IP, DNS, HTTP, firewalls', tags: ['Net'], dur: '2w' }, { t: 'Linux & CLI', s: 'Essential for every security role', tags: ['Linux'], dur: '2w' }, { t: 'Security Concepts', s: 'CIA triad, encryption, threats', tags: ['Sec'], dur: '1w' }] },
      { label: 'Phase 2 — Offensive & Defensive', nodes: [{ t: 'Ethical Hacking Intro', s: 'Recon, scanning, exploitation', tags: ['Kali'], dur: '3w' }, { t: 'Web App Security', s: 'OWASP Top 10, SQLi, XSS', tags: ['OWASP'], dur: '2w' }, { t: 'Digital Forensics', s: 'Incident response, evidence', tags: ['Forensics'], dur: '2w' }] },
      { label: 'Phase 3 — Certifications', nodes: [{ t: 'CompTIA Security+', s: 'Industry baseline certification', tags: ['Cert'], dur: '4w' }, { t: 'CEH / OSCP', s: 'Certified ethical hacker path', tags: ['CEH'], dur: '8w' }] },
    ],
    resources: [{ icon: '🧪', name: 'TryHackMe', type: 'Practice', free: true }, { icon: '🧪', name: 'HackTheBox', type: 'Labs', free: true }, { icon: '📖', name: 'OWASP Docs', type: 'Docs', free: true }, { icon: '🎥', name: 'NetworkChuck', type: 'YouTube', free: true }],
    leaderboard: [
      { init: 'YN', name: 'Yusuf N.', loc: 'Hargeisa', score: 1380, change: '+22', color: '#e11d48' },
      { init: 'AW', name: 'Abdullahi W.', loc: 'Kampala', score: 1290, change: '+15', color: '#c01038' },
      { init: 'SO', name: 'Sagal O.', loc: 'Minneapolis', score: 1100, change: '+7', color: '#e11d48' },
      { init: 'MH', name: 'Mahad H.', loc: 'Nairobi', score: 890, change: '+31', color: '#c01038' },
    ],
    events: [
      { day: '10', month: 'Apr', title: 'CTF Challenge — Beginner Friendly', desc: 'Capture The Flag competition. 20 challenges across web, crypto, forensics, and reversing.', time: 'All day', host: 'Amina Hassan', attendees: 52, type: 'challenge' },
      { day: '24', month: 'Apr', title: 'OSCP Study Group', desc: 'Weekly group session. This week: buffer overflow exploits.', time: '6pm EAT', host: 'Sagal Osman', attendees: 18, type: 'online' },
    ],
    chatMessages: [
      { init: 'YN', name: 'Yusuf N.', color: '#e11d48', role: 'student', msg: 'Just rooted my first HackTheBox machine!! Easy rated but still 😭', time: '11:22 AM', reactions: [{ emoji: '🎉', count: 14, mine: false }] },
      { init: 'AM', name: 'Amina Hassan', color: '#c01038', role: 'mentor', msg: "That first root hits different! Now try the Easy machines consistently before moving to Medium. The methodology matters more than the difficulty.", time: '11:45 AM', reactions: [{ emoji: '👆', count: 9, mine: false }] },
      { init: 'AW', name: 'Abdullahi W.', color: '#c01038', role: 'student', msg: 'Anyone else studying for Security+? Want to form a study group', time: '1:15 PM', reactions: [] },
    ],
    onlineMembers: [],
  },
  {
    id: 'datascience', name: 'Data Science', emoji: '📊', color: '#7c3aed', bg: '#ede9fe',
    desc: 'Python, statistics, machine learning, and data visualization.',
    chips: ['Analytics', 'ML', 'Python'], lessons: 20,
    mentors: [
      { init: 'FN', name: 'Faadumo Nuur', role: 'ML Engineer', company: 'Anthropic', bio: 'Working on LLMs. Building Somali AI tools. Committed to Somali representation in AI.', chips: ['PyTorch', 'NLP', 'LLMs', 'Python'], ans: 141, students: 27, rating: 5.0, online: true, color: '#7c3aed' },
      { init: 'HM', name: 'Hodan Mire', role: 'Data Scientist', company: 'McKinsey', bio: 'Applied data science across East Africa. Turning Somali data into impact.', chips: ['Python', 'R', 'SQL', 'Tableau'], ans: 78, students: 14, rating: 4.8, online: true, color: '#5b21b6' },
    ],
    phases: [
      { label: 'Phase 1 — Foundations', nodes: [{ t: 'Python for Data', s: 'Pandas, NumPy, data manipulation', tags: ['Python'], dur: '3w' }, { t: 'Statistics & Probability', s: 'Distributions, hypothesis testing', tags: ['Stats'], dur: '2w' }, { t: 'Data Visualization', s: 'Matplotlib, Seaborn, Plotly', tags: ['Viz'], dur: '1w' }] },
      { label: 'Phase 2 — Machine Learning', nodes: [{ t: 'Supervised Learning', s: 'Regression, classification, trees', tags: ['ML'], dur: '3w' }, { t: 'Unsupervised Learning', s: 'Clustering, PCA, anomaly detection', tags: ['ML'], dur: '2w' }, { t: 'Deep Learning Basics', s: 'Neural networks, TensorFlow intro', tags: ['DL'], dur: '3w' }] },
      { label: 'Phase 3 — Applied', nodes: [{ t: 'SQL for Data Science', s: 'Advanced queries, window functions', tags: ['SQL'], dur: '2w' }, { t: 'Model Deployment', s: 'FastAPI, Streamlit, Hugging Face', tags: ['Deploy'], dur: '2w' }, { t: 'Somali Dataset Project', s: 'End-to-end with real Somali data', tags: ['Project'], dur: '4w' }] },
    ],
    resources: [{ icon: '📺', name: 'Kaggle Learn', type: 'Course', free: true }, { icon: '📖', name: 'fast.ai', type: 'Course', free: true }, { icon: '🎥', name: 'StatQuest', type: 'YouTube', free: true }, { icon: '📖', name: 'Python DS Handbook', type: 'Book', free: true }],
    leaderboard: [
      { init: 'HM', name: 'Hodan M.', loc: 'Doha', score: 1560, change: '+34', color: '#7c3aed' },
      { init: 'AA', name: 'Abdi A.', loc: 'SF', score: 1420, change: '+12', color: '#5b21b6' },
      { init: 'FN', name: 'Faadumo N.', loc: 'Seattle', score: 1380, change: '+8', color: '#7c3aed' },
      { init: 'YI', name: 'Yusuf I.', loc: 'Toronto', score: 1100, change: '+19', color: '#5b21b6' },
      { init: 'SO', name: 'Sagal O.', loc: 'Minneapolis', score: 980, change: '+27', color: '#7c3aed' },
    ],
    events: [
      { day: '15', month: 'Apr', title: 'Kaggle Competition Kickoff', desc: 'Team up for the monthly Kaggle competition. Faadumo will guide us through the EDA phase live.', time: '5pm EAT', host: 'Faadumo Nuur', attendees: 41, type: 'online' },
      { day: '22', month: 'Apr', title: 'Somali NLP Dataset Workshop', desc: 'Help build the first large-scale Somali language dataset for ML. This is historically significant work.', time: '3pm EAT', host: 'Hodan Mire', attendees: 29, type: 'challenge' },
    ],
    chatMessages: [
      { init: 'HM', name: 'Hodan M.', color: '#7c3aed', role: 'student', msg: 'I just analyzed Mogadishu population density using satellite data + Python. The patterns are fascinating. Sharing the notebook next week 🌍', time: '9:14 AM', reactions: [{ emoji: '🌍', count: 18, mine: false }, { emoji: '🔥', count: 11, mine: false }] },
      { init: 'FN', name: 'Faadumo N.', color: '#5b21b6', role: 'mentor', msg: "Hodan that's incredible! Real Somali data is so rare in ML. Please share the methodology too — this could inspire others to do the same.", time: '9:31 AM', reactions: [{ emoji: '💡', count: 8, mine: false }] },
      { init: 'AA', name: 'Abdi A.', color: '#7c3aed', role: 'student', msg: 'Tip: before any ML course, read "The Art of Statistics" by Spiegelhalter. Changed everything for me.', time: '10:05 AM', reactions: [{ emoji: '📖', count: 15, mine: true }] },
    ],
    onlineMembers: [],
  },
  {
    id: 'ai', name: 'AI & Machine Learning', emoji: '🤖', color: '#d97706', bg: '#fef3c7',
    desc: 'LLMs, neural networks, NLP, and building AI-powered products.',
    chips: ['LLMs', 'NLP', 'PyTorch'], lessons: 22,
    mentors: [
      { init: 'FN', name: 'Faadumo Nuur', role: 'ML Engineer', company: 'Anthropic', bio: 'I train large language models. Somali AI is my mission — the language needs more representation.', chips: ['PyTorch', 'LLMs', 'NLP', 'Somali AI'], ans: 141, students: 27, rating: 5.0, online: true, color: '#d97706' },
      { init: 'AH', name: 'Ahmed Hassan', role: 'AI Research Eng.', company: 'DeepMind', bio: 'Research engineer. Published in NeurIPS. Helping Somali students get into AI research.', chips: ['Research', 'Transformers', 'Math'], ans: 67, students: 9, rating: 4.9, online: false, color: '#b45309' },
    ],
    phases: [
      { label: 'Phase 1 — ML Foundations', nodes: [{ t: 'Math for ML', s: 'Linear algebra, calculus, probability', tags: ['Math'], dur: '3w' }, { t: 'Python & PyTorch', s: 'Tensors, autograd, training loops', tags: ['PyTorch'], dur: '3w' }, { t: 'Classical ML', s: 'Regression, SVM, ensemble methods', tags: ['ML'], dur: '2w' }] },
      { label: 'Phase 2 — Deep Learning & LLMs', nodes: [{ t: 'Neural Networks', s: 'CNNs, RNNs, transformers', tags: ['DL'], dur: '4w' }, { t: 'Working with LLMs', s: 'Prompting, fine-tuning, RAG', tags: ['LLM'], dur: '3w' }, { t: 'Building AI Products', s: 'LangChain, APIs, deployment', tags: ['API'], dur: '3w' }] },
      { label: 'Phase 3 — Specialization', nodes: [{ t: 'NLP & Somali Language AI', s: 'Build tools for underrepresented languages', tags: ['NLP', 'Somali'], dur: 'ongoing' }, { t: 'AI Research Fundamentals', s: 'Reading papers, reproducing results', tags: ['Research'], dur: 'ongoing' }] },
    ],
    resources: [{ icon: '📺', name: 'fast.ai Practical DL', type: 'Course', free: true }, { icon: '🎥', name: 'Andrej Karpathy', type: 'YouTube', free: true }, { icon: '📖', name: 'Hugging Face', type: 'Course', free: true }, { icon: '🧪', name: 'Kaggle', type: 'Practice', free: true }],
    leaderboard: [
      { init: 'HM', name: 'Hodan M.', loc: 'Doha', score: 1890, change: '+41', color: '#d97706' },
      { init: 'FN', name: 'Faadumo N.', loc: 'Seattle', score: 1740, change: '+18', color: '#b45309' },
      { init: 'AA', name: 'Abdi A.', loc: 'SF', score: 1520, change: '+9', color: '#d97706' },
    ],
    events: [
      { day: '8', month: 'Apr', title: 'Build a Somali Chatbot', desc: 'Live workshop: fine-tune a small LLM on Somali text using free Google Colab. No GPU needed.', time: '4pm EAT', host: 'Faadumo Nuur', attendees: 89, type: 'online' },
      { day: '18', month: 'Apr', title: 'AI Paper Reading Club', desc: 'This week: Attention Is All You Need. Ahmed will break it down in plain English.', time: '7pm EAT', host: 'Ahmed Hassan', attendees: 44, type: 'online' },
    ],
    chatMessages: [
      { init: 'HM', name: 'Hodan M.', color: '#d97706', role: 'student', msg: 'I fine-tuned a small LLM on Somali text and it is generating coherent Somali sentences. Sharing the dataset next week. Somali AI is happening!! 🇸🇴', time: '8:45 AM', reactions: [{ emoji: '🇸🇴', count: 34, mine: false }, { emoji: '🚀', count: 21, mine: true }] },
      { init: 'FN', name: 'Faadumo N.', color: '#b45309', role: 'mentor', msg: "This is genuinely historic Hodan. The Somali language has almost zero ML representation. What you're building matters far beyond this community.", time: '9:01 AM', reactions: [{ emoji: '💙', count: 28, mine: false }] },
      { init: 'AA', name: 'Abdi A.', color: '#d97706', role: 'student', msg: 'For anyone scared of the math — watch 3Blue1Brown Essence of Linear Algebra first. All 15 videos. Then fast.ai. The fear disappears.', time: '10:30 AM', reactions: [{ emoji: '💯', count: 19, mine: false }] },
    ],
    onlineMembers: [],
  },
  {
    id: 'networking', name: 'Networking', emoji: '🌐', color: '#0d9488', bg: '#ccfbf1',
    desc: 'TCP/IP, routing, switching, cloud networking, and infrastructure.',
    chips: ['CCNA', 'Cloud', 'Infrastructure'], lessons: 14,
    mentors: [
      { init: 'AW', name: 'Abdullahi Warsame', role: 'Network Engineer', company: 'Safaricom', bio: '9 years designing network infrastructure across East Africa. Building the next generation.', chips: ['CCNA', 'CCNP', 'AWS', 'Cisco'], ans: 93, students: 19, rating: 4.8, online: true, color: '#0d9488' },
    ],
    phases: [
      { label: 'Phase 1 — Foundations', nodes: [{ t: 'OSI & TCP/IP Models', s: 'How data travels across networks', tags: ['OSI'], dur: '1w' }, { t: 'IP Addressing', s: 'IPv4, IPv6, subnetting, CIDR', tags: ['IP'], dur: '2w' }, { t: 'Routing & Switching', s: 'VLANs, STP, OSPF, BGP', tags: ['Cisco'], dur: '3w' }] },
      { label: 'Phase 2 — Cloud & Security', nodes: [{ t: 'Cloud Networking', s: 'AWS VPC, Azure, load balancers', tags: ['AWS'], dur: '2w' }, { t: 'Network Security', s: 'Firewalls, VPNs, IDS/IPS', tags: ['Sec'], dur: '2w' }, { t: 'CCNA Certification', s: 'Cisco certified network associate', tags: ['CCNA'], dur: '6w' }] },
    ],
    resources: [{ icon: '📖', name: 'Cisco NetAcad', type: 'Course', free: true }, { icon: '🎥', name: 'Professor Messer', type: 'YouTube', free: true }, { icon: '🧪', name: 'Packet Tracer', type: 'Labs', free: true }],
    leaderboard: [
      { init: 'AW', name: 'Abdullahi W.', loc: 'Kampala', score: 1420, change: '+28', color: '#0d9488' },
      { init: 'MH', name: 'Mahad H.', loc: 'Nairobi', score: 1180, change: '+14', color: '#0f766e' },
    ],
    events: [
      { day: '11', month: 'Apr', title: 'CCNA Study Group', desc: 'Week 4 of our CCNA prep series. This session: BGP and route redistribution.', time: '6pm EAT', host: 'Abdullahi Warsame', attendees: 23, type: 'online' },
    ],
    chatMessages: [
      { init: 'AW', name: 'Abdullahi W.', color: '#0d9488', role: 'student', msg: 'Study group for CCNA starting next week — Tuesday and Thursday 6pm EAT. Reply here if you want in!', time: '3:00 PM', reactions: [{ emoji: '✋', count: 11, mine: false }] },
      { init: 'AW', name: 'Abdullahi Warsame', color: '#0f766e', role: 'mentor', msg: 'Great initiative! I will sit in on the first session and answer questions. Pro tip: use Packet Tracer for every lab — do not just read the theory.', time: '3:15 PM', reactions: [{ emoji: '🙏', count: 8, mine: false }] },
    ],
    onlineMembers: [],
  },
  {
    id: 'mobile', name: 'Mobile Dev', emoji: '📱', color: '#16a34a', bg: '#dcfce7',
    desc: 'Build iOS and Android apps with React Native or Flutter.',
    chips: ['iOS', 'Android', 'React Native'], lessons: 15,
    mentors: [
      { init: 'OM', name: 'Omar Mahad', role: 'Senior iOS Eng.', company: 'Spotify', bio: 'Built 12 apps shipped to App Store. React Native specialist.', chips: ['React Native', 'iOS', 'Swift', 'Expo'], ans: 76, students: 12, rating: 4.7, online: false, color: '#16a34a' },
    ],
    phases: [
      { label: 'Phase 1 — Basics', nodes: [{ t: 'React Native Setup', s: 'Expo, navigation, components', tags: ['RN'], dur: '2w' }, { t: 'State & Data', s: 'Context, Redux, async storage', tags: ['State'], dur: '2w' }, { t: 'Native Features', s: 'Camera, GPS, notifications', tags: ['Native'], dur: '2w' }] },
      { label: 'Phase 2 — Shipping', nodes: [{ t: 'Backend Integration', s: 'REST APIs, Supabase, Firebase', tags: ['API'], dur: '2w' }, { t: 'Performance', s: 'Optimization, offline, caching', tags: ['Perf'], dur: '1w' }, { t: 'App Store Deploy', s: 'iOS + Google Play submission', tags: ['Deploy'], dur: '2w' }] },
    ],
    resources: [{ icon: '📖', name: 'React Native Docs', type: 'Docs', free: true }, { icon: '📺', name: 'Expo Docs', type: 'Docs', free: true }, { icon: '🎥', name: 'William Candillon', type: 'YouTube', free: true }],
    leaderboard: [
      { init: 'SO', name: 'Sagal O.', loc: 'Minneapolis', score: 1340, change: '+45', color: '#16a34a' },
      { init: 'OM', name: 'Omar M.', loc: 'Dublin', score: 1120, change: '+11', color: '#15803d' },
    ],
    events: [
      { day: '20', month: 'Apr', title: 'Ship Your First App', desc: 'End-to-end workshop: build and submit a simple app to both stores in one day.', time: '10am EAT', host: 'Omar Mahad', attendees: 38, type: 'challenge' },
    ],
    chatMessages: [
      { init: 'SO', name: 'Sagal O.', color: '#16a34a', role: 'student', msg: 'Released my first app on Play Store! Somali-English dictionary. 200 downloads in the first week 🙌🙌🙌', time: '4:00 PM', reactions: [{ emoji: '🎉', count: 32, mine: false }, { emoji: '🔥', count: 18, mine: false }] },
    ],
    onlineMembers: [],
  },
  {
    id: 'devops', name: 'DevOps & Cloud', emoji: '⚙️', color: '#ea580c', bg: '#ffedd5',
    desc: 'Docker, Kubernetes, CI/CD, AWS, and cloud infrastructure.',
    chips: ['Docker', 'Kubernetes', 'AWS'], lessons: 16,
    mentors: [
      { init: 'AA', name: 'Abdi Axmed', role: 'Senior SWE / SRE', company: 'Google', bio: "Running Google's SRE practice for EMEA. DevOps + cloud is the future of East Africa tech.", chips: ['Kubernetes', 'AWS', 'GCP', 'Terraform', 'CI/CD'], ans: 112, students: 21, rating: 4.9, online: true, color: '#ea580c' },
    ],
    phases: [
      { label: 'Phase 1 — Core Tools', nodes: [{ t: 'Linux Administration', s: 'File system, processes, shell scripting', tags: ['Linux'], dur: '2w' }, { t: 'Docker & Containers', s: 'Images, containers, Compose', tags: ['Docker'], dur: '2w' }, { t: 'Git & GitHub', s: 'Branching, PRs, workflows', tags: ['Git'], dur: '1w' }] },
      { label: 'Phase 2 — Cloud & Orchestration', nodes: [{ t: 'AWS Fundamentals', s: 'EC2, S3, IAM, VPC, Lambda', tags: ['AWS'], dur: '3w' }, { t: 'Kubernetes', s: 'Pods, deployments, services', tags: ['K8s'], dur: '4w' }, { t: 'CI/CD Pipelines', s: 'GitHub Actions, ArgoCD', tags: ['CI/CD'], dur: '2w' }] },
    ],
    resources: [{ icon: '🎥', name: 'TechWorld with Nana', type: 'YouTube', free: true }, { icon: '🧪', name: 'KodeKloud', type: 'Labs', free: false }, { icon: '📖', name: 'AWS Free Tier', type: 'Practice', free: true }],
    leaderboard: [
      { init: 'YI', name: 'Yusuf I.', loc: 'Toronto', score: 1480, change: '+22', color: '#ea580c' },
      { init: 'AA', name: 'Abdi A.', loc: 'SF', score: 1360, change: '+15', color: '#c2410c' },
    ],
    events: [
      { day: '13', month: 'Apr', title: 'Kubernetes Hands-On Lab', desc: 'Set up a local K8s cluster and deploy a real app. Abdi will be live to help debug.', time: '7pm EAT', host: 'Abdi Axmed', attendees: 47, type: 'online' },
    ],
    chatMessages: [
      { init: 'YI', name: 'Yusuf I.', color: '#ea580c', role: 'student', msg: 'Got my AWS Solutions Architect cert yesterday! 6 weeks of studying alongside work. ACloudGuru + practice exams.', time: '9:00 AM', reactions: [{ emoji: '🏆', count: 24, mine: false }, { emoji: '🎉', count: 16, mine: true }] },
      { init: 'AA', name: 'Abdi Axmed', color: '#c2410c', role: 'mentor', msg: "Congratulations Yusuf!! AWS SA is a serious cert. Now target the Professional or a specialty cert. Your salary trajectory just changed.", time: '9:18 AM', reactions: [{ emoji: '💪', count: 14, mine: false }] },
    ],
    onlineMembers: [],
  },
  {
    id: 'backend', name: 'Backend Dev', emoji: '🗄️', color: '#0ea5e9', bg: '#e0f2fe',
    desc: 'APIs, databases, system design, and server architecture.',
    chips: ['APIs', 'SQL', 'System Design'], lessons: 17,
    mentors: [
      { init: 'HMR', name: 'Hodan Mire', role: 'Backend Engineer', company: 'Stripe', bio: 'Building payment infrastructure at Stripe. Backend is the backbone of every product.', chips: ['Go', 'PostgreSQL', 'Redis', 'System Design'], ans: 98, students: 17, rating: 4.8, online: true, color: '#0ea5e9' },
      { init: 'AA', name: 'Abdi Axmed', role: 'Senior SWE', company: 'Google', bio: 'Distributed systems at scale. I help Somali engineers think in systems.', chips: ['Go', 'gRPC', 'Kafka', 'Microservices'], ans: 89, students: 18, rating: 4.9, online: false, color: '#0284c7' },
    ],
    phases: [
      { label: 'Phase 1 — API Foundations', nodes: [{ t: 'HTTP & REST APIs', s: 'Methods, status codes, JSON', tags: ['HTTP'], dur: '2w' }, { t: 'Node.js or Python', s: 'Express, FastAPI, or Django', tags: ['Node'], dur: '3w' }, { t: 'Databases', s: 'PostgreSQL, indexing, optimization', tags: ['SQL'], dur: '3w' }] },
      { label: 'Phase 2 — Scaling', nodes: [{ t: 'Auth & Security', s: 'JWT, OAuth, bcrypt, RLS', tags: ['Auth'], dur: '2w' }, { t: 'Caching & Performance', s: 'Redis, CDN, query caching', tags: ['Redis'], dur: '2w' }, { t: 'System Design', s: 'Load balancing, microservices', tags: ['SD'], dur: '4w' }] },
    ],
    resources: [{ icon: '📖', name: 'roadmap.sh/backend', type: 'Roadmap', free: true }, { icon: '🎥', name: 'Fireship', type: 'YouTube', free: true }, { icon: '📖', name: 'PostgreSQL Docs', type: 'Docs', free: true }],
    leaderboard: [
      { init: 'HMR', name: 'Hodan M.', loc: 'Doha', score: 1620, change: '+28', color: '#0ea5e9' },
      { init: 'SO', name: 'Sagal O.', loc: 'Minneapolis', score: 1380, change: '+19', color: '#0284c7' },
      { init: 'AA', name: 'Abdi A.', loc: 'SF', score: 1240, change: '+8', color: '#0ea5e9' },
    ],
    events: [
      { day: '16', month: 'Apr', title: 'System Design Interview Prep', desc: 'Walk through classic SD interview questions: URL shortener, Twitter, Uber. Hodan interviews Abdi live.', time: '6pm EAT', host: 'Hodan Mire', attendees: 61, type: 'online' },
    ],
    chatMessages: [
      { init: 'SO', name: 'Sagal O.', color: '#0ea5e9', role: 'student', msg: "Spent 3 hours debugging an N+1 query. ONE .include() in the ORM fixed it. Query time: 4s → 40ms. Always check your SQL!!", time: '2:30 PM', reactions: [{ emoji: '😭', count: 22, mine: false }, { emoji: '💡', count: 17, mine: false }] },
      { init: 'HMR', name: 'Hodan M.', color: '#0284c7', role: 'mentor', msg: "Classic lesson Sagal! N+1 issues destroy performance at scale. Use EXPLAIN ANALYZE on every slow query. And use a query profiler in development — catch these before production.", time: '2:48 PM', reactions: [{ emoji: '📌', count: 13, mine: false }] },
    ],
    onlineMembers: [],
  },
]

export default FIELDS
