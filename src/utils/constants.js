import facultyImg from '../assets/project-faculty.jpg'
import crmImg from '../assets/project-crm.jpg'
import jewelleryImg from '../assets/project-jewellery.jpg'
import buddyImg from '../assets/project-buddy.jpg'
import solvraImg from '../assets/project-solvra.png'

/**
 * Default content for every fact on the page.
 *
 * The live site reads from Supabase (edited at /admin); these values are what
 * renders before anything has been saved there, or if Supabase is unreachable.
 *
 * Rule for this file: nothing goes in that can't be clicked, verified or
 * truthfully claimed. `linkedin` / `x` render only when non-empty.
 */
export const SITE = {
  name: 'Vishwajeet Nishad',
  title: 'Web Developer',
  role: 'Technical Operations Engineer @ SpeedoExpress',
  tagline:
    'I build modern websites, web applications and internal tools — including a CRM a logistics sales team uses every day. Available for freelance projects.',
  email: 'vishwajeet.inn@gmail.com',
  linkedin: 'https://www.linkedin.com/in/vishwajeet-nishad/',
  x: '',
  github: 'https://github.com/Vishwajeet0101',
  location: 'Greater Noida, India',
  availability: 'Available for freelance projects',
  // Empty means the bundled photo in src/assets.
  portrait: '',
}

/**
 * Screenshots bundled with the site. A project without its own uploaded
 * `image` falls back to the entry here by id.
 */
export const PROJECT_IMAGES = {
  'faculty-portal': facultyImg,
  'speedo-crm': crmImg,
  'hament-jewellery': jewelleryImg,
  buddy: buddyImg,
  solvra: solvraImg,
}

export const ABOUT = {
  summary: `I build modern websites and web applications — the kind that load fast, read clearly on a phone, and still work six months later. I have shipped a role-based faculty portal for my college on Java and Spring Boot, and a sales CRM on Next.js, TypeScript and Supabase that a logistics team now runs their day from — calling queue in the office, selfie attendance and live GPS tracking for the field team. Day to day I work as a Technical Operations Engineer at SpeedoExpress, which is where I learned what breaks in production and why. I am deepening my full-stack range deliberately, and I take on freelance work for people who need a site or an internal tool built properly.`,
  education: {
    degree: 'B.Tech in Computer Science & Engineering',
    school: 'Noida Institute of Engineering and Technology, Greater Noida',
    period: '2024 – Present',
  },
  facts: [
    { label: 'Based in', value: 'Greater Noida, India — working with clients anywhere' },
    { label: 'Builds', value: 'Marketing sites, web apps, dashboards, internal tools' },
    { label: 'Currently', value: 'Technical Operations Engineer at SpeedoExpress' },
    { label: 'Open to', value: 'Freelance projects and contract work' },
  ],
  stats: [
    { label: 'Projects shipped', value: 8, suffix: '' },
    { label: 'Live in production', value: 3, suffix: '' },
    { label: 'Automated tests written', value: 1100, suffix: '+' },
    { label: 'Reply time', value: 24, suffix: 'h' },
  ],
}

/**
 * What a client can actually hire me for. Every item maps to something in
 * PROJECTS — no service listed that isn't already demonstrated below.
 */
export const SERVICES = [
  {
    id: 'websites',
    icon: 'layout',
    title: 'Websites & landing pages',
    summary:
      'Fast, responsive, accessible sites built with React or Next.js. Clean typography, real content hierarchy and sensible SEO basics rather than a template stretched to fit.',
    deliverables: ['Responsive layouts', 'Component system', 'SEO & meta setup', 'Vercel deploy'],
  },
  {
    id: 'web-apps',
    icon: 'app',
    title: 'Web applications',
    summary:
      'Multi-user applications with authentication, roles and permissions — the kind of thing I built for NIET and for the SpeedoExpress sales team. Forms that validate, state that stays consistent.',
    deliverables: ['Auth & role-based access', 'CRUD workflows', 'File uploads', 'Audit trails'],
  },
  {
    id: 'dashboards',
    icon: 'chart',
    title: 'Dashboards & internal tools',
    summary:
      'Admin panels, reporting views and operations tooling that replace a spreadsheet. Built around the task a team repeats fifty times a day, not around a chart library.',
    deliverables: ['Admin dashboards', 'CSV import & export', 'Keyboard-first flows', 'Data views'],
  },
  {
    id: 'backend',
    icon: 'server',
    title: 'Backend & database work',
    summary:
      'REST APIs, relational schemas and migrations with Spring Boot, Node.js, PostgreSQL, MySQL or Supabase. Typed error handling and automated tests come as part of the job.',
    deliverables: ['REST API design', 'Schema & migrations', 'Automated tests', 'Docker setup'],
  },
]

