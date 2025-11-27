// Supabase 데이터베이스 타입 정의

export interface Property {
  id: string
  user_id: string
  name: string
  address: string | null
  phone: string | null
  description: string | null
  is_default: boolean
  created_at: string
  updated_at: string
}

export type PropertyInsert = Omit<Property, 'id' | 'created_at' | 'updated_at'>
export type PropertyUpdate = Partial<Omit<Property, 'id' | 'user_id' | 'created_at' | 'updated_at'>>

export interface Reservation {
  id: string
  user_id: string
  property_id: string | null
  guest_name: string
  guest_phone: string
  check_in_date: string // ISO date string
  check_out_date: string // ISO date string
  status: 'confirmed' | 'cancelled' | 'completed'
  booking_source: 'sms' | 'naver' | 'phone' | 'other' | null
  created_at: string
  updated_at: string
}

export type ReservationInsert = Omit<Reservation, 'id' | 'created_at' | 'updated_at'>
export type ReservationUpdate = Partial<Omit<Reservation, 'id' | 'user_id' | 'created_at' | 'updated_at'>>

export interface Subscriber {
  id: string
  user_id: string
  property_id: string
  phone: string
  name: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export type SubscriberInsert = Omit<Subscriber, 'id' | 'created_at' | 'updated_at'>
export type SubscriberUpdate = Partial<Omit<Subscriber, 'id' | 'user_id' | 'property_id' | 'created_at' | 'updated_at'>>
