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

const main = async () => {
  const { data, error } = await supabase
    .from('anime')
    .select('mal_id,title,slug')
    .limit(100)

  if (error) {
    console.error('select error:', error)
    process.exit(1)
  }

  const rows = data ?? []
  const nullSlug = rows.filter((r) => r.slug == null).length
  const dupMap = new Map()
  for (const row of rows) {
    if (row.slug != null) {
      dupMap.set(row.slug, (dupMap.get(row.slug) ?? 0) + 1)
    }
  }
  const duplicates = [...dupMap.entries()].filter(([, count]) => count > 1)
  console.log('rows', rows.length, 'nullSlugs', nullSlug, 'duplicates', duplicates.length)
  console.log('duplicates sample', duplicates.slice(0, 20))
  console.log('rows sample', rows.slice(0, 10))
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
