import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useReservations } from "@/hooks/useReservations"
import { format, isSameDay, isWithinInterval, parseISO } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { ReservationSummaryCard } from "@/components/ReservationSummaryCard"

export function ReservationCalendar() {
  const { reservations, loading, error } = useReservations()
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  // 선택된 날짜의 예약 찾기
  const getReservationsForDate = (date: Date) => {
    if (!reservations.length) return []
    
    return reservations.filter((reservation) => {
      const checkIn = parseISO(reservation.check_in_date)
      const checkOut = parseISO(reservation.check_out_date)
      
      // 체크인/체크아웃 날짜에 포함되거나 그 사이에 있는지 확인
      return (
        isSameDay(checkIn, date) ||
        isSameDay(checkOut, date) ||
        isWithinInterval(date, { start: checkIn, end: checkOut })
      )
    })
  }

  // 날짜에 예약이 있는지 확인
  const hasReservation = (date: Date) => {
    return getReservationsForDate(date).length > 0
  }

  // 날짜 클릭 핸들러
  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return
    setSelectedDate(date)
  }

  // 날짜 스타일링 (예약이 있는 날짜 강조)
  const modifiers = {
    hasReservation: (date: Date) => hasReservation(date),
  }

  const modifiersClassNames = {
    hasReservation: "bg-primary/20 border-primary/50 border-2 font-semibold",
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            예약 달력
          </CardTitle>
          <CardDescription>
            예약 일정을 달력으로 확인하세요
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <p className="text-muted-foreground">로딩 중...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            예약 달력
          </CardTitle>
          <CardDescription>
            예약 일정을 달력으로 확인하세요
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <p className="text-destructive text-sm">
              예약을 불러오는 중 오류가 발생했습니다.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const selectedDayReservations = selectedDate 
    ? getReservationsForDate(selectedDate)
    : []

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5" />
          예약 달력
        </CardTitle>
        <CardDescription>
          예약이 있는 날짜를 클릭하면 해당 날짜의 예약을 확인할 수 있습니다
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            modifiers={modifiers}
            modifiersClassNames={modifiersClassNames}
            className="rounded-md border"
          />
        </div>
        
        {selectedDate && selectedDayReservations.length > 0 && (
          <div className="w-full space-y-3 border-t pt-4">
            <h3 className="text-sm font-semibold text-muted-foreground">
              {format(selectedDate, "yyyy년 M월 d일")} 예약 ({selectedDayReservations.length}건)
            </h3>
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {selectedDayReservations.map((reservation) => (
                <ReservationSummaryCard key={reservation.id} reservation={reservation} />
              ))}
            </div>
          </div>
        )}
        
        {selectedDate && selectedDayReservations.length === 0 && (
          <div className="w-full text-center border-t pt-4">
            <p className="text-sm text-muted-foreground">
              {format(selectedDate, "yyyy년 M월 d일")}에는 예약이 없습니다.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

