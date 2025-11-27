// 알림 로그 Hook
// 향후 구현 예정

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import type { NotificationLog } from '../types/notification'

/**
 * 알림 로그를 조회하는 Hook
 * 
 * 향후 구현 예정 기능:
 * - 알림 로그 목록 조회
 * - 필터링 (타입, 채널, 상태별)
 * - 페이지네이션
 * - 발송 실패 알림 재시도
 */
export function useNotificationLog() {
  const { user } = useAuth()
  const [logs, setLogs] = useState<NotificationLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    // TODO: Supabase에서 알림 로그 조회
    // const fetchLogs = async () => {
    //   try {
    //     const { data, error: fetchError } = await supabase
    //       .from('notification_logs')
    //       .select('*')
    //       .eq('user_id', user.id)
    //       .order('created_at', { ascending: false })
    //       .limit(100)
    //
    //     if (fetchError) throw fetchError
    //     setLogs(data || [])
    //   } catch (err) {
    //     setError(err instanceof Error ? err : new Error('알림 로그를 불러오는 중 오류가 발생했습니다.'))
    //   } finally {
    //     setLoading(false)
    //   }
    // }
    //
    // fetchLogs()

    // 임시: 로딩 완료 처리
    setLoading(false)
  }, [user])

  return {
    logs,
    loading,
    error,
  }
}

