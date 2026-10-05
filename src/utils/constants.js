/** Set `linkedin` / `x` to your profile URLs to show those links; leave empty to hide them. */
export const SITE = {
  name: 'Vishwajeet Kumar Nishad',
  title: 'Full-Stack Developer',
  email: 'Vishwajeetnishad74@gmail.com',
  linkedin: '',
  x: '',
  github: 'https://github.com/Vishwajeet0101',
  location: 'Greater Noida, India',
}

export const ABOUT = {
  summary: `Full-stack developer who ships real software for real users. I built a role-based Faculty Achievement Portal for NIET on Java 21, Spring Boot and MySQL, and a sales CRM for Speedo Express on Next.js, TypeScript and Supabase that is deployed and in daily use. I care about security, tests and clean architecture as much as polished UI, and I'm actively seeking an internship or entry-level software developer role.`,
  education: {
    degree: 'B.Tech in Computer Science & Engineering',
    school: 'Noida Institute of Engineering and Technology, Greater Noida',
    period: '2024 – Present',
  },
  facts: [
    ['Based in', 'Greater Noida, India'],
    ['Focus', 'Full-stack: Spring Boot, Next.js, React'],
    ['Currently', 'Platform Operations intern @ Speedo Express'],
    ['Looking for', 'Internship / entry-level developer role'],
  ],
  stats: [
    { label: 'Projects shipped', value: 5, suffix: '' },
    { label: 'Automated tests', value: 200, suffix: '+' },
    { label: 'Live deployments', value: 2, suffix: '' },
    { label: 'Internships', value: 2, suffix: '' },
  ],
}

export const EXPERIENCE = [
  {
    id: 'speedo',
    role: 'Platform Operations Manager',
    type: 'Internship',
    company: 'Speedo Express',
    companyNote: 'Logistics',
    period: 'Jan 2026 – Present',
    icon: 'truck',
    highlights: [
      'Designed and shipped Speedo CRM (Next.js + Supabase), the calling platform the sales team now works from.',
      'Managed end-to-end platform operations across customers, delivery partners, and internal teams.',
      'Handled order processing, shipment tracking, and proactive issue resolution.',
      'Supported onboarding and ongoing management of delivery partners and logistics vendors.',
    ],
  },
  {
    id: 'gemini',
    role: 'Google Gemini Ambassador',
    type: 'Internship',
    company: 'Google',
    companyNote: 'Campus / community program',
    period: 'Oct 2025 – Present',
    icon: 'sparkles',
    highlights: [
      'Promoted AI tools and Gemini capabilities among students and developers.',
      'Ran demos, peer sessions, and online outreach with real-world use cases.',
      'Helped peers adopt responsible, practical workflows with Google’s AI stack.',
    ],
  },
]

export const PROJECTS = [
  {
    id: 'faculty-portal',
    featured: true,
    eyebrow: 'Case Study // 01 · Campus Platform',
    metric: { value: '126/126', label: 'Automated tests passing' },
    frame: 'faculty-portal — internal deployment',
    title: 'Faculty Achievement Portal (NIET)',
    description:
      'A centralized, role-based web platform for Noida Institute of Engineering and Technology that replaces paper workflows for faculty achievements: journal publications, patents, research grants, FDPs and awards.',
    highlights: [
      'JWT authentication, BCrypt hashing and role-based access (Faculty / HOD / Admin) with IDOR protection.',
      'HOD verification workflow, admin analytics dashboard, real-time notifications and CSV report export.',
      'Secure PDF proof uploads with magic-byte validation, UUID filenames and an append-only audit trail.',
      'Flyway-managed MySQL schema, Docker + Caddy deployment, 126/126 automated tests passing.',
    ],
    stack: ['Java 21', 'Spring Boot', 'Spring Security', 'JPA / Hibernate', 'MySQL', 'Docker'],
    image: '/project-faculty.svg',
    github: null,
    live: null,
    demoMailto: 'Vishwajeetnishad74@gmail.com?subject=Demo%20request%3A%20Faculty%20Achievement%20Portal',
  },
  {
    id: 'speedo-crm',
    featured: true,
    eyebrow: 'Case Study // 02 · Production CRM',
    metric: { value: '170+', label: 'Unit & database tests' },
    frame: 'crm-system-speedo-express.vercel.app',
    title: 'Speedo CRM: Sales Calling Platform',
    description:
      'A production CRM and daily calling queue for Speedo Express logistics. It imports leads, builds per-caller queues, logs every call and schedules follow-ups automatically. Deployed on Vercel and used by the sales team.',
    highlights: [
      'CSV lead import with RFC 4180 parsing, phone normalisation, dedupe and all-or-nothing commits.',
      'Queue generator with priority bands and a D1/D3/D5/D7/D11 follow-up ladder, built as atomic Postgres functions.',
      'Keyboard-driven caller screen, Customer 360 view, admin dashboard, 30s undo and do-not-call suppression.',
      'Typed Result<T, AppError> error handling, guarded API routes, 170+ unit and database tests.',
    ],
    stack: ['Next.js', 'TypeScript', 'Supabase', 'PostgreSQL', 'Tailwind CSS', 'Vitest'],
    image: '/project-crm.svg',
    github: null,
    live: 'https://crm-system-speedo-express.vercel.app',
  },
  {
    id: 'landslide',
    title: 'Landslide Early Warning Platform',
    description:
      'Early-warning and risk-assessment prototype for Aizawl, Mizoram: rainfall and soil moisture drive slope-failure probability, weighted by exposure, with human verification before any alert. Team lead and backend.',
    stack: ['Node.js', 'PostgreSQL + PostGIS', 'React', 'Python ML', 'Docker'],
    github: 'https://github.com/Vishwajeet0101/landslide-platform',
    live: null,
  },
  {
    id: 'image-encryption',
    title: 'ROI-Based Image Encryption',
    description:
      'Hybrid AI + cryptography system: YOLOv8 finds regions of interest, then chaos-based encryption (SHA-512 keys, CML / PWLCM / STM maps) scrambles only those regions for faster, secure transmission.',
    stack: ['Python', 'YOLOv8', 'NumPy', 'Cryptography'],
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
  { title: 'Languages', skills: ['Java', 'TypeScript', 'JavaScript', 'Python', 'C / C++', 'SQL'] },
  { title: 'Backend', skills: ['Spring Boot', 'Spring Security', 'Node.js', 'REST APIs', 'JWT auth', 'JPA / Hibernate'] },
  { title: 'Frontend', skills: ['React', 'Next.js', 'Tailwind CSS', 'HTML & CSS'] },
  { title: 'Databases', skills: ['MySQL', 'PostgreSQL', 'Supabase', 'PostGIS', 'Flyway'] },
  { title: 'Tools', skills: ['Git & GitHub', 'Docker', 'Vercel', 'Maven', 'JUnit', 'Vitest'] },
]

export const NAV_LINKS = [
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'contact', label: 'Contact' },
]
