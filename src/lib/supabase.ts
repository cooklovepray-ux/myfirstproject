import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables')
  console.error('VITE_SUPABASE_URL:', supabaseUrl)
  console.error('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? '설정됨' : '없음')
  // 개발 환경에서는 에러를 던지지 않고 경고만 출력
  if (import.meta.env.DEV) {
    console.warn('개발 모드: Supabase 환경 변수가 없습니다.')
  } else {
    throw new Error('Missing Supabase environment variables')
  }
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
)

