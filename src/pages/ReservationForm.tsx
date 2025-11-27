import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { DatePicker } from "@/components/DatePicker"
import { useAuth } from "@/contexts/AuthContext"
import { useProperty } from "@/contexts/PropertyContext"
import { supabase } from "@/lib/supabase"
import { useState } from "react"
import { ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"

interface ReservationFormData {
  guest_name: string
  guest_phone: string
  check_in_date: Date
  check_out_date: Date
  booking_source: 'sms' | 'naver' | 'phone' | 'other' | null
}

export function ReservationForm() {
  const { user } = useAuth()
  const { currentProperty } = useProperty()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<ReservationFormData>({
    defaultValues: {
      guest_name: "",
      guest_phone: "",
      check_in_date: undefined,
      check_out_date: undefined,
      booking_source: null,
    },
    mode: "onChange",
  })

  const onSubmit = async (data: ReservationFormData) => {
    if (!user) {
      setError("로그인이 필요합니다.")
      return
    }

    // 필수 필드 검증
    if (!data.guest_name || !data.guest_phone || !data.check_in_date || !data.check_out_date) {
      setError("모든 필드를 입력해주세요.")
      return
    }

    // 숙소 선택 확인
    if (!currentProperty) {
      setError("먼저 숙소를 선택해주세요. 설정 페이지에서 숙소를 추가할 수 있습니다.")
      return
    }

    // 퇴실 날짜가 입실 날짜보다 이전인지 확인
    if (data.check_out_date <= data.check_in_date) {
      form.setError("check_out_date", {
        type: "manual",
        message: "퇴실 날짜는 입실 날짜보다 늦어야 합니다.",
      })
      return
    }

    setLoading(true)
    setError(null)

    try {
      const { error: insertError } = await supabase
        .from("reservations")
        .insert({
          user_id: user.id,
          property_id: currentProperty.id,
          guest_name: data.guest_name,
          guest_phone: data.guest_phone,
          check_in_date: data.check_in_date.toISOString().split("T")[0],
          check_out_date: data.check_out_date.toISOString().split("T")[0],
          status: "confirmed",
          booking_source: data.booking_source,
        })

      if (insertError) {
        throw insertError
      }

      // 성공 시 대시보드로 리다이렉트
      navigate("/dashboard")
    } catch (err: any) {
      console.error("예약 등록 오류:", err)
      setError(err.message || "예약 등록 중 오류가 발생했습니다.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/dashboard">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">예약 등록</h1>
            <p className="text-muted-foreground">
              새로운 예약을 등록하세요
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>예약 정보</CardTitle>
            <CardDescription>
              투숙객 정보와 입실/퇴실 날짜를 입력해주세요
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="guest_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>이름</FormLabel>
                      <FormControl>
                        <Input placeholder="홍길동" {...field} required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="guest_phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>전화번호</FormLabel>
                      <FormControl>
                        <Input
                          type="tel"
                          placeholder="010-1234-5678"
                          {...field}
                          required
                        />
                      </FormControl>
                      <FormDescription>
                        하이픈(-)을 포함하여 입력해주세요
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="check_in_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>입실 날짜</FormLabel>
                      <FormControl>
                        <DatePicker
                          date={field.value}
                          onSelect={field.onChange}
                          placeholder="입실 날짜 선택"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="check_out_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>퇴실 날짜</FormLabel>
                      <FormControl>
                        <DatePicker
                          date={field.value}
                          onSelect={field.onChange}
                          placeholder="퇴실 날짜 선택"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="booking_source"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>예약 루트</FormLabel>
                      <FormControl>
                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            type="button"
                            variant={field.value === 'sms' ? 'default' : 'outline'}
                            className="w-full min-h-[44px] sm:min-h-0"
                            onClick={() => field.onChange('sms')}
                          >
                            문자예약
                          </Button>
                          <Button
                            type="button"
                            variant={field.value === 'naver' ? 'default' : 'outline'}
                            className="w-full min-h-[44px] sm:min-h-0"
                            onClick={() => field.onChange('naver')}
                          >
                            네이버예약
                          </Button>
                          <Button
                            type="button"
                            variant={field.value === 'phone' ? 'default' : 'outline'}
                            className="w-full min-h-[44px] sm:min-h-0"
                            onClick={() => field.onChange('phone')}
                          >
                            전화예약
                          </Button>
                          <Button
                            type="button"
                            variant={field.value === 'other' ? 'default' : 'outline'}
                            className="w-full min-h-[44px] sm:min-h-0"
                            onClick={() => field.onChange('other')}
                          >
                            기타
                          </Button>
                        </div>
                      </FormControl>
                      <FormDescription>
                        예약이 들어온 경로를 선택해주세요
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {error && (
                  <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                    {error}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 min-h-[44px] sm:min-h-0"
                    onClick={() => navigate("/dashboard")}
                    disabled={loading}
                  >
                    취소
                  </Button>
                  <Button type="submit" className="flex-1 min-h-[44px] sm:min-h-0" disabled={loading}>
                    {loading ? "등록 중..." : "예약 등록"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

