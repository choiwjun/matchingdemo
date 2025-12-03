'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button, Modal } from '@/components/ui';

interface ProposalActionsProps {
    proposalId: string;
    businessId: string;
    projectId: string;
    status: string;
}

export default function ProposalActions({ proposalId, businessId, projectId, status }: ProposalActionsProps) {
    const router = useRouter();
    const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleAccept = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/proposals/${proposalId}/accept`, {
                method: 'POST',
            });

            if (!response.ok) {
                throw new Error('제안 수락에 실패했습니다.');
            }

            router.refresh();
            setIsAcceptModalOpen(false);
        } catch (error) {
            console.error('Error accepting proposal:', error);
            alert('오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleReject = async () => {
        if (!confirm('이 제안을 거절하시겠습니까?')) return;

        setIsLoading(true);
        try {
            const response = await fetch(`/api/proposals/${proposalId}/reject`, {
                method: 'POST',
            });

            if (!response.ok) {
                throw new Error('제안 거절에 실패했습니다.');
            }

            router.refresh();
        } catch (error) {
            console.error('Error rejecting proposal:', error);
            alert('오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    if (status !== 'PENDING') {
        return null;
    }

    return (
        <>
            <div className="mt-4 flex items-center gap-3">
                <Link
                    href={`/chat?businessId=${businessId}&projectId=${projectId}`}
                    className="btn btn-outline flex-1 justify-center"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    채팅하기
                </Link>
                <Button
                    variant="primary"
                    className="flex-1"
                    onClick={() => setIsAcceptModalOpen(true)}
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    수락하기
                </Button>
                <button
                    onClick={handleReject}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="거절하기"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            {/* Accept Confirmation Modal */}
            <Modal
                isOpen={isAcceptModalOpen}
                onClose={() => setIsAcceptModalOpen(false)}
                title="제안 수락"
            >
                <div className="space-y-4">
                    <div className="p-4 bg-yellow-50 rounded-lg">
                        <div className="flex gap-3">
                            <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <div>
                                <p className="font-medium text-yellow-800">계약이 체결됩니다</p>
                                <p className="text-sm text-yellow-700 mt-1">
                                    제안을 수락하면 해당 사업자와 계약이 체결되며, 다른 제안은 자동으로 거절됩니다.
                                </p>
                            </div>
                        </div>
                    </div>

                    <p className="text-gray-600">
                        이 제안을 수락하시겠습니까? 수락 후에는 채팅을 통해 상세 일정을 조율하세요.
                    </p>

                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            fullWidth
                            onClick={() => setIsAcceptModalOpen(false)}
                        >
                            취소
                        </Button>
                        <Button
                            variant="primary"
                            fullWidth
                            onClick={handleAccept}
                            isLoading={isLoading}
                        >
                            수락하기
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
}
