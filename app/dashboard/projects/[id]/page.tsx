import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { PROJECT_STATUS_LABELS, PROPOSAL_STATUS_LABELS } from '@/lib/constants';
import ProposalActions from './ProposalActions';

export const dynamic = 'force-dynamic';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function ProjectDetailPage({ params }: PageProps) {
    const session = await getServerSession(authOptions);
    const { id } = await params;

    if (!session) return null;

    const project = await prisma.project.findUnique({
        where: { id },
        include: {
            user: {
                include: {
                    profile: true,
                },
            },
            proposals: {
                include: {
                    business: {
                        include: {
                            businessProfile: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: 'desc',
                },
            },
            contracts: {
                include: {
                    business: {
                        include: {
                            businessProfile: true,
                        },
                    },
                },
            },
        },
    });

    if (!project || project.userId !== session.user.id) {
        notFound();
    }

    const statusInfo = PROJECT_STATUS_LABELS[project.status as keyof typeof PROJECT_STATUS_LABELS];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link
                    href="/dashboard/projects"
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </Link>
                <div className="flex-1">
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold text-gray-900">{project.title}</h1>
                        <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${statusInfo.color}`}>
                            {statusInfo.label}
                        </span>
                    </div>
                    <p className="text-gray-500 mt-1">
                        {new Date(project.createdAt).toLocaleDateString('ko-KR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        })} 등록
                    </p>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Project Details */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Description */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">프로젝트 상세</h2>
                        <div className="prose prose-sm max-w-none">
                            <p className="text-gray-700 whitespace-pre-wrap">{project.description}</p>
                        </div>

                        <div className="mt-6 grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="text-sm text-gray-500">카테고리</div>
                                <div className="font-medium text-gray-900">{project.category}</div>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="text-sm text-gray-500">지역</div>
                                <div className="font-medium text-gray-900">{project.location}</div>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="text-sm text-gray-500">예산</div>
                                <div className="font-medium text-gray-900">
                                    {project.budgetMin && project.budgetMax
                                        ? `${project.budgetMin.toLocaleString()}원 ~ ${project.budgetMax.toLocaleString()}원`
                                        : '협의 가능'}
                                </div>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="text-sm text-gray-500">마감일</div>
                                <div className="font-medium text-gray-900">
                                    {project.deadline
                                        ? new Date(project.deadline).toLocaleDateString('ko-KR')
                                        : '미정'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Images */}
                    {project.images.length > 0 && (
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">첨부 사진</h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {project.images.map((image, index) => (
                                    <div key={index} className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                                        <Image
                                            src={image}
                                            alt={`Project image ${index + 1}`}
                                            width={300}
                                            height={300}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Proposals */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gray-900">
                                받은 제안 ({project.proposals.length})
                            </h2>
                        </div>

                        {project.proposals.length === 0 ? (
                            <div className="text-center py-8">
                                <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <p className="text-gray-500">아직 받은 제안이 없습니다.</p>
                                <p className="text-sm text-gray-400 mt-1">사업자들의 제안을 기다려주세요.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {project.proposals.map((proposal) => {
                                    const proposalStatusInfo = PROPOSAL_STATUS_LABELS[proposal.status as keyof typeof PROPOSAL_STATUS_LABELS] || PROPOSAL_STATUS_LABELS.PENDING;
                                    const businessProfile = proposal.business.businessProfile;

                                    return (
                                        <div key={proposal.id} className="border rounded-lg p-4 hover:border-primary-300 transition-colors">
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-start gap-4">
                                                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold">
                                                        {businessProfile?.companyName?.[0] || 'B'}
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <h3 className="font-medium text-gray-900">
                                                                {businessProfile?.companyName || '사업자'}
                                                            </h3>
                                                            {businessProfile?.verified && (
                                                                <span className="text-green-600">
                                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                                    </svg>
                                                                </span>
                                                            )}
                                                            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${proposalStatusInfo.color}`}>
                                                                {proposalStatusInfo.label}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                                                            <span className="flex items-center gap-1">
                                                                <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                                </svg>
                                                                {businessProfile?.rating?.toFixed(1) || '0.0'} ({businessProfile?.reviewCount || 0})
                                                            </span>
                                                            <span>{new Date(proposal.createdAt).toLocaleDateString('ko-KR')}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-2xl font-bold text-primary-600">
                                                        {proposal.amount.toLocaleString()}원
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                                                <p className="text-sm text-gray-700 line-clamp-3">{proposal.description}</p>
                                            </div>

                                            {proposal.timeline && (
                                                <div className="mt-3 text-sm text-gray-600">
                                                    <span className="font-medium">예상 작업 기간:</span> {proposal.timeline}
                                                </div>
                                            )}

                                            <ProposalActions
                                                proposalId={proposal.id}
                                                businessId={proposal.businessId}
                                                projectId={project.id}
                                                status={proposal.status}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Stats */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">현황</h2>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">받은 제안</span>
                                <span className="font-semibold text-gray-900">{project.proposals.length}개</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">조회수</span>
                                <span className="font-semibold text-gray-900">-</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">등록 후 경과</span>
                                <span className="font-semibold text-gray-900">
                                    {Math.floor((Date.now() - new Date(project.createdAt).getTime()) / (1000 * 60 * 60 * 24))}일
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Active Contract */}
                    {project.contracts.length > 0 && (
                        <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                            <h2 className="text-lg font-semibold text-green-900 mb-4">진행 중인 계약</h2>
                            {project.contracts.map((contract) => (
                                <div key={contract.id}>
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 bg-green-200 rounded-full flex items-center justify-center text-green-700 font-bold">
                                            {contract.business?.businessProfile?.companyName?.[0] || 'B'}
                                        </div>
                                        <div>
                                            <div className="font-medium text-green-900">
                                                {contract.business?.businessProfile?.companyName || '사업자'}
                                            </div>
                                            <div className="text-sm text-green-700">
                                                {contract.amount.toLocaleString()}원
                                            </div>
                                        </div>
                                    </div>
                                    <Link
                                        href={`/dashboard/contracts/${contract.id}`}
                                        className="btn btn-success w-full text-center"
                                    >
                                        계약 상세 보기
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">관리</h2>
                        <div className="space-y-3">
                            <Link
                                href={`/dashboard/projects/${project.id}/edit`}
                                className="btn btn-secondary w-full justify-center"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                수정하기
                            </Link>
                            {project.status === 'OPEN' && (
                                <button className="btn btn-outline w-full justify-center text-red-600 border-red-300 hover:bg-red-50">
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    모집 마감
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
