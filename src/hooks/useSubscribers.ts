import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { Subscriber, SubscriberInsert, SubscriberUpdate } from '@/types/database'
import { useAuth } from '@/contexts/AuthContext'
import { useProperty } from '@/contexts/PropertyContext'

export function useSubscribers() {
  const { user } = useAuth()
  const { currentProperty } = useProperty()
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchSubscribers = async () => {
    if (!user || !currentProperty) {
      setSubscribers([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const { data, error: fetchError } = await supabase
        .from('subscribers')
        .select('*')
        .eq('user_id', user.id)
        .eq('property_id', currentProperty.id)
        .order('created_at', { ascending: false })

      if (fetchError) {
        throw fetchError
      }

      setSubscribers(data || [])
    } catch (err) {
      const error = err instanceof Error ? err : new Error('구독자 목록을 불러오는 중 오류가 발생했습니다.')
      setError(error)
      console.error('구독자 목록 조회 오류:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSubscribers()
  }, [user, currentProperty])

  const createSubscriber = async (subscriber: SubscriberInsert) => {
    if (!user || !currentProperty) {
      throw new Error('로그인 및 숙소 선택이 필요합니다.')
    }

    try {
      const { data, error: insertError } = await supabase
        .from('subscribers')
        .insert({
          ...subscriber,
          user_id: user.id,
          property_id: currentProperty.id,
        })
        .select()
        .single()

      if (insertError) {
        throw insertError
      }

      await fetchSubscribers()
      return data
    } catch (err) {
      const error = err instanceof Error ? err : new Error('구독자 추가 중 오류가 발생했습니다.')
      console.error('구독자 추가 오류:', err)
      throw error
    }
  }

  const updateSubscriber = async (id: string, updates: SubscriberUpdate) => {
    if (!user) {
      throw new Error('로그인이 필요합니다.')
    }

    try {
      const { data, error: updateError } = await supabase
        .from('subscribers')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single()

      if (updateError) {
        throw updateError
      }

      await fetchSubscribers()
      return data
    } catch (err) {
      const error = err instanceof Error ? err : new Error('구독자 수정 중 오류가 발생했습니다.')
      console.error('구독자 수정 오류:', err)
      throw error
    }
  }

  const deleteSubscriber = async (id: string) => {
    if (!user) {
      throw new Error('로그인이 필요합니다.')
    }

    try {
      const { error: deleteError } = await supabase
        .from('subscribers')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

      if (deleteError) {
        throw deleteError
      }

      await fetchSubscribers()
    } catch (err) {
      const error = err instanceof Error ? err : new Error('구독자 삭제 중 오류가 발생했습니다.')
      console.error('구독자 삭제 오류:', err)
      throw error
    }
  }

  const bulkCreateSubscribers = async (phones: string[]) => {
    if (!user || !currentProperty) {
      throw new Error('로그인 및 숙소 선택이 필요합니다.')
    }

    try {
      const subscribersToInsert: SubscriberInsert[] = phones.map(phone => ({
        phone: phone.trim(),
        name: null,
        is_active: true,
        property_id: currentProperty.id,
        user_id: user.id,
      }))

      const { data, error: insertError } = await supabase
        .from('subscribers')
        .insert(subscribersToInsert)
        .select()

      if (insertError) {
        throw insertError
      }

      await fetchSubscribers()
      return data || []
    } catch (err) {
      const error = err instanceof Error ? err : new Error('구독자 일괄 추가 중 오류가 발생했습니다.')
      console.error('구독자 일괄 추가 오류:', err)
      throw error
    }
  }

  return {
    subscribers,
    loading,
    error,
    refetch: fetchSubscribers,
    createSubscriber,
    updateSubscriber,
    deleteSubscriber,
    bulkCreateSubscribers,
  }
}

