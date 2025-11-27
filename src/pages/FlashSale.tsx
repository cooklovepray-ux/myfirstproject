import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/AuthContext"
import { useProperty } from "@/contexts/PropertyContext"
import { Home, Bell, Users, Calendar as CalendarIcon, Upload, FileSpreadsheet, X } from "lucide-react"
import { useState, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { sendFlashSaleNotification } from "@/features/notifications/services/notificationService"
import { useSubscribers } from "@/hooks/useSubscribers"
import * as XLSX from "xlsx"

export function FlashSale() {
  const { user } = useAuth()
  const { currentProperty } = useProperty()
  const { subscribers: dbSubscribers, bulkCreateSubscribers, refetch } = useSubscribers()
  const [sending, setSending] = useState(false)
  const [selectedDates, setSelectedDates] = useState<string[]>([])
  const [uploadedPhones, setUploadedPhones] = useState<string[]>([])
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Excel 파일만 허용
    const validExtensions = ['.xlsx', '.xls', '.csv']
    const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase()
    
    if (!validExtensions.includes(fileExtension)) {
      alert('Excel 파일(.xlsx, .xls) 또는 CSV 파일만 업로드 가능합니다.')
      return
    }

    try {
      const data = await file.arrayBuffer()
      const workbook = XLSX.read(data, { type: 'array' })
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
      const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 }) as any[][]

      // 전화번호 추출 (첫 번째 열 또는 '전화번호', 'phone', '연락처' 등의 헤더 찾기)
      const phoneNumbers: string[] = []
      const headers = jsonData[0] || []
      
      // 헤더에서 전화번호 열 찾기
      let phoneColumnIndex = -1
      const phoneKeywords = ['전화번호', 'phone', '연락처', 'tel', '휴대폰', 'mobile']
      
      headers.forEach((header, index) => {
        if (phoneColumnIndex === -1 && phoneKeywords.some(keyword => 
          String(header).toLowerCase().includes(keyword.toLowerCase())
        )) {
          phoneColumnIndex = index
        }
      })

      // 헤더가 없거나 전화번호 열을 찾지 못한 경우 첫 번째 열 사용
      if (phoneColumnIndex === -1) {
        phoneColumnIndex = 0
      }

      // 데이터에서 전화번호 추출
      const startRow = headers.some(h => phoneKeywords.some(k => 
        String(h).toLowerCase().includes(k.toLowerCase())
      )) ? 1 : 0 // 헤더가 있으면 1행부터, 없으면 0행부터

      for (let i = startRow; i < jsonData.length; i++) {
        const row = jsonData[i]
        if (row && row[phoneColumnIndex]) {
          let phone = String(row[phoneColumnIndex]).trim()
          // 하이픈 제거 및 숫자만 추출
          phone = phone.replace(/[^0-9]/g, '')
          // 한국 전화번호 형식 체크 (10자리 또는 11자리)
          if (phone.length >= 10 && phone.length <= 11) {
            // 010-1234-5678 형식으로 포맷팅
            if (phone.length === 11) {
              phone = `${phone.slice(0, 3)}-${phone.slice(3, 7)}-${phone.slice(7)}`
            } else if (phone.length === 10) {
              phone = `${phone.slice(0, 3)}-${phone.slice(3, 6)}-${phone.slice(6)}`
            }
            if (!phoneNumbers.includes(phone)) {
              phoneNumbers.push(phone)
            }
          }
        }
      }

      if (phoneNumbers.length === 0) {
        alert('전화번호를 찾을 수 없습니다. Excel 파일의 첫 번째 열에 전화번호가 있는지 확인해주세요.')
        return
      }

      setUploadedPhones(phoneNumbers)
      setUploadedFileName(file.name)
      
      // 구독자 DB에 저장
      try {
        await bulkCreateSubscribers(phoneNumbers)
        alert(`${phoneNumbers.length}개의 전화번호가 구독자로 추가되었습니다.`)
        await refetch()
      } catch (error) {
        console.error('구독자 추가 오류:', error)
        alert('일부 전화번호는 이미 등록되어 있거나 추가에 실패했습니다.')
      }
    } catch (error) {
      console.error('파일 읽기 오류:', error)
      alert('파일을 읽는 중 오류가 발생했습니다.')
    }
  }

  const handleRemoveFile = () => {
    setUploadedPhones([])
    setUploadedFileName(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }
  
  // 활성화된 구독자 전화번호 목록
  const activeSubscriberPhones = dbSubscribers
    .filter(s => s.is_active)
    .map(s => s.phone)

  const handleSendFlashSale = async () => {
    if (!currentProperty) {
      alert("먼저 숙소를 선택해주세요.")
      return
    }

    if (selectedDates.length === 0) {
      alert("빈날을 선택해주세요.")
      return
    }

    const phonesToSend = activeSubscriberPhones.length > 0 
      ? activeSubscriberPhones 
      : uploadedPhones
    
    if (phonesToSend.length === 0) {
      alert("구독자가 없습니다. Excel 파일을 업로드하거나 구독자를 추가해주세요.")
      return
    }

    setSending(true)
    try {
      const phonesToSend = activeSubscriberPhones.length > 0 
        ? activeSubscriberPhones 
        : uploadedPhones
        
      const result = await sendFlashSaleNotification(
        phonesToSend,
        currentProperty.name,
        selectedDates
      )

      if (result.success) {
        alert(`Flash-Sale 알림이 ${result.sentCount}명에게 발송되었습니다.`)
        setSelectedDates([])
      } else {
        alert(`알림 발송 중 오류가 발생했습니다.`)
      }
    } catch (error) {
      console.error("Flash-Sale 발송 오류:", error)
      alert("Flash-Sale 발송 중 오류가 발생했습니다.")
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6 md:space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Flash-Sale</h1>
            <p className="text-muted-foreground">
              빈방 발생 시 구독자에게 즉시 알림을 보내세요
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link to="/dashboard">
                <Home className="h-4 w-4 mr-2" />
                대시보드
              </Link>
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>구독자 관리</CardTitle>
            <CardDescription>
              Flash-Sale 알림을 받을 구독자 전화번호를 관리하세요
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {dbSubscribers.length > 0 ? (
              <div className="space-y-2">
                <p className="text-sm font-medium">
                  총 {dbSubscribers.length}명의 구독자 (활성: {activeSubscriberPhones.length}명)
                </p>
                <div className="max-h-48 overflow-y-auto space-y-1">
                  {dbSubscribers.map((subscriber) => (
                    <div
                      key={subscriber.id}
                      className="flex items-center justify-between p-2 border rounded-lg text-sm"
                    >
                      <div>
                        <span className="font-medium">{subscriber.phone}</span>
                        {subscriber.name && (
                          <span className="text-muted-foreground ml-2">({subscriber.name})</span>
                        )}
                        {!subscriber.is_active && (
                          <span className="text-xs text-muted-foreground ml-2">(비활성)</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center py-8">
                <p className="text-muted-foreground text-sm">
                  등록된 구독자가 없습니다. Excel 파일을 업로드하여 구독자를 추가하세요.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>빈날 알림 발송</CardTitle>
            <CardDescription>
              빈방이 발생한 날짜를 선택하여 구독자에게 알림을 보내세요
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>구독자 목록 업로드 (Excel 파일)</Label>
              <div className="flex items-center gap-2">
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <Label
                  htmlFor="file-upload"
                  className="flex-1 cursor-pointer border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 sm:p-6 hover:border-primary/50 transition-colors min-h-[120px] sm:min-h-[100px] flex items-center justify-center"
                >
                  <div className="flex flex-col items-center justify-center gap-2 text-center">
                    <Upload className="h-8 w-8 sm:h-10 sm:w-10 text-muted-foreground" />
                    <div className="text-xs sm:text-sm">
                      <span className="text-primary font-medium">클릭하여 파일 선택</span>
                      <span className="text-muted-foreground hidden sm:inline"> 또는 드래그 앤 드롭</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Excel (.xlsx, .xls) 또는 CSV 파일
                    </p>
                  </div>
                </Label>
              </div>
              
              {uploadedFileName && (
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg gap-2">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <FileSpreadsheet className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{uploadedFileName}</p>
                      <p className="text-xs text-muted-foreground">
                        {uploadedPhones.length}개 전화번호
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRemoveFile}
                    className="flex-shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}

              {uploadedPhones.length > 0 && (
                <div className="max-h-32 overflow-y-auto p-2 bg-muted/30 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">업로드된 전화번호:</p>
                  <div className="flex flex-wrap gap-1">
                    {uploadedPhones.slice(0, 10).map((phone, index) => (
                      <span
                        key={index}
                        className="text-xs px-2 py-1 bg-background rounded"
                      >
                        {phone}
                      </span>
                    ))}
                    {uploadedPhones.length > 10 && (
                      <span className="text-xs px-2 py-1 text-muted-foreground">
                        외 {uploadedPhones.length - 10}개...
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>빈날 선택</Label>
              <Input
                type="date"
                placeholder="빈날을 선택하세요"
                onChange={(e) => {
                  if (e.target.value && !selectedDates.includes(e.target.value)) {
                    setSelectedDates([...selectedDates, e.target.value])
                  }
                }}
              />
              {selectedDates.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedDates.map((date, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-primary/10 text-primary rounded-md text-sm flex items-center gap-2"
                    >
                      {new Date(date).toLocaleDateString('ko-KR')}
                      <button
                        onClick={() => {
                          setSelectedDates(selectedDates.filter((_, i) => i !== index))
                        }}
                        className="text-primary hover:text-primary/80"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <Button
              onClick={handleSendFlashSale}
              disabled={sending || selectedDates.length === 0 || (activeSubscriberPhones.length === 0 && uploadedPhones.length === 0) || !currentProperty}
              className="w-full min-h-[44px] sm:min-h-0"
              size="lg"
            >
              <Bell className="h-4 w-4 mr-2" />
              {sending ? "발송 중..." : `알림 보내기 (${activeSubscriberPhones.length || uploadedPhones.length}명)`}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>발송 기록</CardTitle>
            <CardDescription>
              발송된 Flash-Sale 알림 내역을 확인할 수 있습니다
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8">
              <p className="text-muted-foreground text-sm">
                발송 기록 기능은 곧 추가될 예정입니다.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

