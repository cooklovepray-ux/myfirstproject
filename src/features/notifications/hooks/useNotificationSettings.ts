// 알림 설정 Hook
// 향후 구현 예정

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import type { NotificationSettings } from '../types/notification'

/**
 * 알림 설정을 관리하는 Hook
 * 
 * 향후 구현 예정 기능:
 * - 알림 설정 조회
 * - 알림 설정 업데이트
 * - 알림 채널 선택 (SMS, 카카오 알림톡)
 * - 알림 타입별 활성화/비활성화
 */
export function useNotificationSettings() {
  const { user } = useAuth()
  const [settings] = useState<NotificationSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [error] = useState<Error | null>(null)

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    // TODO: Supabase에서 알림 설정 조회
    // const fetchSettings = async () => {
    //   try {
    //     const { data, error: fetchError } = await supabase
    //       .from('notification_settings')
    //       .select('*')
    //       .eq('user_id', user.id)
    //       .single()
    //
    //     if (fetchError) throw fetchError
    //     setSettings(data)
    //   } catch (err) {
    //     setError(err instanceof Error ? err : new Error('알림 설정을 불러오는 중 오류가 발생했습니다.'))
    //   } finally {
    //     setLoading(false)
    //   }
    // }
    //
    // fetchSettings()

    // 임시: 로딩 완료 처리
    setLoading(false)
  }, [user])

  const updateSettings = async (updates: Partial<NotificationSettings>) => {
    if (!user) {
      throw new Error('로그인이 필요합니다.')
    }

    // TODO: Supabase에서 알림 설정 업데이트
    // try {
    //   const { data, error: updateError } = await supabase
    //     .from('notification_settings')
    //     .update(updates)
    //     .eq('user_id', user.id)
    //     .select()
    //     .single()
    //
    //   if (updateError) throw updateError
    //   setSettings(data)
    // } catch (err) {
    //   throw err instanceof Error ? err : new Error('알림 설정 업데이트 중 오류가 발생했습니다.')
    // }

    console.log('알림 설정 업데이트 예정:', updates)
    throw new Error('알림 설정 기능은 아직 구현되지 않았습니다.')
  }

  return {
    settings,
    loading,
    error,
    updateSettings,
  }
}

