# StayFollowup

국내 숙소 호스트를 위한 예약 자동 메시지 발송 + 달력 관리 서비스

## 기술 스택

- React 19 + TypeScript
- Vite
- Tailwind CSS + shadcn/ui
- Supabase (Auth, Database)
- React Router DOM

## 개발 환경 설정

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 다음 변수를 설정하세요:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. 개발 서버 실행

```bash
npm run dev
```

## 빌드 및 배포

### 로컬 빌드 테스트

```bash
npm run build
npm run preview
```

### Vercel 배포

1. **Vercel 프로젝트 생성**
   - [Vercel](https://vercel.com)에 로그인
   - "New Project" 클릭
   - GitHub 저장소 연결 또는 코드 업로드

2. **환경 변수 설정**
   - Vercel 대시보드에서 프로젝트 설정 → Environment Variables
   - 다음 변수 추가:
     - `VITE_SUPABASE_URL`: Supabase 프로젝트 URL
     - `VITE_SUPABASE_ANON_KEY`: Supabase Anonymous Key

3. **빌드 설정 확인**
   - Framework Preset: Vite
   - Build Command: `npm run build` (자동 감지)
   - Output Directory: `dist` (자동 감지)
   - Install Command: `npm install` (자동 감지)

4. **배포**
   - "Deploy" 버튼 클릭
   - 배포 완료 후 자동으로 URL 생성

### 배포 체크리스트

- [ ] 환경 변수 설정 완료
- [ ] 빌드 테스트 통과 (`npm run build`)
- [ ] Supabase RLS 정책 확인
- [ ] OAuth 리다이렉트 URL 설정 (Supabase Dashboard → Authentication → URL Configuration)
  - Production URL: `https://your-domain.vercel.app`
  - Redirect URLs: `https://your-domain.vercel.app/auth/callback`

---

## 기존 템플릿 정보

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
