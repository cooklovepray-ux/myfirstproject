import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { Property, PropertyInsert, PropertyUpdate } from '@/types/database'
import { useAuth } from '@/contexts/AuthContext'

export function useProperties() {
  const { user } = useAuth()
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchProperties = async () => {
    if (!user) {
      setProperties([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const { data, error: fetchError } = await supabase
        .from('properties')
        .select('*')
        .eq('user_id', user.id)
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: true })

      if (fetchError) throw fetchError
      setProperties(data || [])
    } catch (err) {
      const error = err instanceof Error ? err : new Error('숙소 목록을 불러오는 중 오류가 발생했습니다.')
      setError(error)
      console.error('숙소 목록 조회 오류:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProperties()
  }, [user])

  const createProperty = async (property: PropertyInsert) => {
    if (!user) throw new Error('로그인이 필요합니다.')

    try {
      // 첫 번째 숙소인 경우 기본 숙소로 설정
      const isFirstProperty = properties.length === 0
      const newProperty: PropertyInsert = {
        ...property,
        user_id: user.id,
        is_default: isFirstProperty,
      }

      const { data, error: insertError } = await supabase
        .from('properties')
        .insert(newProperty)
        .select()
        .single()

      if (insertError) throw insertError
      
      // 새로고침
      await fetchProperties()
      return data
    } catch (err) {
      const error = err instanceof Error ? err : new Error('숙소 생성 중 오류가 발생했습니다.')
      console.error('숙소 생성 오류:', err)
      throw error
    }
  }

  const updateProperty = async (id: string, updates: PropertyUpdate) => {
    if (!user) throw new Error('로그인이 필요합니다.')

    try {
      const { data, error: updateError } = await supabase
        .from('properties')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single()

      if (updateError) throw updateError
      
      // 새로고침
      await fetchProperties()
      return data
    } catch (err) {
      const error = err instanceof Error ? err : new Error('숙소 수정 중 오류가 발생했습니다.')
      console.error('숙소 수정 오류:', err)
      throw error
    }
  }

  const deleteProperty = async (id: string) => {
    if (!user) throw new Error('로그인이 필요합니다.')

    try {
      const { error: deleteError } = await supabase
        .from('properties')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

      if (deleteError) throw deleteError
      
      // 새로고침
      await fetchProperties()
    } catch (err) {
      const error = err instanceof Error ? err : new Error('숙소 삭제 중 오류가 발생했습니다.')
      console.error('숙소 삭제 오류:', err)
      throw error
    }
  }

  const setDefaultProperty = async (id: string) => {
    if (!user) throw new Error('로그인이 필요합니다.')

    try {
      // 먼저 모든 숙소의 is_default를 false로 설정
      await supabase
        .from('properties')
        .update({ is_default: false })
        .eq('user_id', user.id)

      // 선택한 숙소를 기본으로 설정
      await updateProperty(id, { is_default: true })
    } catch (err) {
      const error = err instanceof Error ? err : new Error('기본 숙소 설정 중 오류가 발생했습니다.')
      console.error('기본 숙소 설정 오류:', err)
      throw error
    }
  }

  return {
    properties,
    loading,
    error,
    refetch: fetchProperties,
    createProperty,
    updateProperty,
    deleteProperty,
    setDefaultProperty,
  }
}

