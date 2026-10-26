import { ArrowDown, ArrowUp, ImageUp, Loader2, Plus, Trash2, X } from 'lucide-react'
import { useRef, useState } from 'react'
import { uploadImage } from '../lib/supabase'

/* Schema-driven form fields. A schema is a list of
   { key, label, type, ...options }; `list` and `object` nest further schemas,
   so one renderer covers every section of the site. */

export function FieldLabel({ label, hint, children }) {
  return (
    <label className="block">
      <span className="label text-[var(--text-muted)]">{label}</span>
      {hint && <span className="mt-1.5 block text-xs text-[var(--text-muted)] opacity-80">{hint}</span>}
      <div className="mt-2">{children}</div>
    </label>
  )
}

/**
 * A string[] edited as text — comma-separated on one line, or one per line.
 * The raw text lives locally so a trailing comma or blank line survives
 * typing; only the parsed list goes up.
 */
function StringListInput({ value, onChange, multiline, placeholder }) {
  const sep = multiline ? '\n' : ', '
  const [text, setText] = useState(() => (value || []).join(sep))
  const parse = (raw) =>
    raw
      .split(multiline ? '\n' : ',')
      .map((s) => s.trim())
      .filter(Boolean)

  const props = {
    className: 'admin-input',
    value: text,
    placeholder,
    onChange: (e) => {
      setText(e.target.value)
      onChange(parse(e.target.value))
    },
  }
  return multiline ? (
    <textarea rows={Math.max(3, text.split('\n').length + 1)} {...props} />
  ) : (
    <input type="text" {...props} />
  )
}

export function ImageInput({ value, onChange, folder, fallback }) {
  const fileRef = useRef(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const preview = value || fallback

  const onFile = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setBusy(true)
    setError('')
    try {
      onChange(await uploadImage(file, folder))
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
      <div className="flex h-24 w-40 shrink-0 items-center justify-center overflow-hidden border border-[var(--line)] bg-[var(--surface-2)]">
        {preview ? (
          <img src={preview} alt="" className="h-full w-full object-cover" />
        ) : (
          <span className="label text-[var(--text-muted)]">No image</span>
        )}
      </div>
      <div className="min-w-0 flex-1 space-y-2">
        <div className="flex flex-wrap gap-2">
          <button type="button" className="admin-btn" disabled={busy} onClick={() => fileRef.current?.click()}>
            {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ImageUp className="h-3.5 w-3.5" />}
            {busy ? 'Uploading…' : 'Upload image'}
          </button>
          {value && (
            <button type="button" className="admin-btn admin-btn-danger" onClick={() => onChange('')}>
              <X className="h-3.5 w-3.5" />
              Remove
            </button>
          )}
        </div>
        <input
          type="url"
          className="admin-input"
          placeholder="…or paste an image URL"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
        />
        {!value && fallback && (
          <p className="text-xs text-[var(--text-muted)]">Showing the screenshot bundled with the site.</p>
        )}
        {error && <p className="text-xs text-red-400">Upload failed: {error}</p>}
        <input ref={fileRef} type="file" accept="image/*" hidden onChange={onFile} />
      </div>
    </div>
  )
}

function Field({ field, value, onChange, parent }) {
  const { type = 'text', label, hint, placeholder } = field

  if (type === 'checkbox') {
    return (
      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          className="h-4 w-4 accent-[var(--color-accent)]"
          checked={Boolean(value)}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span className="text-sm text-[var(--text-primary)]">{label}</span>
        {hint && <span className="text-xs text-[var(--text-muted)]">— {hint}</span>}
      </label>
    )
  }

  if (type === 'object') {
    return (
      <fieldset className="border border-[var(--line)] p-4">
        <legend className="label px-2 text-[var(--text-muted)]">{label}</legend>
        <Fields schema={field.fields} value={value || {}} onChange={onChange} />
      </fieldset>
    )
  }

  if (type === 'list') {
    return <ListField field={field} value={value || []} onChange={onChange} />
  }

  let input
  if (type === 'textarea') {
    input = (
      <textarea
        className="admin-input"
        rows={field.rows || 4}
        value={value ?? ''}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    )
  } else if (type === 'tags' || type === 'lines') {
    input = (
      <StringListInput
        value={value}
        onChange={onChange}
        multiline={type === 'lines'}
        placeholder={placeholder}
      />
    )
  } else if (type === 'image') {
    input = (
      <ImageInput
        value={value}
        onChange={onChange}
        folder={field.folder}
        fallback={field.fallback?.(parent)}
      />
    )
  } else if (type === 'number') {
    input = (
      <input
        type="number"
        className="admin-input"
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value === '' ? 0 : Number(e.target.value))}
      />
    )
  } else {
    input = (
      <input
        type={type}
        className="admin-input"
        value={value ?? ''}
        placeholder={placeholder}
        onChange={(e) => onChange(type === 'url' ? e.target.value.trim() || null : e.target.value)}
      />
    )
  }

  return (
    <FieldLabel label={label} hint={hint}>
      {input}
    </FieldLabel>
  )
}

