'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Badge, Button } from '@/components/ui';

interface Contract {
    id: string;
    amount: number;
    status: string;
    startDate: string;
    endDate: string | null;
    createdAt: string;
    project: {
        id: string;
        title: string;
        category: string;
    };
    business: {
        id: string;
        email: string;
        businessProfile: {
            companyName: string;
        } | null;
    };
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
    PENDING: { label: '承認待ち', color: 'warning' },
    ACTIVE: { label: '進行中', color: 'primary' },
    COMPLETED: { label: '完了', color: 'success' },
    CANCELLED: { label: 'キャンセル', color: 'danger' },
};

// サンプルデータ
const SAMPLE_CONTRACTS: Contract[] = [
    {
        id: '1',
        amount: 6500000,
        status: 'ACTIVE',
        startDate: '2024-01-15',
        endDate: null,
        createdAt: '2024-01-10',
        project: {
            id: 'sample-project-1',
            title: 'マンションリビングのインテリアリフォーム',
            category: 'construction',
        },
        business: {
            id: 'business-1',
            email: 'business@test.com',
            businessProfile: {
                companyName: '鈴木インテリア株式会社',
            },
        },
    },
    {
        id: '2',
        amount: 400000,
        status: 'COMPLETED',
        startDate: '2024-01-01',
        endDate: '2024-01-31',
        createdAt: '2023-12-25',
        project: {
            id: 'sample-project-2',
            title: 'オフィスの定期清掃業者を探しております',
            category: 'cleaning',
        },
        business: {
            id: 'business-2',
            email: 'business2@test.com',
            businessProfile: {
                companyName: 'ピカピカ清掃サービス',
            },
        },
    },
];

export default function ContractsPage() {
    const [contracts, setContracts] = useState<Contract[]>(SAMPLE_CONTRACTS);
    const [isLoading, setIsLoading] = useState(false);
    const [filter, setFilter] = useState('all');

    const filteredContracts = contracts.filter((contract) => {
        if (filter === 'all') return true;
        return contract.status === filter;
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">契約管理</h1>
                <p className="text-gray-600 mt-1">進行中および完了した契約を確認できます</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl shadow-sm p-4">
                    <p className="text-sm text-gray-600">全契約</p>
                    <p className="text-2xl font-bold text-gray-900">{contracts.length}</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-4">
                    <p className="text-sm text-gray-600">進行中</p>
                    <p className="text-2xl font-bold text-blue-600">
                        {contracts.filter((c) => c.status === 'ACTIVE').length}
                    </p>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-4">
                    <p className="text-sm text-gray-600">完了</p>
                    <p className="text-2xl font-bold text-green-600">
                        {contracts.filter((c) => c.status === 'COMPLETED').length}
                    </p>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-4">
                    <p className="text-sm text-gray-600">総取引額</p>
                    <p className="text-2xl font-bold text-primary-600">
                        {contracts.reduce((sum, c) => sum + c.amount, 0).toLocaleString()}円
                    </p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2 flex-wrap">
                {[
                    { id: 'all', label: 'すべて' },
                    { id: 'ACTIVE', label: '進行中' },
                    { id: 'COMPLETED', label: '完了' },
                    { id: 'PENDING', label: '承認待ち' },
                ].map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setFilter(item.id)}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            filter === item.id
                                ? 'bg-primary-600 text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                        {item.label}
                    </button>
                ))}
            </div>

            {/* Contracts List */}
            <div className="space-y-4">
                {filteredContracts.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                        <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        <p className="text-gray-500">契約がございません</p>
                    </div>
                ) : (
                    filteredContracts.map((contract) => (
                        <div
                            key={contract.id}
                            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-lg font-semibold text-gray-900">{contract.project.title}</h3>
                                        <Badge variant={STATUS_LABELS[contract.status]?.color as 'success' | 'primary' | 'warning' | 'danger'}>
                                            {STATUS_LABELS[contract.status]?.label}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-8 h-8 bg-secondary-100 rounded-full flex items-center justify-center">
                                            <span className="text-secondary-600 font-medium text-sm">
                                                {contract.business.businessProfile?.companyName?.[0] || 'B'}
                                            </span>
                                        </div>
                                        <span className="text-gray-700">
                                            {contract.business.businessProfile?.companyName || contract.business.email}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            契約金額: {contract.amount.toLocaleString()}円
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            開始日: {new Date(contract.startDate).toLocaleDateString('ja-JP')}
                                        </span>
                                        {contract.endDate && (
                                            <span className="flex items-center gap-1">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                完了日: {new Date(contract.endDate).toLocaleDateString('ja-JP')}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Link href={`/chat?businessId=${contract.business.id}`}>
                                        <Button variant="outline" size="sm">
                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                            </svg>
                                            チャット
                                        </Button>
                                    </Link>
                                    {contract.status === 'ACTIVE' && (
                                        <Button size="sm">完了報告</Button>
                                    )}
                                    {contract.status === 'COMPLETED' && (
                                        <Button variant="outline" size="sm">
                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                            </svg>
                                            レビュー
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
