export const learnCourses = [
  {
    id: 'html-css',
    track: 'webdev',
    emoji: '🌐',
    title: { so: 'HTML & CSS Aasaasiga', en: 'HTML & CSS Fundamentals' },
    description: 'Billow mashruucaaga koowaad ee web. Wax ka baro qaab-dhismeedka HTML iyo qurxinta CSS.',
    difficulty: 'beginner',
    color: '#4189DD',
    tags: ['HTML', 'CSS', 'Web'],
    lessons: [
      {
        id: 'html-1',
        title: { so: 'HTML maxay tahay?', en: 'What is HTML?' },
        body: {
          so: 'HTML (HyperText Markup Language) waa luuqadda aasaasiga ah ee lagu dhiso websaydhyada. Waxay adeegsataa "tags" si loo abuuro qaab-dhismeedka bogga, sida cinwaanada, muqaalada, sawirrada, iyo xiriiriyaha.\n\nKasta oo HTML tags waxay u yihiin sida sanduuqyo: mid furan <tag> iyo mid xidhan </tag>.',
          en: 'HTML (HyperText Markup Language) is the foundational language of the web. It uses "tags" to create the structure of a page — headings, paragraphs, images, and links.\n\nEvery HTML tag acts like a container: an opening tag <tag> and a closing tag </tag>.',
        },
        code: `<!DOCTYPE html>\n<html>\n  <head>\n    <title>My First Page</title>\n  </head>\n  <body>\n    <h1>Salaan Adduunka!</h1>\n    <p>Halkan ku qor muqaalkaaga.</p>\n    <a href="#">Xiriiriye</a>\n  </body>\n</html>`,
      },
      {
        id: 'html-2',
        title: { so: 'CSS maxay tahay?', en: 'What is CSS?' },
        body: {
          so: 'CSS (Cascading Style Sheets) waa luuqadda lagu qurxiyo iyo lagu naqshadeeyaa bogagga HTML. Waxay go\'aanisaa midabka, cabbirka qoraalka, meesha walba ee curiyuhu ku yimaado, iyo wax badan.\n\nCSS-ka waxaad ku qori kartaa:\n1. Si toos ah HTML (inline)\n2. Gudaha HTML file (<style>)\n3. Fayl gooni ah (.css)',
          en: 'CSS (Cascading Style Sheets) is the language for styling and designing HTML pages. It controls colors, font sizes, layout, and much more.\n\nYou can write CSS in three ways:\n1. Directly in HTML (inline style)\n2. Inside the HTML file (<style> tag)\n3. In a separate .css file',
        },
        code: `/* CSS Example */\nh1 {\n  color: #4189DD;\n  font-size: 2rem;\n}\n\np {\n  color: #3d4f6e;\n  line-height: 1.6;\n}\n\n.card {\n  background: #f4f7fb;\n  border-radius: 12px;\n  padding: 20px;\n  border: 1px solid #dce6f5;\n}`,
      },
      {
        id: 'html-3',
        title: { so: 'CSS Flexbox Layout', en: 'CSS Flexbox Layout' },
        body: {
          so: 'Flexbox waa nidaam lagu aasaasay CSS oo kaa caawinaya inaad ku hagaajiso curiyayaasha bogga si fudud iyo si la xukumi karo. Waxaad isticmaali kartaa marka aad rabto inaad wax u qaabeysid dhinac ka dhinac ama xudduunta u dhigto.\n\nFuraha ugu muhiimsan: display: flex',
          en: 'Flexbox is a CSS layout system for arranging elements easily and responsively. Use it to line things up side by side or center items on the page.\n\nThe key: add display: flex to the parent container.',
        },
        code: `.container {\n  display: flex;\n  gap: 16px;\n  align-items: center;\n  justify-content: space-between;\n}\n\n.item {\n  flex: 1;\n  padding: 16px;\n  background: #eaf2fd;\n  border-radius: 8px;\n}\n\n/* Center something */\n.centered {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}`,
      },
    ],
  },
  {
    id: 'js-basics',
    track: 'webdev',
    emoji: '⚡',
    title: { so: 'JavaScript Aasaasiga', en: 'JavaScript Fundamentals' },
    description: 'Ku baro luuqadda websaydhyada firfircoon — variables, functions, loops, iyo DOM manipulation.',
    difficulty: 'beginner',
    color: '#1a5db5',
    tags: ['JavaScript', 'Web', 'Programming'],
    lessons: [
      {
        id: 'js-1',
        title: { so: 'Variables iyo Data Types', en: 'Variables & Data Types' },
        body: {
          so: 'Variable waa meel kaydinta xog. JavaScript-ka waxaad ku sameyn kartaa variables adiga oo isticmaalaya:\n\n• const — qiimaha aan la beddelayn (isticmaal badankiis)\n• let — variable la beddeli karo\n• var — hore loo isticmaali jiray (ha isticmaalin)\n\nNoocyada xogta: String (qoraal), Number (arimaha), Boolean (run/been), Array, Object',
          en: 'A variable is a named container for storing data. In JavaScript you create them using:\n\n• const — for values that never change (use most of the time)\n• let — for values that may change\n• var — old style (avoid it)\n\nData types: String (text), Number, Boolean (true/false), Array, Object',
        },
        code: `// Variables\nconst name = "Asha";\nlet age = 24;\nlet isStudent = true;\n\n// Array — ordered list\nconst languages = ["Somali", "English", "JavaScript"];\nconsole.log(languages[0]); // "Somali"\n\n// Object — key/value pairs\nconst user = {\n  name: "Asha",\n  city: "Mogadishu",\n  skills: ["React", "CSS"]\n};\nconsole.log(user.city); // "Mogadishu"`,
      },
      {
        id: 'js-2',
        title: { so: 'Functions iyo Arrow Functions', en: 'Functions & Arrow Functions' },
        body: {
          so: 'Function waa koox amar oo dib u isticmaali karno. Functions waxay qaataan "parameters" (xogta la gelinayo) oo waxay soo celisaa natiijada "return" adiga oo isticmaalaya.\n\nArrow function waa qaab kooban oo casri ah oo JavaScript.',
          en: 'A function is a reusable block of code. Functions accept "parameters" (inputs) and return a result using the return keyword.\n\nArrow functions are the modern, shorter syntax for writing functions.',
        },
        code: `// Traditional function\nfunction greet(name) {\n  return \`Salaan, \${name}!\`;\n}\n\n// Arrow function (same thing, shorter)\nconst greet = (name) => \`Salaan, \${name}!\`;\n\nconsole.log(greet("Hodan")); // Salaan, Hodan!\n\n// Array methods using arrow functions\nconst cities = ["Mogadishu", "Hargeisa", "Bosaso"];\nconst upper = cities.map(city => city.toUpperCase());\nconsole.log(upper); // ["MOGADISHU", "HARGEISA", "BOSASO"]`,
      },
      {
        id: 'js-3',
        title: { so: 'DOM: Bogga wax ka beddel', en: 'DOM Manipulation' },
        body: {
          so: 'DOM (Document Object Model) waa qaab JavaScript ugu hadlayso HTML-ka bogga. Waxaad ku beddelan kartaa qoraalada, midabada, iyo curiyayaasha adigoo isticmaalaya JavaScript.\n\nquerySelectorWaa amarka ugu muhiimsan ee DOM-ka.',
          en: 'The DOM is how JavaScript communicates with and changes your HTML. You can update text, styles, and elements in real-time.\n\nquerySelector is the most important DOM method.',
        },
        code: `// Select an element\nconst title = document.querySelector('h1');\n\n// Change its text\ntitle.textContent = "Kayd waa barasho!";\n\n// Change its style\ntitle.style.color = "#4189DD";\n\n// React to user actions\nconst btn = document.querySelector('#myBtn');\nbtn.addEventListener('click', () => {\n  alert('Guul! 🎉');\n});\n\n// Create a new element\nconst p = document.createElement('p');\np.textContent = "Muqaal cusub";\ndocument.body.appendChild(p);`,
      },
    ],
  },
  {
    id: 'python',
    track: 'python',
    emoji: '🐍',
    title: { so: 'Python Bilaawga ah', en: 'Python for Beginners' },
    description: 'Luuqadda ugu fududan ee bilaabista. Waxaad ku baranaysaa code-writing, xog-baaris, iyo AI.',
    difficulty: 'beginner',
    color: '#0f3d82',
    tags: ['Python', 'Programming', 'AI/ML'],
    lessons: [
      {
        id: 'py-1',
        title: { so: 'Maxay tahay Python?', en: 'What is Python?' },
        body: {
          so: 'Python waa luuqad barnaamijeed oo si fudud loo akhriyi karo. Waxaa loo isticmaalaa: AI/ML, xog-baaris (data science), dhismaha websaydhyada, automation, iyo wax badan.\n\nSababta Python loo jecel yahay:\n• Qoraalkeeda wuxuu u eg yahay Ingiriisiga caadiga\n• Maktabad aad badan oo bilaash ah\n• Waxaa adeegsada Google, Netflix, NASA, iyo shirkado kale oo badan',
          en: 'Python is a programming language known for being clean and easy to read. It\'s used for AI/ML, data science, web backends, automation, and much more.\n\nWhy people love Python:\n• Code reads almost like plain English\n• Massive free library ecosystem\n• Used by Google, Netflix, NASA, and hundreds more',
        },
        code: `# Your first Python program\nprint("Salaan Adduunka!")\n\n# Variables — no type declaration needed\nname = "Asha"\nage = 24\ncity = "Mogadishu"\n\nprint(f"Magacaygu waa {name}, da'daydu waa {age}")\n# Output: Magacaygu waa Asha, da'daydu waa 24\n\n# Python is case-sensitive\n# name != Name != NAME`,
      },
      {
        id: 'py-2',
        title: { so: 'Lists iyo Loops Python-ka', en: 'Lists & Loops in Python' },
        body: {
          so: 'List waa xoolo xog oo hal meel lagu kaydinayo. Loops waxay kaa caawinayaan inaad wax ku sameyso dhammaan curiyayaasha liiska.\n\nPython for loop waa mid aad fudud oo si toos ah loo akhriyi karo.',
          en: 'A list is a collection of items stored in one place. Loops let you perform an action on every item in the list.\n\nPython\'s for loop reads almost like plain English.',
        },
        code: `# List\nstudents = ["Asha", "Hamdi", "Yusuf", "Faadumo"]\n\n# Basic loop\nfor student in students:\n    print(f"Salaan {student}!")\n\n# List comprehension — powerful one-liner\nnames_upper = [name.upper() for name in students]\nprint(names_upper)\n# ['ASHA', 'HAMDI', 'YUSUF', 'FAADUMO']\n\n# range() — loop a number of times\nfor i in range(5):\n    print(i)  # 0, 1, 2, 3, 4`,
      },
      {
        id: 'py-3',
        title: { so: 'Functions Python-ka', en: 'Functions in Python' },
        body: {
          so: 'Functions Python-ka waxaad ku qortaa adiga oo isticmaalaya ereyga def. Functions waxay kaa caawinayaan inaad code dib u adeegsato oo aad kaga fogaato dib-u-qorista isla coda.\n\nWaxaa muhiim ah inaad barato: parameters, return, iyo default values.',
          en: 'Python functions are defined using the def keyword. Functions help you reuse code and avoid writing the same thing twice.\n\nKey concepts: parameters, return, and default values.',
        },
        code: `# Basic function\ndef greet(name):\n    return f"Salaan, {name}!"\n\nprint(greet("Hodan"))  # Salaan, Hodan!\n\n# Default parameter value\ndef greet(name, lang="so"):\n    if lang == "so":\n        return f"Salaan, {name}!"\n    return f"Hello, {name}!"\n\nprint(greet("Asha"))         # Salaan, Asha!\nprint(greet("Asha", "en"))   # Hello, Asha!\n\n# Multiple return values\ndef min_max(numbers):\n    return min(numbers), max(numbers)\n\nlo, hi = min_max([3, 1, 9, 4])\nprint(lo, hi)  # 1 9`,
      },
    ],
  },
  {
    id: 'algorithms',
    track: 'algorithms',
    emoji: '🧮',
    title: { so: 'Algorithms & Data Structures', en: 'Algorithms & Data Structures' },
    description: 'Xalinta dhibaatooyinka code-ka. Muhiim interview-ka tech iyo dhismaha software fiican.',
    difficulty: 'intermediate',
    color: '#7c3aed',
    tags: ['Algorithms', 'DSA', 'Interview Prep'],
    lessons: [
      {
        id: 'algo-1',
        title: { so: 'Algorithm maxay tahay?', en: 'What is an Algorithm?' },
        body: {
          so: 'Algorithm waa tilmaamaha tallaabo-tallaabo ah ee lagu xallinayo dhibaatad. Waa sida recipe-ka cuntada — waxaad raacdo talaabooyin go\'an si aad u hesho natiijada aad dooneyso.\n\nAlgorithm-yada waxaa loo cabbiraa:\n• Xawaaraha: Time Complexity — Big O Notation\n• Xusuusta: Space Complexity',
          en: 'An algorithm is a step-by-step procedure for solving a problem. Think of it like a cooking recipe — defined steps that produce a predictable result.\n\nAlgorithms are measured by:\n• Speed: Time Complexity — Big O Notation\n• Memory: Space Complexity',
        },
        code: `# Linear Search — check each item one by one\ndef linear_search(arr, target):\n    for i in range(len(arr)):\n        if arr[i] == target:\n            return i  # found at index i\n    return -1  # not found\n\nscores = [85, 92, 78, 95, 60]\nprint(linear_search(scores, 95))  # 3\nprint(linear_search(scores, 50))  # -1\n\n# Time complexity: O(n) — worst case checks every item`,
      },
      {
        id: 'algo-2',
        title: { so: 'Big O Notation', en: 'Big O Notation' },
        body: {
          so: 'Big O Notation waa hab lagu cabbirayo xawaaraha algorithm-ka markay xogtu korodhayso. Su\'aasha: "Haddii xogta laba jibbaar noqoto, waqtiga socodkana maalin bay laba jibbaar noqdaa?"\n\nNoocyada ugu caansan:\n• O(1) — had iyo jeer isla xawaaraha (best)\n• O(n) — xawaaruhu wuxuu korodhnayaa xogta la mid ah\n• O(n²) — loop gudaha loop (gaabis, iska fogow)',
          en: 'Big O Notation measures how an algorithm\'s runtime grows as the input size increases. The question: "If data doubles, does runtime double too?"\n\nMost common:\n• O(1) — constant time regardless of input size (best)\n• O(n) — grows linearly with input\n• O(n²) — loop inside a loop (slow, avoid when possible)',
        },
        code: `# O(1) — constant, always same speed\ndef get_first(arr):\n    return arr[0]\n\n# O(n) — linear, grows with array size\ndef find_max(arr):\n    max_val = arr[0]\n    for item in arr:\n        if item > max_val:\n            max_val = item\n    return max_val\n\n# O(n²) — quadratic, avoid for large data\ndef has_duplicate(arr):\n    for i in range(len(arr)):\n        for j in range(i + 1, len(arr)):  # nested!\n            if arr[i] == arr[j]:\n                return True\n    return False`,
      },
      {
        id: 'algo-3',
        title: { so: 'Arrays iyo HashMaps', en: 'Arrays & HashMaps' },
        body: {
          so: 'Array iyo HashMap waa labada qaab ugu muhiimsan ee kaydinta xogta. Inta badan interview-yada tech way ka weydiiyan dhibaatooyinka ku saabsan labadan.\n\nArray: liiska xogta lambarka la yaqaan (index). O(1) helid haddii aad taqaan index-ka.\nHashMap: raadinta degdeg ah adiga oo isticmaalaya furaha (key). O(1) helid iyo kaydinta.',
          en: 'Arrays and HashMaps are the two most important data structures. Most technical interview problems involve one or both.\n\nArray: ordered list where position (index) is known. O(1) access by index.\nHashMap (dict): fast lookup by key. O(1) get and set.',
        },
        code: `# Array tricks\nnums = [1, 2, 3, 4, 5]\nprint(nums[-1])    # last item: 5\nprint(nums[1:3])   # slice: [2, 3]\nnums.append(6)     # add to end\nnums.pop()         # remove from end\n\n# HashMap (dict in Python)\n# Classic interview pattern: frequency count\ndef count_chars(s):\n    freq = {}\n    for char in s:\n        freq[char] = freq.get(char, 0) + 1\n    return freq\n\nprint(count_chars("salaan"))\n# {'s': 1, 'a': 3, 'l': 1, 'n': 1}`,
      },
    ],
  },
  {
    id: 'career',
    track: 'career',
    emoji: '🚀',
    title: { so: 'Tech Career: Soomaaliya → Adduunka', en: 'Tech Career: Somalia to the World' },
    description: 'Resume, portfolio, LinkedIn, iyo sidaad u diyaar-garoowdaa interview-ka. Tilmaamo xaqiiqda ah.',
    difficulty: 'beginner',
    color: '#1a6b4a',
    tags: ['Career', 'Interview', 'Resume', 'Somalia'],
    lessons: [
      {
        id: 'career-1',
        title: { so: 'LinkedIn xirfadeed sidaad u dhisaysaa', en: 'Building a Professional LinkedIn' },
        body: {
          so: 'LinkedIn waa xarunta ugu muhiimsan ee xirfadlaha tech-ka adduunka oo dhan. Dadka badan oo shaqo u baahan waa halkan looga helo.\n\nTillaabada LinkedIn fiican:\n1. Sawir xirfadeed ah\n2. Headline si cad oo sheegaysa aad maxaad tahay\n3. About section: sheeg sheekadaada si dabiici ah\n4. Xirfadahaaga (Skills): React, Python, etc.\n5. Mashaariicda aad dhisay (Projects)',
          en: 'LinkedIn is the most important professional network in global tech. Most senior hiring happens through LinkedIn connections.\n\nSteps to a strong profile:\n1. Professional photo\n2. Clear headline stating exactly who you are\n3. About section: tell your story naturally\n4. Skills: React, Python, SQL, etc.\n5. Projects you have built with links',
        },
        code: `// Example Headline formats\n\n// ❌ Weak — too vague\n"Student at University of Mogadishu"\n\n// ✅ Strong — specific + value\n"Frontend Developer | React & JavaScript |\nBuilding tools for the Somali tech community"\n\n// ✅ Also strong — shows trajectory\n"CS Student → Software Engineer |\nOpen Source | Python, Django, PostgreSQL"\n\n// Your summary should answer:\n// WHO you are, WHAT you build, WHY it matters`,
      },
      {
        id: 'career-2',
        title: { so: 'Sidaad u diyaar-garoowdaa interview-ka tech', en: 'How to Prepare for a Tech Interview' },
        body: {
          so: 'Interview-ka tech-ka wuxuu kaa codsanayaa inaad xalliso dhibaatooyinka code-ka adigoo hadlaya xalkaaga. Waxaad u baahan tahay:\n\n1. Data Structures: Arrays, Strings, HashMaps, Trees\n2. Algorithms: Binary Search, Two Pointers, Sliding Window\n3. Practice: 50-100 LeetCode easy questions\n4. Behavioral questions (STAR method)\n5. Ku celceli sharaxaadda afkaaga',
          en: 'A tech interview asks you to solve coding problems while explaining your thinking out loud. You need to prepare:\n\n1. Data Structures: Arrays, Strings, HashMaps, Trees\n2. Algorithms: Binary Search, Two Pointers, Sliding Window\n3. Practice: 50-100 LeetCode Easy problems\n4. Behavioral questions (STAR method)\n5. Practice explaining your reasoning verbally',
        },
        code: `# Classic interview problem: Two Sum\n# Given an array, find two numbers that add to target\n\ndef two_sum(nums, target):\n    seen = {}  # HashMap approach — O(n)\n    \n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in seen:\n            return [seen[complement], i]\n        seen[num] = i\n    \n    return []\n\n# Test\nnums = [2, 7, 11, 15]\nprint(two_sum(nums, 9))   # [0, 1] — nums[0]+nums[1]=9\nprint(two_sum(nums, 18))  # [1, 2] — nums[1]+nums[2]=18`,
      },
    ],
  },
]

export const LEARN_TRACKS = [
  { id: 'all', label: 'All Courses' },
  { id: 'webdev', label: 'Web Dev' },
  { id: 'python', label: 'Python' },
  { id: 'algorithms', label: 'Algorithms' },
  { id: 'career', label: 'Career' },
]

export const LEARN_PROGRESS_KEY = 'hh_learn_progress'
