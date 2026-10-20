import { motion } from 'framer-motion'
import { ArrowUpRight, Check, Copy, Mail, Send } from 'lucide-react'
import { useState } from 'react'
import { IconGitHub, IconLinkedIn, IconX } from '../components/BrandIcons'
import { useClock } from '../hooks/useClock'
import { SITE } from '../utils/constants'

const MotionDiv = motion.div
const MotionH2 = motion.h2
const MotionP = motion.p

const INITIAL_FORM = { name: '', email: '', kind: 'Website', budget: '', message: '' }

const PROJECT_KINDS = [
  'Website',
  'Web application',
  'Dashboard / internal tool',
  'Backend / API',
  'Something else',
]

const BUDGETS = ['Not sure yet', 'Under ₹25k', '₹25k – ₹75k', '₹75k – ₹2L', 'Above ₹2L']

/* A direct-channel card: icon, mono label, the value, and a hover arrow.
   min-w-0 on the root matters: as a grid item it would otherwise default to
   min-width:auto and let the long email address push the card past its
   track on a phone, taking the whole page into horizontal scroll. */
function ChannelCard({ icon, label, value, href }) {
  const Icon = icon
  return (
    <a
      href={href}
      target={href.startsWith('mailto:') ? undefined : '_blank'}
      rel="noreferrer"
      className="terminal-panel group flex min-w-0 items-center gap-4 px-4 py-4"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-[var(--line-strong)] text-[var(--text-primary)] transition-colors duration-300 group-hover:border-accent group-hover:text-accent">
        <Icon className="h-4 w-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="label block text-[var(--text-muted)]">{label}</span>
        <span className="mono mt-1.5 block truncate text-[13px] text-[var(--text-primary)]">
          {value}
        </span>
      </span>
      <ArrowUpRight className="h-4 w-4 shrink-0 text-[var(--text-muted)] transition-all duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
    </a>
  )
}

export function Contact() {
  const [copied, setCopied] = useState(false)
  const [form, setForm] = useState(INITIAL_FORM)
  const time = useClock()

  const setField = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  /* No backend, and no pretending there is one: submitting opens the
     visitor's own mail client with everything already filled in. */
  const dispatch = (e) => {
    e.preventDefault()
    const subject = encodeURIComponent(
      `${form.kind} project enquiry — ${form.name || 'a visitor'}`,
    )
    const lines = [
      form.message,
      '',
      `Project type: ${form.kind}`,
      form.budget ? `Budget: ${form.budget}` : null,
      '',
      `— ${form.name}`,
      form.email,
    ].filter((line) => line !== null)
    window.location.href = `mailto:${SITE.email}?subject=${subject}&body=${encodeURIComponent(
      lines.join('\n'),
    )}`
  }

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(SITE.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      window.location.href = `mailto:${SITE.email}`
    }
  }

  return (
    <section id="contact" className="scroll-mt-20 px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        {/* Header row: section pill + status. */}
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="rule flex flex-wrap items-center justify-between gap-4 pt-6"
        >
          <span className="status-pill">
            <span className="text-accent">Section</span> // 06
          </span>
          <span className="status-pill">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            {SITE.availability}
          </span>
        </MotionDiv>

        <MotionH2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
          className="font-display mt-8 max-w-3xl text-[clamp(1.75rem,4vw,3rem)] leading-[1.02] text-[var(--text-primary)]"
        >
          Tell me what you need <span className="em-serif-italic">built.</span>
        </MotionH2>

        <MotionP
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 max-w-2xl text-[15px] leading-relaxed text-[var(--text-muted)] sm:text-base"
        >
          A rough idea is enough to start — I will come back with scope, a timeline and a
          fixed price. Email is the fastest route and I reply within a day.
        </MotionP>

        {/* ------------------------------------------- direct communications */}
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10"
        >
          <p className="label text-[var(--text-muted)]">
            <span className="text-accent">//</span> direct channels
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <ChannelCard
              icon={Mail}
              label="Direct email"
              value={SITE.email}
              href={`mailto:${SITE.email}`}
            />
            {SITE.linkedin && (
              <ChannelCard
                icon={IconLinkedIn}
                label="LinkedIn"
                value={SITE.linkedin.replace('https://www.', '').replace(/\/$/, '')}
                href={SITE.linkedin}
              />
            )}
            <ChannelCard
              icon={IconGitHub}
              label="GitHub repositories"
              value={SITE.github.replace('https://', '')}
              href={SITE.github}
            />
            {SITE.x && (
              <ChannelCard
                icon={IconX}
                label="X (Twitter)"
                value={SITE.x.replace('https://', '')}
                href={SITE.x}
              />
            )}
            <button
              type="button"
              onClick={copyEmail}
              className="terminal-panel group flex min-w-0 items-center gap-4 px-4 py-4 text-left"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-[var(--line-strong)] text-[var(--text-primary)] transition-colors duration-300 group-hover:border-accent group-hover:text-accent">
                {copied ? (
                  <Check className="h-4 w-4 text-accent" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </span>
              <span className="min-w-0 flex-1">
                <span className="label block text-[var(--text-muted)]">
                  {copied ? 'Copied to clipboard' : 'Copy email'}
                </span>
                <span className="mono mt-1.5 block truncate text-[13px] text-[var(--text-primary)]">
                  {SITE.email}
                </span>
              </span>
            </button>
          </div>
        </MotionDiv>

        {/* ------------------------------------------------- enquiry form */}
        <MotionDiv
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 border border-[var(--line)] bg-[var(--surface-1)]"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--line)] px-5 py-3">
            <span className="label text-[var(--text-primary)]">[project_enquiry]</span>
            <span className="label text-[var(--text-muted)]">reply &lt; 24h · {time} IST</span>
          </div>

          <form onSubmit={dispatch} className="px-5 py-8">
            <div className="grid gap-6 sm:grid-cols-2">
              <label className="field">
                <span className="label text-[var(--text-muted)]">Name</span>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={setField('name')}
                  placeholder="Your name"
                  autoComplete="name"
                />
              </label>
              <label className="field">
                <span className="label text-[var(--text-muted)]">Email</span>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={setField('email')}
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </label>
              <label className="field">
                <span className="label text-[var(--text-muted)]">Project type</span>
                <select value={form.kind} onChange={setField('kind')}>
                  {PROJECT_KINDS.map((kind) => (
                    <option key={kind} value={kind}>
                      {kind}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field">
                <span className="label text-[var(--text-muted)]">Budget (optional)</span>
                <select value={form.budget} onChange={setField('budget')}>
                  <option value="">Prefer not to say</option>
                  {BUDGETS.map((band) => (
                    <option key={band} value={band}>
                      {band}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <label className="field mt-6">
              <span className="label text-[var(--text-muted)]">What are you building?</span>
              <textarea
                required
                rows={4}
                value={form.message}
                onChange={setField('message')}
                placeholder="A few lines on the project, who it is for, and any deadline."
              />
            </label>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <button type="submit" className="btn-pill btn-pill-accent">
                Send enquiry
                <Send className="h-3.5 w-3.5" />
              </button>
              {/* Said plainly, because the button does not post anywhere. */}
              <p className="mono text-[12px] leading-5 text-[var(--text-muted)]">
                Opens your mail app with this message ready to send.
              </p>
            </div>
          </form>
        </MotionDiv>
      </div>
    </section>
  )
}
