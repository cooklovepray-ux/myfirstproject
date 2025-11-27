# 환경 변수 설정 가이드

## Supabase에서 Anon Key 찾기

### 1. Supabase Dashboard 접속
https://app.supabase.com

### 2. 프로젝트 선택
배포하려는 Supabase 프로젝트를 선택합니다.

### 3. Settings → API 메뉴로 이동
좌측 사이드바에서 "Settings" → "API" 클릭

### 4. Project API keys 섹션에서 찾기
"Project API keys" 섹션에서 다음을 확인:

- **anon public**: 이것이 `VITE_SUPABASE_ANON_KEY`에 사용할 값입니다
- **Project URL**: 이것이 `VITE_SUPABASE_URL`에 사용할 값입니다

### 5. 값 복사
- anon 키 옆의 복사 버튼 클릭
- 또는 전체 키를 선택하여 복사 (Ctrl+C)

---

## 로컬 개발용 .env 파일 (선택사항)

로컬 개발을 위해 프로젝트 루트에 `.env` 파일을 만들 수 있습니다:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlvdXItcHJvamVjdC1pZCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNjQxOTY2NDAwLCJleHAiOjE5NTc1NDI0MDB9.your-anon-key-here
```

**주의**: `.env` 파일은 `.gitignore`에 포함되어 있어 Git에 커밋되지 않습니다.

---

## Vercel에 환경 변수 입력

### 방법 1: 웹 대시보드

1. Vercel Dashboard → 프로젝트 선택
2. Settings → Environment Variables
3. "Add New" 클릭
4. 다음 정보 입력:

#### 첫 번째 환경 변수
- **Key**: `VITE_SUPABASE_URL`
- **Value**: Supabase Project URL (예: `https://xxxxx.supabase.co`)
- **Environment**: Production, Preview, Development 모두 체크
- **Save** 클릭

#### 두 번째 환경 변수
- **Key**: `VITE_SUPABASE_ANON_KEY`
- **Value**: Supabase anon public 키 (위에서 복사한 값)
- **Environment**: Production, Preview, Development 모두 체크
- **Save** 클릭

### 방법 2: Vercel CLI

```bash
# Vercel CLI 설치 (필요시)
npm i -g vercel

# 프로젝트 디렉토리에서
cd D:\Dev\vibe-coding\myfirstproject

# 환경 변수 추가
vercel env add VITE_SUPABASE_URL production
# 프롬프트가 나타나면 Supabase URL 입력

vercel env add VITE_SUPABASE_ANON_KEY production
# 프롬프트가 나타나면 anon key 입력
```

---

## 환경 변수 확인

설정 후 다음을 확인하세요:

- [ ] `VITE_SUPABASE_URL` 설정 완료
- [ ] `VITE_SUPABASE_ANON_KEY` 설정 완료
- [ ] Production 환경에 설정됨
- [ ] Preview 환경에 설정됨 (선택사항)
- [ ] Development 환경에 설정됨 (선택사항)

---

## 중요 사항

1. **변수명은 반드시 `VITE_`로 시작해야 합니다**
   - Vite는 `VITE_` 접두사가 있는 환경 변수만 클라이언트 번들에 포함시킵니다

2. **환경 변수 추가 후 재배포 필요**
   - 환경 변수를 추가하거나 수정한 후에는 재배포가 필요합니다
   - Vercel이 자동으로 재배포하거나, 수동으로 "Redeploy" 클릭

3. **보안**
   - `anon` 키는 공개 키이지만, Supabase RLS(Row Level Security)로 보호됩니다
   - 서비스 키(service_role)는 절대 클라이언트에 노출하지 마세요

---

## 문제 해결

### 환경 변수가 로드되지 않는 경우

1. 변수명 확인: `VITE_` 접두사 확인
2. 재배포 확인: 환경 변수 추가 후 새 배포 생성 확인
3. 브라우저 콘솔 확인: 개발자 도구에서 에러 메시지 확인
4. 빌드 로그 확인: Vercel Dashboard에서 빌드 로그 확인

