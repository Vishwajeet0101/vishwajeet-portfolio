import { motion } from 'framer-motion'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { SectionHeading } from '../components/SectionHeading'
import { useContent } from '../content/useContent'
import { formatDate, readingTime, renderMarkdown } from '../lib/markdown'
import { onLinkClick } from '../lib/router'
import { supabase } from '../lib/supabase'

const MotionLi = motion.li

const POST_FIELDS = 'id, slug, title, excerpt, cover_url, tags, published_at'

function useDocumentTitle(title) {
  useEffect(() => {
    const previous = document.title
    document.title = title
    return () => {
      document.title = previous
    }
  }, [title])
}

function Status({ children }) {
  return <p className="mono py-16 text-sm text-[var(--text-muted)]">{children}</p>
}

export function BlogIndex() {
  const { site } = useContent()
  // Without Supabase there is nothing to load: start at "no posts".
  const [posts, setPosts] = useState(supabase ? null : [])
  const [error, setError] = useState('')
  useDocumentTitle(`Blog | ${site.name}`)

  useEffect(() => {
    if (!supabase) return
    supabase
      .from('posts')
      .select(POST_FIELDS)
      .eq('published', true)
      .order('published_at', { ascending: false })
      .then(({ data, error: err }) => {
        if (err) setError(err.message)
        else setPosts(data)
      })
  }, [])

  return (
    <section className="px-4 pb-16 pt-28 sm:px-6 sm:pb-24 sm:pt-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          index="07"
          label="Blog"
          accent="as I build."
          intro="Notes on the projects, the bugs and the decisions behind them."
        >
          Things I learn
        </SectionHeading>

        {error && <Status>Could not load posts: {error}</Status>}
        {!error && posts === null && <Status>Loading posts…</Status>}
        {posts?.length === 0 && <Status>No posts yet — check back soon.</Status>}

        {posts?.length > 0 && (
          <ul className="mt-10">
            {posts.map((post, index) => (
              <MotionLi
                key={post.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
                className="rule"
              >
                <a
                  href={`/blog/${post.slug}`}
                  onClick={onLinkClick}
                  className="row group -mx-4 flex flex-col gap-5 px-4 py-8 sm:flex-row sm:items-center sm:gap-8"
                >
                  {post.cover_url && (
                    <img
                      src={post.cover_url}
                      alt=""
                      loading="lazy"
                      className="aspect-[16/9] w-full shrink-0 border border-[var(--line)] object-cover sm:w-56"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="label text-[var(--text-muted)]">
                      {formatDate(post.published_at)}
                      {post.tags?.length > 0 && ` · ${post.tags.join(' / ')}`}
                    </p>
                    <h3 className="font-display mt-3 text-xl leading-snug text-[var(--text-primary)] sm:text-2xl">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="mt-3 line-clamp-2 max-w-2xl text-[15px] leading-relaxed text-[var(--text-muted)]">
                        {post.excerpt}
                      </p>
                    )}
                  </div>
                  <ArrowUpRight className="hidden h-5 w-5 shrink-0 text-[var(--text-muted)] transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent sm:block" />
                </a>
              </MotionLi>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}

/** Rendered with key={slug}, so moving to another post starts from scratch. */
export function BlogPost({ slug }) {
  const { site } = useContent()
  // undefined = loading, null = not found.
  const [post, setPost] = useState(supabase ? undefined : null)
  const [error, setError] = useState('')
  useDocumentTitle(post ? `${post.title} | ${site.name}` : `Blog | ${site.name}`)

  useEffect(() => {
    if (!supabase) return
    supabase
      .from('posts')
      .select(`${POST_FIELDS}, content`)
      .eq('slug', slug)
      .eq('published', true)
      .maybeSingle()
      .then(({ data, error: err }) => {
        if (err) setError(err.message)
        else setPost(data)
      })
  }, [slug])

  const html = useMemo(() => (post ? renderMarkdown(post.content) : ''), [post])

  return (
    <article className="px-4 pb-16 pt-28 sm:px-6 sm:pb-24 sm:pt-32">
      <div className="mx-auto max-w-3xl">
        <a href="/blog" onClick={onLinkClick} className="label inline-flex items-center gap-2 text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]">
          <ArrowLeft className="h-3.5 w-3.5" />
          All posts
        </a>

        {error && <Status>Could not load this post: {error}</Status>}
        {!error && post === undefined && <Status>Loading…</Status>}
        {post === null && <Status>This post does not exist, or has not been published yet.</Status>}

        {post && (
          <>
            <p className="label mt-10 text-[var(--text-muted)]">
              {formatDate(post.published_at)} · {readingTime(post.content)}
            </p>
            <h1 className="font-display mt-4 text-[clamp(2rem,5vw,3.25rem)] leading-[1.05] text-[var(--text-primary)]">
              {post.title}
            </h1>
            {post.excerpt && (
              <p className="mt-5 text-lg leading-relaxed text-[var(--text-muted)]">{post.excerpt}</p>
            )}
            {post.tags?.length > 0 && (
              <ul className="mt-6 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <li key={tag} className="chip">
                    {tag}
                  </li>
                ))}
              </ul>
            )}
            {post.cover_url && (
              <img
                src={post.cover_url}
                alt=""
                className="mt-10 aspect-[16/9] w-full border border-[var(--line)] object-cover"
              />
            )}
            <div className="prose-post mt-10" dangerouslySetInnerHTML={{ __html: html }} />
          </>
        )}
      </div>
    </article>
  )
}
