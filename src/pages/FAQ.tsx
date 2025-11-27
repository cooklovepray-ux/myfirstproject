import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Home, ChevronDown } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface FAQItem {
  question: string
  answer: string
}

const faqData: FAQItem[] = [
  {
    question: "StayFollowup는 어떤 서비스인가요?",
    answer: "StayFollowup은 국내 숙소 호스트를 위한 예약 자동 메시지 발송 및 달력 관리 서비스입니다. 체크인/체크아웃 안내 메시지를 자동으로 발송하고, 여러 숙소의 예약 현황을 한눈에 관리할 수 있습니다."
  },
  {
    question: "어떤 방식으로 로그인할 수 있나요?",
    answer: "카카오, 네이버 소셜 로그인 또는 이메일과 전화번호를 이용한 회원가입으로 서비스를 이용할 수 있습니다."
  },
  {
    question: "여러 숙소를 등록할 수 있나요?",
    answer: "네, 최대 5개까지 숙소를 등록할 수 있습니다. 각 숙소별로 예약을 관리할 수 있으며, 기본 숙소를 설정할 수 있습니다."
  },
  {
    question: "예약 알림은 어떻게 발송되나요?",
    answer: "체크인/체크아웃 안내 메시지와 리뷰 요청 메시지를 수동으로 발송할 수 있습니다. 현재는 SMS/카카오 알림톡 발송 기능이 준비 중이며, 곧 자동 발송 기능이 추가될 예정입니다."
  },
  {
    question: "Flash-Sale 기능은 무엇인가요?",
    answer: "빈방이 발생했을 때 구독자에게 즉시 알림을 보내는 기능입니다. Excel 파일로 구독자 목록을 업로드하고, 빈날을 선택하여 일괄 알림을 발송할 수 있습니다."
  },
  {
    question: "예약을 수정하거나 취소할 수 있나요?",
    answer: "네, 예약 카드에서 수정 버튼을 클릭하여 예약 정보를 변경하거나, 취소 버튼으로 예약 상태를 취소로 변경할 수 있습니다. 완전 삭제도 가능합니다."
  },
  {
    question: "달력에서 예약을 확인할 수 있나요?",
    answer: "네, 대시보드 하단의 달력에서 예약이 있는 날짜를 확인할 수 있습니다. 예약이 있는 날짜는 강조 표시되며, 날짜를 클릭하면 해당 날짜의 예약 목록을 볼 수 있습니다."
  },
  {
    question: "서비스 이용료는 얼마인가요?",
    answer: "현재 MVP 버전은 무료로 이용할 수 있습니다. 향후 요금제가 추가될 예정입니다."
  }
]

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-background via-background to-primary/5">
      <div className="max-w-4xl mx-auto space-y-6 md:space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              자주 묻는 질문
            </h1>
            <p className="text-muted-foreground">
              StayFollowup에 대해 궁금한 점을 확인하세요
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link to="/">
              <Home className="h-4 w-4 mr-2" />
              홈으로
            </Link>
          </Button>
        </div>

        <div className="space-y-4">
          {faqData.map((faq, index) => (
            <Card 
              key={index}
              className={cn(
                "border-border/50 transition-all duration-200 cursor-pointer",
                openIndex === index 
                  ? "border-primary/30 shadow-lg shadow-primary/5 bg-gradient-to-br from-card to-card/80" 
                  : "hover:border-primary/20 hover:shadow-md bg-card/50"
              )}
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-semibold pr-8">
                    {faq.question}
                  </CardTitle>
                  <ChevronDown 
                    className={cn(
                      "h-5 w-5 text-muted-foreground transition-transform duration-200 flex-shrink-0",
                      openIndex === index && "transform rotate-180"
                    )}
                  />
                </div>
              </CardHeader>
              {openIndex === index && (
                <CardContent className="pt-0 pb-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        <Card className="border-primary/20 bg-gradient-to-br from-primary/10 to-transparent">
          <CardHeader>
            <CardTitle className="text-lg">더 궁금한 점이 있으신가요?</CardTitle>
            <CardDescription>
              문의사항이 있으시면 언제든지 연락주세요
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              이메일: support@stayfollowup.com
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

