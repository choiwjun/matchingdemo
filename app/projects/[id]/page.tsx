'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { CATEGORIES, REGIONS, PROJECT_STATUS_LABELS } from '@/lib/constants';

// Sample projects data (same as list page)
const sampleProjects = [
    {
        id: '1',
        title: 'マンション リビング リフォーム',
        category: 'construction',
        description: '築20年のマンションのリビング（約20畳）のリフォームを検討しています。フローリングの張り替え、壁紙の交換、照明のLED化を希望します。\n\n【希望する作業内容】\n・フローリング張り替え（約20畳）\n・壁紙交換（リビング全体）\n・照明器具のLED化（5箇所）\n・コンセント増設（2箇所）\n\n【その他条件】\n・平日の作業希望\n・近隣への配慮をお願いします\n・見積り後の追加費用が発生しないこと',
        budgetMin: 1000000,
        budgetMax: 1500000,
        region: 'tokyo',
        status: 'OPEN',
        proposalCount: 5,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
        deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString(),
        user: { name: '田中', createdAt: '2023-06-15' },
    },
    {
        id: '2',
        title: 'オフィス定期清掃（週2回）',
        category: 'cleaning',
        description: '50坪のオフィスの定期清掃をお願いできる業者様を探しています。週2回、始業前または終業後の作業を希望します。\n\n【作業内容】\n・床掃除（掃除機・モップ）\n・デスク拭き\n・ゴミ回収\n・トイレ清掃\n・給湯室清掃\n\n【条件】\n・週2回（月・木 or 火・金）\n・作業時間：8:00前 or 19:00以降\n・清掃道具は弊社で用意可能',
        budgetMin: 50000,
        budgetMax: 80000,
        region: 'kanagawa',
        status: 'OPEN',
        proposalCount: 8,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
        deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(),
        user: { name: '佐藤', createdAt: '2023-08-20' },
    },
    {
        id: '3',
        title: 'エアコン取り付け工事（3台）',
        category: 'repair',
        description: '新居にエアコン3台の取り付けをお願いしたいです。エアコン本体は用意済みです。配管工事込みでお見積りをお願いします。\n\n【エアコン詳細】\n・リビング：23畳用（配管4m程度）\n・寝室1：8畳用（配管3m程度）\n・寝室2：6畳用（配管3m程度）\n\n【条件】\n・土日での作業希望\n・真空引き必須\n・既存の配管穴使用可能',
        budgetMin: 30000,
        budgetMax: 50000,
        region: 'saitama',
        status: 'OPEN',
        proposalCount: 12,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
        deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10).toISOString(),
        user: { name: '山田', createdAt: '2024-01-10' },
    },
    {
        id: '4',
        title: 'Webサイトリニューアル',
        category: 'it',
        description: '会社のコーポレートサイトのリニューアルを検討しています。WordPress希望、レスポンシブ対応、10ページ程度。\n\n【必要なページ】\n・トップページ\n・会社概要\n・サービス紹介（3ページ）\n・実績紹介\n・ニュース/ブログ\n・お問い合わせ\n・プライバシーポリシー\n・アクセス\n\n【その他要望】\n・SEO対策\n・スマホ対応必須\n・更新のしやすさ重視',
        budgetMin: 300000,
        budgetMax: 500000,
        region: 'osaka',
        status: 'OPEN',
        proposalCount: 6,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
        deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
        user: { name: '鈴木', createdAt: '2023-11-05' },
    },
    {
        id: '5',
        title: '引越し作業（単身・都内→都内）',
        category: 'moving',
        description: 'ワンルームから1LDKへの引越しです。荷物少なめ、大型家具は冷蔵庫とベッドのみ。日曜日希望。',
        budgetMin: 30000,
        budgetMax: 50000,
        region: 'tokyo',
        status: 'OPEN',
        proposalCount: 4,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
        deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 21).toISOString(),
        user: { name: '高橋', createdAt: '2024-02-01' },
    },
    {
        id: '6',
        title: '社内研修講師（ビジネスマナー）',
        category: 'education',
        description: '新入社員向けのビジネスマナー研修の講師を探しています。参加者20名、1日研修。教材提供含む。',
        budgetMin: 150000,
        budgetMax: 200000,
        region: 'aichi',
        status: 'OPEN',
        proposalCount: 3,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(),
        deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 45).toISOString(),
        user: { name: '伊藤', createdAt: '2023-09-15' },
    },
    {
        id: '7',
        title: '結婚式二次会の司会・演出',
        category: 'event',
        description: '結婚式二次会（参加者60名程度）の司会と簡単な演出をお願いできる方を探しています。会場は都内レストラン。',
        budgetMin: 30000,
        budgetMax: 50000,
        region: 'tokyo',
        status: 'OPEN',
        proposalCount: 7,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
        deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 60).toISOString(),
        user: { name: '渡辺', createdAt: '2024-01-20' },
    },
    {
        id: '8',
        title: 'ロゴデザイン制作',
        category: 'design',
        description: '新規立ち上げのカフェのロゴデザインをお願いします。ナチュラル・オーガニックなイメージ希望。複数案提案可能な方。',
        budgetMin: 50000,
        budgetMax: 100000,
        region: 'kyoto',
        status: 'OPEN',
        proposalCount: 15,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
        deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString(),
        user: { name: '小林', createdAt: '2023-12-01' },
    },
];

