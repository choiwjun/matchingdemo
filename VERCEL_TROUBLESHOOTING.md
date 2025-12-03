# Vercel 에러 해결 가이드

## 에러: Application error: a server-side exception has occurred
**Digest: 3229314011**

이 에러는 서버 사이드에서 예외가 발생했을 때 나타나는 일반적인 에러입니다.

---

## 🔍 확인 사항

### 1. Vercel 로그 확인
1. Vercel 대시보드 접속
2. 해당 프로젝트 선택
3. **Deployments** 탭 클릭
4. 최신 배포 클릭
5. **Runtime Logs** 또는 **Build Logs** 확인

실제 에러 메시지를 찾으려면:
- Runtime Logs에서 500 에러나 예외 스택 트레이스 확인
- Build Logs에서 빌드 실패 여부 확인

---

## 🛠️ 해결 방법

### 방법 1: 환경 변수 설정 (가장 가능성 높음)

Vercel 대시보드에서:
1. **Settings** → **Environment Variables** 이동
2. 다음 환경 변수들을 추가:

```bash
# 필수 환경 변수
DATABASE_URL="file:./dev.db"  # 임시 (나중에 PostgreSQL로 변경 필요)
NEXTAUTH_SECRET="your-production-secret-key-min-32-characters-long"
NEXTAUTH_URL="https://your-app.vercel.app"

# 선택 환경 변수 (Google OAuth 사용 시)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

**중요**: 
- `NEXTAUTH_SECRET`은 최소 32자 이상의 랜덤 문자열이어야 합니다
- `NEXTAUTH_URL`은 실제 Vercel 배포 URL로 설정해야 합니다
- 환경 변수 추가 후 **Redeploy** 필요

### 방법 2: 데이터베이스 변경 (SQLite → PostgreSQL)

**문제**: Vercel의 서버리스 환경에서는 SQLite가 제대로 작동하지 않습니다.

**해결책**: PostgreSQL로 마이그레이션

#### Option A: Vercel Postgres (추천)
1. Vercel 대시보드에서 **Storage** 탭
2. **Create Database** → **Postgres** 선택
3. 자동으로 `DATABASE_URL` 환경 변수가 설정됩니다

#### Option B: Neon (무료 PostgreSQL)
1. https://neon.tech 가입
2. 새 프로젝트 생성
3. Connection String 복사
4. Vercel 환경 변수에 `DATABASE_URL` 설정

#### Option C: Supabase (무료 PostgreSQL)
1. https://supabase.com 가입
2. 새 프로젝트 생성
3. Settings → Database → Connection String 복사
4. Vercel 환경 변수에 `DATABASE_URL` 설정

**schema.prisma 수정 필요**:
```prisma
datasource db {
  provider = "postgresql"  // sqlite에서 변경
  url      = env("DATABASE_URL")
}
```

그 후:
```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 방법 3: Prisma 빌드 설정 확인

`package.json`의 빌드 스크립트가 올바른지 확인:
```json
{
  "scripts": {
    "build": "prisma generate && next build",
    "postinstall": "prisma generate"
  }
}
```

### 방법 4: 에러 로깅 개선

더 자세한 에러 정보를 얻기 위해 API 라우트에 로깅 추가:

```typescript
// app/api/*/route.ts
export async function GET(request: Request) {
    try {
        // ... 기존 코드
    } catch (error) {
        console.error('Detailed error:', error);
        console.error('Error stack:', error instanceof Error ? error.stack : 'No stack');
        return NextResponse.json(
            { 
                error: '에러 발생',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}
```

---

## 📋 체크리스트

- [ ] Vercel Runtime Logs 확인
- [ ] 환경 변수 설정 (`DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`)
- [ ] 데이터베이스 연결 확인 (PostgreSQL 사용 권장)
- [ ] Prisma Client 생성 확인 (`prisma generate`)
- [ ] 빌드 로그에서 에러 확인
- [ ] 로컬에서 프로덕션 빌드 테스트 (`npm run build`)

---

## 🚀 빠른 해결 (임시)

가장 빠르게 해결하려면:

1. **Vercel 대시보드** → **Settings** → **Environment Variables**
2. 다음 추가:
   ```
   NEXTAUTH_SECRET=please-change-this-to-a-random-32-character-string-in-production
   NEXTAUTH_URL=https://your-vercel-app-url.vercel.app
   DATABASE_URL=file:./dev.db
   ```
3. **Deployments** → 최신 배포 → **Redeploy**

**주의**: `DATABASE_URL=file:./dev.db`는 임시 해결책입니다. 
프로덕션에서는 반드시 PostgreSQL 등의 외부 데이터베이스를 사용해야 합니다.

---

## 🔗 추가 리소스

- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Prisma with Vercel](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel)
- [NextAuth.js Deployment](https://next-auth.js.org/deployment)
- [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
