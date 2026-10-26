import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

/**
 * Null when the env vars are missing — the site then renders the defaults in
 * utils/constants.js, and the admin page says what is missing.
 */
export const supabase = url && key ? createClient(url, key) : null

export const BUCKET = 'portfolio'

/** Uploads a file to the public bucket and returns its public URL. */
export async function uploadImage(file, folder = 'uploads') {
  const ext = file.name.split('.').pop()?.toLowerCase() || 'bin'
  const path = `${folder}/${crypto.randomUUID()}.${ext}`
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { cacheControl: '31536000', contentType: file.type })
  if (error) throw error
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl
}
