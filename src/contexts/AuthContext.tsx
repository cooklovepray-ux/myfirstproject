import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type Session = Awaited<ReturnType<typeof supabase.auth.getSession>>['data']['session']
type User = Session extends { user: infer U } ? U : null

interface AuthContextType {
  user: User | null
  session: Session
  loading: boolean
  signInWithKakao: () => Promise<void>
  signInWithNaver: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    // 현재 세션 확인
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    }).catch((error) => {
      console.error('세션 가져오기 오류:', error)
      if (mounted) {
        setLoading(false)
      }
    })

    // 인증 상태 변경 감지
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const signInWithKakao = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'kakao',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) {
      console.error('Kakao 로그인 오류:', error)
      throw error
    }
  }

  const signInWithNaver = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'naver',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) {
      console.error('Naver 로그인 오류:', error)
      throw error
    }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('로그아웃 오류:', error)
      throw error
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signInWithKakao,
        signInWithNaver,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

