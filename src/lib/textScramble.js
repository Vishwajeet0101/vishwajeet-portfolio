/**
 * Hover scramble: the word under a mouse cursor briefly cycles through random
 * characters, then resolves back left to right.
 *
 * It works on the text nodes the browser already has — the word is found
 * with caretPositionFromPoint, so nothing is wrapped in spans and React's
 * markup is untouched. Each frame rewrites the node's value, and the last
 * frame always puts the exact original string back.
 *
 * Replacement characters keep the original's case (and digits stay digits)
 * so the word's width barely moves and lines don't reflow while it plays.
 */

const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const LOWER = 'abcdefghijklmnopqrstuvwxyz'
const DIGITS = '0123456789'
const WORD_CHAR = /[\p{L}\p{N}]/u

const FRAME_MS = 32
const MIN_LEN = 2

// Never scramble what someone is typing into, numbers that animate on their
// own, or anything explicitly opted out.
const SKIP = 'input, textarea, select, [contenteditable], .tabular-nums, [data-no-scramble]'

const pick = (set) => set[Math.floor(Math.random() * set.length)]

function randomLike(ch) {
  if (UPPER.includes(ch)) return pick(UPPER)
  if (LOWER.includes(ch)) return pick(LOWER)
  if (DIGITS.includes(ch)) return pick(DIGITS)
  return ch
}

function caretAt(x, y) {
  if (document.caretPositionFromPoint) {
    const pos = document.caretPositionFromPoint(x, y)
    return pos && { node: pos.offsetNode, offset: pos.offset }
  }
  if (document.caretRangeFromPoint) {
    const range = document.caretRangeFromPoint(x, y)
    return range && { node: range.startContainer, offset: range.startOffset }
  }
  return null
}

/** The word under (x, y), or null when the pointer isn't actually on one. */
function wordAt(x, y) {
  const caret = caretAt(x, y)
  if (!caret || caret.node.nodeType !== Node.TEXT_NODE) return null
  const { node } = caret
  if (node.parentElement?.closest(SKIP)) return null

  const text = node.nodeValue
  let start = caret.offset
  let end = caret.offset
  while (start > 0 && WORD_CHAR.test(text[start - 1])) start--
  while (end < text.length && WORD_CHAR.test(text[end])) end++
  if (end - start < MIN_LEN) return null

  // The caret API snaps to the nearest text even over empty space, so
  // confirm the pointer is inside the word's own box.
  const range = document.createRange()
  range.setStart(node, start)
  range.setEnd(node, end)
  const inside = [...range.getClientRects()].some(
    (r) => x >= r.left && x <= r.right && y >= r.top && y <= r.bottom,
  )
  return inside ? { node, start, end } : null
}

export function startTextScramble() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
  /** One running animation per text node: node -> { original, timer } */
  const running = new Map()
  let current = null // the word the pointer is on, so it plays once per visit

  const restore = (node) => {
    const job = running.get(node)
    if (!job) return
    clearInterval(job.timer)
    node.nodeValue = job.original
    running.delete(node)
  }

  const scramble = ({ node, start, end }) => {
    restore(node)
    const original = node.nodeValue
    const word = original.slice(start, end)
    // Each letter settles a little after the one before it, with jitter.
    const settleAt = [...word].map((_, i) => i * 1.4 + 3 + Math.random() * 4)
    let frame = 0

    const timer = setInterval(() => {
      // React replaced the text since we started — leave its value alone.
      if (!node.isConnected) {
        clearInterval(timer)
        running.delete(node)
        return
      }
      frame++
      let out = ''
      let done = true
      for (let i = 0; i < word.length; i++) {
        if (frame >= settleAt[i]) out += word[i]
        else {
          out += randomLike(word[i])
          done = false
        }
      }
      if (done) restore(node)
      else node.nodeValue = original.slice(0, start) + out + original.slice(end)
    }, FRAME_MS)

    running.set(node, { original, timer })
  }

  let queued = null
  const onMove = (e) => {
    if (e.pointerType !== 'mouse' || reduce.matches) return
    // At most one hit-test per animation frame.
    if (queued) return
    const { clientX: x, clientY: y } = e
    queued = requestAnimationFrame(() => {
      queued = null
      const hit = wordAt(x, y)
      if (!hit) {
        current = null
        return
      }
      const same = current && current.node === hit.node && current.start === hit.start
      if (same) return
      current = hit
      scramble(hit)
    })
  }

  document.addEventListener('pointermove', onMove, { passive: true })
  return () => {
    document.removeEventListener('pointermove', onMove)
    if (queued) cancelAnimationFrame(queued)
    for (const node of [...running.keys()]) restore(node)
  }
}