/** How a project actually runs, start to finish. Four steps, no filler. */
export const PROCESS = [
  {
    id: 'discover',
    step: '01',
    title: 'Understand the problem',
    duration: 'Day 1',
    summary:
      'A call to find out who uses the thing and what decision it has to support. I write back what I heard, with scope, assumptions and anything I think is a bad idea.',
  },
  {
    id: 'plan',
    step: '02',
    title: 'Plan and shape',
    duration: 'Days 2–4',
    summary:
      'Pages, data model and the stack choice with a reason attached. You approve a written scope and a fixed price before any code is written.',
  },
  {
    id: 'build',
    step: '03',
    title: 'Build in the open',
    duration: 'Weeks 1–4',
    summary:
      'A live preview URL from the first week, updated as I go. You review real screens instead of mockups, so changes land while they are still cheap.',
  },
  {
    id: 'launch',
    step: '04',
    title: 'Launch and hand over',
    duration: 'Launch week',
    summary:
      'Deploy to your domain, check it on real devices, hand over the repo and a short written walkthrough. Two weeks of fixes included after go-live.',
  },
]

export const EXPERIENCE = [
  {
    id: 'speedo',
    role: 'Technical Operations Engineer',
    type: 'Full-time',
    company: 'SpeedoExpress',
    companyNote: 'Logistics',
    period: 'Jan 2026 – Present',
    icon: 'truck',
    mark: 'S',
    skills: ['Next.js', 'Supabase', 'PostgreSQL', 'CRM', 'Operations'],
    highlights: [
      'Designed and shipped Speedo CRM (Next.js + Supabase), the calling platform the sales team now works from daily, with field tracking and an Android app for staff on the road.',
      'Run platform operations across customers, delivery partners and internal teams — order processing, shipment tracking and issue resolution.',
      'Support onboarding and ongoing management of delivery partners and logistics vendors.',
      'Translate day-to-day operational friction into product changes, which is where most of the CRM feature set came from.',
    ],
  },
  {
    id: 'gemini',
    role: 'Google Gemini Ambassador',
    type: 'Campus program',
    company: 'Google',
    companyNote: 'Community / student program',
    period: 'Oct 2025 – Present',
    icon: 'sparkles',
    mark: 'G',
    skills: ['AI tooling', 'Gemini', 'Public speaking', 'Community', 'Demos'],
    highlights: [
      'Promote AI tools and Gemini capabilities among students and developers.',
      'Run demos and peer sessions built around real-world use cases.',
      'Help peers adopt practical, responsible workflows with the Google AI stack.',
    ],
  },
]

