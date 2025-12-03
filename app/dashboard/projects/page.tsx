import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { PROJECT_STATUS_LABELS } from '@/lib/constants';

export const dynamic = 'force-dynamic';

export default async function UserProjectsPage() {
    const session = await getServerSession(authOptions);

    if (!session) return null;

    const projects = await prisma.project.findMany({
        where: {
            userId: session.user.id,
        },
        include: {
            _count: {
                select: {
                    proposals: true,
                },
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">내 프로젝트</h1>
                    <p className="text-gray-600 mt-1">등록한 프로젝트와 받은 제안을 관리하세요.</p>
                </div>
                <Link href="/dashboard/projects/new" className="btn btn-primary">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    새 프로젝트
                </Link>
            </div>

            {projects.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                    <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">등록된 프로젝트가 없습니다</h3>
                    <p className="text-gray-500 mb-6">첫 번째 프로젝트를 등록하고 전문가의 제안을 받아보세요.</p>
                    <Link href="/dashboard/projects/new" className="btn btn-primary">
                        프로젝트 등록하기
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {projects.map((project) => {
                        const statusInfo = PROJECT_STATUS_LABELS[project.status as keyof typeof PROJECT_STATUS_LABELS];
                        return (
                            <Link
                                key={project.id}
                                href={`/dashboard/projects/${project.id}`}
                                className="block bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="p-6">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-lg font-semibold text-gray-900">{project.title}</h3>
                                                <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${statusInfo.color}`}>
                                                    {statusInfo.label}
                                                </span>
                                            </div>
                                            <p className="text-gray-600 line-clamp-2 mb-3">{project.description}</p>
                                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                                                <div className="flex items-center gap-1">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                                    </svg>
                                                    {project.category}
                                                </div>
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
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    {new Date(project.createdAt).toLocaleDateString('ko-KR')}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="ml-4 text-right">
                                            <div className="text-2xl font-bold text-primary-600">
                                                {project._count.proposals}
                                            </div>
                                            <div className="text-sm text-gray-500">개 제안</div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
