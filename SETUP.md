# Marketplace Platform - Setup Guide

이 가이드는 마켓플레이스 플랫폼을 로컬 환경에서 실행하는 방법을 설명합니다.

## 시작하기 전에

PowerShell 실행 정책 문제로 인해 npm 명령어가 실행되지 않을 수 있습니다.
다음 중 하나의 방법을 선택하세요:

### 방법 1: 명령 프롬프트(CMD) 사용 (권장)
1. Windows 검색에서 "cmd" 입력
2. 명령 프롬프트 실행
3. 프로젝트 폴더로 이동

### 방법 2: PowerShell 정책 변경
1. PowerShell을 관리자 권한으로 실행
2. 다음 명령어 실행:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## 설치 단계

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env.example` 파일을 `.env`로 복사하고 수정:

```bash
copy .env.example .env
```

`.env` 파일 내용:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/marketplace"
NEXTAUTH_SECRET="임의의-긴-비밀키-여기에-입력"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. 데이터베이스 설정

PostgreSQL이 설치되어 있어야 합니다.

```bash
# Prisma 클라이언트 생성
npx prisma generate

# 데이터베이스 마이그레이션
npx prisma migrate dev --name init
```

### 4. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:3000` 접속

## 주요 기능

### 사용자 기능
- ✅ 회원가입/로그인 (이메일, Google)
- ✅ 프로젝트 등록
- ✅ 실시간 채팅
- ✅ 대시보드

### 사업자 기능
- ✅ 프로젝트 검색
- ✅ 제안 제출
- ✅ 실시간 채팅

### 관리자 기능
- ✅ 통계 대시보드
- ✅ 사용자 관리
- ✅ 프로젝트 모니터링

## 문제 해결

### npm 명령어가 실행되지 않을 때
- 명령 프롬프트(CMD)를 사용하세요
- 또는 PowerShell 실행 정책을 변경하세요

### 데이터베이스 연결 오류
- PostgreSQL이 실행 중인지 확인
- `.env` 파일의 DATABASE_URL이 올바른지 확인

### 포트 충돌
- 3000번 포트가 이미 사용 중이면 다른 포트 사용:
```bash
PORT=3001 npm run dev
```

## 다음 단계

1. Google OAuth 설정 (선택사항)
2. 프로젝트 등록 테스트
3. 채팅 기능 테스트
4. 추가 기능 구현

자세한 내용은 `README.md`를 참조하세요.
