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

async function main() {
  const { data, error } = await supabase.from('anime').select('mal_id,title,slug').limit(1000)
  if (error) {
    console.error('select error', error)
    process.exit(1)
  }
  const rows = data ?? []
  const nullSlugs = rows.filter((r) => r.slug == null).length
  const bySlug = new Map()
  for (const row of rows) {
    if (row.slug != null) {
      bySlug.set(row.slug, (bySlug.get(row.slug) ?? 0) + 1)
    }
  }
  const duplicates = [...bySlug.entries()].filter(([, count]) => count > 1)
  console.log('rows:', rows.length)
  console.log('null slugs:', nullSlugs)
  console.log('duplicate slug count:', duplicates.length)
  if (duplicates.length > 0) {
    console.log('duplicates sample:', duplicates.slice(0, 20))
  }
  console.log('first 20 rows:', rows.slice(0, 20))
}

main().catch((err) => { console.error(err); process.exit(1) })
