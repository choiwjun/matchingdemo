# Vercel 에러 해결 완료 체크리스트

## ✅ 완료된 작업

### 1. 에러 로깅 개선
- ✅ `lib/prisma.ts` - Prisma Client 초기화 시 상세한 에러 로깅 추가
- ✅ `app/api/proposals/route.ts` - 제안 API 에러 핸들링 개선
- ✅ `app/api/projects/route.ts` - 프로젝트 API 에러 핸들링 개선

### 2. 문서 생성
- ✅ `VERCEL_ERROR_GUIDE.md` - 상세한 에러 해결 가이드
- ✅ `VERCEL_TROUBLESHOOTING.md` - 트러블슈팅 가이드
- ✅ `.env.production` - Vercel 환경 변수 템플릿

---

## 🔴 현재 에러 원인 (추정)

**Digest: 3229314011** 에러는 다음 중 하나일 가능성이 높습니다:

### 1️⃣ 환경 변수 누락 (90% 확률)
- `DATABASE_URL` 미설정
- `NEXTAUTH_SECRET` 미설정
- `NEXTAUTH_URL` 미설정

### 2️⃣ 데이터베이스 문제 (80% 확률)
- SQLite를 Vercel에서 사용 중 (서버리스 환경에서 작동 안 함)
- PostgreSQL로 변경 필요

### 3️⃣ Prisma Client 생성 실패 (50% 확률)
- 빌드 시 `prisma generate` 실패

---

## 📋 지금 바로 해야 할 일

### Step 1: Vercel 로그 확인 ⭐ 가장 중요!

1. https://vercel.com/dashboard 접속
2. 프로젝트 선택
3. **Deployments** 클릭
4. 최신 배포 클릭
5. **Runtime Logs** 탭 확인

**찾아야 할 것:**
```
❌ DATABASE_URL is not set!
또는
PrismaClientInitializationError
또는
Error: No such file or directory
```

---

### Step 2: 환경 변수 설정

**Vercel Dashboard → Settings → Environment Variables**

다음 3개를 추가:

#### 1. DATABASE_URL
```bash
# 임시 (테스트용)
file:./dev.db

# 또는 PostgreSQL (권장)
postgresql://user:password@host:5432/database
```

#### 2. NEXTAUTH_SECRET
```bash
# 랜덤 32자 이상 문자열 생성
# 방법 1: https://generate-secret.vercel.app/32
# 방법 2: openssl rand -base64 32
```

예시:
```
your-random-32-character-secret-key-here-change-this
```

#### 3. NEXTAUTH_URL
```bash
# 실제 Vercel 배포 URL
https://your-app-name.vercel.app
```

**중요:** 
- Environment 선택 시 **Production**, **Preview**, **Development** 모두 체크
- 저장 후 반드시 **Redeploy** 클릭!

---

### Step 3: 데이터베이스 변경 (권장)

현재 SQLite 사용 중 → PostgreSQL로 변경 필요

#### 🟢 가장 쉬운 방법: Vercel Postgres

1. Vercel Dashboard → **Storage** 탭
2. **Create Database** → **Postgres** 선택
3. 이름 입력 후 생성
4. 자동으로 `DATABASE_URL` 연결됨
5. **Deployments** → **Redeploy**

#### 🟢 무료 대안: Neon.tech

1. https://neon.tech 가입
2. New Project 생성
3. Connection String 복사
4. Vercel 환경 변수에 `DATABASE_URL` 추가
5. Redeploy

**그 후 로컬에서:**

`prisma/schema.prisma` 수정:
```prisma
datasource db {
  provider = "postgresql"  // sqlite → postgresql
  url      = env("DATABASE_URL")
}
```

터미널에서:
```bash
npx prisma migrate dev --name init
npx prisma generate
git add .
git commit -m "Change to PostgreSQL"
git push
```

---

## 🚀 빠른 테스트 (5분 안에)

**임시로 작동시키려면:**

1. Vercel → Settings → Environment Variables
2. 다음 3개 추가:
   ```
   DATABASE_URL=file:./dev.db
   NEXTAUTH_SECRET=temporary-secret-min-32-chars-long-please-change
   NEXTAUTH_URL=https://your-vercel-url.vercel.app
   ```
3. Deployments → Redeploy
4. 작동하는지 확인

**주의:** `DATABASE_URL=file:./dev.db`는 임시입니다. 
실제 프로덕션에서는 PostgreSQL을 사용해야 합니다!

---

## 🔍 다음 단계

### 에러가 계속되면:

1. **Vercel Runtime Logs** 스크린샷 찍어서 보내주세요
2. 실제 에러 메시지를 알려주세요
3. 정확한 해결책을 제시하겠습니다

### 에러가 해결되면:

1. ✅ 환경 변수 확인
2. ✅ PostgreSQL로 마이그레이션
3. ✅ 데이터베이스 시드 데이터 추가
4. ✅ 프로덕션 테스트

---

## 📞 추가 도움이 필요하면

다음 정보를 알려주세요:

1. **Vercel Runtime Logs**의 에러 메시지
2. 현재 설정한 환경 변수 목록 (값 제외)
3. 데이터베이스 종류 (SQLite? PostgreSQL?)

그러면 정확한 해결책을 드리겠습니다!

---

## 📚 참고 문서

- [Vercel 환경 변수 설정](https://vercel.com/docs/concepts/projects/environment-variables)
- [Prisma + Vercel 가이드](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel)
- [NextAuth 배포 가이드](https://next-auth.js.org/deployment)
- [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
- [Neon PostgreSQL](https://neon.tech/docs/introduction)
