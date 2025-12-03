import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function BusinessDashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session) return null;

    const businessProfile = await prisma.businessProfile.findUnique({
        where: { userId: session.user.id },
    });

    const proposalCount = await prisma.proposal.count({
        where: { businessId: session.user.id },
    });

    const activeContracts = await prisma.contract.count({
        where: {
            businessId: session.user.id,
            status: 'ACTIVE',
        },
    });

    const availableProjects = await prisma.project.count({
        where: {
            status: 'OPEN',
        },
    });

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-sm border-b">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-8">
                            <h1 className="text-xl font-bold text-primary-600">Marketplace</h1>
                            <div className="hidden md:flex gap-4">
                                <a href="/business" className="text-gray-700 hover:text-primary-600 px-3 py-2">
                                    대시보드
                                </a>
                                <a href="/business/projects" className="text-gray-700 hover:text-primary-600 px-3 py-2">
                                    프로젝트 찾기
                                </a>
                                <a href="/business/proposals" className="text-gray-700 hover:text-primary-600 px-3 py-2">
                                    내 제안
                                </a>
                                <a href="/business/profile" className="text-gray-700 hover:text-primary-600 px-3 py-2">
                                    프로필 관리
                                </a>
                                <a href="/chat" className="text-gray-700 hover:text-primary-600 px-3 py-2">
                                    채팅
                                </a>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-medium">
                                    {session.user.email[0].toUpperCase()}
                                </div>
                                <span className="hidden md:block text-sm text-gray-700">{session.user.email}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="container mx-auto px-4 py-8">
                <div className="space-y-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            사업자 대시보드
                        </h1>
                        <p className="text-gray-600 mt-2">프로젝트를 찾고 제안을 관리하세요.</p>
                    </div>

                    {!businessProfile?.verified && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                                <svg className="w-5 h-5 text-yellow-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                <div>
                                    <h3 className="font-medium text-yellow-900">프로필 인증이 필요합니다</h3>
                                    <p className="text-sm text-yellow-700 mt-1">
                                        사업자 인증을 완료하면 더 많은 프로젝트에 제안할 수 있습니다.
                                    </p>
                                    <Link href="/business/profile" className="btn btn-primary mt-3 text-sm">
                                        프로필 완성하기
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Stats */}
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="card">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">제출한 제안</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-1">{proposalCount}</p>
                                </div>
                                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="card">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">진행 중인 계약</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-1">{activeContracts}</p>
                                </div>
                                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="card">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">이용 가능한 프로젝트</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-1">{availableProjects}</p>
                                </div>
                                <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="card">
                        <h2 className="text-xl font-semibold mb-4">빠른 작업</h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            <Link
                                href="/business/projects"
                                className="p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all text-center"
                            >
                                <svg className="w-10 h-10 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <p className="font-medium text-gray-700 text-lg">프로젝트 찾기</p>
                                <p className="text-sm text-gray-500 mt-1">새로운 프로젝트에 제안하세요</p>
                            </Link>
                            <Link
                                href="/business/profile"
                                className="p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all text-center"
                            >
                                <svg className="w-10 h-10 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                <p className="font-medium text-gray-700 text-lg">프로필 관리</p>
                                <p className="text-sm text-gray-500 mt-1">회사 정보와 포트폴리오 업데이트</p>
                            </Link>
                        </div>
                    </div>

                    {/* Profile Completion */}
                    {businessProfile && (
                        <div className="card">
                            <h2 className="text-xl font-semibold mb-4">프로필 완성도</h2>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">회사 정보</span>
                                    <span className={`badge ${businessProfile.companyName ? 'badge-success' : 'badge-warning'}`}>
                                        {businessProfile.companyName ? '완료' : '미완료'}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">사업자 인증</span>
                                    <span className={`badge ${businessProfile.verified ? 'badge-success' : 'badge-warning'}`}>
                                        {businessProfile.verified ? '완료' : '미완료'}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">포트폴리오</span>
                                    <span className={`badge ${businessProfile.portfolioImages.length > 0 ? 'badge-success' : 'badge-warning'}`}>
                                        {businessProfile.portfolioImages.length > 0 ? '완료' : '미완료'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
