import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
    const stats = await Promise.all([
        prisma.user.count(),
        prisma.user.count({ where: { role: 'BUSINESS' } }),
        prisma.project.count(),
        prisma.contract.count(),
    ]);

    const [totalUsers, businessUsers, totalProjects, totalContracts] = stats;

    const recentUsers = await prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
            profile: true,
        },
    });

    const recentProjects = await prisma.project.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
            user: {
                include: {
                    profile: true,
                },
            },
        },
    });

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-sm border-b">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-8">
                            <h1 className="text-xl font-bold text-primary-600">Admin Dashboard</h1>
                            <div className="hidden md:flex gap-4">
                                <a href="/admin" className="text-primary-600 font-medium px-3 py-2">
                                    대시보드
                                </a>
                                <a href="/admin/users" className="text-gray-700 hover:text-primary-600 px-3 py-2">
                                    사용자 관리
                                </a>
                                <a href="/admin/projects" className="text-gray-700 hover:text-primary-600 px-3 py-2">
                                    프로젝트 관리
                                </a>
                                <a href="/admin/content" className="text-gray-700 hover:text-primary-600 px-3 py-2">
                                    콘텐츠 관리
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="container mx-auto px-4 py-8">
                <div className="space-y-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">관리자 대시보드</h1>
                        <p className="text-gray-600 mt-2">플랫폼 전체를 관리하고 모니터링하세요.</p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid md:grid-cols-4 gap-6">
                        <div className="card">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">전체 사용자</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-1">{totalUsers}</p>
                                </div>
                                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="card">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">사업자</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-1">{businessUsers}</p>
                                </div>
                                <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="card">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">전체 프로젝트</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-1">{totalProjects}</p>
                                </div>
                                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="card">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">전체 계약</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-1">{totalContracts}</p>
                                </div>
                                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Users */}
                    <div className="card">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold">최근 가입 사용자</h2>
                            <Link href="/admin/users" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                                전체 보기 →
                            </Link>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">이메일</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">이름</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">역할</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">가입일</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentUsers.map((user) => (
                                        <tr key={user.id} className="border-b hover:bg-gray-50">
                                            <td className="py-3 px-4 text-sm">{user.email}</td>
                                            <td className="py-3 px-4 text-sm">
                                                {user.profile ? `${user.profile.firstName} ${user.profile.lastName}` : '-'}
                                            </td>
                                            <td className="py-3 px-4 text-sm">
                                                <span className={`badge ${user.role === 'ADMIN' ? 'badge-danger' :
                                                    user.role === 'BUSINESS' ? 'badge-primary' : 'badge-success'
                                                    }`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-sm text-gray-600">
                                                {new Date(user.createdAt).toLocaleDateString('ko-KR')}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Recent Projects */}
                    <div className="card">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold">최근 등록 프로젝트</h2>
                            <Link href="/admin/projects" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                                전체 보기 →
                            </Link>
                        </div>
                        <div className="space-y-3">
                            {recentProjects.map((project) => (
                                <div key={project.id} className="p-4 border border-gray-200 rounded-lg">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h3 className="font-medium text-gray-900">{project.title}</h3>
                                            <p className="text-sm text-gray-600 mt-1">
                                                등록자: {project.user.profile ? `${project.user.profile.firstName} ${project.user.profile.lastName}` : project.user.email}
                                            </p>
                                            <div className="flex items-center gap-3 mt-2">
                                                <span className="badge badge-primary">{project.category}</span>
                                                <span className={`badge ${project.status === 'OPEN' ? 'badge-success' :
                                                    project.status === 'IN_PROGRESS' ? 'badge-warning' : 'badge-danger'
                                                    }`}>
                                                    {project.status}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    {new Date(project.createdAt).toLocaleDateString('ko-KR')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
