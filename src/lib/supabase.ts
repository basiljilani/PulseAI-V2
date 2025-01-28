import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

console.log('Supabase URL:', supabaseUrl)
console.log('Environment variables:', import.meta.env)

if (!supabaseUrl || !supabaseKey) {
  throw new Error(`Missing environment variables:
    VITE_SUPABASE_URL: ${supabaseUrl ? '✓' : '✗'}
    VITE_SUPABASE_ANON_KEY: ${supabaseKey ? '✓' : '✗'}
  `)
}

export const supabase = createClient(supabaseUrl, supabaseKey)