export const PROJECTS = [
  {
    id: 'faculty-portal',
    featured: true,
    metric: { value: '126/126', label: 'Automated tests passing' },
    frame: 'niet-portal.duckdns.org',
    title: 'Faculty Achievement Portal',
    client: 'Noida Institute of Engineering and Technology',
    problem:
      'Faculty achievements — publications, patents, grants, FDPs, awards — were tracked on paper and email, with no way for a department head to verify a claim or for admin to report on it.',
    description:
      'A role-based web platform that replaces the paper trail. Faculty submit achievements with proof, department heads verify them, and admin gets a dashboard and CSV reports out the other end.',
    highlights: [
      'JWT authentication, BCrypt hashing and role-based access (Faculty / HOD / Admin) with IDOR protection.',
      'HOD verification workflow, admin analytics dashboard, real-time notifications and CSV report export.',
      'Secure PDF proof uploads with magic-byte validation, UUID filenames and an append-only audit trail.',
      'Flyway-managed MySQL schema, Docker + Caddy deployment, 126/126 automated tests passing.',
    ],
    tagline: 'ROLE-BASED PLATFORM · SPRING BOOT',
    discipline: 'Web application',
    stack: ['Java 21', 'Spring Boot', 'Spring Security', 'JPA / Hibernate', 'MySQL', 'Docker'],
    image: '',
    github: null,
    live: 'https://niet-portal.duckdns.org/',
  },
  {
    id: 'speedo-crm',
    featured: true,
    device: 'laptop',
    metric: { value: '1,000+', label: 'Unit & database tests' },
    frame: 'crm-system-speedo-express.vercel.app',
    title: 'Speedo CRM — Sales Calling & Field Tracking',
    client: 'SpeedoExpress',
    problem:
      'The sales team worked leads from spreadsheets: no call history, no follow-up schedule, and duplicate numbers getting called twice by different people. Out in the markets, the field team had no attendance record and no way to show where they had been.',
    description:
      'A production CRM with a daily calling queue for the office team and a field tracking system for the sales staff on the road. It imports leads, builds a per-caller queue, logs every call and schedules the next follow-up automatically. Field staff check in with a selfie, are tracked only while on duty, and log their visits against leads, while admins watch a live map. Deployed on Vercel, with an Android app for the field team, and in daily use.',
    highlights: [
      'CSV lead import with RFC 4180 parsing, phone normalisation, dedupe and all-or-nothing commits.',
      'Queue generator with priority bands and a D1/D3/D5/D7/D11 follow-up ladder, built as atomic Postgres functions.',
      'Field tracking: selfie check-in with live camera, server token, duplicate-photo hashes and fake-GPS flag, then admin review.',
      'Live map on OpenStreetMap with route playback, stop detection, market zones with entry/exit rules, visits and tasks.',
      'Android app (Capacitor) that tracks in the background only between check-in and check-out; day reports export to Excel and CSV.',
      'Keyboard-driven caller screen, Customer 360 view, 30s undo, do-not-call suppression and 1,000+ unit and database tests.',
    ],
    tagline: 'LIVE PRODUCT · WEB + ANDROID · NEXT.JS + SUPABASE',
    discipline: 'Internal tool',
    stack: ['Next.js', 'TypeScript', 'Supabase', 'PostgreSQL', 'Tailwind CSS', 'Capacitor', 'Leaflet', 'Vitest'],
    image: '',
    github: null,
    live: 'https://crm-system-speedo-express.vercel.app',
  },
  {
    id: 'hament-jewellery',
    featured: true,
    device: 'laptop',
    metric: { value: '3', label: 'Languages — Hinglish, English, Hindi' },
    frame: 'hement-jewellary.vercel.app',
    title: 'Hament Jewellery — Online Storefront',
    client: 'Hament Jewellery, Madanpur Bazar',
    problem:
      'A neighbourhood jeweller with no way to show its pieces online — customers had to walk in or phone to find out what was in stock, in what purity, and at what price.',
    description:
      'A storefront for 22K hallmarked gold and 925 sterling silver. Customers browse by category, see purity, weight and price on every piece, and enquire on WhatsApp in one tap; the shop manages its own catalogue from an admin panel.',
    highlights: [
      'Category browsing across gold and silver — necklaces, bangles, chains, rings, earrings, pendants, kadas.',
      'Purity, weight and price on every product, with "Price on WhatsApp" and availability badges where the shop wants them.',
      'One-tap WhatsApp enquiry from any product, the header and a floating button.',
      'Language switch between Hinglish, English and Hindi; shop admin login to manage products.',
    ],
    tagline: 'LIVE STOREFRONT · NEXT.JS + SUPABASE',
    discipline: 'E-commerce website',
    stack: ['Next.js', 'Supabase', 'Tailwind CSS', 'WhatsApp enquiry'],
    image: '',
    github: null,
    live: 'https://hement-jewellary.vercel.app',
  },
  {
    id: 'buddy',
    featured: true,
    metric: { value: '< 1s', label: 'Laptop commands, fully offline' },
    frame: 'Buddy v1.1.0 — Windows 10 / 11',
    title: 'Buddy — Voice Assistant for Windows',
    problem:
      'Windows has no free, always-on voice assistant that understands how people actually talk here — mixing Hindi and English, asking follow-ups, and expecting the laptop to just do the thing.',
    description:
      'Say "Hey Buddy" and talk. A Siri-style desktop assistant that opens apps, sets timers and alarms, plays music, controls volume, Wi-Fi and windows, reads what is on your screen and answers anything — in English or Hinglish. It starts with Windows, lives in the tray, and costs nothing to run.',
    highlights: [
      'Offline wake word and speech-to-text with Vosk; laptop commands run without internet in under a second.',
      'AI answers through Groq (≈0.3s) with Gemini as backup, spoken sentence by sentence while the rest is still being written.',
      'Understands Hinglish and Hindi script ("Chrome kholo", "thoda awaaz badha do"), follow-up questions and "stop / ruko" interrupts.',
      'Reads the screen to explain code or solve a question; WhatsApp messages and calls that always confirm before sending.',
      'Voice training so only your voice wakes it; API keys encrypted with Windows DPAPI; pauses during calls and when locked.',
      'Timers, alarms and reminders that survive a restart, plus routines like "good morning" and "study mode".',
    ],
    tagline: 'DESKTOP APP · PYTHON · OFFLINE WAKE WORD + AI',
    discipline: 'Desktop tool',
    stack: ['Python', 'Vosk', 'Groq', 'Gemini', 'Edge TTS', 'CustomTkinter'],
    image: '',
    github: 'https://github.com/Vishwajeet0101/buddy-voice-assistant',
    live: null,
  },
  {
    id: 'solvra',
    featured: true,
    device: 'laptop',
    metric: { value: '1 → 60', label: 'Day revision ladder, six rounds' },
    title: 'Solvra — LeetCode Revision Tracker',
    problem:
      'Solving a LeetCode problem once is easy to forget a week later. There was no simple way to know which problems were due for revision, which ones had slipped, or to keep every accepted solution and its notes in one place.',
    description:
      'A free Chrome extension (also Brave and Edge) for LeetCode practice. Every solved problem comes back for revision on a spaced schedule, Solvra shows what is due and what you missed, and each Accepted solution is saved with your notes to GitHub and/or a folder on your computer.',
    highlights: [
      'Spaced revision after 1, 3, 7, 14, 30 and 60 days, with due-today, missed-by-N-days and full per-problem history.',
      'Auto save on Accepted: a pop-up asks for notes, then pushes the code and a README to GitHub (one-click login) or a local folder.',
      'Reads Solved / Attempted / Not solved straight from your LeetCode account; reminders when revisions are due.',
      'ChatGPT and Gemini side panel (Alt+Shift+A), plus ad blocker, study-hours site blocker, Clean YouTube and a time tracker.',
      'No server and no tracking: data stays in the browser, solutions go only to your own GitHub repo.',
    ],
    steps: [
      'Download solvra-….zip from the latest GitHub release and unzip it into a folder you will keep.',
      'Open chrome://extensions (brave://extensions or edge://extensions).',
      'Turn on Developer mode in the top-right corner.',
      'Click Load unpacked and pick the unzipped folder (the one with manifest.json).',
      'Pin Solvra from the puzzle-piece menu.',
      'On the Welcome page, click Login with GitHub, authorise, and pick your repo.',
    ],
    tagline: 'CHROME EXTENSION · JAVASCRIPT · GITHUB SYNC',
    discipline: 'Browser extension',
    stack: ['JavaScript', 'Chrome Extension (MV3)', 'GitHub API', 'HTML & CSS'],
    image: '',
    github: 'https://github.com/Vishwajeet0101/solvra',
    download: 'https://github.com/Vishwajeet0101/solvra/releases/latest',
    live: null,
  },
  {
    id: 'landslide',
    title: 'Landslide Early Warning Platform',
    description:
      'Early-warning and risk-assessment prototype for Aizawl, Mizoram: rainfall and soil moisture drive a slope-failure probability, weighted by exposure, with human verification before any alert goes out. I led the team and built the backend.',
    stack: ['Node.js', 'PostgreSQL + PostGIS', 'React', 'Python ML', 'Docker'],
    github: 'https://github.com/Vishwajeet0101/landslide-platform',
    live: null,
  },
  {
    id: 'image-encryption',
    title: 'ROI-Based Image Encryption',
    description:
      'Hybrid AI and cryptography system: YOLO object detection finds the regions of interest, then chaos-based encryption (SHA-512 keys, CML / PWLCM / STM maps) scrambles only those regions for faster, targeted protection.',
    stack: ['Python', 'YOLO', 'NumPy', 'Cryptography'],
    github: 'https://github.com/Vishwajeet0101/Image-Encryption',
    live: null,
  },
  {
    id: 'hostel',
    title: 'Hostel Management Dashboard',
    description:
      'Web dashboard for hostel and PG admins to manage students, room allocation, rent payments, electricity billing and notices from one place.',
    stack: ['JavaScript', 'HTML', 'CSS'],
    github: 'https://github.com/Vishwajeet0101/Web-Tech-Project',
    live: 'https://techproject-1.netlify.app/login.html',
  },
]

export const SKILL_GROUPS = [
  {
    title: 'Frontend',
    skills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'HTML & CSS', 'Framer Motion'],
  },
  {
    title: 'Backend',
    skills: [
      'Spring Boot',
      'Spring Security',
      'Node.js',
      'REST APIs',
      'JWT auth',
      'JPA / Hibernate',
    ],
  },
  {
    title: 'Databases',
    skills: ['PostgreSQL', 'MySQL', 'Supabase', 'PostGIS', 'Flyway'],
  },
  {
    title: 'Languages',
    skills: ['JavaScript', 'TypeScript', 'Java', 'Python', 'SQL', 'C / C++'],
  },
  {
    title: 'Tooling & deploy',
    skills: ['Git & GitHub', 'Vercel', 'Docker', 'Vite', 'Maven', 'JUnit', 'Vitest'],
  },
]

/** Named honestly: things I am actively levelling up, not things I claim. */
export const LEARNING = ['System design', 'Testing at scale', 'CI/CD pipelines', 'Cloud deployment']

export const NAV_LINKS = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Work' },
  { id: 'experience', label: 'Experience' },
  // { id: 'services', label: 'Services' },
  { id: 'process', label: 'Process' },
  { id: 'contact', label: 'Contact' },
]
