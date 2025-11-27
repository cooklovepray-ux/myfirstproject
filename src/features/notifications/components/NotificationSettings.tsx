// 알림 설정 컴포넌트
// 향후 구현 예정

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function NotificationSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>알림 설정</CardTitle>
        <CardDescription>
          체크인/체크아웃 알림 및 리뷰 요청 알림을 설정할 수 있습니다
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center py-8">
          <p className="text-muted-foreground text-sm">
            알림 설정 기능은 곧 추가될 예정입니다.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

