# Vercel 환경 변수 설정 가이드

## 필수 환경 변수

Vercel 프로젝트 설정에서 다음 환경 변수를 추가해야 합니다.

### 1. VITE_SUPABASE_URL

**설명**: Supabase 프로젝트 URL

**설정 방법**:
1. Supabase Dashboard 접속: https://app.supabase.com
2. 프로젝트 선택
3. Settings → API 메뉴로 이동
4. "Project URL" 값을 복사

**예시 값**:
```
https://xxxxxxxxxxxxx.supabase.co
```

**Vercel 설정**:
- Key: `VITE_SUPABASE_URL`
- Value: 위에서 복사한 Project URL
- Environment: Production, Preview, Development 모두 선택

---

### 2. VITE_SUPABASE_ANON_KEY

**설명**: Supabase Anonymous Key (공개 키)

**설정 방법**:
1. Supabase Dashboard 접속: https://app.supabase.com
2. 프로젝트 선택
3. Settings → API 메뉴로 이동
4. "Project API keys" 섹션에서 "anon" 또는 "public" 키를 복사

**예시 값**:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4eHh4eHh4eHh4eHh4eHh4eHgiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MTk2NjQwMCwiZXhwIjoxOTU3NTQyNDAwfQ.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Vercel 설정**:
- Key: `VITE_SUPABASE_ANON_KEY`
- Value: 위에서 복사한 anon/public 키
- Environment: Production, Preview, Development 모두 선택

---

## Vercel에서 환경 변수 설정하는 방법

### 방법 1: 웹 대시보드에서 설정

1. **Vercel Dashboard 접속**
   - https://vercel.com/dashboard

2. **프로젝트 선택**
   - 배포하려는 프로젝트 클릭

3. **Settings 메뉴 클릭**
   - 프로젝트 페이지 상단의 "Settings" 탭 클릭

4. **Environment Variables 메뉴 클릭**
   - 좌측 사이드바에서 "Environment Variables" 선택

5. **환경 변수 추가**
   - "Add New" 버튼 클릭
   - Key 입력: `VITE_SUPABASE_URL`
   - Value 입력: Supabase Project URL
   - Environment 선택: Production, Preview, Development 모두 체크
   - "Save" 클릭

6. **두 번째 환경 변수 추가**
   - 다시 "Add New" 버튼 클릭
   - Key 입력: `VITE_SUPABASE_ANON_KEY`
   - Value 입력: Supabase Anon Key
   - Environment 선택: Production, Preview, Development 모두 체크
   - "Save" 클릭

### 방법 2: Vercel CLI로 설정 (선택사항)

```bash
# Vercel CLI 설치 (아직 설치하지 않은 경우)
npm i -g vercel

# 프로젝트 디렉토리에서 로그인
vercel login

# 환경 변수 추가
vercel env add VITE_SUPABASE_URL production
vercel env add VITE_SUPABASE_ANON_KEY production
```

---

## 환경 변수 확인 체크리스트

설정 후 다음을 확인하세요:

- [ ] `VITE_SUPABASE_URL` 설정 완료
- [ ] `VITE_SUPABASE_ANON_KEY` 설정 완료
- [ ] Production 환경에 설정됨
- [ ] Preview 환경에 설정됨 (선택사항)
- [ ] Development 환경에 설정됨 (선택사항)

**중요**: 
- 환경 변수 이름은 반드시 `VITE_`로 시작해야 합니다
- Vite는 `VITE_` 접두사가 있는 환경 변수만 클라이언트 번들에 포함시킵니다
- 환경 변수 변경 후에는 재배포가 필요합니다

---

## 환경 변수 설정 후 재배포

환경 변수를 추가하거나 수정한 후:

1. **자동 재배포** (권장)
   - Vercel이 자동으로 새로운 배포를 트리거합니다
   - 배포 로그에서 환경 변수가 제대로 로드되었는지 확인

2. **수동 재배포**
   - Deployments 탭에서 최신 배포의 "Redeploy" 클릭
   - 또는 코드를 다시 푸시하면 자동 배포됩니다

---

## 문제 해결

### 환경 변수가 로드되지 않는 경우

1. **변수명 확인**
   - `VITE_` 접두사가 있는지 확인
   - 대소문자 정확히 일치하는지 확인

2. **재배포 확인**
   - 환경 변수 추가 후 재배포가 필요합니다
   - 새 배포가 생성되었는지 확인

3. **브라우저 콘솔 확인**
   - 배포된 사이트에서 브라우저 개발자 도구 열기
   - Console 탭에서 환경 변수 관련 에러 확인

4. **빌드 로그 확인**
   - Vercel Dashboard → Deployments → 최신 배포 클릭
   - Build Logs에서 환경 변수 관련 에러 확인

---

## 보안 참고사항

- `VITE_SUPABASE_ANON_KEY`는 공개 키이지만, Supabase RLS(Row Level Security)로 보호됩니다
- 서비스 키(Service Key)는 절대 클라이언트에 노출하지 마세요
- 환경 변수는 Vercel 대시보드에서만 관리하고, 코드에 하드코딩하지 마세요

