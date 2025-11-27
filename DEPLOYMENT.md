# Vercel 배포 가이드

## 사전 준비

### 1. 빌드 테스트

로컬에서 빌드가 성공하는지 확인:

```bash
npm run build
```

빌드 성공 시 `dist` 폴더가 생성됩니다.

### 2. 환경 변수 확인

다음 환경 변수가 필요합니다:

- `VITE_SUPABASE_URL`: Supabase 프로젝트 URL
- `VITE_SUPABASE_ANON_KEY`: Supabase Anonymous Key

## Vercel 배포 단계

### 1. Vercel 프로젝트 생성

1. [Vercel](https://vercel.com)에 로그인
2. "Add New..." → "Project" 클릭
3. GitHub 저장소 연결 또는 코드 업로드

### 2. 프로젝트 설정

Vercel이 자동으로 다음을 감지합니다:
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 3. 환경 변수 설정

프로젝트 설정 → Environment Variables에서 다음 변수 추가:

| 변수명 | 설명 | 예시 |
|--------|------|------|
| `VITE_SUPABASE_URL` | Supabase 프로젝트 URL | `https://xxxxx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Supabase Anonymous Key | `eyJhbGci...` |

**중요**: 
- Production, Preview, Development 환경 모두에 설정
- 변수명 앞에 `VITE_` 접두사 필수

### 4. Supabase 설정

#### OAuth 리다이렉트 URL 설정

Supabase Dashboard → Authentication → URL Configuration:

1. **Site URL**: `https://your-domain.vercel.app`
2. **Redirect URLs**에 추가:
   - `https://your-domain.vercel.app/auth/callback`
   - `https://your-domain.vercel.app/**` (와일드카드)

#### RLS 정책 확인

모든 테이블에 Row Level Security (RLS) 정책이 올바르게 설정되어 있는지 확인:

- `reservations`: 사용자별 데이터 접근 제한
- `properties`: 사용자별 데이터 접근 제한
- `subscribers`: 사용자별 데이터 접근 제한

### 5. 배포 실행

1. "Deploy" 버튼 클릭
2. 빌드 로그 확인
3. 배포 완료 후 생성된 URL 확인

### 6. 배포 후 확인 사항

- [ ] 홈페이지 로드 확인
- [ ] 로그인 기능 테스트 (카카오/네이버 OAuth)
- [ ] 이메일 로그인/회원가입 테스트
- [ ] 대시보드 접근 확인
- [ ] 예약 등록/수정/삭제 기능 테스트
- [ ] 달력 뷰 확인
- [ ] Flash-Sale 기능 테스트

## 문제 해결

### 빌드 실패

1. 로컬에서 `npm run build` 실행하여 에러 확인
2. TypeScript 타입 에러 확인: `npm run build` 출력 확인
3. 환경 변수 누락 확인: Vercel 대시보드에서 환경 변수 확인

### 환경 변수 관련 에러

- 변수명이 `VITE_`로 시작하는지 확인
- Production, Preview, Development 모두에 설정되어 있는지 확인
- 변수 값에 공백이나 특수문자가 없는지 확인

### OAuth 리다이렉트 에러

- Supabase Dashboard에서 Redirect URLs 확인
- Vercel 배포 URL과 일치하는지 확인
- 브라우저 콘솔에서 에러 메시지 확인

### CORS 에러

- Supabase Dashboard → Settings → API → CORS 설정 확인
- Vercel 도메인이 허용 목록에 있는지 확인

## 추가 리소스

- [Vercel 공식 문서](https://vercel.com/docs)
- [Supabase 공식 문서](https://supabase.com/docs)
- [Vite 배포 가이드](https://vitejs.dev/guide/static-deploy.html)

