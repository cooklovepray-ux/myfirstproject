import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'

export function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('인증 오류:', error)
          navigate('/')
          return
        }

        if (data.session) {
          // 인증 성공 - 대시보드로 리다이렉트
          navigate('/dashboard')
        } else {
          // 세션이 없음 - 홈으로 리다이렉트
          navigate('/')
        }
      } catch (error) {
        console.error('콜백 처리 오류:', error)
        navigate('/')
      }
    }

    handleAuthCallback()
  }, [navigate])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-muted-foreground">인증 처리 중...</div>
    </div>
  )
}

