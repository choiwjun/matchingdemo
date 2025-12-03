import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
        redirect('/');
    }

    // Fetch dashboard statistics
    const [
        totalUsers,
        totalBusinesses,
        totalProjects,
        totalContracts,
        activeProjects,
        pendingVerifications,
        pendingReports,
        recentUsers,
        recentProjects,
    ] = await Promise.all([
        prisma.user.count({ where: { role: 'USER' } }),
        prisma.user.count({ where: { role: 'BUSINESS' } }),
        prisma.project.count(),
        prisma.contract.count(),
        prisma.project.count({ where: { status: 'OPEN' } }),
        prisma.businessProfile.count({ where: { verified: false, businessNumber: { not: null } } }),
        prisma.report.count({ where: { resolved: false } }),
        prisma.user.findMany({
            orderBy: { createdAt: 'desc' },
            take: 5,
            include: { profile: true, businessProfile: true },
        }),
        prisma.project.findMany({
            orderBy: { createdAt: 'desc' },
            take: 5,
            include: { user: true },
        }),
    ]);

    // Calculate monthly stats
    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);

    const [monthlyNewUsers, monthlyProjects, monthlyContracts] = await Promise.all([
        prisma.user.count({ where: { createdAt: { gte: thisMonth } } }),
        prisma.project.count({ where: { createdAt: { gte: thisMonth } } }),
        prisma.contract.count({ where: { createdAt: { gte: thisMonth } } }),
    ]);

    // Revenue calculation
    const monthlyRevenue = await prisma.contract.aggregate({
        where: {
            status: 'COMPLETED',
            updatedAt: { gte: thisMonth },
        },
        _sum: { amount: true },
    });

    const platformFee = (monthlyRevenue._sum.amount || 0) * 0.1;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">관리자 대시보드</h1>
                <p className="text-gray-600 mt-1">플랫폼 현황을 한눈에 확인하세요.</p>
            </div>

            {/* Alert Cards */}
            {(pendingVerifications > 0 || pendingReports > 0) && (
                <div className="grid md:grid-cols-2 gap-4">
                    {pendingVerifications > 0 && (
                        <Link
                            href="/admin/verifications"
                            className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 hover:bg-yellow-100 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-yellow-200 rounded-full flex items-center justify-center">
                                    <svg className="w-5 h-5 text-yellow-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-medium text-yellow-900">인증 대기</h3>
                                    <p className="text-sm text-yellow-700">{pendingVerifications}건의 사업자 인증 요청</p>
                                </div>
                            </div>
                        </Link>
                    )}
                    {pendingReports > 0 && (
                        <Link
                            href="/admin/reports"
                            className="bg-red-50 border border-red-200 rounded-xl p-4 hover:bg-red-100 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-red-200 rounded-full flex items-center justify-center">
                                    <svg className="w-5 h-5 text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-medium text-red-900">신고 접수</h3>
                                    <p className="text-sm text-red-700">{pendingReports}건의 미처리 신고</p>
                                </div>
                            </div>
                        </Link>
                    )}
                </div>
            )}

            {/* Main Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">총 사용자</p>
                            <p className="text-3xl font-bold text-gray-900 mt-1">{totalUsers}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </div>
                    </div>
                    <div className="mt-2 text-sm text-green-600">+{monthlyNewUsers} 이번 달</div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">총 사업자</p>
                            <p className="text-3xl font-bold text-gray-900 mt-1">{totalBusinesses}</p>
                        </div>
                        <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">총 프로젝트</p>
                            <p className="text-3xl font-bold text-gray-900 mt-1">{totalProjects}</p>
                        </div>
                        <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                    </div>
                    <div className="mt-2 text-sm text-blue-600">{activeProjects} 모집중</div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">총 계약</p>
                            <p className="text-3xl font-bold text-gray-900 mt-1">{totalContracts}</p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                    </div>
                    <div className="mt-2 text-sm text-green-600">+{monthlyContracts} 이번 달</div>
                </div>
            </div>

            {/* Revenue Stats */}
            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-primary-600 to-secondary-600 rounded-xl p-6 text-white">
                    <h3 className="text-lg font-semibold mb-4">이번 달 수익</h3>
                    <div className="space-y-4">
                        <div>
                            <p className="text-primary-100 text-sm">총 거래액</p>
                            <p className="text-3xl font-bold">{(monthlyRevenue._sum.amount || 0).toLocaleString()}원</p>
                        </div>
                        <div>
                            <p className="text-primary-100 text-sm">플랫폼 수수료 (10%)</p>
                            <p className="text-2xl font-bold">{platformFee.toLocaleString()}원</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">이번 달 현황</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600">신규 가입자</span>
                            <span className="font-semibold text-gray-900">{monthlyNewUsers}명</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600">등록 프로젝트</span>
                            <span className="font-semibold text-gray-900">{monthlyProjects}건</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600">체결 계약</span>
                            <span className="font-semibold text-gray-900">{monthlyContracts}건</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600">매칭률</span>
                            <span className="font-semibold text-gray-900">
                                {monthlyProjects > 0 ? ((monthlyContracts / monthlyProjects) * 100).toFixed(1) : 0}%
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* Recent Users */}
                <div className="bg-white rounded-xl shadow-sm">
                    <div className="p-4 border-b flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900">최근 가입자</h3>
                        <Link href="/admin/users" className="text-sm text-primary-600 hover:text-primary-700">
                            전체 보기 →
                        </Link>
                    </div>
                    <div className="divide-y">
                        {recentUsers.map((user) => (
                            <div key={user.id} className="p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium ${
                                        user.role === 'BUSINESS' ? 'bg-secondary-600' : 'bg-primary-600'
                                    }`}>
                                        {user.email[0].toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{user.email}</p>
                                        <p className="text-sm text-gray-500">
                                            {user.role === 'BUSINESS' ? '사업자' : '일반 사용자'}
                                        </p>
                                    </div>
                                </div>
                                <span className="text-xs text-gray-500">
                                    {new Date(user.createdAt).toLocaleDateString('ko-KR')}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Projects */}
                <div className="bg-white rounded-xl shadow-sm">
                    <div className="p-4 border-b flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900">최근 프로젝트</h3>
                        <Link href="/admin/projects" className="text-sm text-primary-600 hover:text-primary-700">
                            전체 보기 →
                        </Link>
                    </div>
                    <div className="divide-y">
                        {recentProjects.map((project) => (
                            <div key={project.id} className="p-4">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="font-medium text-gray-900">{project.title}</p>
                                        <p className="text-sm text-gray-500 mt-1">
                                            {project.category} • {project.location}
                                        </p>
                                    </div>
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                        project.status === 'OPEN'
                                            ? 'bg-green-100 text-green-800'
                                            : project.status === 'IN_PROGRESS'
                                            ? 'bg-blue-100 text-blue-800'
                                            : 'bg-gray-100 text-gray-800'
                                    }`}>
                                        {project.status === 'OPEN' ? '모집중' : project.status === 'IN_PROGRESS' ? '진행중' : '완료'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link
                    href="/admin/users"
                    className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow group text-center"
                >
                    <div className="w-12 h-12 mx-auto bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                    </div>
                    <h3 className="font-semibold text-gray-900">회원 관리</h3>
                </Link>

                <Link
                    href="/admin/projects"
                    className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow group text-center"
                >
                    <div className="w-12 h-12 mx-auto bg-primary-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary-200 transition-colors">
                        <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <h3 className="font-semibold text-gray-900">프로젝트 관리</h3>
                </Link>

                <Link
                    href="/admin/settlements"
                    className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow group text-center"
                >
                    <div className="w-12 h-12 mx-auto bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="font-semibold text-gray-900">정산 관리</h3>
                </Link>

                <Link
                    href="/admin/content"
                    className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow group text-center"
                >
                    <div className="w-12 h-12 mx-auto bg-purple-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
                        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                        </svg>
                    </div>
                    <h3 className="font-semibold text-gray-900">콘텐츠 관리</h3>
                </Link>
            </div>
        </div>
    );
}
