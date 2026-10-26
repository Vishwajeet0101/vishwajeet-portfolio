import { ExternalLink, Loader2, LogOut, RotateCcw, Save } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { DEFAULTS, useContent } from '../content/useContent'
import { onLinkClick } from '../lib/router'
import { supabase } from '../lib/supabase'
import { BlogAdmin } from './BlogAdmin'
import { Fields } from './fields'
import { SECTIONS, withIds } from './schemas'

const TABS = [...SECTIONS.map((s) => ({ key: s.key, title: s.title })), { key: 'blog', title: 'Blog' }]

function Shell({ children, wide }) {
  return (
    <div className="font-body min-h-svh px-4 py-10 sm:px-6">
      <div className={`mx-auto ${wide ? 'max-w-6xl' : 'max-w-md'}`}>{children}</div>
    </div>
  )
}

function Notice({ tone = 'muted', children }) {
  const color = tone === 'error' ? 'text-red-400' : tone === 'ok' ? 'text-accent' : 'text-[var(--text-muted)]'
  return <p className={`text-sm ${color}`}>{children}</p>
}

function SignIn() {
  const [mode, setMode] = useState('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState(null)

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setMessage(null)
    const { error } =
      mode === 'signin'
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({
            email,
            password,
            options: { emailRedirectTo: `${window.location.origin}/admin` },
          })
    setBusy(false)
    if (error) setMessage({ tone: 'error', text: error.message })
    else if (mode === 'signup')
      setMessage({
        tone: 'ok',
        text: 'Account created. Open the confirmation email, click the link, then sign in here.',
      })
  }

  return (
    <Shell>
      <p className="label text-[var(--text-muted)]">Portfolio admin</p>
      <h1 className="font-display mt-3 text-3xl text-[var(--text-primary)]">
        {mode === 'signin' ? 'Sign in' : 'Create your admin account'}
      </h1>
      <form onSubmit={submit} className="mt-8 space-y-4">
        <input
          type="email"
          required
          autoComplete="email"
          placeholder="Email"
          className="admin-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          required
          minLength={8}
          autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
          placeholder="Password (8+ characters)"
          className="admin-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="admin-btn admin-btn-primary w-full justify-center py-3" disabled={busy}>
          {busy && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          {mode === 'signin' ? 'Sign in' : 'Create account'}
        </button>
        {message && <Notice tone={message.tone}>{message.text}</Notice>}
      </form>
      <button
        type="button"
        className="link mt-6 text-sm"
        onClick={() => {
          setMode(mode === 'signin' ? 'signup' : 'signin')
          setMessage(null)
        }}
      >
        {mode === 'signin' ? 'First time? Create the admin account' : 'Already have an account? Sign in'}
      </button>
    </Shell>
  )
}

/** Edits one `site_content` row through its schema. */
function SectionEditor({ section }) {
  const content = useContent()
  const stored = content.saved[section.key]
  const current = content[section.key]

  const initial = useMemo(
    () => withIds(section.schema, section.list ? { value: current } : current),
    // Only re-seed the form when the section changes or a save lands.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [section, stored],
  )
  const [draft, setDraft] = useState(initial)
  const [seed, setSeed] = useState(initial)
  // Bumped whenever the draft is replaced wholesale, to remount the inputs
  // that keep their own text state.
  const [revision, setRevision] = useState(0)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState(null)

  if (seed !== initial) {
    setSeed(initial)
    setDraft(initial)
    setRevision((r) => r + 1)
  }

  const discard = () => {
    setDraft(initial)
    setRevision((r) => r + 1)
  }

  const dirty = JSON.stringify(draft) !== JSON.stringify(initial)

  const save = async () => {
    setBusy(true)
    setMessage(null)
    const value = section.list ? draft.value : draft
    const { error } = await supabase
      .from('site_content')
      .upsert({ key: section.key, value }, { onConflict: 'key' })
    if (error) {
      setBusy(false)
      setMessage({ tone: 'error', text: error.message })
      return
    }
    await content.refresh()
    setBusy(false)
    setMessage({ tone: 'ok', text: 'Saved — the live site is updated.' })
  }

  const reset = async () => {
    if (!window.confirm(`Discard your saved ${section.title} content and go back to the built-in default?`)) return
    setBusy(true)
    const { error } = await supabase.from('site_content').delete().eq('key', section.key)
    await content.refresh()
    setBusy(false)
    setMessage(error ? { tone: 'error', text: error.message } : { tone: 'ok', text: 'Reset to default.' })
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl text-[var(--text-primary)]">{section.title}</h2>
          <p className="mt-1 text-sm text-[var(--text-muted)]">{section.intro}</p>
        </div>
        <p className="label text-[var(--text-muted)]">
          {stored == null ? 'Showing built-in defaults' : 'Saved in Supabase'}
        </p>
      </div>

      <div className="mt-8">
        <Fields key={revision} schema={section.schema} value={draft} onChange={setDraft} />
      </div>

      {/* Sticky so Save is reachable at the bottom of a long list. */}
      <div className="sticky bottom-0 mt-8 flex flex-wrap items-center gap-3 border-t border-[var(--line)] bg-[var(--page-bg)] py-4">
        <button type="button" className="admin-btn admin-btn-primary" disabled={!dirty || busy} onClick={save}>
          {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
          Save changes
        </button>
        <button type="button" className="admin-btn" disabled={!dirty || busy} onClick={discard}>
          Discard
        </button>
        {stored != null && DEFAULTS[section.key] && (
          <button type="button" className="admin-btn admin-btn-danger ml-auto" disabled={busy} onClick={reset}>
            <RotateCcw className="h-3.5 w-3.5" />
            Reset to default
          </button>
        )}
        {message && <Notice tone={message.tone}>{message.text}</Notice>}
        {!message && dirty && <Notice>Unsaved changes</Notice>}
      </div>
    </div>
  )
}

function Dashboard({ session }) {
  const [tab, setTab] = useState(() => {
    const hash = window.location.hash.slice(1)
    return TABS.some((t) => t.key === hash) ? hash : 'site'
  })

  useEffect(() => {
    window.history.replaceState(null, '', `#${tab}`)
  }, [tab])

  const section = SECTIONS.find((s) => s.key === tab)

  return (
    <Shell wide>
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--line)] pb-5">
        <div>
          <p className="label text-[var(--text-muted)]">Portfolio admin</p>
          <p className="mt-2 text-sm text-[var(--text-muted)]">Signed in as {session.user.email}</p>
        </div>
        <div className="flex gap-2">
          <a href="/" onClick={onLinkClick} className="admin-btn">
            <ExternalLink className="h-3.5 w-3.5" />
            View site
          </a>
          <button type="button" className="admin-btn" onClick={() => supabase.auth.signOut()}>
            <LogOut className="h-3.5 w-3.5" />
            Sign out
          </button>
        </div>
      </header>

      <nav className="mt-6 flex flex-wrap gap-2" aria-label="Sections">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`admin-btn ${tab === t.key ? 'border-accent text-accent' : ''}`}
            aria-current={tab === t.key ? 'page' : undefined}
          >
            {t.title}
          </button>
        ))}
      </nav>

      <div className="mt-10">
        {section ? <SectionEditor key={section.key} section={section} /> : <BlogAdmin />}
      </div>
    </Shell>
  )
}

