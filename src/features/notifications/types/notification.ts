// 알림 관련 타입 정의
// 향후 구현 예정

export type NotificationChannel = 'sms' | 'kakao' | 'email'

export type NotificationType = 'checkin' | 'checkout' | 'review_request' | 'flash_sale'

export interface NotificationTemplate {
  id: string
  type: NotificationType
  channel: NotificationChannel
  title: string
  content: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface NotificationLog {
  id: string
  user_id: string
  property_id: string | null
  reservation_id: string | null
  type: NotificationType
  channel: NotificationChannel
  recipient: string // 전화번호 또는 이메일
  status: 'pending' | 'sent' | 'failed'
  sent_at: string | null
  error_message: string | null
  created_at: string
}

export interface NotificationSettings {
  id: string
  user_id: string
  property_id: string | null
  checkin_enabled: boolean
  checkout_enabled: boolean
  review_request_enabled: boolean
  flash_sale_enabled: boolean
  checkin_channels: NotificationChannel[]
  checkout_channels: NotificationChannel[]
  review_request_channels: NotificationChannel[]
  flash_sale_channels: NotificationChannel[]
  created_at: string
  updated_at: string
}

