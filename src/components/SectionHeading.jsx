import { motion } from 'framer-motion'

/**
 * Editorial section header: a hairline rule, a numbered mono label in the
 * left margin, and the title in the wide column beside it.
 */
export function SectionHeading({ index, label, children, intro, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`rule grid gap-x-8 gap-y-6 pt-6 lg:grid-cols-12 ${className}`}
    >
      <p className="label flex items-baseline gap-3 text-[var(--text-muted)] lg:col-span-3">
        <span className="text-accent">{index}</span>
        <span className="h-px w-6 shrink-0 translate-y-[-3px] bg-[var(--line-strong)]" />
        <span>{label}</span>
      </p>

      <div className="lg:col-span-9">
        <h2 className="font-display max-w-3xl text-[2rem] font-semibold leading-[1.08] text-[var(--text-primary)] sm:text-5xl">
          {children}
        </h2>
        {intro && (
          <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-[var(--text-muted)] sm:text-base">
            {intro}
          </p>
        )}
      </div>
    </motion.div>
  )
}
