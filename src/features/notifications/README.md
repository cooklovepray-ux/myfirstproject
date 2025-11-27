# 알림 기능 (Notifications Feature)

## 개요

StayFollowup의 알림 기능은 숙소 호스트가 예약 관련 알림을 자동으로 발송할 수 있도록 지원합니다.

## 기능 계획

### 1. 알림 타입
- **체크인 알림**: 체크인 전날 또는 당일 발송
- **체크아웃 알림**: 체크아웃 당일 발송
- **리뷰 요청 알림**: 체크아웃 후 발송
- **Flash-Sale 알림**: 빈방 발생 시 구독자에게 발송

### 2. 알림 채널
- **SMS**: Solapi를 통한 SMS 발송
- **카카오 알림톡**: Solapi를 통한 카카오 알림톡 발송
- **이메일**: 선택적 (향후 구현)

### 3. 알림 설정
- 알림 타입별 활성화/비활성화
- 채널 선택 (SMS, 카카오 알림톡)
- 발송 시점 설정 (체크인 전 N일, 체크아웃 당일 등)
- 알림 템플릿 커스터마이징

### 4. 알림 로그
- 발송 내역 조회
- 발송 상태 확인 (대기, 발송 완료, 실패)
- 실패 알림 재시도

## 파일 구조

```
src/features/notifications/
├── components/
│   ├── NotificationSettings.tsx    # 알림 설정 UI
│   └── NotificationLog.tsx         # 알림 로그 UI
├── hooks/
│   ├── useNotificationSettings.ts  # 알림 설정 관리 Hook
│   └── useNotificationLog.ts       # 알림 로그 조회 Hook
├── services/
│   └── notificationService.ts      # 알림 발송 서비스 (Solapi 연동)
├── types/
│   └── notification.ts             # 알림 관련 타입 정의
└── README.md                        # 이 파일
```

## 데이터베이스 스키마 (예정)

### notification_settings 테이블
- 사용자별 알림 설정 저장
- 숙소별 설정 가능

### notification_logs 테이블
- 발송된 알림 내역 저장
- 발송 상태 및 결과 추적

### notification_templates 테이블
- 알림 템플릿 관리
- 타입별, 채널별 템플릿

## 구현 예정

1. **Solapi 연동**
   - SMS 발송 API 연동
   - 카카오 알림톡 API 연동
   - API 키 관리 및 환경 변수 설정

2. **알림 스케줄링**
   - 체크인/체크아웃 날짜 기반 자동 발송
   - Supabase Edge Functions 또는 외부 스케줄러 활용

3. **템플릿 관리**
   - 템플릿 편집 UI
   - 변수 치환 (예: {guest_name}, {check_in_date})

4. **에러 처리**
   - 발송 실패 시 재시도 로직
   - 에러 로깅 및 알림

## 참고

- Solapi 문서: https://docs.solapi.com/
- 카카오 알림톡 가이드: https://talk-developers.kakao.com/

