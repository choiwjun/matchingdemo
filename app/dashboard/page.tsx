import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session) return null;

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: {
            profile: true,
            projects: {
                take: 5,
                orderBy: { createdAt: 'desc' },
            },
            contracts: {
                take: 5,
                orderBy: { createdAt: 'desc' },
                include: {
                    project: true,
                },
            },
        },
    });

    const projectCount = await prisma.project.count({
        where: { userId: session.user.id },
    });

    const contractCount = await prisma.contract.count({
        where: { userId: session.user.id },
    });

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">
                    안녕하세요, {user?.profile?.firstName}님!
                </h1>
                <p className="text-gray-600 mt-2">프로젝트를 관리하고 전문가와 연결하세요.</p>
            </div>

            {/* Stats */}
            <div className="grid md:grid-cols-3 gap-6">
                <div className="card">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">전체 프로젝트</p>
                            <p className="text-3xl font-bold text-gray-900 mt-1">{projectCount}</p>
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
                            <p className="text-3xl font-bold text-gray-900 mt-1">{contractCount}</p>
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
                            <p className="text-sm text-gray-600">받은 제안</p>
                            <p className="text-3xl font-bold text-gray-900 mt-1">0</p>
                        </div>
                        <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
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
                        href="/dashboard/projects/new"
                        className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all text-center"
                    >
                        <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <p className="font-medium text-gray-700">새 프로젝트 등록</p>
                    </Link>
                    <Link
                        href="/chat"
                        className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all text-center"
                    >
                        <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <p className="font-medium text-gray-700">메시지 확인</p>
                    </Link>
                </div>
            </div>

            {/* Recent Projects */}
            <div className="card">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">최근 프로젝트</h2>
                    <Link href="/dashboard/projects" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                        전체 보기 →
                    </Link>
                </div>
                {user?.projects && user.projects.length > 0 ? (
                    <div className="space-y-3">
                        {user.projects.map((project) => (
                            <div key={project.id} className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h3 className="font-medium text-gray-900">{project.title}</h3>
                                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{project.description}</p>
                                        <div className="flex items-center gap-4 mt-2">
                                            <span className="text-xs text-gray-500">
                                                {new Date(project.createdAt).toLocaleDateString('ko-KR')}
                                            </span>
                                            <span className={`badge ${project.status === 'OPEN' ? 'badge-primary' :
                                                project.status === 'IN_PROGRESS' ? 'badge-warning' :
                                                    project.status === 'COMPLETED' ? 'badge-success' : 'badge-danger'
                                                }`}>
                                                {project.status === 'OPEN' ? '모집 중' :
                                                    project.status === 'IN_PROGRESS' ? '진행 중' :
                                                        project.status === 'COMPLETED' ? '완료' : '취소됨'}
                                            </span>
                                        </div>
                                    </div>
                                    <Link
                                        href={`/dashboard/projects/${project.id}`}
                                        className="btn btn-outline text-sm ml-4"
                                    >
                                        상세보기
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 text-gray-500">
                        <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p>아직 등록된 프로젝트가 없습니다.</p>
                        <Link href="/dashboard/projects/new" className="btn btn-primary mt-4">
                            첫 프로젝트 등록하기
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
