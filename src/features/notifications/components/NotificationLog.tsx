// 알림 로그 컴포넌트
// 향후 구현 예정

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function NotificationLog() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>알림 로그</CardTitle>
        <CardDescription>
          발송된 알림 내역을 확인할 수 있습니다
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center py-8">
          <p className="text-muted-foreground text-sm">
            알림 로그 기능은 곧 추가될 예정입니다.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

