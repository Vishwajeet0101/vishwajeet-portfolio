import { createContext, useContext } from 'react'
import {
  ABOUT,
  EXPERIENCE,
  LEARNING,
  PROCESS,
  PROJECTS,
  SITE,
  SKILL_GROUPS,
} from '../utils/constants'

/** Every editable block, keyed the same as its row in `site_content`. */
export const DEFAULTS = {
  site: SITE,
  about: ABOUT,
  learning: LEARNING,
  skills: SKILL_GROUPS,
  experience: EXPERIENCE,
  projects: PROJECTS,
  process: PROCESS,
}

/* Objects merge over their defaults so a field added to the code later still
   has a value; lists replace wholesale, because removing an item is an edit. */
export function mergeContent(saved) {
  const out = {}
  for (const [key, fallback] of Object.entries(DEFAULTS)) {
    const value = saved[key]
    if (value == null) out[key] = fallback
    else if (Array.isArray(fallback)) out[key] = Array.isArray(value) ? value : fallback
    else out[key] = { ...fallback, ...value }
  }
  return out
}

export const ContentContext = createContext(null)

/**
 * The page's content: each DEFAULTS key resolved against Supabase, plus
 * `saved` (the raw rows) and `refresh()` to re-fetch after an edit.
 */
export function useContent() {
  const ctx = useContext(ContentContext)
  if (!ctx) throw new Error('useContent must be used inside <ContentProvider>')
  return ctx
}
