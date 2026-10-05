import { motion } from 'framer-motion'
import { ArrowUpRight, Check, Copy, Send } from 'lucide-react'
import { useState } from 'react'
import { IconGitHub, IconLinkedIn, IconX } from '../components/BrandIcons'
import { SectionHeading } from '../components/SectionHeading'
import { useClock } from '../hooks/useClock'
import { SITE } from '../utils/constants'

const INITIAL_FORM = { name: '', email: '', message: '' }

export function Contact() {
  const [copied, setCopied] = useState(false)
  const [form, setForm] = useState(INITIAL_FORM)
  const time = useClock()

  const setField = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  // No backend needed: the compose window opens pre-filled with the message.
  const dispatch = (e) => {
    e.preventDefault()
    const subject = encodeURIComponent(`Portfolio inquiry from ${form.name || 'a visitor'}`)
    const body = encodeURIComponent(`${form.message}\n\n— ${form.name}\n${form.email}`)
    window.location.href = `mailto:${SITE.email}?subject=${subject}&body=${body}`
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
    <section id="contact" className="scroll-mt-20 px-4 py-24 sm:px-6 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          index="05"
          label="Contact"
          intro="Hiring for an internship or entry-level role, or have a project in mind? The fastest way to reach me is email — I reply within a day."
        >
          Let&apos;s work together
        </SectionHeading>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mt-14"
        >
          <div className="rule">
            <a
              href={`mailto:${SITE.email}`}
              className="row group -mx-4 flex flex-wrap items-center justify-between gap-6 px-4 py-10 transition-[padding] duration-500 hover:pl-6 sm:py-14"
            >
              <span className="font-display break-all text-[clamp(1.5rem,5.5vw,3.5rem)] font-semibold leading-[1.05] text-[var(--text-primary)]">
                {SITE.email}
              </span>
              <ArrowUpRight className="h-7 w-7 shrink-0 text-[var(--text-muted)] transition-all duration-500 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-accent sm:h-10 sm:w-10" />
            </a>
          </div>

          <div className="rule grid gap-x-8 gap-y-12 py-12 lg:grid-cols-12">
            {/* Inline message dispatch — Stitch's contact form, mailto-powered. */}
            <form onSubmit={dispatch} className="lg:col-span-7">
              <p className="label text-[var(--text-muted)]">Send a message</p>
              <div className="mt-6 grid gap-6 sm:grid-cols-2">
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
              </div>
              <label className="field mt-6">
                <span className="label text-[var(--text-muted)]">Message</span>
                <textarea
                  required
                  rows={4}
                  value={form.message}
                  onChange={setField('message')}
                  placeholder="What are you working on?"
                />
              </label>
              <button type="submit" className="btn btn-solid mt-8">
                Dispatch message
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>

            {/* Direct channels column. */}
            <div className="lg:col-span-5 lg:col-start-8">
              <p className="label text-[var(--text-muted)]">Direct</p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button type="button" onClick={copyEmail} className="btn">
                  {copied ? (
                    <Check className="h-3.5 w-3.5 text-accent" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                  {copied ? 'Copied' : 'Copy email'}
                </button>
                <a href={SITE.github} target="_blank" rel="noreferrer" className="btn">
                  <IconGitHub className="h-3.5 w-3.5" />
                  GitHub
                </a>
                {SITE.linkedin && (
                  <a href={SITE.linkedin} target="_blank" rel="noreferrer" className="btn">
                    <IconLinkedIn className="h-3.5 w-3.5" />
                    LinkedIn
                  </a>
                )}
                {SITE.x && (
                  <a href={SITE.x} target="_blank" rel="noreferrer" className="btn">
                    <IconX className="h-3.5 w-3.5" />
                    X
                  </a>
                )}
              </div>
              <p className="mono mt-8 text-[13px] leading-relaxed text-[var(--text-muted)]">
                {SITE.location} · {time} IST
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
