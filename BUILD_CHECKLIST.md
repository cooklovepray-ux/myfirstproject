# 빌드 및 배포 체크리스트

## ✅ 빌드 준비 완료

### 1. 빌드 스크립트 확인
- ✅ `package.json`에 `build` 스크립트 설정됨: `tsc -b && vite build`
- ✅ TypeScript 컴파일 및 Vite 빌드 포함

### 2. Vercel 설정 파일
- ✅ `vercel.json` 생성 완료
  - Build Command: `npm run build`
  - Output Directory: `dist`
  - SPA 라우팅 설정 완료 (rewrites)

### 3. 환경 변수 확인
필요한 환경 변수:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## 🔧 로컬 빌드 테스트

터미널에서 다음 명령어로 빌드 테스트를 실행하세요:

```bash
cd D:\Dev\vibe-coding\myfirstproject
npm run build
```

**예상 결과:**
- `dist` 폴더 생성
- TypeScript 컴파일 성공
- Vite 빌드 성공
- 에러 없이 완료

**빌드 실패 시:**
1. TypeScript 에러 확인: `tsc -b` 출력 확인
2. 의존성 확인: `npm install` 재실행
3. 타입 에러 수정 후 재빌드

## 🚀 Vercel 배포 단계

### 1단계: GitHub에 푸시 (선택사항)
```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 2단계: Vercel 프로젝트 생성
1. [Vercel Dashboard](https://vercel.com/dashboard) 접속
2. "Add New..." → "Project" 클릭
3. GitHub 저장소 선택 또는 코드 업로드

### 3단계: 환경 변수 설정
Vercel 프로젝트 설정 → Environment Variables:

| 변수명 | 값 예시 | 설명 |
|--------|---------|------|
| `VITE_SUPABASE_URL` | `https://xxxxx.supabase.co` | Supabase 프로젝트 URL |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGci...` | Supabase Anonymous Key |

**중요:**
- Production, Preview, Development 환경 모두에 설정
- 변수명은 반드시 `VITE_`로 시작해야 함

### 4단계: Supabase 설정
Supabase Dashboard → Authentication → URL Configuration:

1. **Site URL**: `https://your-domain.vercel.app`
2. **Redirect URLs** 추가:
   ```
   https://your-domain.vercel.app/auth/callback
   https://your-domain.vercel.app/**
   ```

### 5단계: 배포 실행
1. "Deploy" 버튼 클릭
2. 빌드 로그 확인
3. 배포 완료 대기

### 6단계: 배포 후 확인
- [ ] 홈페이지 로드 확인
- [ ] 로그인 기능 테스트
- [ ] OAuth 리다이렉트 확인
- [ ] 대시보드 접근 확인
- [ ] 예약 기능 테스트

## 📝 추가 참고사항

- 빌드 출력 폴더: `dist/`
- 프레임워크: Vite (자동 감지)
- Node.js 버전: Vercel이 자동으로 감지
- 빌드 시간: 약 1-2분 예상

## 🐛 문제 해결

### 빌드 실패
- TypeScript 타입 에러 확인
- 환경 변수 누락 확인
- 의존성 설치 확인

### 배포 후 에러
- 브라우저 콘솔 확인
- Vercel 함수 로그 확인
- Supabase 연결 확인

