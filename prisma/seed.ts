import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 시드 데이터 생성 시작...\n');

    // 비밀번호 해시 생성 (모든 계정 동일 비밀번호: test1234)
    const hashedPassword = await bcrypt.hash('test1234', 12);

    // ==================== 일반 사용자 계정 ====================
    const user = await prisma.user.upsert({
        where: { email: 'user@test.com' },
        update: {},
        create: {
            email: 'user@test.com',
            password: hashedPassword,
            phone: '010-1234-5678',
            role: 'USER',
            phoneVerified: true,
            profile: {
                create: {
                    firstName: '길동',
                    lastName: '홍',
                    region: 'seoul',
                    interests: ['construction', 'cleaning', 'repair'],
                },
            },
        },
    });
    console.log('✅ 일반 사용자 계정 생성:', user.email);

    // ==================== 사업자 계정 ====================
    const business = await prisma.user.upsert({
        where: { email: 'business@test.com' },
        update: {},
        create: {
            email: 'business@test.com',
            password: hashedPassword,
            phone: '010-9876-5432',
            role: 'BUSINESS',
            phoneVerified: true,
            profile: {
                create: {
                    firstName: '철수',
                    lastName: '김',
                    region: 'seoul',
                    interests: ['construction', 'repair'],
                },
            },
            businessProfile: {
                create: {
                    companyName: '김철수 인테리어',
                    businessNumber: '123-45-67890',
                    description: '20년 경력의 인테리어 전문 업체입니다. 주거용/상업용 인테리어, 리모델링, 수리 등 모든 작업을 진행합니다.',
                    serviceAreas: ['seoul', 'gyeonggi'],
                    categories: ['construction', 'repair'],
                    portfolioImages: [],
                    priceRange: '100만원 ~ 5000만원',
                    verified: true,
                    rating: 4.8,
                    reviewCount: 127,
                },
            },
        },
    });
    console.log('✅ 사업자 계정 생성:', business.email);

    // ==================== 사업자 계정 2 ====================
    const business2 = await prisma.user.upsert({
        where: { email: 'business2@test.com' },
        update: {},
        create: {
            email: 'business2@test.com',
            password: hashedPassword,
            phone: '010-1111-2222',
            role: 'BUSINESS',
            phoneVerified: true,
            profile: {
                create: {
                    firstName: '영희',
                    lastName: '이',
                    region: 'seoul',
                    interests: ['cleaning', 'moving'],
                },
            },
            businessProfile: {
                create: {
                    companyName: '깔끔이 청소 서비스',
                    businessNumber: '234-56-78901',
                    description: '가정집, 사무실, 상가 청소 전문. 입주/이사 청소, 정기 청소, 특수 청소 모두 가능합니다.',
                    serviceAreas: ['seoul', 'incheon', 'gyeonggi'],
                    categories: ['cleaning', 'moving'],
                    portfolioImages: [],
                    priceRange: '10만원 ~ 100만원',
                    verified: true,
                    rating: 4.5,
                    reviewCount: 89,
                },
            },
        },
    });
    console.log('✅ 사업자 계정 2 생성:', business2.email);

    // ==================== 관리자 계정 ====================
    const admin = await prisma.user.upsert({
        where: { email: 'admin@test.com' },
        update: {},
        create: {
            email: 'admin@test.com',
            password: hashedPassword,
            phone: '010-0000-0000',
            role: 'ADMIN',
            phoneVerified: true,
            profile: {
                create: {
                    firstName: '관리자',
                    lastName: '시스템',
                    region: 'seoul',
                    interests: [],
                },
            },
        },
    });
    console.log('✅ 관리자 계정 생성:', admin.email);

    // ==================== 샘플 프로젝트 생성 ====================
    const project1 = await prisma.project.upsert({
        where: { id: 'sample-project-1' },
        update: {},
        create: {
            id: 'sample-project-1',
            userId: user.id,
            title: '아파트 거실 인테리어 리모델링',
            description: `30평형 아파트 거실 인테리어를 새롭게 하고 싶습니다.

현재 상태:
- 벽지가 오래되어 교체 필요
- 바닥재(마루) 일부 손상
- 조명 교체 희망

원하는 스타일:
- 모던하고 깔끔한 분위기
- 밝은 톤의 색상
- 간접 조명 설치

예산은 500만원 ~ 800만원 정도로 생각하고 있습니다.
작업 가능한 전문가분들의 제안 부탁드립니다.`,
            category: 'construction',
            location: 'seoul',
            budgetMin: 5000000,
            budgetMax: 8000000,
            images: [],
            attachments: [],
            status: 'OPEN',
        },
    });
    console.log('✅ 샘플 프로젝트 1 생성:', project1.title);

    const project2 = await prisma.project.upsert({
        where: { id: 'sample-project-2' },
        update: {},
        create: {
            id: 'sample-project-2',
            userId: user.id,
            title: '사무실 정기 청소 업체 찾습니다',
            description: `50평 규모의 사무실 정기 청소 업체를 찾고 있습니다.

청소 범위:
- 바닥 청소 및 왁스
- 화장실 청소
- 창문 닦기
- 쓰레기 처리

희망 일정: 주 2회 (화, 금)
시간: 오후 7시 이후 (퇴근 후)

장기 계약 가능하며, 견적과 함께 진행 방법 제안해주세요.`,
            category: 'cleaning',
            location: 'seoul',
            budgetMin: 300000,
            budgetMax: 500000,
            images: [],
            attachments: [],
            status: 'OPEN',
        },
    });
    console.log('✅ 샘플 프로젝트 2 생성:', project2.title);

    const project3 = await prisma.project.upsert({
        where: { id: 'sample-project-3' },
        update: {},
        create: {
            id: 'sample-project-3',
            userId: user.id,
            title: '보일러 수리 급해요!',
            description: `아파트 보일러가 갑자기 작동을 안 합니다.

증상:
- 전원은 들어오는데 온수가 안 나옴
- 난방도 안 됨
- 이상한 소리가 남

보일러 모델: 경동나비엔 NCB-500
설치년도: 2018년

급하게 수리 가능한 분 찾습니다.
가능하면 오늘 내일 중으로 방문 부탁드립니다.`,
            category: 'repair',
            location: 'gyeonggi',
            budgetMin: 100000,
            budgetMax: 300000,
            images: [],
            attachments: [],
            status: 'OPEN',
        },
    });
    console.log('✅ 샘플 프로젝트 3 생성:', project3.title);

    // ==================== 샘플 제안 생성 ====================
    const proposal1 = await prisma.proposal.upsert({
        where: { id: 'sample-proposal-1' },
        update: {},
        create: {
            id: 'sample-proposal-1',
            projectId: project1.id,
            businessId: business.id,
            amount: 6500000,
            description: `안녕하세요, 김철수 인테리어입니다.

20년 경력을 바탕으로 고객님의 거실을 새롭게 변화시켜 드리겠습니다.

[작업 내용]
1. 벽지 교체 - 친환경 실크 벽지 (LG하우시스)
2. 바닥재 - 강화마루 부분 교체
3. 조명 - LED 간접조명 + 다운라이트 설치
4. 몰딩 교체 - 화이트 톤 몰딩

[예상 소요 기간]
- 약 5일 (주말 제외)

[견적 상세]
- 자재비: 350만원
- 인건비: 250만원
- 부가세 포함 총: 650만원

포트폴리오와 이전 작업 사진 보내드릴 수 있습니다.
궁금하신 점은 채팅으로 문의해주세요!`,
            timeline: '5일',
            attachments: [],
            status: 'PENDING',
        },
    });
    console.log('✅ 샘플 제안 1 생성');

    const proposal2 = await prisma.proposal.upsert({
        where: { id: 'sample-proposal-2' },
        update: {},
        create: {
            id: 'sample-proposal-2',
            projectId: project2.id,
            businessId: business2.id,
            amount: 400000,
            description: `안녕하세요, 깔끔이 청소 서비스입니다.

50평 사무실 정기 청소 견적 보내드립니다.

[서비스 내용]
- 바닥 진공청소 + 물걸레
- 화장실 청소 및 소독
- 창문 내부 청소 (월 1회 외부)
- 쓰레기 수거 및 분리수거

[진행 방식]
- 주 2회 방문 (화, 금)
- 저녁 7시 이후 시작
- 2인 1조 약 2시간 소요

[월 비용]
- 정기 계약 시: 40만원/월
- 3개월 이상 계약 시 5% 할인

첫 달 무료 체험 서비스도 가능합니다.
문의 주세요!`,
            timeline: '월 8회',
            attachments: [],
            status: 'PENDING',
        },
    });
    console.log('✅ 샘플 제안 2 생성');

    // ==================== 카테고리 데이터 생성 ====================
    const categories = [
        { id: 'construction', name: 'Construction', nameKo: '건설/인테리어', icon: '🏗️', order: 1 },
        { id: 'cleaning', name: 'Cleaning', nameKo: '청소/정리', icon: '🧹', order: 2 },
        { id: 'moving', name: 'Moving', nameKo: '이사/운송', icon: '🚚', order: 3 },
        { id: 'repair', name: 'Repair', nameKo: '수리/설치', icon: '🔧', order: 4 },
        { id: 'design', name: 'Design', nameKo: '디자인', icon: '🎨', order: 5 },
        { id: 'education', name: 'Education', nameKo: '교육/레슨', icon: '📚', order: 6 },
        { id: 'health', name: 'Health', nameKo: '건강/뷰티', icon: '💆', order: 7 },
        { id: 'it', name: 'IT Services', nameKo: 'IT/기술', icon: '💻', order: 8 },
        { id: 'event', name: 'Event', nameKo: '이벤트/행사', icon: '🎉', order: 9 },
        { id: 'legal', name: 'Legal', nameKo: '법률/세무', icon: '⚖️', order: 10 },
        { id: 'pet', name: 'Pet Services', nameKo: '반려동물', icon: '🐕', order: 11 },
        { id: 'other', name: 'Other', nameKo: '기타', icon: '📦', order: 12 },
    ];

    for (const cat of categories) {
        await prisma.category.upsert({
            where: { id: cat.id },
            update: {},
            create: cat,
        });
    }
    console.log('✅ 카테고리 데이터 생성 완료');

    console.log('\n🎉 시드 데이터 생성 완료!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 테스트 계정 정보:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
    console.log('👤 일반 사용자:');
    console.log('   이메일: user@test.com');
    console.log('   비밀번호: test1234');
    console.log('');
    console.log('🏢 사업자 1:');
    console.log('   이메일: business@test.com');
    console.log('   비밀번호: test1234');
    console.log('   회사명: 김철수 인테리어');
    console.log('');
    console.log('🏢 사업자 2:');
    console.log('   이메일: business2@test.com');
    console.log('   비밀번호: test1234');
    console.log('   회사명: 깔끔이 청소 서비스');
    console.log('');
    console.log('👑 관리자:');
    console.log('   이메일: admin@test.com');
    console.log('   비밀번호: test1234');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

main()
    .catch((e) => {
        console.error('❌ 시드 데이터 생성 실패:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
