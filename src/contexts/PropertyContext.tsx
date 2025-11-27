import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import type { Property } from '@/types/database'
import { useProperties } from '@/hooks/useProperties'
import { useAuth } from '@/contexts/AuthContext'

interface PropertyContextType {
  currentProperty: Property | null
  setCurrentProperty: (property: Property | null) => void
  properties: Property[]
  loading: boolean
}

const PropertyContext = createContext<PropertyContextType | undefined>(undefined)

export function PropertyProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const { properties, loading } = useProperties()
  const [currentProperty, setCurrentPropertyState] = useState<Property | null>(null)

  // 로컬 스토리지에서 현재 선택된 숙소 ID 가져오기
  useEffect(() => {
    if (!user) {
      setCurrentPropertyState(null)
      return
    }

    const storedPropertyId = localStorage.getItem(`current_property_${user.id}`)
    if (storedPropertyId && properties.length > 0) {
      const property = properties.find(p => p.id === storedPropertyId)
      if (property) {
        setCurrentPropertyState(property)
        return
      }
    }

    // 저장된 값이 없거나 찾을 수 없으면 기본 숙소 선택
    if (properties.length > 0) {
      const defaultProperty = properties.find(p => p.is_default) || properties[0]
      setCurrentPropertyState(defaultProperty)
      localStorage.setItem(`current_property_${user.id}`, defaultProperty.id)
    } else {
      setCurrentPropertyState(null)
    }
  }, [user, properties])

  const setCurrentProperty = (property: Property | null) => {
    setCurrentPropertyState(property)
    if (property && user) {
      localStorage.setItem(`current_property_${user.id}`, property.id)
    } else if (user) {
      localStorage.removeItem(`current_property_${user.id}`)
    }
  }

  return (
    <PropertyContext.Provider
      value={{
        currentProperty,
        setCurrentProperty,
        properties,
        loading,
      }}
    >
      {children}
    </PropertyContext.Provider>
  )
}

export function useProperty() {
  const context = useContext(PropertyContext)
  if (context === undefined) {
    throw new Error('useProperty must be used within a PropertyProvider')
  }
  return context
}

