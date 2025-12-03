'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { Button, Input, Textarea, FileUpload } from '@/components/ui';
import { PROJECT_STATUS_LABELS } from '@/lib/constants';

// Helper to parse JSON arrays safely
const parseJsonArray = (value: string | null | undefined): string[] => {
    if (!value) return [];
    try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
};

interface Project {
    id: string;
    title: string;
    description: string;
    category: string;
    location: string;
    budgetMin?: number;
    budgetMax?: number;
    images: string | null;
    attachments: string | null;
    deadline?: string;
    status: string;
    createdAt: string;
    user: {
        id: string;
        email: string;
        profile?: {
            firstName: string;
            lastName: string;
            avatar?: string;
        };
    };
    _count: {
        proposals: number;
    };
}

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function BusinessProjectDetailPage({ params }: PageProps) {
    const { id } = use(params);
    const router = useRouter();
    const { data: session } = useSession();
    const [project, setProject] = useState<Project | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showProposalForm, setShowProposalForm] = useState(false);
    const [proposalData, setProposalData] = useState({
        amount: '',
        description: '',
        timeline: '',
        workPlan: '',
    });
    const [attachments, setAttachments] = useState<File[]>([]);
    const [hasSubmitted, setHasSubmitted] = useState(false);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const response = await fetch(`/api/projects/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setProject(data);
                }

                // Check if already submitted
                const proposalResponse = await fetch(`/api/proposals/check?projectId=${id}`);
                if (proposalResponse.ok) {
                    const proposalData = await proposalResponse.json();
                    setHasSubmitted(proposalData.hasSubmitted);
                }
            } catch (error) {
                console.error('Error fetching project:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProject();
    }, [id]);

    const handleSubmitProposal = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const formData = new FormData();
            formData.append('projectId', id);
            formData.append('amount', proposalData.amount);
            formData.append('description', proposalData.description);
            formData.append('timeline', proposalData.timeline);
            formData.append('workPlan', proposalData.workPlan);

            attachments.forEach((file) => {
                formData.append('attachments', file);
            });

            const response = await fetch('/api/proposals', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                setHasSubmitted(true);
                setShowProposalForm(false);
                alert('제안이 성공적으로 제출되었습니다!');
            } else {
                const error = await response.json();
                throw new Error(error.message || '제안 제출에 실패했습니다.');
            }
        } catch (error) {
            console.error('Error submitting proposal:', error);
            alert(error instanceof Error ? error.message : '오류가 발생했습니다.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-gray-900">프로젝트를 찾을 수 없습니다</h2>
                    <Link href="/business/projects" className="mt-4 text-primary-600">
                        프로젝트 목록으로 돌아가기
                    </Link>
                </div>
            </div>
        );
    }

    const statusInfo = PROJECT_STATUS_LABELS[project.status as keyof typeof PROJECT_STATUS_LABELS];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b sticky top-0 z-10">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => router.back()}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <h1 className="text-xl font-bold text-gray-900">프로젝트 상세</h1>
                        </div>
                    </div>
                </div>
            </div>

            <main className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="space-y-6">
                    {/* Project Header */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <h1 className="text-2xl font-bold text-gray-900">{project.title}</h1>
                                    <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${statusInfo.color}`}>
                                        {statusInfo.label}
                                    </span>
                                </div>
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
                                    <div className="flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {new Date(project.createdAt).toLocaleDateString('ko-KR')}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                        </svg>
                                        {project._count.proposals}개 제안
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                {project.budgetMin && project.budgetMax && (
                                    <div>
                                        <div className="text-sm text-gray-500">예산</div>
                                        <div className="text-xl font-bold text-primary-600">
                                            {project.budgetMin.toLocaleString()}원 ~ {project.budgetMax.toLocaleString()}원
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">상세 내용</h2>
                        <p className="text-gray-700 whitespace-pre-wrap">{project.description}</p>

                        {project.deadline && (
                            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                                <div className="text-sm text-gray-500">마감일</div>
                                <div className="font-medium text-gray-900">
                                    {new Date(project.deadline).toLocaleDateString('ko-KR', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Images */}
                    {parseJsonArray(project.images).length > 0 && (
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">첨부 사진</h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {parseJsonArray(project.images).map((image, index) => (
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

                    {/* Attachments */}
                    {parseJsonArray(project.attachments).length > 0 && (
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">첨부 파일</h2>
                            <ul className="space-y-2">
                                {parseJsonArray(project.attachments).map((attachment, index) => (
                                    <li key={index}>
                                        <a
                                            href={attachment}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                        >
                                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                            </svg>
                                            <span className="text-sm text-gray-700">첨부파일 {index + 1}</span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Action Buttons */}
                    {project.status === 'OPEN' && !hasSubmitted && (
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            {!showProposalForm ? (
                                <div className="text-center">
                                    <p className="text-gray-600 mb-4">
                                        이 프로젝트에 관심이 있으신가요? 제안을 제출해보세요.
                                    </p>
                                    <Button onClick={() => setShowProposalForm(true)} size="lg">
                                        제안하기
                                    </Button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmitProposal} className="space-y-6">
                                    <h2 className="text-lg font-semibold text-gray-900">제안서 작성</h2>

                                    <Input
                                        label="제안 금액 (원)"
                                        type="number"
                                        required
                                        value={proposalData.amount}
                                        onChange={(e) => setProposalData({ ...proposalData, amount: e.target.value })}
                                        placeholder="예: 500000"
                                    />

                                    <Textarea
                                        label="제안 내용"
                                        required
                                        value={proposalData.description}
                                        onChange={(e) => setProposalData({ ...proposalData, description: e.target.value })}
                                        placeholder="작업 방법, 사용 재료, 경험 등을 상세히 설명해주세요."
                                        rows={5}
                                    />

                                    <Input
                                        label="예상 작업 기간"
                                        value={proposalData.timeline}
                                        onChange={(e) => setProposalData({ ...proposalData, timeline: e.target.value })}
                                        placeholder="예: 3일, 1주일"
                                    />

                                    <Textarea
                                        label="작업 계획"
                                        value={proposalData.workPlan}
                                        onChange={(e) => setProposalData({ ...proposalData, workPlan: e.target.value })}
                                        placeholder="상세 작업 계획과 인원 배치 등을 입력해주세요."
                                        rows={3}
                                    />

                                    <FileUpload
                                        label="첨부 파일"
                                        accept={['application/pdf', 'image/*']}
                                        maxFiles={5}
                                        value={attachments}
                                        onChange={setAttachments}
                                        helperText="견적서, 포트폴리오 등을 첨부하세요."
                                        previewType="file"
                                    />

                                    <div className="flex gap-3">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            fullWidth
                                            onClick={() => setShowProposalForm(false)}
                                        >
                                            취소
                                        </Button>
                                        <Button type="submit" fullWidth isLoading={isSubmitting}>
                                            제안 제출
                                        </Button>
                                    </div>
                                </form>
                            )}
                        </div>
                    )}

                    {hasSubmitted && (
                        <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                            <div className="flex items-center gap-3">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <div>
                                    <h3 className="font-medium text-green-900">제안이 제출되었습니다</h3>
                                    <p className="text-sm text-green-700 mt-1">
                                        고객이 제안을 검토하면 알림을 보내드립니다.
                                    </p>
                                </div>
                            </div>
                            <Link
                                href="/business/proposals"
                                className="mt-4 inline-flex items-center text-green-700 hover:text-green-800 font-medium"
                            >
                                내 제안 보기 →
                            </Link>
                        </div>
                    )}

                    {/* Contact Section */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">문의하기</h2>
                        <p className="text-gray-600 mb-4">
                            프로젝트에 대해 더 자세한 정보가 필요하시면 채팅으로 문의해주세요.
                        </p>
                        <Link
                            href={`/chat?userId=${project.user.id}&projectId=${project.id}`}
                            className="btn btn-secondary inline-flex items-center"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            채팅으로 문의하기
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
