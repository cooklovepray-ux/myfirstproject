import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/AuthContext"
import { useProperty } from "@/contexts/PropertyContext"
import { useProperties } from "@/hooks/useProperties"
import { NotificationSettings } from "@/features/notifications/components/NotificationSettings"
import { Home, User, Mail, Phone, LogOut, Building2, Plus, Edit, Trash2 } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function Settings() {
  const { user, signOut } = useAuth()
  const { currentProperty, setCurrentProperty, properties } = useProperty()
  const { createProperty, updateProperty, deleteProperty, setDefaultProperty, refetch } = useProperties()
  const navigate = useNavigate()
  const [isAddingProperty, setIsAddingProperty] = useState(false)
  const [isEditingProperty, setIsEditingProperty] = useState<string | null>(null)
  const [newPropertyName, setNewPropertyName] = useState("")
  const [newPropertyAddress, setNewPropertyAddress] = useState("")
  const [newPropertyPhone, setNewPropertyPhone] = useState("")

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate("/")
    } catch (error) {
      console.error("로그아웃 오류:", error)
    }
  }

  const handleAddProperty = async () => {
    if (!newPropertyName.trim()) {
      alert("숙소명을 입력해주세요.")
      return
    }

    // 최대 5개까지만 추가 가능
    if (properties.length >= 5) {
      alert("숙소는 최대 5개까지만 등록할 수 있습니다.")
      return
    }

    try {
      const newProperty = await createProperty({
        name: newPropertyName.trim(),
        address: newPropertyAddress.trim() || null,
        phone: newPropertyPhone.trim() || null,
        description: null,
      })
      
      // 새로 추가된 숙소를 현재 숙소로 설정
      if (newProperty) {
        setCurrentProperty(newProperty)
      }
      
      // 목록 새로고침
      await refetch()
      
      setNewPropertyName("")
      setNewPropertyAddress("")
      setNewPropertyPhone("")
      setIsAddingProperty(false)
    } catch (error) {
      console.error("숙소 추가 오류:", error)
      alert("숙소 추가 중 오류가 발생했습니다.")
    }
  }

  const handleDeleteProperty = async (id: string) => {
    if (!confirm("정말 이 숙소를 삭제하시겠습니까?")) return

    try {
      await deleteProperty(id)
      if (currentProperty?.id === id) {
        setCurrentProperty(null)
      }
    } catch (error) {
      console.error("숙소 삭제 오류:", error)
      alert("숙소 삭제 중 오류가 발생했습니다.")
    }
  }

  const handleSetDefault = async (id: string) => {
    try {
      await setDefaultProperty(id)
      const property = properties.find(p => p.id === id)
      if (property) {
        setCurrentProperty(property)
      }
    } catch (error) {
      console.error("기본 숙소 설정 오류:", error)
      alert("기본 숙소 설정 중 오류가 발생했습니다.")
    }
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6 md:space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">설정</h1>
            <p className="text-muted-foreground">
              계정 및 서비스 설정을 관리하세요
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
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-muted-foreground" />
              <div>
                <CardTitle>계정 정보</CardTitle>
                <CardDescription>
                  {user?.email || user?.user_metadata?.email || "로그인 정보"}
                  {currentProperty && ` · ${currentProperty.name}`}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium">로그인 이메일</p>
                <p className="text-sm text-muted-foreground">
                  {user?.email || user?.user_metadata?.email || "이메일 정보 없음"}
                </p>
              </div>
            </div>

            {user?.user_metadata?.phone && (
              <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium">전화번호</p>
                  <p className="text-sm text-muted-foreground">
                    {user.user_metadata.phone}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium">현재 숙소</p>
                <p className="text-sm text-muted-foreground">
                  {currentProperty?.name || "숙소가 없습니다"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>숙소 관리</CardTitle>
                <CardDescription>
                  여러 숙소를 등록하고 관리할 수 있습니다 (최대 5개)
                </CardDescription>
              </div>
              {!isAddingProperty && properties.length < 5 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAddingProperty(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  숙소 추가
                </Button>
              )}
              {properties.length >= 5 && (
                <p className="text-sm text-muted-foreground">
                  최대 5개까지 등록 가능
                </p>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {isAddingProperty && (
              <div className="p-4 border rounded-lg space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="property-name">숙소명 *</Label>
                  <Input
                    id="property-name"
                    placeholder="예: 강남 펜션"
                    value={newPropertyName}
                    onChange={(e) => setNewPropertyName(e.target.value)}
                    className="min-h-[44px] sm:min-h-0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="property-address">주소</Label>
                  <Input
                    id="property-address"
                    placeholder="예: 서울시 강남구"
                    value={newPropertyAddress}
                    onChange={(e) => setNewPropertyAddress(e.target.value)}
                    className="min-h-[44px] sm:min-h-0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="property-phone">전화번호</Label>
                  <Input
                    id="property-phone"
                    placeholder="예: 010-1234-5678"
                    value={newPropertyPhone}
                    onChange={(e) => setNewPropertyPhone(e.target.value)}
                    className="min-h-[44px] sm:min-h-0"
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button onClick={handleAddProperty} className="min-h-[44px] sm:min-h-0 flex-1">추가</Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsAddingProperty(false)
                      setNewPropertyName("")
                      setNewPropertyAddress("")
                      setNewPropertyPhone("")
                    }}
                    className="min-h-[44px] sm:min-h-0 flex-1"
                  >
                    취소
                  </Button>
                </div>
              </div>
            )}

            {properties.length === 0 && !isAddingProperty && (
              <div className="flex items-center justify-center py-8">
                <p className="text-muted-foreground text-sm">
                  등록된 숙소가 없습니다. 숙소를 추가해주세요.
                </p>
              </div>
            )}

            {properties.length > 0 && (
              <div className="space-y-2">
                {properties.map((property) => (
                  <div
                    key={property.id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border rounded-lg gap-3"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium">{property.name}</p>
                        {property.is_default && (
                          <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded">
                            기본
                          </span>
                        )}
                      </div>
                      {property.address && (
                        <p className="text-sm text-muted-foreground truncate">
                          {property.address}
                        </p>
                      )}
                      {property.phone && (
                        <p className="text-sm text-muted-foreground">
                          {property.phone}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      {!property.is_default && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSetDefault(property.id)}
                          className="min-h-[44px] sm:min-h-0"
                        >
                          기본 설정
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteProperty(property.id)}
                        className="min-h-[44px] sm:min-h-0"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {properties.length > 0 && (
              <div className="pt-4 border-t">
                <Label htmlFor="current-property-select">현재 숙소 선택</Label>
                <Select
                  value={currentProperty?.id || ""}
                  onValueChange={(value) => {
                    const property = properties.find(p => p.id === value)
                    if (property) {
                      setCurrentProperty(property)
                    }
                  }}
                >
                  <SelectTrigger id="current-property-select" className="mt-2">
                    <SelectValue placeholder="숙소를 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {properties.map((property) => (
                      <SelectItem key={property.id} value={property.id}>
                        {property.name}
                        {property.is_default && " (기본)"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </CardContent>
        </Card>

        <NotificationSettings />

        <Card className="border-destructive/20">
          <CardHeader>
            <CardTitle className="text-destructive">위험 구역</CardTitle>
            <CardDescription>
              계정 관련 위험한 작업입니다
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="destructive"
              onClick={handleSignOut}
              className="w-full sm:w-auto"
            >
              <LogOut className="h-4 w-4 mr-2" />
              로그아웃
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

