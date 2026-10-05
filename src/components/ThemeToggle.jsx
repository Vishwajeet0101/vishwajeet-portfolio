import { AnimatePresence, motion } from 'framer-motion'
import { Moon, Sun } from 'lucide-react'

export function ThemeToggle({ theme, toggle }) {
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={toggle}
      className="flex h-9 w-9 items-center justify-center border border-[var(--line-strong)] text-[var(--text-primary)] transition hover:bg-[var(--surface-1)]"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={isDark ? 'moon' : 'sun'}
          initial={{ rotate: -60, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          exit={{ rotate: 60, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="flex items-center justify-center"
        >
          {isDark ? (
            <Moon className="h-3.5 w-3.5" strokeWidth={1.75} />
          ) : (
            <Sun className="h-3.5 w-3.5" strokeWidth={1.75} />
          )}
        </motion.span>
      </AnimatePresence>
    </button>
  )
}
