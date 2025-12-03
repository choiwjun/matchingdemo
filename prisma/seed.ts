import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 シードデータの作成を開始いたします...\n');

    // パスワードハッシュ生成（全アカウント共通パスワード: test1234）
    const hashedPassword = await bcrypt.hash('test1234', 12);

    // ==================== 一般ユーザーアカウント ====================
    const user = await prisma.user.upsert({
        where: { email: 'user@test.com' },
        update: {},
        create: {
            email: 'user@test.com',
            password: hashedPassword,
            phone: '090-1234-5678',
            role: 'USER',
            phoneVerified: true,
            profile: {
                create: {
                    firstName: '太郎',
                    lastName: '山田',
                    region: 'tokyo',
                    interests: JSON.stringify(['construction', 'cleaning', 'repair']),
                },
            },
        },
    });
    console.log('✅ 一般ユーザーアカウントを作成いたしました:', user.email);

    // ==================== 事業者アカウント ====================
    const business = await prisma.user.upsert({
        where: { email: 'business@test.com' },
        update: {},
        create: {
            email: 'business@test.com',
            password: hashedPassword,
            phone: '090-9876-5432',
            role: 'BUSINESS',
            phoneVerified: true,
            profile: {
                create: {
                    firstName: '一郎',
                    lastName: '鈴木',
                    region: 'tokyo',
                    interests: JSON.stringify(['construction', 'repair']),
                },
            },
            businessProfile: {
                create: {
                    companyName: '鈴木インテリア株式会社',
                    businessNumber: '1234567890123',
                    description: '創業20年のインテリア専門業者でございます。住宅・商業施設のインテリア、リフォーム、修理等、あらゆる作業に対応いたします。',
                    serviceAreas: JSON.stringify(['tokyo', 'kanagawa']),
                    categories: JSON.stringify(['construction', 'repair']),
                    portfolioImages: JSON.stringify([]),
                    priceRange: '100万円〜5,000万円',
                    verified: true,
                    rating: 4.8,
                    reviewCount: 127,
                },
            },
        },
    });
    console.log('✅ 事業者アカウントを作成いたしました:', business.email);

    // ==================== 事業者アカウント2 ====================
    const business2 = await prisma.user.upsert({
        where: { email: 'business2@test.com' },
        update: {},
        create: {
            email: 'business2@test.com',
            password: hashedPassword,
            phone: '090-1111-2222',
            role: 'BUSINESS',
            phoneVerified: true,
            profile: {
                create: {
                    firstName: '花子',
                    lastName: '佐藤',
                    region: 'tokyo',
                    interests: JSON.stringify(['cleaning', 'moving']),
                },
            },
            businessProfile: {
                create: {
                    companyName: 'ピカピカ清掃サービス',
                    businessNumber: '2345678901234',
                    description: '一般家庭、オフィス、店舗の清掃を専門としております。入居・退去清掃、定期清掃、特殊清掃すべてに対応可能でございます。',
                    serviceAreas: JSON.stringify(['tokyo', 'chiba', 'kanagawa']),
                    categories: JSON.stringify(['cleaning', 'moving']),
                    portfolioImages: JSON.stringify([]),
                    priceRange: '1万円〜100万円',
                    verified: true,
                    rating: 4.5,
                    reviewCount: 89,
                },
            },
        },
    });
    console.log('✅ 事業者アカウント2を作成いたしました:', business2.email);

    // ==================== 管理者アカウント ====================
    const admin = await prisma.user.upsert({
        where: { email: 'admin@test.com' },
        update: {},
        create: {
            email: 'admin@test.com',
            password: hashedPassword,
            phone: '090-0000-0000',
            role: 'ADMIN',
            phoneVerified: true,
            profile: {
                create: {
                    firstName: '管理者',
                    lastName: 'システム',
                    region: 'tokyo',
                    interests: JSON.stringify([]),
                },
            },
        },
    });
    console.log('✅ 管理者アカウントを作成いたしました:', admin.email);

    // ==================== サンプル案件作成 ====================
    const project1 = await prisma.project.upsert({
        where: { id: 'sample-project-1' },
        update: {},
        create: {
            id: 'sample-project-1',
            userId: user.id,
            title: 'マンションリビングのインテリアリフォーム',
            description: `100㎡のマンションリビングのインテリアを新しくしたいと考えております。

現在の状況：
・壁紙が古くなっており、交換が必要
・フローリングの一部に傷あり
・照明の交換を希望

ご希望のスタイル：
・モダンでシンプルな雰囲気
・明るいトーンの色合い
・間接照明の設置

予算は500万円〜800万円程度を予定しております。
作業可能な専門家の方々からのご提案をお待ちしております。`,
            category: 'construction',
            location: 'tokyo',
            budgetMin: 5000000,
            budgetMax: 8000000,
            images: JSON.stringify([]),
            attachments: JSON.stringify([]),
            status: 'OPEN',
        },
    });
    console.log('✅ サンプル案件1を作成いたしました:', project1.title);

    const project2 = await prisma.project.upsert({
        where: { id: 'sample-project-2' },
        update: {},
        create: {
            id: 'sample-project-2',
            userId: user.id,
            title: 'オフィスの定期清掃業者を探しております',
            description: `150㎡規模のオフィスの定期清掃業者を探しております。

清掃範囲：
・床の清掃およびワックス
・トイレ清掃
・窓拭き
・ゴミ処理

ご希望日程：週2回（火曜・金曜）
時間帯：午後7時以降（退勤後）

長期契約も可能でございます。お見積もりと併せて進め方のご提案をお願いいたします。`,
            category: 'cleaning',
            location: 'tokyo',
            budgetMin: 300000,
            budgetMax: 500000,
            images: JSON.stringify([]),
            attachments: JSON.stringify([]),
            status: 'OPEN',
        },
    });
    console.log('✅ サンプル案件2を作成いたしました:', project2.title);

    const project3 = await prisma.project.upsert({
        where: { id: 'sample-project-3' },
        update: {},
        create: {
            id: 'sample-project-3',
            userId: user.id,
            title: '給湯器の修理を至急お願いいたします',
            description: `マンションの給湯器が突然動かなくなりました。

症状：
・電源は入りますがお湯が出ません
・暖房も作動しません
・異音がいたします

給湯器型番：リンナイ RUF-E2405SAW
設置年：2018年

至急修理いただける方を探しております。
可能であれば本日明日中のご訪問をお願いいたします。`,
            category: 'repair',
            location: 'kanagawa',
            budgetMin: 100000,
            budgetMax: 300000,
            images: JSON.stringify([]),
            attachments: JSON.stringify([]),
            status: 'OPEN',
        },
    });
    console.log('✅ サンプル案件3を作成いたしました:', project3.title);

    // ==================== サンプル提案作成 ====================
    const proposal1 = await prisma.proposal.upsert({
        where: { id: 'sample-proposal-1' },
        update: {},
        create: {
            id: 'sample-proposal-1',
            projectId: project1.id,
            businessId: business.id,
            amount: 6500000,
            description: `はじめまして、鈴木インテリア株式会社でございます。

20年の経験を活かして、お客様のリビングを新しく生まれ変わらせていただきます。

【作業内容】
1. 壁紙交換 - 環境配慮型シルク壁紙（サンゲツ製）
2. フローリング - 強化フロア部分交換
3. 照明 - LED間接照明＋ダウンライト設置
4. 幕板交換 - ホワイトトーン幕板

【予定作業期間】
約5日間（土日祝日を除く）

【お見積り詳細】
・資材費：350万円
・施工費：250万円
・消費税込み合計：650万円

ポートフォリオと以前の施工写真をお送りすることも可能でございます。
ご不明な点がございましたら、チャットにてお問い合わせくださいませ。`,
            timeline: '5日間',
            attachments: JSON.stringify([]),
            status: 'PENDING',
        },
    });
    console.log('✅ サンプル提案1を作成いたしました');

    const proposal2 = await prisma.proposal.upsert({
        where: { id: 'sample-proposal-2' },
        update: {},
        create: {
            id: 'sample-proposal-2',
            projectId: project2.id,
            businessId: business2.id,
            amount: 400000,
            description: `はじめまして、ピカピカ清掃サービスでございます。

150㎡オフィスの定期清掃のお見積りをお送りいたします。

【サービス内容】
・床の掃除機がけ＋水拭き
・トイレ清掃および消毒
・窓の内側清掃（月1回外側）
・ゴミ回収および分別

【作業方法】
・週2回訪問（火曜・金曜）
・午後7時以降開始
・2名体制で約2時間

【月額費用】
・定期契約時：40万円/月
・3ヶ月以上のご契約で5%割引

初月無料体験サービスも承っております。
お気軽にお問い合わせくださいませ。`,
            timeline: '月8回',
            attachments: JSON.stringify([]),
            status: 'PENDING',
        },
    });
    console.log('✅ サンプル提案2を作成いたしました');

    // ==================== カテゴリデータ作成 ====================
    const categories = [
        { id: 'construction', name: 'Construction', nameKo: '建設・リフォーム', icon: '🏗️', order: 1 },
        { id: 'cleaning', name: 'Cleaning', nameKo: '清掃・整理', icon: '🧹', order: 2 },
        { id: 'moving', name: 'Moving', nameKo: '引越し・運送', icon: '🚚', order: 3 },
        { id: 'repair', name: 'Repair', nameKo: '修理・設置', icon: '🔧', order: 4 },
        { id: 'design', name: 'Design', nameKo: 'デザイン', icon: '🎨', order: 5 },
        { id: 'education', name: 'Education', nameKo: '教育・レッスン', icon: '📚', order: 6 },
        { id: 'health', name: 'Health', nameKo: '健康・美容', icon: '💆', order: 7 },
        { id: 'it', name: 'IT Services', nameKo: 'IT・技術', icon: '💻', order: 8 },
        { id: 'event', name: 'Event', nameKo: 'イベント・行事', icon: '🎉', order: 9 },
        { id: 'legal', name: 'Legal', nameKo: '法律・税務', icon: '⚖️', order: 10 },
        { id: 'pet', name: 'Pet Services', nameKo: 'ペット', icon: '🐕', order: 11 },
        { id: 'other', name: 'Other', nameKo: 'その他', icon: '📦', order: 12 },
    ];

    for (const cat of categories) {
        await prisma.category.upsert({
            where: { id: cat.id },
            update: {},
            create: cat,
        });
    }
    console.log('✅ カテゴリデータを作成いたしました');

    console.log('\n🎉 シードデータの作成が完了いたしました！\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 テストアカウント情報：');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
    console.log('👤 一般ユーザー：');
    console.log('   メールアドレス: user@test.com');
    console.log('   パスワード: test1234');
    console.log('');
    console.log('🏢 事業者1：');
    console.log('   メールアドレス: business@test.com');
    console.log('   パスワード: test1234');
    console.log('   会社名: 鈴木インテリア株式会社');
    console.log('');
    console.log('🏢 事業者2：');
    console.log('   メールアドレス: business2@test.com');
    console.log('   パスワード: test1234');
    console.log('   会社名: ピカピカ清掃サービス');
    console.log('');
    console.log('👑 管理者：');
    console.log('   メールアドレス: admin@test.com');
    console.log('   パスワード: test1234');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

main()
    .catch((e) => {
        console.error('❌ シードデータの作成に失敗いたしました:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