export function Fields({ schema, value, onChange }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {schema.map((field) => (
        <div key={field.key} className={field.half ? '' : 'sm:col-span-2'}>
          <Field
            field={field}
            value={value[field.key]}
            parent={value}
            onChange={(next) => onChange({ ...value, [field.key]: next })}
          />
        </div>
      ))}
    </div>
  )
}

function ListField({ field, value, onChange }) {
  const [open, setOpen] = useState(() => new Set())

  const update = (index, item) => onChange(value.map((v, i) => (i === index ? item : v)))
  const move = (index, delta) => {
    const next = [...value]
    const [item] = next.splice(index, 1)
    next.splice(index + delta, 0, item)
    onChange(next)
  }
  const remove = (index) => {
    const title = field.itemTitle(value[index]) || 'this item'
    if (window.confirm(`Remove “${title}”?`)) onChange(value.filter((_, i) => i !== index))
  }
  const add = () => {
    const item = { id: crypto.randomUUID(), ...field.newItem() }
    onChange([...value, item])
    setOpen((s) => new Set(s).add(item.id))
  }
  const toggle = (id) =>
    setOpen((s) => {
      const next = new Set(s)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  return (
    <div>
      {field.label && <p className="label mb-3 text-[var(--text-muted)]">{field.label}</p>}
      <ol className="space-y-3">
        {value.map((item, index) => (
          <li key={item.id} className="border border-[var(--line)] bg-[var(--surface-1)]">
            <div className="flex items-center gap-2 px-3 py-2.5">
              <button
                type="button"
                onClick={() => toggle(item.id)}
                className="min-w-0 flex-1 truncate text-left text-sm text-[var(--text-primary)]"
                aria-expanded={open.has(item.id)}
              >
                <span className="mono mr-3 text-xs text-[var(--text-muted)]">
                  {String(index + 1).padStart(2, '0')}
                </span>
                {field.itemTitle(item) || <em className="text-[var(--text-muted)]">Untitled</em>}
              </button>
              <button type="button" className="admin-btn px-2" disabled={index === 0} onClick={() => move(index, -1)} aria-label="Move up">
                <ArrowUp className="h-3.5 w-3.5" />
              </button>
              <button type="button" className="admin-btn px-2" disabled={index === value.length - 1} onClick={() => move(index, 1)} aria-label="Move down">
                <ArrowDown className="h-3.5 w-3.5" />
              </button>
              <button type="button" className="admin-btn admin-btn-danger px-2" onClick={() => remove(index)} aria-label="Remove">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
            {open.has(item.id) && (
              <div className="border-t border-[var(--line)] p-4">
                <Fields schema={field.fields} value={item} onChange={(next) => update(index, next)} />
              </div>
            )}
          </li>
        ))}
      </ol>
      <button type="button" className="admin-btn mt-3" onClick={add}>
        <Plus className="h-3.5 w-3.5" />
        {field.addLabel || 'Add item'}
      </button>
    </div>
  )
}
