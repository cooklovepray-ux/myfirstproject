# .env 파일 복구 가이드

.env 파일을 실수로 지우셨다면, 다음 단계를 따라 복구하세요.

## 1. .env 파일 생성

프로젝트 루트 디렉토리(`D:\Dev\vibe-coding\myfirstproject`)에 `.env` 파일을 생성하세요.

## 2. 환경 변수 입력

`.env` 파일에 다음 내용을 입력하세요:

```env
# Supabase 환경 변수
VITE_SUPABASE_URL=your_supabase_project_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

## 3. Supabase에서 값 가져오기

### VITE_SUPABASE_URL
1. Supabase Dashboard 접속: https://app.supabase.com
2. 프로젝트 선택
3. Settings → API 메뉴로 이동
4. "Project URL" 값을 복사하여 `VITE_SUPABASE_URL`에 입력

### VITE_SUPABASE_ANON_KEY
1. Supabase Dashboard → Settings → API
2. "Project API keys" 섹션에서 "anon public" 키 복사
3. `VITE_SUPABASE_ANON_KEY`에 입력

## 4. 완성된 .env 파일 예시

```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4eHh4eHh4eHh4eHh4eHh4eHgiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MTk2NjQwMCwiZXhwIjoxOTU3NTQyNDAwfQ.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## 5. 파일 저장 위치 확인

파일은 반드시 프로젝트 루트에 있어야 합니다:
```
D:\Dev\vibe-coding\myfirstproject\.env
```

## 6. 확인

파일을 저장한 후 개발 서버를 재시작하세요:
```bash
npm run dev
```

환경 변수가 제대로 로드되면 콘솔에 에러가 나타나지 않습니다.

## 참고

- `.env` 파일은 `.gitignore`에 포함되어 있어 Git에 커밋되지 않습니다
- 실제 키 값은 절대 Git에 커밋하지 마세요
- `.env.example` 파일을 참고하여 필요한 환경 변수를 확인할 수 있습니다