export default function ProjectDetailPage() {
    const params = useParams();
    const projectId = params.id as string;

    const project = sampleProjects.find(p => p.id === projectId);

    if (!project) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">案件が見つかりません</h1>
                    <Link href="/projects" className="text-primary-600 hover:text-primary-700">
                        ← 案件一覧に戻る
                    </Link>
                </div>
            </div>
        );
    }

    const category = CATEGORIES.find(c => c.id === project.category);
    const region = REGIONS.find(r => r.id === project.region);
    const statusInfo = PROJECT_STATUS_LABELS[project.status as keyof typeof PROJECT_STATUS_LABELS];

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('ja-JP', {
            style: 'currency',
            currency: 'JPY',
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('ja-JP', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const getDaysRemaining = (deadline: string) => {
        const days = Math.ceil((new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        return days;
    };

    const daysRemaining = getDaysRemaining(project.deadline);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navigation */}
            <nav className="bg-white shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <Link href="/" className="text-xl font-bold text-primary-600">
                            ProMatch
                        </Link>
                        <div className="flex items-center space-x-4">
                            <Link href="/projects" className="text-gray-600 hover:text-primary-600">
                                案件を探す
                            </Link>
                            <Link href="/auth/login" className="text-gray-600 hover:text-primary-600">
                                ログイン
                            </Link>
                            <Link
                                href="/auth/register"
                                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                            >
                                無料登録
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Breadcrumb */}
                <nav className="mb-6">
                    <ol className="flex items-center space-x-2 text-sm text-gray-500">
                        <li><Link href="/" className="hover:text-primary-600">ホーム</Link></li>
                        <li>/</li>
                        <li><Link href="/projects" className="hover:text-primary-600">案件一覧</Link></li>
                        <li>/</li>
                        <li className="text-gray-900">{project.title}</li>
                    </ol>
                </nav>

                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    {/* Header */}
                    <div className="p-6 border-b">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-3xl">{category?.icon}</span>
                            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{category?.nameKo}</span>
                            <span className={`px-3 py-1 text-sm rounded-full ${statusInfo?.color}`}>
                                {statusInfo?.label}
                            </span>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">{project.title}</h1>
                        
                        <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span>{region?.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span>投稿日: {formatDate(project.createdAt)}</span>
                            </div>
                            <div className={`flex items-center gap-2 ${daysRemaining <= 3 ? 'text-red-600 font-medium' : ''}`}>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>締切: {formatDate(project.deadline)} (残り{daysRemaining}日)</span>
                            </div>
                        </div>
                    </div>

                    {/* Budget & Proposal Count */}
                    <div className="grid grid-cols-2 divide-x border-b">
                        <div className="p-6 text-center">
                            <p className="text-sm text-gray-500 mb-1">予算</p>
                            <p className="text-2xl font-bold text-primary-600">
                                {formatCurrency(project.budgetMin)} 〜 {formatCurrency(project.budgetMax)}
                            </p>
                        </div>
                        <div className="p-6 text-center">
                            <p className="text-sm text-gray-500 mb-1">提案数</p>
                            <p className="text-2xl font-bold text-gray-900">{project.proposalCount}件</p>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="p-6 border-b">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">案件詳細</h2>
                        <div className="prose prose-gray max-w-none">
                            <p className="whitespace-pre-wrap text-gray-700">{project.description}</p>
                        </div>
                    </div>

                    {/* Client Info */}
                    <div className="p-6 border-b bg-gray-50">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">依頼者情報</h2>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                                <span className="text-xl font-medium text-primary-600">
                                    {project.user.name[0]}
                                </span>
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">{project.user.name}様</p>
                                <p className="text-sm text-gray-500">登録日: {project.user.createdAt}</p>
                            </div>
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="p-6">
                        <div className="bg-primary-50 rounded-lg p-6 text-center">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">この案件に提案しませんか？</h3>
                            <p className="text-gray-600 mb-4">
                                事業者として登録すると、この案件に提案を送ることができます。
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <Link
                                    href="/auth/login"
                                    className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium"
                                >
                                    ログインして提案する
                                </Link>
                                <Link
                                    href="/auth/register?role=BUSINESS"
                                    className="px-6 py-3 border border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 font-medium"
                                >
                                    事業者として新規登録
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Back Button */}
                <div className="mt-6 text-center">
                    <Link href="/projects" className="text-primary-600 hover:text-primary-700">
                        ← 案件一覧に戻る
                    </Link>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-400 py-12 mt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="text-2xl font-bold text-white">ProMatch</div>
                        <div className="flex flex-wrap justify-center gap-6">
                            <Link href="/how-it-works" className="hover:text-white">ご利用ガイド</Link>
                            <Link href="/faq" className="hover:text-white">FAQ</Link>
                            <Link href="/terms" className="hover:text-white">利用規約</Link>
                            <Link href="/privacy" className="hover:text-white">プライバシーポリシー</Link>
                        </div>
                    </div>
                    <div className="mt-8 text-center text-sm">
                        © 2024 ProMatch. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
}
