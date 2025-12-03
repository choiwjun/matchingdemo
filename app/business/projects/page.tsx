import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function BusinessProjectsPage() {
    const session = await getServerSession(authOptions);

    if (!session) return null;

    const projects = await prisma.project.findMany({
        where: {
            status: 'OPEN',
        },
        include: {
            user: {
                include: {
                    profile: true,
                },
            },
            _count: {
                select: {
                    proposals: true,
                },
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
        take: 20,
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
                                <a href="/business/projects" className="text-primary-600 font-medium px-3 py-2">
                                    프로젝트 찾기
                                </a>
                                <a href="/business/proposals" className="text-gray-700 hover:text-primary-600 px-3 py-2">
                                    내 제안
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="container mx-auto px-4 py-8">
                <div className="space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">프로젝트 찾기</h1>
                        <p className="text-gray-600 mt-2">관심있는 프로젝트에 제안을 제출하세요.</p>
                    </div>

                    {/* Filters */}
                    <div className="card">
                        <div className="flex flex-wrap gap-2">
                            <button className="btn btn-primary text-sm">전체</button>
                            <button className="btn btn-secondary text-sm">건설/인테리어</button>
                            <button className="btn btn-secondary text-sm">청소/정리</button>
                            <button className="btn btn-secondary text-sm">이사/운송</button>
                            <button className="btn btn-secondary text-sm">수리/설치</button>
                            <button className="btn btn-secondary text-sm">기타</button>
                        </div>
                    </div>

                    {/* Projects List */}
                    <div className="space-y-4">
                        {projects.map((project) => (
                            <div key={project.id} className="card hover:shadow-md transition-shadow">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-xl font-semibold text-gray-900">{project.title}</h3>
                                            <span className="badge badge-primary">{project.category}</span>
                                        </div>
                                        <p className="text-gray-600 mb-4 line-clamp-2">{project.description}</p>
                                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                                            <div className="flex items-center gap-1">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                {project.location}
                                            </div>
                                            {project.budgetMin && project.budgetMax && (
                                                <div className="flex items-center gap-1">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    {project.budgetMin.toLocaleString()}원 ~ {project.budgetMax.toLocaleString()}원
                                                </div>
                                            )}
                                            <div className="flex items-center gap-1">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                                </svg>
                                                {project._count.proposals}개 제안
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                {new Date(project.createdAt).toLocaleDateString('ko-KR')}
                                            </div>
                                        </div>
                                    </div>
                                    <Link
                                        href={`/business/projects/${project.id}`}
                                        className="btn btn-primary ml-4"
                                    >
                                        제안하기
                                    </Link>
                                </div>
                            </div>
                        ))}

                        {projects.length === 0 && (
                            <div className="card text-center py-12">
                                <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <p className="text-gray-500">현재 이용 가능한 프로젝트가 없습니다.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
