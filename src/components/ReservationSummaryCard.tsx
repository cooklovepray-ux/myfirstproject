import { Card, CardContent } from "@/components/ui/card"
import type { Reservation } from "@/types/database"
import { Calendar, Phone } from "lucide-react"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"

interface ReservationSummaryCardProps {
  reservation: Reservation
  onClick?: () => void
}

export function ReservationSummaryCard({ reservation, onClick }: ReservationSummaryCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
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

  return (
    <Card 
      className="cursor-pointer hover:bg-muted/50 transition-colors"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="font-semibold text-sm truncate">{reservation.guest_name}</span>
              {reservation.booking_source && (
                <Badge variant="secondary" className="text-xs h-5">
                  {reservation.booking_source === 'sms' && '문자'}
                  {reservation.booking_source === 'naver' && '네이버'}
                  {reservation.booking_source === 'phone' && '전화'}
                  {reservation.booking_source === 'other' && '기타'}
                </Badge>
              )}
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Phone className="h-3 w-3" />
                {reservation.guest_phone}
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                입실: {getDateLabel(reservation.check_in_date)}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                퇴실: {formatDate(reservation.check_out_date)}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

