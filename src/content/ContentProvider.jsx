import { useCallback, useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'
import { ContentContext, mergeContent } from './useContent'

const CACHE_KEY = 'portfolio-content-v1'

function readCache() {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY)) || {}
  } catch {
    return {}
  }
}

function writeCache(value) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(value))
  } catch {
    // Private mode or storage full — the cache is only a head start.
  }
}

async function fetchContent() {
  if (!supabase) return null
  const { data, error } = await supabase.from('site_content').select('key, value')
  if (error) {
    console.warn('Could not load site content, using defaults:', error.message)
    return null
  }
  return Object.fromEntries(data.map((row) => [row.key, row.value]))
}

export function ContentProvider({ children }) {
  // The last fetched copy renders first, so a returning visitor never sees
  // the defaults flash before their edits.
  const [saved, setSaved] = useState(readCache)

  const apply = useCallback((next) => {
    if (!next) return
    setSaved(next)
    writeCache(next)
  }, [])

  const refresh = useCallback(() => fetchContent().then(apply), [apply])

  useEffect(() => {
    fetchContent().then(apply)
  }, [apply])

  const value = useMemo(() => ({ ...mergeContent(saved), saved, refresh }), [saved, refresh])

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
}
