import { ArrowLeft, Eye, ImagePlus, Loader2, Pencil, Plus, Save, Trash2 } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { supabase, uploadImage } from '../lib/supabase'
import { formatDate, renderMarkdown } from '../lib/markdown'
import { FieldLabel, ImageInput } from './fields'

const EMPTY_POST = {
  title: '',
  slug: '',
  excerpt: '',
  cover_url: '',
  content: '',
  tags: [],
  published: false,
  published_at: null,
}

/** Every post, drafts included — RLS only returns drafts to the admin. */
function fetchPosts() {
  return supabase.from('posts').select('*').order('created_at', { ascending: false })
}

function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

function PostEditor({ post, onDone }) {
  const [draft, setDraft] = useState(() => ({ ...EMPTY_POST, ...post }))
  const [tagText, setTagText] = useState(() => (post.tags || []).join(', '))
  // A new post's slug follows its title until the slug is edited by hand.
  const [slugTouched, setSlugTouched] = useState(Boolean(post.id))
  const [preview, setPreview] = useState(false)
  const [busy, setBusy] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const contentRef = useRef(null)
  const fileRef = useRef(null)

  const set = (key) => (value) => setDraft((d) => ({ ...d, [key]: value }))
  const html = useMemo(() => (preview ? renderMarkdown(draft.content) : ''), [preview, draft.content])

  const onTitle = (e) => {
    const title = e.target.value
    setDraft((d) => ({ ...d, title, slug: slugTouched ? d.slug : slugify(title) }))
  }

  /* Uploads an image and drops its markdown at the cursor. */
  const insertImage = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setUploading(true)
    setError('')
    try {
      const url = await uploadImage(file, 'blog')
      const el = contentRef.current
      const at = el ? el.selectionStart : draft.content.length
      const snippet = `\n![${file.name.replace(/\.[^.]+$/, '')}](${url})\n`
      setDraft((d) => ({ ...d, content: d.content.slice(0, at) + snippet + d.content.slice(at) }))
    } catch (err) {
      setError(`Upload failed: ${err.message}`)
    } finally {
      setUploading(false)
    }
  }

  const save = async (publish = draft.published) => {
    setError('')
    if (!draft.title.trim()) return setError('Give the post a title.')
    const slug = slugify(draft.slug || draft.title)
    if (!slug) return setError('The slug needs at least one letter or number.')

    setBusy(true)
    const row = {
      title: draft.title.trim(),
      slug,
      excerpt: draft.excerpt.trim(),
      cover_url: draft.cover_url || null,
      content: draft.content,
      tags: tagText
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      published: publish,
      // Keeps the original date when a post is edited after going live.
      published_at: publish ? draft.published_at || new Date().toISOString() : draft.published_at,
    }
    const query = post.id
      ? supabase.from('posts').update(row).eq('id', post.id)
      : supabase.from('posts').insert(row)
    const { error: err } = await query
    setBusy(false)
    if (err) {
      setError(err.code === '23505' ? `Another post already uses the slug “${slug}”.` : err.message)
      return
    }
    onDone()
  }

  return (
    <div>
      <button type="button" className="admin-btn" onClick={onDone}>
        <ArrowLeft className="h-3.5 w-3.5" />
        All posts
      </button>

      <div className="mt-8 grid gap-5">
        <FieldLabel label="Title">
          <input className="admin-input text-lg" value={draft.title} onChange={onTitle} />
        </FieldLabel>
        <div className="grid gap-5 sm:grid-cols-2">
          <FieldLabel label="URL slug" hint={`/blog/${slugify(draft.slug || draft.title) || '…'}`}>
            <input
              className="admin-input mono"
              value={draft.slug}
              onChange={(e) => {
                setSlugTouched(true)
                set('slug')(e.target.value)
              }}
            />
          </FieldLabel>
          <FieldLabel label="Tags" hint="Comma-separated">
            <input className="admin-input" value={tagText} onChange={(e) => setTagText(e.target.value)} />
          </FieldLabel>
        </div>
        <FieldLabel label="Excerpt" hint="One or two sentences for the blog list.">
          <textarea className="admin-input" rows={2} value={draft.excerpt} onChange={(e) => set('excerpt')(e.target.value)} />
        </FieldLabel>
        <FieldLabel label="Cover image">
          <ImageInput value={draft.cover_url} onChange={set('cover_url')} folder="blog" />
        </FieldLabel>

        <div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="label text-[var(--text-muted)]">Content (Markdown)</span>
            <div className="flex gap-2">
              <button type="button" className="admin-btn" disabled={uploading || preview} onClick={() => fileRef.current?.click()}>
                {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ImagePlus className="h-3.5 w-3.5" />}
                Insert image
              </button>
              <button type="button" className="admin-btn" onClick={() => setPreview((p) => !p)}>
                {preview ? <Pencil className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                {preview ? 'Write' : 'Preview'}
              </button>
            </div>
          </div>
          <input ref={fileRef} type="file" accept="image/*" hidden onChange={insertImage} />
          {preview ? (
            <div
              className="prose-post mt-3 min-h-[24rem] border border-[var(--line)] p-5"
              dangerouslySetInnerHTML={{ __html: html || '<p>Nothing to preview yet.</p>' }}
            />
          ) : (
            <textarea
              ref={contentRef}
              className="admin-input mono mt-3 min-h-[24rem] text-sm"
              value={draft.content}
              placeholder={'## A heading\n\nWrite in **Markdown**. Links, lists, `code` and images all work.'}
              onChange={(e) => set('content')(e.target.value)}
            />
          )}
        </div>
      </div>

      <div className="sticky bottom-0 mt-8 flex flex-wrap items-center gap-3 border-t border-[var(--line)] bg-[var(--page-bg)] py-4">
        {draft.published ? (
          <>
            <button type="button" className="admin-btn admin-btn-primary" disabled={busy} onClick={() => save(true)}>
              {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
              Update post
            </button>
            <button type="button" className="admin-btn" disabled={busy} onClick={() => save(false)}>
              Unpublish
            </button>
          </>
        ) : (
          <>
            <button type="button" className="admin-btn admin-btn-primary" disabled={busy} onClick={() => save(true)}>
              {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
              Publish
            </button>
            <button type="button" className="admin-btn" disabled={busy} onClick={() => save(false)}>
              Save draft
            </button>
          </>
        )}
        {error && <p className="text-sm text-red-400">{error}</p>}
      </div>
    </div>
  )
}

export function BlogAdmin() {
  const [posts, setPosts] = useState(null)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState(null)

  const show = useCallback(({ data, error: err }) => {
    if (err) setError(err.message)
    else setPosts(data)
  }, [])

  const load = useCallback(() => fetchPosts().then(show), [show])

  useEffect(() => {
    fetchPosts().then(show)
  }, [show])

  const remove = async (post) => {
    if (!window.confirm(`Delete “${post.title}”? This cannot be undone.`)) return
    const { error: err } = await supabase.from('posts').delete().eq('id', post.id)
    if (err) setError(err.message)
    else load()
  }

  if (editing) {
    return (
      <PostEditor
        post={editing}
        onDone={() => {
          setEditing(null)
          load()
        }}
      />
    )
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl text-[var(--text-primary)]">Blog</h2>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            Drafts are only visible to you. Published posts appear at /blog.
          </p>
        </div>
        <button type="button" className="admin-btn admin-btn-primary" onClick={() => setEditing({})}>
          <Plus className="h-3.5 w-3.5" />
          New post
        </button>
      </div>

      {error && <p className="mt-6 text-sm text-red-400">{error}</p>}
      {posts === null && !error && <Loader2 className="mt-8 h-5 w-5 animate-spin text-[var(--text-muted)]" />}
      {posts?.length === 0 && <p className="mt-8 text-sm text-[var(--text-muted)]">No posts yet. Write your first one.</p>}

      {posts?.length > 0 && (
        <ul className="mt-8 border-t border-[var(--line)]">
          {posts.map((post) => (
            <li key={post.id} className="flex flex-wrap items-center gap-4 border-b border-[var(--line)] py-4">
              <span
                className={`label shrink-0 border px-2 py-1 ${
                  post.published ? 'border-accent text-accent' : 'border-[var(--line)] text-[var(--text-muted)]'
                }`}
              >
                {post.published ? 'Live' : 'Draft'}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[var(--text-primary)]">{post.title}</p>
                <p className="mono mt-1 text-xs text-[var(--text-muted)]">
                  /blog/{post.slug}
                  {post.published_at && ` · ${formatDate(post.published_at)}`}
                </p>
              </div>
              {post.published && (
                <a href={`/blog/${post.slug}`} target="_blank" rel="noreferrer" className="admin-btn">
                  <Eye className="h-3.5 w-3.5" />
                  View
                </a>
              )}
              <button type="button" className="admin-btn" onClick={() => setEditing(post)}>
                <Pencil className="h-3.5 w-3.5" />
                Edit
              </button>
              <button type="button" className="admin-btn admin-btn-danger px-2" onClick={() => remove(post)} aria-label={`Delete ${post.title}`}>
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
