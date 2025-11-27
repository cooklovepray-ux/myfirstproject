import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/AuthContext"
import { Home, Calendar as CalendarIcon } from "lucide-react"

export function Calendar() {
  const { signOut } = useAuth()

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6 md:space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">달력</h1>
            <p className="text-muted-foreground">
              예약 일정을 달력으로 확인하세요
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link to="/dashboard">
                <Home className="h-4 w-4 mr-2" />
                대시보드
              </Link>
            </Button>
            <Button variant="outline" onClick={signOut}>
              로그아웃
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <CalendarIcon className="h-6 w-6 text-muted-foreground" />
              <div>
                <CardTitle>달력 뷰</CardTitle>
                <CardDescription>
                  예약 일정을 달력으로 확인할 수 있습니다
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-16 space-y-4">
              <CalendarIcon className="h-16 w-16 text-muted-foreground opacity-50" />
              <div className="text-center space-y-2">
                <h3 className="text-lg font-semibold">달력 기능은 곧 추가될 예정입니다</h3>
                <p className="text-muted-foreground text-sm">
                  현재는 대시보드에서 예약 목록을 확인하실 수 있습니다.
                </p>
              </div>
              <Button asChild className="mt-4">
                <Link to="/dashboard">
                  대시보드로 이동
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