export function Admin() {
  // undefined while the stored session is being read.
  const [session, setSession] = useState(supabase ? undefined : null)
  // The answer is tagged with the email it was asked for, so a stale answer
  // never applies to a different account.
  const [adminCheck, setAdminCheck] = useState(null)

  useEffect(() => {
    document.title = 'Admin | Portfolio'
    if (!supabase) return undefined
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data } = supabase.auth.onAuthStateChange((_event, next) => setSession(next))
    return () => data.subscription.unsubscribe()
  }, [])

  const email = session?.user?.email
  useEffect(() => {
    if (!email) return
    supabase.rpc('is_admin').then(({ data }) => setAdminCheck({ email, ok: Boolean(data) }))
  }, [email])
  const isAdmin = email && adminCheck?.email === email ? adminCheck.ok : null

  if (!supabase) {
    return (
      <Shell>
        <h1 className="font-display text-2xl text-[var(--text-primary)]">Supabase is not configured</h1>
        <Notice>
          Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in .env.local (and in the Vercel
          project settings), then restart the dev server.
        </Notice>
      </Shell>
    )
  }

  if (session === undefined || (session && isAdmin === null)) {
    return (
      <Shell>
        <Loader2 className="h-5 w-5 animate-spin text-[var(--text-muted)]" />
      </Shell>
    )
  }

  if (!session) return <SignIn />

  if (!isAdmin) {
    return (
      <Shell>
        <h1 className="font-display text-2xl text-[var(--text-primary)]">Not authorised</h1>
        <div className="mt-4">
          <Notice>
            {session.user.email} is signed in but is not on the admin list, so it cannot edit this
            site.
          </Notice>
        </div>
        <button type="button" className="admin-btn mt-6" onClick={() => supabase.auth.signOut()}>
          Sign out
        </button>
      </Shell>
    )
  }

  return <Dashboard session={session} />
}
