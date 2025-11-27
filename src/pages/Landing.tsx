import { useEffect } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/AuthContext"
import { useNavigate } from "react-router-dom"
import { HelpCircle, Star, CheckCircle2, Sparkles, Users } from "lucide-react"
import { Footer } from "@/components/Footer"

export function Landing() {
  const { signInWithKakao, signInWithNaver, user, loading } = useAuth()
  const navigate = useNavigate()

  // 이미 로그인된 경우 대시보드로 리다이렉트
  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard', { replace: true })
    }
  }, [user, loading, navigate])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-muted-foreground">로딩 중...</div>
      </div>
    )
  }

  if (user) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-primary/5">
      <div className="flex-1 p-4 sm:p-8">
        <div className="max-w-7xl mx-auto space-y-8 sm:space-y-12">
        <div className="text-center space-y-4 pt-8 sm:pt-12">
          <div className="inline-block p-3 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 mb-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              StayFollowup
            </h1>
          </div>
          <p className="text-muted-foreground text-lg sm:text-xl max-w-2xl mx-auto">
            국내 숙소 호스트를 위한 예약 자동 메시지 발송 + 달력 관리 서비스
          </p>
        </div>

        {/* 메인 콘텐츠: 2열 레이아웃 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* 왼쪽: Why StayFollowup 섹션 */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-6">Why StayFollowup?</h2>
            </div>

            {/* 요금제 플랜 */}
            <Card className="border-primary/20 bg-gradient-to-br from-primary/10 to-primary/5 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <CardTitle className="text-xl">요금제</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-4 bg-card rounded-lg border border-primary/20">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-bold text-lg">Basic</h3>
                        <p className="text-sm text-muted-foreground">1숙소 호스트</p>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-bold text-primary">9,900원</span>
                        <span className="text-xs text-muted-foreground block">/월</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-card rounded-lg border border-primary/20">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-bold text-lg">Pro</h3>
                        <p className="text-sm text-muted-foreground">3~5개 숙소 운영자</p>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-bold text-primary">29,900원</span>
                        <span className="text-xs text-muted-foreground block">/월</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 서비스 장점 3가지 */}
            <Card className="border-primary/10 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">서비스 장점</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">자동화된 예약 관리</p>
                    <p className="text-sm text-muted-foreground">
                      체크인/체크아웃 안내를 자동으로 발송하여 수동 작업을 줄입니다
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">통합 달력 관리</p>
                    <p className="text-sm text-muted-foreground">
                      여러 숙소의 예약을 한 곳에서 한눈에 확인하고 관리할 수 있습니다
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">빈방 즉시 알림</p>
                    <p className="text-sm text-muted-foreground">
                      Flash-Sale 기능으로 빈방 발생 시 즉시 구독자에게 알림을 보냅니다
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 고객 경험 리뷰 3개 */}
            <Card className="border-primary/10 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  고객 경험 리뷰
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <span className="text-sm font-semibold">김호스트님</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    "예약 안내 메시지 발송이 자동화되어 정말 편리해졌어요. 실수도 없고 시간도 많이 절약됩니다!"
                  </p>
                </div>
                <div className="space-y-2 p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <span className="text-sm font-semibold">이호스트님</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    "네이버 예약이나 다른 예약 사이트에서 예약이 들어오면 자동으로 보내주는 기능이 없어서, 매번 기억하기도 번거롭고 문자 보내는 것도 일이었어요."
                  </p>
                </div>
                <div className="space-y-2 p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <span className="text-sm font-semibold">박호스트님</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    "Flash-Sale 기능으로 빈방이 생기면 바로 알림을 보낼 수 있어서 매출 손실을 줄일 수 있었어요!"
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 오른쪽: 로그인/회원가입 폼 */}
          <div className="space-y-6">
            {/* 영상/일러스트레이션 영역 */}
            <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 shadow-lg">
              {/* 플레이스홀더 - 실제 영상이나 일러스트로 교체 가능 */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center space-y-4 p-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/20 border-2 border-primary/30">
                    <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-foreground">숙소 운영의 새로운 경험</h3>
                    <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                      StayFollowup으로 여러 숙소를 자동화하며<br />
                      효율적으로 운영하는 모습을 확인해보세요
                    </p>
                  </div>
                </div>
              </div>
              {/* 장식 요소 */}
              <div className="absolute top-4 right-4 w-16 h-16 rounded-full bg-primary/10 border border-primary/20 blur-xl"></div>
              <div className="absolute bottom-4 left-4 w-12 h-12 rounded-full bg-accent/10 border border-accent/20 blur-lg"></div>
            </div>

            {/* 로그인 폼 */}
            <Card className="border-primary/20 shadow-xl shadow-primary/5 bg-card/50 backdrop-blur-sm w-full">
              <CardHeader className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">로그인</CardTitle>
                    <CardDescription className="text-base">
                      소셜 로그인 또는 이메일로 시작하세요
                    </CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-foreground">
                    <Link to="/faq">
                      <HelpCircle className="h-4 w-4 mr-1" />
                      FAQ
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Button 
                    className="w-full h-12 text-base font-medium bg-gradient-to-r from-[#FEE500] to-[#FEE500]/90 hover:from-[#FEE500]/90 hover:to-[#FEE500] text-[#000000] shadow-lg shadow-[#FEE500]/20 transition-all duration-200" 
                    onClick={() => {
                      signInWithKakao().catch((error) => {
                        console.error('로그인 오류:', error)
                        alert('로그인 중 오류가 발생했습니다.')
                      })
                    }}
                  >
                    카카오로 로그인
                  </Button>
                  <Button 
                    className="w-full h-12 text-base font-medium bg-gradient-to-r from-[#03C75A] to-[#03C75A]/90 hover:from-[#03C75A]/90 hover:to-[#03C75A] text-white shadow-lg shadow-[#03C75A]/20 transition-all duration-200" 
                    onClick={() => {
                      signInWithNaver().catch((error) => {
                        console.error('로그인 오류:', error)
                        alert('로그인 중 오류가 발생했습니다.')
                      })
                    }}
                  >
                    네이버로 로그인
                  </Button>
                </div>
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      또는
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button 
                    className="w-full" 
                    variant="secondary"
                    asChild
                  >
                    <Link to="/login">이메일로 로그인</Link>
                  </Button>
                  <Button 
                    className="w-full" 
                    variant="outline"
                    asChild
                  >
                    <Link to="/signup">이메일로 회원가입</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ 섹션 */}
        <div className="space-y-4 pt-8">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">자주 묻는 질문</h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              궁금한 점이 있으신가요?
            </p>
          </div>
          <Card className="border-primary/20 shadow-lg shadow-primary/5 bg-card/50">
            <CardContent className="pt-6">
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground text-center">
                  StayFollowup에 대해 궁금한 점이 있으신가요?
                </p>
                <div className="flex justify-center">
                  <Button asChild variant="outline" className="w-full sm:w-auto">
                    <Link to="/faq">
                      <HelpCircle className="h-4 w-4 mr-2" />
                      FAQ 전체 보기
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
