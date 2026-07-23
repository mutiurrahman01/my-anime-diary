import { readFileSync } from 'fs'
import { createClient } from '@supabase/supabase-js'

const env = Object.fromEntries(
  readFileSync(new URL('../.env.local', import.meta.url), 'utf8')
    .split(/\r?\n/)
    .filter((line) => line.trim() && !line.trim().startsWith('#'))
    .map((line) => line.split('=', 2).map((part) => part.trim()))
)

for (const key of Object.keys(env)) {
  process.env[key] = env[key]
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

function slugify(title) {
  const normalized = title
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9 ]+/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .toLowerCase()
    .replace(/^-+|-+$/g, '')

  return normalized || 'anime'
}

async function main() {
  const { data: rows, error: fetchError } = await supabase
    .from('anime')
    .select('id, mal_id, title, slug')

  if (fetchError) {
    console.error('fetch error', fetchError)
    process.exit(1)
  }

  const records = (rows ?? []).map((row) => ({
    ...row,
    base_slug: slugify(row.title ?? 'anime'),
  }))

  const sorted = [...records].sort((a, b) => {
    if (a.base_slug < b.base_slug) return -1
    if (a.base_slug > b.base_slug) return 1
    const aKey = a.mal_id ?? a.id
    const bKey = b.mal_id ?? b.id
    return aKey - bKey
  })

  const slugCounter = new Map()
  const updates = []

  for (const row of sorted) {
    const count = slugCounter.get(row.base_slug) ?? 0
    const rn = count + 1
    slugCounter.set(row.base_slug, rn)

    const slug = rn === 1 ? row.base_slug : `${row.base_slug}-${rn}`

    updates.push({ id: row.id, mal_id: row.mal_id, slug })
  }

  console.log('Preparing updates for', updates.length, 'rows')

  for (const update of updates) {
    const { id, slug } = update
    if (!slug) {
      console.error('computed empty slug for id', id)
      process.exit(1)
    }

    const { error: updateError } = await supabase
      .from('anime')
      .update({ slug })
      .eq('id', id)

    if (updateError) {
      console.error('update error for id', id, updateError)
      process.exit(1)
    }
  }

  const { data: verify, error: verifyError } = await supabase
    .from('anime')
    .select('slug')

  if (verifyError) {
    console.error('verify error', verifyError)
    process.exit(1)
  }

  const duplicates = Object.entries(
    (verify ?? []).reduce((acc, row) => {
      if (row.slug == null) return acc
      acc[row.slug] = (acc[row.slug] ?? 0) + 1
      return acc
    }, {})
  ).filter(([, count]) => count > 1)

  console.log('verification duplicate slugs count:', duplicates.length)
  if (duplicates.length > 0) {
    console.log('duplicates sample', duplicates.slice(0, 20))
    process.exit(1)
  }

  console.log('slug regeneration complete and verified')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
