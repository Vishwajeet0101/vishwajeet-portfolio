import DOMPurify from 'dompurify'
import { marked } from 'marked'

/** Markdown in, sanitised HTML out — used by the blog and the admin preview. */
export function renderMarkdown(markdown) {
  return DOMPurify.sanitize(marked.parse(markdown || '', { gfm: true }))
}

export function formatDate(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

/** Rough reading time at ~220 words a minute. */
export function readingTime(markdown) {
  const words = (markdown || '').trim().split(/\s+/).filter(Boolean).length
  return `${Math.max(1, Math.round(words / 220))} min read`
}
