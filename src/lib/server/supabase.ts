import { env as privateEnv } from '$env/dynamic/private'
import { env as publicEnv } from '$env/dynamic/public'
import { createClient } from '@supabase/supabase-js'

if (!publicEnv.PUBLIC_SUPABASE_URL) {
  throw new Error('PUBLIC_SUPABASE_URL is not set')
}

if (!privateEnv.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set')
}

export const supabase = createClient(
  publicEnv.PUBLIC_SUPABASE_URL,
  privateEnv.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
)
