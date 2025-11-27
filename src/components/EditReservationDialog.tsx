import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
import { Button } from "@/components/ui/button"
import { DatePicker } from "@/components/DatePicker"
import type { Reservation } from "@/types/database"
import { parseISO } from "date-fns"

interface EditReservationDialogProps {
  reservation: Reservation | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (id: string, updates: Partial<Reservation>) => Promise<void>
}

interface ReservationFormData {
  guest_name: string
  guest_phone: string
  check_in_date: Date
  check_out_date: Date
  booking_source: 'sms' | 'naver' | 'phone' | 'other' | null
}

export function EditReservationDialog({
  reservation,
  open,
  onOpenChange,
  onSave,
}: EditReservationDialogProps) {
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

  useEffect(() => {
    if (reservation) {
      form.reset({
        guest_name: reservation.guest_name,
        guest_phone: reservation.guest_phone,
        check_in_date: parseISO(reservation.check_in_date),
        check_out_date: parseISO(reservation.check_out_date),
        booking_source: reservation.booking_source || null,
      })
    }
  }, [reservation, form])

  const onSubmit = async (data: ReservationFormData) => {
    if (!reservation) return

    // 필수 필드 검증
    if (!data.guest_name || !data.guest_phone || !data.check_in_date || !data.check_out_date) {
      setError("모든 필드를 입력해주세요.")
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
      await onSave(reservation.id, {
        guest_name: data.guest_name,
        guest_phone: data.guest_phone,
        check_in_date: data.check_in_date.toISOString().split("T")[0],
        check_out_date: data.check_out_date.toISOString().split("T")[0],
        booking_source: data.booking_source,
      })
      onOpenChange(false)
    } catch (err: any) {
      console.error("예약 수정 오류:", err)
      setError(err.message || "예약 수정 중 오류가 발생했습니다.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>예약 수정</DialogTitle>
          <DialogDescription>
            예약 정보를 수정하세요
          </DialogDescription>
        </DialogHeader>

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
                        className="w-full"
                        onClick={() => field.onChange('sms')}
                      >
                        문자예약
                      </Button>
                      <Button
                        type="button"
                        variant={field.value === 'naver' ? 'default' : 'outline'}
                        className="w-full"
                        onClick={() => field.onChange('naver')}
                      >
                        네이버예약
                      </Button>
                      <Button
                        type="button"
                        variant={field.value === 'phone' ? 'default' : 'outline'}
                        className="w-full"
                        onClick={() => field.onChange('phone')}
                      >
                        전화예약
                      </Button>
                      <Button
                        type="button"
                        variant={field.value === 'other' ? 'default' : 'outline'}
                        className="w-full"
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

            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                취소
              </Button>
              <Button type="submit" className="flex-1" disabled={loading}>
                {loading ? "저장 중..." : "저장"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

