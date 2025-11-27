import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { useProperty } from '@/contexts/PropertyContext'
import type { Reservation } from '@/types/database'

export function useReservations() {
  const { user } = useAuth()
  const { currentProperty } = useProperty()
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!user) {
      setReservations([])
      setLoading(false)
      return
    }

    const fetchReservations = async () => {
      try {
        setLoading(true)
        setError(null)

        let query = supabase
          .from('reservations')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'confirmed')

        // 현재 선택된 숙소가 있으면 해당 숙소의 예약만 조회
        if (currentProperty) {
          query = query.eq('property_id', currentProperty.id)
        }

        const { data, error: fetchError } = await query
          .order('check_in_date', { ascending: true })

        if (fetchError) {
          throw fetchError
        }

        setReservations(data || [])
      } catch (err) {
        console.error('예약 조회 오류:', err)
        setError(err instanceof Error ? err : new Error('예약을 불러오는 중 오류가 발생했습니다.'))
      } finally {
        setLoading(false)
      }
    }

    fetchReservations()
  }, [user, currentProperty])

  const updateReservation = async (id: string, updates: Partial<Reservation>) => {
    if (!user) {
      throw new Error('로그인이 필요합니다.')
    }

    try {
      const { error: updateError } = await supabase
        .from('reservations')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)

      if (updateError) {
        throw updateError
      }

      // 목록 새로고침
      const fetchReservations = async () => {
        try {
          let query = supabase
            .from('reservations')
            .select('*')
            .eq('user_id', user.id)
            .eq('status', 'confirmed')

          if (currentProperty) {
            query = query.eq('property_id', currentProperty.id)
          }

          const { data, error: fetchError } = await query
            .order('check_in_date', { ascending: true })

          if (fetchError) {
            throw fetchError
          }

          setReservations(data || [])
        } catch (err) {
          console.error('예약 조회 오류:', err)
        }
      }

      await fetchReservations()
    } catch (err) {
      const error = err instanceof Error ? err : new Error('예약 수정 중 오류가 발생했습니다.')
      console.error('예약 수정 오류:', err)
      throw error
    }
  }

  const cancelReservation = async (id: string) => {
    return updateReservation(id, { status: 'cancelled' })
  }

  const deleteReservation = async (id: string) => {
    if (!user) {
      throw new Error('로그인이 필요합니다.')
    }

    try {
      const { error: deleteError } = await supabase
        .from('reservations')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

      if (deleteError) {
        throw deleteError
      }

      // 목록 새로고침
      const fetchReservations = async () => {
        try {
          let query = supabase
            .from('reservations')
            .select('*')
            .eq('user_id', user.id)
            .eq('status', 'confirmed')

          if (currentProperty) {
            query = query.eq('property_id', currentProperty.id)
          }

          const { data, error: fetchError } = await query
            .order('check_in_date', { ascending: true })

          if (fetchError) {
            throw fetchError
          }

          setReservations(data || [])
        } catch (err) {
          console.error('예약 조회 오류:', err)
        }
      }

      await fetchReservations()
    } catch (err) {
      const error = err instanceof Error ? err : new Error('예약 삭제 중 오류가 발생했습니다.')
      console.error('예약 삭제 오류:', err)
      throw error
    }
  }

  return { reservations, loading, error, updateReservation, cancelReservation, deleteReservation }
}

export function useTodayTomorrowReservations() {
  const { reservations, loading, error } = useReservations()
  
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  
  const dayAfterTomorrow = new Date(tomorrow)
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1)

  const filteredReservations = reservations.filter((reservation) => {
    const checkInDate = new Date(reservation.check_in_date)
    checkInDate.setHours(0, 0, 0, 0)
    
    // 오늘 또는 내일 체크인 예약만 필터링
    return (
      (checkInDate.getTime() === today.getTime()) ||
      (checkInDate.getTime() === tomorrow.getTime())
    )
  })

  return {
    reservations: filteredReservations,
    loading,
    error,
  }
}

