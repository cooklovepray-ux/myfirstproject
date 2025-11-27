import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Reservation } from "@/types/database"
import { Calendar, Phone, MessageSquare, Edit, Trash2, Star } from "lucide-react"
import { useState } from "react"
import { EditReservationDialog } from "@/components/EditReservationDialog"
import { useReservations } from "@/hooks/useReservations"
import { Badge } from "@/components/ui/badge"

interface ReservationCardProps {
  reservation: Reservation
}

export function ReservationCard({ reservation }: ReservationCardProps) {
  const [sending, setSending] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const { updateReservation, cancelReservation, deleteReservation } = useReservations()

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const getDateLabel = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const checkInDate = new Date(date)
    checkInDate.setHours(0, 0, 0, 0)
    
    const diffTime = checkInDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return '오늘'
    if (diffDays === 1) return '내일'
    return formatDate(dateString)
  }

  const handleSendMessage = async (type: 'checkin' | 'checkout' | 'review') => {
    setSending(true)
    try {
      // TODO: 실제 메시지 발송 로직 구현
      // const { sendCheckinNotification, sendCheckoutNotification, sendReviewRequestNotification } = await import('@/features/notifications/services/notificationService')
      
      let message = ''
      switch (type) {
        case 'checkin':
          message = `체크인 안내 메시지를 ${reservation.guest_phone}로 발송합니다.`
          break
        case 'checkout':
          message = `체크아웃 안내 메시지를 ${reservation.guest_phone}로 발송합니다.`
          break
        case 'review':
          message = `리뷰 요청 메시지를 ${reservation.guest_phone}로 발송합니다.`
          break
      }
      
      // 임시: 실제 구현 전까지 알림만 표시
      alert(message + '\n\n(메시지 발송 기능은 곧 추가될 예정입니다.)')
    } catch (error) {
      console.error('메시지 발송 오류:', error)
      alert('메시지 발송 중 오류가 발생했습니다.')
    } finally {
      setSending(false)
    }
  }

  const handleCancel = async () => {
    if (!confirm('정말 이 예약을 취소하시겠습니까?')) return
    
    try {
      await cancelReservation(reservation.id)
      alert('예약이 취소되었습니다.')
    } catch (error) {
      console.error('예약 취소 오류:', error)
      alert('예약 취소 중 오류가 발생했습니다.')
    }
  }

  const handleDelete = async () => {
    if (!confirm('정말 이 예약을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) return
    
    try {
      await deleteReservation(reservation.id)
      alert('예약이 삭제되었습니다.')
    } catch (error) {
      console.error('예약 삭제 오류:', error)
      alert('예약 삭제 중 오류가 발생했습니다.')
    }
  }

  return (
    <Card className="border-border/50 hover:border-primary/30 transition-all duration-200 hover:shadow-md bg-card/50">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg font-semibold">{reservation.guest_name}</CardTitle>
              {reservation.booking_source && (
                <Badge variant="secondary" className="text-xs">
                  {reservation.booking_source === 'sms' && '문자예약'}
                  {reservation.booking_source === 'naver' && '네이버예약'}
                  {reservation.booking_source === 'phone' && '전화예약'}
                  {reservation.booking_source === 'other' && '기타'}
                </Badge>
              )}
            </div>
            <CardDescription className="flex items-center gap-2 text-sm">
              <Phone className="h-3.5 w-3.5" />
              {reservation.guest_phone}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">입실:</span>
          <span className="font-medium">{getDateLabel(reservation.check_in_date)}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">퇴실:</span>
          <span className="font-medium">{formatDate(reservation.check_out_date)}</span>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditDialogOpen(true)}
            className="flex-1 min-h-[44px] sm:min-h-0"
          >
            <Edit className="h-4 w-4 sm:mr-2" />
            <span className="text-xs sm:text-sm">수정</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSendMessage('checkin')}
            disabled={sending}
            className="flex-1 min-h-[44px] sm:min-h-0"
          >
            <MessageSquare className="h-4 w-4 sm:mr-2" />
            <span className="text-xs sm:text-sm">체크인 안내</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSendMessage('checkout')}
            disabled={sending}
            className="flex-1 min-h-[44px] sm:min-h-0"
          >
            <MessageSquare className="h-4 w-4 sm:mr-2" />
            <span className="text-xs sm:text-sm">체크아웃 안내</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSendMessage('review')}
            disabled={sending}
            className="flex-1 min-h-[44px] sm:min-h-0"
          >
            <Star className="h-4 w-4 sm:mr-2" />
            <span className="text-xs sm:text-sm">리뷰 요청</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCancel}
            className="flex-1 min-h-[44px] sm:min-h-0"
          >
            <span className="text-xs sm:text-sm">예약 취소</span>
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            className="min-h-[44px] sm:min-h-0"
            title="예약 삭제"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        
        <EditReservationDialog
          reservation={reservation}
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onSave={updateReservation}
        />
      </CardContent>
    </Card>
  )
}

