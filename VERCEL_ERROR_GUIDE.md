# Vercel 배포 에러 해결 가이드

## 🔴 에러 내용
```
Application error: a server-side exception has occurred
Digest: 3229314011
```

---

## 📋 즉시 확인해야 할 사항

### 1️⃣ Vercel 로그 확인 (가장 중요!)

**실제 에러 메시지를 확인하는 방법:**

1. **Vercel 대시보드** 접속: https://vercel.com/dashboard
2. 해당 프로젝트 클릭
3. **Deployments** 탭 클릭
4. 가장 최근 배포 클릭
5. **Runtime Logs** 탭에서 에러 확인

**찾아야 할 것:**
- ❌ 빨간색 에러 메시지
- 🔍 "Error:", "Failed:", "Cannot" 등의 키워드
- 📍 스택 트레이스 (어느 파일의 몇 번째 줄에서 에러 발생했는지)

---

### 2️⃣ 환경 변수 설정 확인

**Vercel Dashboard → Settings → Environment Variables**

필수 환경 변수 3개가 설정되어 있는지 확인:

| 변수명 | 값 예시 | 설명 |
|--------|---------|------|
| `DATABASE_URL` | `postgresql://...` 또는 `file:./dev.db` | 데이터베이스 연결 URL |
| `NEXTAUTH_SECRET` | `랜덤 32자 이상 문자열` | NextAuth 암호화 키 |
| `NEXTAUTH_URL` | `https://your-app.vercel.app` | 실제 배포 URL |

**❗ 중요:**
- 환경 변수를 추가/수정한 후에는 반드시 **Redeploy** 해야 합니다
- Environment 선택 시 **Production**, **Preview**, **Development** 모두 체크

---

### 3️⃣ 데이터베이스 문제 (가장 흔한 원인)

**문제:** 현재 SQLite를 사용 중인데, Vercel 서버리스 환경에서는 SQLite가 제대로 작동하지 않습니다.

**해결책:** PostgreSQL로 변경 (3가지 옵션)

#### 🟢 Option A: Vercel Postgres (가장 쉬움, 추천)
1. Vercel Dashboard → **Storage** 탭
2. **Create Database** 클릭
3. **Postgres** 선택
4. 데이터베이스 이름 입력 후 생성
5. 자동으로 `DATABASE_URL` 환경 변수가 프로젝트에 연결됩니다
6. **Deployments** → **Redeploy**

#### 🟢 Option B: Neon (무료, 추천)
1. https://neon.tech 접속 및 가입
2. **New Project** 클릭
3. 프로젝트 이름 입력 후 생성
4. **Connection String** 복사 (예: `postgresql://user:pass@ep-xxx.region.aws.neon.tech/dbname`)
5. Vercel → Settings → Environment Variables
6. `DATABASE_URL` 추가 및 복사한 문자열 붙여넣기
7. **Redeploy**

#### 🟢 Option C: Supabase (무료)
1. https://supabase.com 접속 및 가입
2. **New Project** 클릭
3. Settings → Database → Connection String 복사
4. Vercel → Settings → Environment Variables
5. `DATABASE_URL` 추가
6. **Redeploy**

**데이터베이스 변경 후 해야 할 일:**

`prisma/schema.prisma` 파일 수정:
```prisma
datasource db {
  provider = "postgresql"  // "sqlite"에서 변경
  url      = env("DATABASE_URL")
}
```

로컬에서 마이그레이션:
```bash
npx prisma migrate dev --name init
npx prisma db push
npx prisma generate
```

Git에 커밋 및 푸시:
```bash
git add .
git commit -m "Change database to PostgreSQL"
git push
```

---

## 🚀 빠른 임시 해결 (테스트용)

**주의: 프로덕션에서는 사용하지 마세요!**

Vercel 환경 변수에 다음을 추가:

```bash
DATABASE_URL=file:./dev.db
NEXTAUTH_SECRET=temporary-secret-key-please-change-to-random-32-characters
NEXTAUTH_URL=https://your-actual-vercel-url.vercel.app
```

그 후 **Redeploy**

---

## 🔍 추가 디버깅

### Runtime Logs에서 찾아야 할 일반적인 에러들:

1. **"PrismaClientInitializationError"**
   - 원인: DATABASE_URL이 없거나 잘못됨
   - 해결: 환경 변수 확인

2. **"Error: No such file or directory"**
   - 원인: SQLite 파일 시스템 문제
   - 해결: PostgreSQL로 변경

3. **"Invalid `prisma.xxx.findMany()` invocation"**
   - 원인: Prisma Client가 생성되지 않음
   - 해결: `package.json`의 build 스크립트 확인

4. **"NEXTAUTH_SECRET is not set"**
   - 원인: 환경 변수 누락
   - 해결: NEXTAUTH_SECRET 추가

5. **"Cannot find module '@prisma/client'"**
   - 원인: Prisma 설치 문제
   - 해결: `package.json`의 postinstall 스크립트 확인

---

## 📞 다음 단계

1. **Vercel Runtime Logs 확인** ← 가장 중요!
2. 실제 에러 메시지를 찾아서 알려주세요
3. 그러면 정확한 해결책을 제시할 수 있습니다

**로그 확인 방법:**
- Vercel Dashboard → Deployments → 최신 배포 클릭 → Runtime Logs

**찾은 에러 메시지를 복사해서 알려주시면 정확한 해결책을 드리겠습니다!**
