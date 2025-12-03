import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function BusinessDashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session) return null;

    const businessProfile = await prisma.businessProfile.findUnique({
        where: { userId: session.user.id },
    });

    const [proposalCount, activeContracts, completedContracts, availableProjects, recentProposals] = await Promise.all([
        prisma.proposal.count({
            where: { businessId: session.user.id },
        }),
        prisma.contract.count({
            where: {
                businessId: session.user.id,
                status: 'ACTIVE',
            },
        }),
        prisma.contract.count({
            where: {
                businessId: session.user.id,
                status: 'COMPLETED',
            },
        }),
        prisma.project.count({
            where: {
                status: 'OPEN',
            },
        }),
        prisma.proposal.findMany({
            where: { businessId: session.user.id },
            include: {
                project: true,
            },
            orderBy: { createdAt: 'desc' },
            take: 5,
        }),
    ]);

    // Calculate this month's earnings
    const thisMonthStart = new Date();
    thisMonthStart.setDate(1);
    thisMonthStart.setHours(0, 0, 0, 0);

    const monthlyEarnings = await prisma.contract.aggregate({
        where: {
            businessId: session.user.id,
            status: 'COMPLETED',
            updatedAt: {
                gte: thisMonthStart,
            },
        },
        _sum: {
            amount: true,
        },
    });

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-8">
                            <Link href="/" className="text-xl font-bold text-primary-600">Marketplace</Link>
                            <div className="hidden md:flex gap-1">
                                <Link href="/business" className="flex items-center gap-2 px-3 py-2 text-primary-600 bg-primary-50 rounded-lg">
                                    ダッシュボード
                                </Link>
                                <Link href="/business/projects" className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                                    案件を探す
                                </Link>
                                <Link href="/business/proposals" className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                                    提案履歴
                                </Link>
                                <Link href="/business/contracts" className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                                    契約管理
                                </Link>
                                <Link href="/chat" className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                                    チャット
                                </Link>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <Link href="/business/profile" className="flex items-center gap-2 p-1 hover:bg-gray-100 rounded-lg transition-colors">
                                <div className="w-8 h-8 bg-secondary-600 rounded-full flex items-center justify-center text-white font-medium">
                                    {businessProfile?.companyName?.[0] || session.user.email?.[0]?.toUpperCase() || 'B'}
                                </div>
                                <span className="hidden md:block text-sm text-gray-700">
                                    {businessProfile?.companyName || session.user.email}
                                </span>
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="container mx-auto px-4 py-8">
                <div className="space-y-8">
                    {/* Welcome Section */}
                    <div className="bg-gradient-to-r from-secondary-600 to-primary-600 rounded-2xl p-8 text-white">
                        <h1 className="text-2xl md:text-3xl font-bold mb-2">
                            {businessProfile?.companyName || '事業者'} 様、ようこそ！ 👋
                        </h1>
                        <p className="text-secondary-100 mb-6">
                            新しい案件にご提案いただき、ビジネスを成長させましょう。
                        </p>
                        <Link
                            href="/business/projects"
                            className="inline-flex items-center gap-2 bg-white text-secondary-600 px-6 py-3 rounded-lg font-medium hover:bg-secondary-50 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            案件を探す
                        </Link>
                    </div>

                    {/* Verification Alert */}
                    {!businessProfile?.verified && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                            <div className="flex items-start gap-3">
                                <svg className="w-6 h-6 text-yellow-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                <div>
                                    <h3 className="font-medium text-yellow-900">事業者認証が必要です</h3>
                                    <p className="text-sm text-yellow-700 mt-1">
                                        事業者認証を完了すると、より多くの案件にご提案でき、お客様からの信頼度も向上いたします。
                                    </p>
                                    <Link href="/business/profile" className="inline-block mt-3 text-sm font-medium text-yellow-800 hover:text-yellow-900">
                                        今すぐ認証する →
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">提出した提案</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-1">{proposalCount}</p>
                                </div>
                                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">進行中の契約</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-1">{activeContracts}</p>
                                </div>
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">完了した契約</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-1">{completedContracts}</p>
                                </div>
                                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">今月の収益</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-1">
                                        {(monthlyEarnings._sum.amount || 0).toLocaleString()}
                                        <span className="text-lg">円</span>
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gray-900">募集中の案件</h2>
                            <span className="text-3xl font-bold text-primary-600">{availableProjects}</span>
                        </div>
                        <p className="text-gray-600 mb-4">現在募集中の案件が{availableProjects}件ございます。</p>
                        <Link
                            href="/business/projects"
                            className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
                        >
                            案件を見る
                            <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </div>

                    {/* Recent Proposals */}
                    <div className="bg-white rounded-xl shadow-sm">
                        <div className="p-6 border-b">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-gray-900">最近の提案</h2>
                                <Link href="/business/proposals" className="text-sm text-primary-600 hover:text-primary-700">
                                    すべて見る →
                                </Link>
                            </div>
                        </div>
                        <div className="divide-y">
                            {recentProposals.length === 0 ? (
                                <div className="p-8 text-center">
                                    <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <p className="text-gray-500">提出した提案がございません。</p>
                                    <Link
                                        href="/business/projects"
                                        className="inline-block mt-4 text-primary-600 hover:text-primary-700"
                                    >
                                        案件に提案する
                                    </Link>
                                </div>
                            ) : (
                                recentProposals.map((proposal) => (
                                    <Link
                                        key={proposal.id}
                                        href={`/business/proposals/${proposal.id}`}
                                        className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="flex-1">
                                            <h3 className="font-medium text-gray-900">{proposal.project.title}</h3>
                                            <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                                                <span>{proposal.amount.toLocaleString()}円</span>
                                                <span>•</span>
                                                <span>{new Date(proposal.createdAt).toLocaleDateString('ja-JP')}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                                                proposal.status === 'PENDING'
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : proposal.status === 'ACCEPTED'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {proposal.status === 'PENDING' ? '審査中' : proposal.status === 'ACCEPTED' ? '承認済み' : 'お見送り'}
                                            </span>
                                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    </Link>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Profile Completion */}
                    {businessProfile && (
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">プロフィール完成度</h2>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">基本情報</span>
                                    <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                                        businessProfile.companyName ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {businessProfile.companyName ? '完了' : '未完了'}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">事業者認証</span>
                                    <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                                        businessProfile.verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {businessProfile.verified ? '完了' : '未完了'}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">ポートフォリオ</span>
                                    <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                                        businessProfile.portfolioImages.length > 0 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {businessProfile.portfolioImages.length > 0 ? `${businessProfile.portfolioImages.length}件登録` : '未登録'}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">対応エリア</span>
                                    <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                                        businessProfile.serviceAreas.length > 0 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {businessProfile.serviceAreas.length > 0 ? `${businessProfile.serviceAreas.length}エリア` : '未設定'}
                                    </span>
                                </div>
                            </div>
                            <Link
                                href="/business/profile"
                                className="mt-4 inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
                            >
                                プロフィールを管理する
                                <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </Link>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
