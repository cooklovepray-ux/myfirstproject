import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/AuthContext"
import { useProperty } from "@/contexts/PropertyContext"
import { useTodayTomorrowReservations, useReservations } from "@/hooks/useReservations"
import { ReservationCard } from "@/components/ReservationCard"
import { ReservationSummaryCard } from "@/components/ReservationSummaryCard"
import { ReservationCalendar } from "@/components/ReservationCalendar"
import { Home, Plus, Calendar as CalendarIcon, Settings as SettingsIcon, Building2, Zap } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function Dashboard() {
  const { user, signOut } = useAuth()
  const { currentProperty, setCurrentProperty, properties } = useProperty()
  const { reservations: todayTomorrowReservations, loading: todayTomorrowLoading, error: todayTomorrowError } = useTodayTomorrowReservations()
  const { reservations: allReservations, loading: allLoading, error: allError } = useReservations()

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6 md:space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex-1">
                <h1 className="text-2xl md:text-3xl font-bold mb-2">예약관리</h1>
                <p className="text-muted-foreground">
                  {user?.email || user?.user_metadata?.email || '사용자'}님 환영합니다
                </p>
            {properties.length > 0 && (
              <div className="mt-3 flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <Select
                  value={currentProperty?.id || ""}
                  onValueChange={(value) => {
                    const property = properties.find(p => p.id === value)
                    if (property) {
                      setCurrentProperty(property)
                    }
                  }}
                >
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue placeholder="숙소를 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {properties.map((property) => (
                      <SelectItem key={property.id} value={property.id}>
                        {property.name}
                        {property.is_default && " (기본)"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" asChild className="text-xs sm:text-sm">
              <Link to="/calendar">
                <CalendarIcon className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">달력</span>
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild className="text-xs sm:text-sm">
              <Link to="/flash-sale">
                <Zap className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Flash-Sale</span>
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild className="text-xs sm:text-sm">
              <Link to="/settings">
                <SettingsIcon className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">설정</span>
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild className="text-xs sm:text-sm">
              <Link to="/">
                <Home className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">홈</span>
              </Link>
            </Button>
            <Button variant="outline" size="sm" onClick={signOut} className="text-xs sm:text-sm">
              <span className="hidden sm:inline">로그아웃</span>
              <span className="sm:hidden">로그아웃</span>
            </Button>
          </div>
        </div>

        <Card className="border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent shadow-lg shadow-primary/5">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <CardTitle className="text-primary text-xl font-bold">오늘/내일 예약</CardTitle>
                <CardDescription className="text-sm">
                  체크인 예정인 예약 목록입니다
                </CardDescription>
              </div>
              <Button asChild size="sm" className="w-full sm:w-auto bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-md">
                <Link to="/reservation-form">
                  <Plus className="h-4 w-4 mr-2" />
                  예약 등록
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {todayTomorrowLoading && (
              <div className="flex items-center justify-center py-8">
                <p className="text-muted-foreground">로딩 중...</p>
              </div>
            )}
            
            {todayTomorrowError && (
              <div className="flex items-center justify-center py-8">
                <p className="text-destructive text-sm">
                  예약을 불러오는 중 오류가 발생했습니다.
                </p>
              </div>
            )}
            
            {!todayTomorrowLoading && !todayTomorrowError && todayTomorrowReservations.length === 0 && (
              <div className="flex items-center justify-center py-8">
                <p className="text-muted-foreground text-sm">
                  오늘 또는 내일 체크인 예정인 예약이 없습니다.
                </p>
              </div>
            )}
            
            {!todayTomorrowLoading && !todayTomorrowError && todayTomorrowReservations.length > 0 && (
              <div className="space-y-4">
                {todayTomorrowReservations.map((reservation) => (
                  <ReservationCard key={reservation.id} reservation={reservation} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-orange-200/50 bg-gradient-to-br from-orange-50/80 via-orange-50/50 to-transparent shadow-lg shadow-orange-200/20">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <CardTitle className="text-orange-700 flex items-center gap-2 text-xl font-bold">
                  <div className="p-1.5 rounded-lg bg-orange-100">
                    <Zap className="h-5 w-5" />
                  </div>
                  Flash-Sale
                </CardTitle>
                <CardDescription className="text-sm">
                  빈방 발생 시 구독자에게 즉시 알림을 보내세요
                </CardDescription>
              </div>
              <Button variant="outline" asChild size="sm" className="w-full sm:w-auto border-orange-300 hover:bg-orange-50">
                <Link to="/flash-sale">
                  <Zap className="h-4 w-4 mr-2" />
                  Flash-Sale 관리
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8">
              <p className="text-muted-foreground text-sm">
                빈방이 발생하면 구독자에게 즉시 알림을 보낼 수 있습니다.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-muted/50 bg-gradient-to-br from-card to-card/80 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">전체 예약</CardTitle>
            <CardDescription className="text-sm">
              모든 예약 목록입니다
            </CardDescription>
          </CardHeader>
            <CardContent>
              {allLoading && (
                <div className="flex items-center justify-center py-8">
                  <p className="text-muted-foreground">로딩 중...</p>
                </div>
              )}
              
              {allError && (
                <div className="flex items-center justify-center py-8">
                  <p className="text-destructive text-sm">
                    예약을 불러오는 중 오류가 발생했습니다.
                  </p>
                </div>
              )}
              
              {!allLoading && !allError && allReservations.length === 0 && (
                <div className="flex items-center justify-center py-8">
                  <p className="text-muted-foreground text-sm">
                    등록된 예약이 없습니다.
                  </p>
                </div>
              )}
              
              {!allLoading && !allError && allReservations.length > 0 && (
                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                  {allReservations.map((reservation) => (
                    <ReservationSummaryCard key={reservation.id} reservation={reservation} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <ReservationCalendar />
        </div>
      </div>
    </div>
  )
}
