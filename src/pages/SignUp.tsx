import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { supabase } from "@/lib/supabase"

export function SignUp() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [phone, setPhone] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            phone: phone,
          },
        },
      })

      if (signUpError) {
        throw signUpError
      }

      if (data.user) {
        // 회원가입 성공 - 이메일 확인 필요할 수 있음
        alert("회원가입이 완료되었습니다. 이메일을 확인해주세요.")
        navigate("/")
      }
    } catch (err: any) {
      console.error("회원가입 오류:", err)
      setError(err.message || "회원가입 중 오류가 발생했습니다.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>회원가입</CardTitle>
          <CardDescription>
            이메일과 비밀번호로 계정을 만드세요
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                이메일
              </label>
              <Input
                id="email"
                type="email"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="min-h-[44px] sm:min-h-0"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium">
                전화번호
              </label>
              <Input
                id="phone"
                type="tel"
                placeholder="010-1234-5678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="min-h-[44px] sm:min-h-0"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                비밀번호
              </label>
              <Input
                id="password"
                type="password"
                placeholder="비밀번호를 입력하세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="min-h-[44px] sm:min-h-0"
              />
            </div>

            {error && (
              <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full min-h-[44px] sm:min-h-0" disabled={loading}>
              {loading ? "처리 중..." : "회원가입"}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            <span className="text-muted-foreground">이미 계정이 있으신가요? </span>
            <Link to="/login" className="text-primary hover:underline">
              로그인
            </Link>
          </div>

          <div className="mt-4 text-center text-sm">
            <Link to="/" className="text-muted-foreground hover:underline">
              ← 홈으로 돌아가기
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

