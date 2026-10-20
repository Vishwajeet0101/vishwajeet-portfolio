import facultyImg from '../assets/project-faculty.png'
import crmImg from '../assets/project-crm.png'

/**
 * Single source of truth for every fact on the page.
 *
 * Rule for this file: nothing goes in that can't be clicked, verified or
 * truthfully claimed. `linkedin` / `x` render only when non-empty.
 */
export const SITE = {
  name: 'Vishwajeet Nishad',
  title: 'Web Developer',
  role: 'Technical Operations Engineer @ SpeedoExpress',
  email: 'vishwajeet.inn@gmail.com',
  linkedin: 'https://www.linkedin.com/in/vishwajeet-nishad/',
  x: '',
  github: 'https://github.com/Vishwajeet0101',
  location: 'Greater Noida, India',
  availability: 'Available for freelance projects',
}

export const ABOUT = {
  summary: `I build modern websites and web applications — the kind that load fast, read clearly on a phone, and still work six months later. I have shipped a role-based faculty portal for my college on Java and Spring Boot, and a sales CRM on Next.js, TypeScript and Supabase that a logistics team now runs their day from. Day to day I work as a Technical Operations Engineer at SpeedoExpress, which is where I learned what breaks in production and why. I am deepening my full-stack range deliberately, and I take on freelance work for people who need a site or an internal tool built properly.`,
  education: {
    degree: 'B.Tech in Computer Science & Engineering',
    school: 'Noida Institute of Engineering and Technology, Greater Noida',
    period: '2024 – Present',
  },
  facts: [
    ['Based in', 'Greater Noida, India — working with clients anywhere'],
    ['Builds', 'Marketing sites, web apps, dashboards, internal tools'],
    ['Currently', 'Technical Operations Engineer at SpeedoExpress'],
    ['Open to', 'Freelance projects and contract work'],
  ],
  stats: [
    { label: 'Projects shipped', value: 5, suffix: '' },
    { label: 'Live in production', value: 2, suffix: '' },
    { label: 'Automated tests written', value: 290, suffix: '+' },
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
      'Designed and shipped Speedo CRM (Next.js + Supabase), the calling platform the sales team now works from daily.',
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
    frame: 'faculty-portal — internal deployment',
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
    image: facultyImg,
    github: null,
    live: null,
    demoMailto:
      'vishwajeet.inn@gmail.com?subject=Demo%20request%3A%20Faculty%20Achievement%20Portal',
  },
  {
    id: 'speedo-crm',
    featured: true,
    metric: { value: '170+', label: 'Unit & database tests' },
    frame: 'crm-system-speedo-express.vercel.app',
    title: 'Speedo CRM — Sales Calling Platform',
    client: 'SpeedoExpress',
    problem:
      'The sales team worked leads from spreadsheets: no call history, no follow-up schedule, and duplicate numbers getting called twice by different people.',
    description:
      'A production CRM and daily calling queue. It imports leads, builds a per-caller queue, logs every call and schedules the next follow-up automatically. Deployed on Vercel and in daily use.',
    highlights: [
      'CSV lead import with RFC 4180 parsing, phone normalisation, dedupe and all-or-nothing commits.',
      'Queue generator with priority bands and a D1/D3/D5/D7/D11 follow-up ladder, built as atomic Postgres functions.',
      'Keyboard-driven caller screen, Customer 360 view, admin dashboard, 30s undo and do-not-call suppression.',
      'Typed error handling, guarded API routes, 170+ unit and database tests.',
    ],
    tagline: 'LIVE PRODUCT · NEXT.JS + SUPABASE',
    discipline: 'Internal tool',
    stack: ['Next.js', 'TypeScript', 'Supabase', 'PostgreSQL', 'Tailwind CSS', 'Vitest'],
    image: crmImg,
    github: null,
    live: 'https://crm-system-speedo-express.vercel.app',
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
