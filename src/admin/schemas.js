import { PROJECT_IMAGES } from '../utils/constants'

/**
 * Gives every object in a `list` field an id (recursively), so list rows keep
 * a stable React key — and their inputs' local state — when reordered.
 */
export function withIds(schema, value) {
  const out = { ...value }
  for (const field of schema) {
    const v = out[field.key]
    if (field.type === 'list' && Array.isArray(v)) {
      out[field.key] = v.map((item) => withIds(field.fields, { id: crypto.randomUUID(), ...item }))
    } else if (field.type === 'object' && v) {
      out[field.key] = withIds(field.fields, v)
    }
  }
  return out
}

/**
 * One entry per admin tab. `key` is the row in `site_content`; `list: true`
 * means the stored value is the list itself rather than an object.
 */

const experienceFields = [
  { key: 'role', label: 'Role / job title', half: true },
  { key: 'company', label: 'Company', half: true },
  { key: 'companyNote', label: 'Company note', hint: 'e.g. industry', half: true },
  { key: 'type', label: 'Type', placeholder: 'Full-time, Internship…', half: true },
  {
    key: 'period',
    label: 'Period',
    placeholder: 'Jan 2026 – Present',
    hint: 'Include “Present” to mark it as your current role.',
    half: true,
  },
  { key: 'mark', label: 'Monogram', hint: 'One letter, shown when there is no logo', half: true },
  { key: 'logo', label: 'Company logo (optional)', type: 'image', folder: 'logos' },
  { key: 'highlights', label: 'Highlights', type: 'lines', hint: 'One bullet per line' },
  { key: 'skills', label: 'Skills used', type: 'tags', hint: 'Comma-separated' },
]

const projectFields = [
  { key: 'title', label: 'Title' },
  {
    key: 'featured',
    label: 'Featured case study',
    type: 'checkbox',
    hint: 'big card with screenshot; otherwise listed under “Also built”',
  },
  {
    key: 'image',
    label: 'Screenshot',
    type: 'image',
    folder: 'projects',
    fallback: (project) => PROJECT_IMAGES[project.id],
  },
  { key: 'description', label: 'Description', type: 'textarea' },
  { key: 'stack', label: 'Tech stack', type: 'tags', hint: 'Comma-separated' },
  { key: 'live', label: 'Live URL', type: 'url', half: true },
  { key: 'github', label: 'GitHub URL', type: 'url', half: true },
  { key: 'client', label: 'Built for (client)', hint: 'Featured only', half: true },
  { key: 'discipline', label: 'Discipline', placeholder: 'Web application', hint: 'Featured only', half: true },
  { key: 'tagline', label: 'Tagline under screenshot', hint: 'Featured only', half: true },
  { key: 'frame', label: 'Browser-bar text', placeholder: 'example.com', hint: 'Featured only', half: true },
  { key: 'problem', label: 'The problem', type: 'textarea', hint: 'Featured only' },
  { key: 'highlights', label: 'Highlights', type: 'lines', hint: 'One per line' },
  {
    key: 'metric',
    label: 'Headline metric (featured only)',
    type: 'object',
    fields: [
      { key: 'value', label: 'Value', placeholder: '126/126', half: true },
      { key: 'label', label: 'Label', placeholder: 'Automated tests passing', half: true },
    ],
  },
]

