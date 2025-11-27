import { Link } from "react-router-dom"
import { Mail, Phone, MapPin, FileText, Shield } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t bg-muted/30 mt-16">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* 회사 정보 */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">StayFollowup</h3>
            <p className="text-sm text-muted-foreground">
              국내 숙소 호스트를 위한 예약 자동 메시지 발송 + 달력 관리 서비스
            </p>
          </div>

          {/* 사업자 정보 */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">사업자 정보</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-start gap-2">
                <FileText className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>사업자등록번호: <span className="text-foreground">000-00-00000</span></span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span className="text-foreground">주소: 서울특별시 강남구 테헤란로 123</span>
              </div>
            </div>
          </div>

          {/* 담당자 정보 */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">담당자 정보</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="text-foreground">담당자: 케이트</span>
              </div>
              <div className="flex items-start gap-2">
                <Phone className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span className="text-foreground">연락처: 010-3233-3845</span>
              </div>
              <div className="flex items-start gap-2">
                <Mail className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span className="text-foreground">이메일: shinaes@naver.com</span>
              </div>
            </div>
          </div>

          {/* 기타 정보 */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">기타 정보</h3>
            <div className="space-y-2 text-sm">
              <Link 
                to="/faq" 
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Shield className="h-4 w-4" />
                FAQ
              </Link>
              <div className="text-muted-foreground">
                <p>이용약관</p>
                <p>개인정보처리방침</p>
              </div>
            </div>
          </div>
        </div>

        {/* 하단 저작권 정보 */}
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>© 2024 StayFollowup. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

