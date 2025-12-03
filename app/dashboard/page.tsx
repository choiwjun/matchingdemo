import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session) return null;

    // Fetch user stats
    const [projectCount, activeContractCount, pendingProposalCount, recentProjects] = await Promise.all([
        prisma.project.count({
            where: { userId: session.user.id },
        }),
        prisma.contract.count({
            where: {
                userId: session.user.id,
                status: 'ACTIVE',
            },
        }),
        prisma.proposal.count({
            where: {
                project: {
                    userId: session.user.id,
                },
                status: 'PENDING',
            },
        }),
        prisma.project.findMany({
            where: { userId: session.user.id },
            include: {
                _count: {
                    select: { proposals: true },
                },
            },
            orderBy: { createdAt: 'desc' },
            take: 5,
        }),
    ]);

    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-8 text-white">
                <h1 className="text-2xl md:text-3xl font-bold mb-2">
                    안녕하세요! 👋
                </h1>
                <p className="text-primary-100 mb-6">
                    원하는 서비스를 등록하고 전문가의 제안을 받아보세요.
                </p>
                <Link
                    href="/dashboard/projects/new"
                    className="inline-flex items-center gap-2 bg-white text-primary-600 px-6 py-3 rounded-lg font-medium hover:bg-primary-50 transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    새 프로젝트 등록
                </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">등록한 프로젝트</p>
                            <p className="text-3xl font-bold text-gray-900 mt-1">{projectCount}</p>
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
                            <p className="text-sm text-gray-600">대기 중인 제안</p>
                            <p className="text-3xl font-bold text-gray-900 mt-1">{pendingProposalCount}</p>
                        </div>
                        <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">진행 중인 계약</p>
                            <p className="text-3xl font-bold text-gray-900 mt-1">{activeContractCount}</p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">완료된 계약</p>
                            <p className="text-3xl font-bold text-gray-900 mt-1">0</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Projects */}
            <div className="bg-white rounded-xl shadow-sm">
                <div className="p-6 border-b">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-900">최근 프로젝트</h2>
                        <Link href="/dashboard/projects" className="text-sm text-primary-600 hover:text-primary-700">
                            전체 보기 →
                        </Link>
                    </div>
                </div>
                <div className="divide-y">
                    {recentProjects.length === 0 ? (
                        <div className="p-8 text-center">
                            <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <p className="text-gray-500">등록된 프로젝트가 없습니다.</p>
                            <Link
                                href="/dashboard/projects/new"
                                className="inline-block mt-4 text-primary-600 hover:text-primary-700"
                            >
                                첫 프로젝트 등록하기
                            </Link>
                        </div>
                    ) : (
                        recentProjects.map((project) => (
                            <Link
                                key={project.id}
                                href={`/dashboard/projects/${project.id}`}
                                className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex-1">
                                    <h3 className="font-medium text-gray-900">{project.title}</h3>
                                    <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                                        <span>{project.category}</span>
                                        <span>•</span>
                                        <span>{project.location}</span>
                                        <span>•</span>
                                        <span>{new Date(project.createdAt).toLocaleDateString('ko-KR')}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <div className="text-lg font-semibold text-primary-600">
                                            {project._count.proposals}
                                        </div>
                                        <div className="text-xs text-gray-500">개 제안</div>
                                    </div>
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-3 gap-4">
                <Link
                    href="/dashboard/projects/new"
                    className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow group"
                >
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary-200 transition-colors">
                        <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                    </div>
                    <h3 className="font-semibold text-gray-900">새 프로젝트</h3>
                    <p className="text-sm text-gray-500 mt-1">서비스 의뢰를 등록하세요</p>
                </Link>

                <Link
                    href="/chat"
                    className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow group"
                >
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                    </div>
                    <h3 className="font-semibold text-gray-900">채팅</h3>
                    <p className="text-sm text-gray-500 mt-1">사업자와 대화하세요</p>
                </Link>

                <Link
                    href="/dashboard/profile"
                    className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow group"
                >
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                    <h3 className="font-semibold text-gray-900">프로필 관리</h3>
                    <p className="text-sm text-gray-500 mt-1">계정 정보를 수정하세요</p>
                </Link>
            </div>
        </div>
    );
}