export const SECTIONS = [
  {
    key: 'site',
    title: 'Profile',
    intro: 'Your name, headline, contact links and portrait.',
    schema: [
      { key: 'name', label: 'Full name', half: true },
      { key: 'title', label: 'Title', half: true },
      { key: 'role', label: 'Current role', half: true },
      { key: 'location', label: 'Location', half: true },
      { key: 'tagline', label: 'Hero intro', type: 'textarea', rows: 3 },
      { key: 'availability', label: 'Availability line', placeholder: 'Available for freelance projects' },
      { key: 'portrait', label: 'Portrait photo', type: 'image', folder: 'portrait', hint: 'Empty uses the bundled photo.' },
      { key: 'email', label: 'Email', type: 'email', half: true },
      { key: 'github', label: 'GitHub URL', type: 'url', half: true },
      { key: 'linkedin', label: 'LinkedIn URL', type: 'url', half: true },
      { key: 'x', label: 'X / Twitter URL', type: 'url', half: true },
    ],
  },
  {
    key: 'about',
    title: 'About',
    intro: 'The About section: summary, numbers, quick facts and education.',
    schema: [
      { key: 'summary', label: 'Summary', type: 'textarea', rows: 7 },
      {
        key: 'stats',
        label: 'Stats (the first three also appear in the hero)',
        type: 'list',
        addLabel: 'Add stat',
        itemTitle: (s) => (s.label ? `${s.value}${s.suffix || ''} — ${s.label}` : ''),
        newItem: () => ({ label: '', value: 0, suffix: '' }),
        fields: [
          { key: 'label', label: 'Label' },
          { key: 'value', label: 'Number', type: 'number', half: true },
          { key: 'suffix', label: 'Suffix', placeholder: '+, h, %…', half: true },
        ],
      },
      {
        key: 'facts',
        label: 'At a glance',
        type: 'list',
        addLabel: 'Add fact',
        itemTitle: (f) => f.label,
        newItem: () => ({ label: '', value: '' }),
        fields: [
          { key: 'label', label: 'Label', half: true },
          { key: 'value', label: 'Value', half: true },
        ],
      },
      {
        key: 'education',
        label: 'Education',
        type: 'object',
        fields: [
          { key: 'degree', label: 'Degree' },
          { key: 'school', label: 'School', half: true },
          { key: 'period', label: 'Period', half: true },
        ],
      },
    ],
  },
  {
    key: 'skills',
    title: 'Skills',
    intro: 'Skill groups shown in the Skills section.',
    list: true,
    schema: [
      {
        key: 'value',
        type: 'list',
        addLabel: 'Add skill group',
        itemTitle: (g) => g.title,
        newItem: () => ({ title: '', skills: [] }),
        fields: [
          { key: 'title', label: 'Group name' },
          { key: 'skills', label: 'Skills', type: 'tags', hint: 'Comma-separated' },
        ],
      },
    ],
  },
  {
    key: 'learning',
    title: 'Learning',
    intro: '“Currently levelling up” chips in the About section.',
    list: true,
    schema: [{ key: 'value', label: 'Topics', type: 'tags', hint: 'Comma-separated' }],
  },
  {
    key: 'experience',
    title: 'Experience',
    intro: 'Jobs and roles, newest first.',
    list: true,
    schema: [
      {
        key: 'value',
        type: 'list',
        addLabel: 'Add job',
        itemTitle: (j) => [j.role, j.company].filter(Boolean).join(' · '),
        newItem: () => ({
          role: '',
          company: '',
          companyNote: '',
          type: 'Full-time',
          period: '',
          mark: '',
          logo: '',
          highlights: [],
          skills: [],
        }),
        fields: experienceFields,
      },
    ],
  },
  {
    key: 'projects',
    title: 'Projects',
    intro: 'Featured case studies first, then the rest.',
    list: true,
    schema: [
      {
        key: 'value',
        type: 'list',
        addLabel: 'Add project',
        itemTitle: (p) => (p.featured ? `★ ${p.title}` : p.title),
        newItem: () => ({
          title: '',
          featured: false,
          description: '',
          stack: [],
          image: '',
          live: null,
          github: null,
        }),
        fields: projectFields,
      },
    ],
  },
  {
    key: 'process',
    title: 'Process',
    intro: 'The steps in the Work process section.',
    list: true,
    schema: [
      {
        key: 'value',
        type: 'list',
        addLabel: 'Add step',
        itemTitle: (p) => [p.step, p.title].filter(Boolean).join('  '),
        newItem: () => ({ step: '', title: '', duration: '', summary: '' }),
        fields: [
          { key: 'step', label: 'Step number', placeholder: '05', half: true },
          { key: 'duration', label: 'Duration', half: true },
          { key: 'title', label: 'Title' },
          { key: 'summary', label: 'Summary', type: 'textarea' },
        ],
      },
    ],
  },
]
