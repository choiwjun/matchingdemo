'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { CONTRACT_STATUS_LABELS, CATEGORIES } from '@/lib/constants';

// Sample contracts data
const sampleContracts = [
    {
        id: '1',
        projectTitle: 'オフィス定期清掃',
        projectCategory: 'cleaning',
        amount: 80000,
        status: 'ACTIVE',
        startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
        endDate: null,
        client: {
            name: '株式会社ABC',
            email: 'contact@abc-corp.jp',
            phone: '03-1234-5678',
        },
        milestones: [
            { id: '1', title: '初回清掃完了', status: 'completed', amount: 20000 },
            { id: '2', title: '2回目清掃完了', status: 'completed', amount: 20000 },
            { id: '3', title: '3回目清掃', status: 'pending', amount: 20000 },
            { id: '4', title: '4回目清掃', status: 'pending', amount: 20000 },
        ],
        nextPaymentDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5).toISOString(),
    },
    {
        id: '2',
        projectTitle: 'Webサイトリニューアル',
        projectCategory: 'it',
        amount: 500000,
        status: 'ACTIVE',
        startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20).toISOString(),
        endDate: null,
        client: {
            name: '株式会社XYZ',
            email: 'web@xyz.co.jp',
            phone: '06-9876-5432',
        },
        milestones: [
            { id: '1', title: 'デザイン制作', status: 'completed', amount: 150000 },
            { id: '2', title: 'コーディング', status: 'in_progress', amount: 200000 },
            { id: '3', title: '納品・公開', status: 'pending', amount: 150000 },
        ],
        nextPaymentDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10).toISOString(),
    },
    {
        id: '3',
        projectTitle: 'キッチンリフォーム',
        projectCategory: 'construction',
        amount: 1500000,
        status: 'COMPLETED',
        startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString(),
        endDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
        client: {
            name: '高橋 様',
            email: 'takahashi@email.jp',
            phone: '080-1111-2222',
        },
        milestones: [
            { id: '1', title: '解体工事', status: 'completed', amount: 300000 },
            { id: '2', title: '設備設置', status: 'completed', amount: 700000 },
            { id: '3', title: '仕上げ工事', status: 'completed', amount: 500000 },
        ],
        nextPaymentDate: null,
        review: {
            rating: 5,
            comment: '素晴らしい仕事でした。職人さんも丁寧で、予定通りに完了しました。',
        },
    },
    {
        id: '4',
        projectTitle: '引越し作業',
        projectCategory: 'moving',
        amount: 120000,
        status: 'PENDING',
        startDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(),
        endDate: null,
        client: {
            name: '鈴木 様',
            email: 'suzuki@email.jp',
            phone: '090-3333-4444',
        },
        milestones: [
            { id: '1', title: '引越し作業一式', status: 'pending', amount: 120000 },
        ],
        nextPaymentDate: null,
    },
];

export default function BusinessContractsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [contracts] = useState(sampleContracts);
    const [filterStatus, setFilterStatus] = useState<string>('all');

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/login');
        }
    }, [status, router]);

    if (status === 'loading') {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('ja-JP', {
            style: 'currency',
            currency: 'JPY',
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('ja-JP', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const filteredContracts = filterStatus === 'all'
        ? contracts
        : contracts.filter(c => c.status === filterStatus);

    const statusCounts = {
        all: contracts.length,
        PENDING: contracts.filter(c => c.status === 'PENDING').length,
        ACTIVE: contracts.filter(c => c.status === 'ACTIVE').length,
        COMPLETED: contracts.filter(c => c.status === 'COMPLETED').length,
        CANCELLED: contracts.filter(c => c.status === 'CANCELLED').length,
    };

    // Calculate totals
    const activeRevenue = contracts
        .filter(c => c.status === 'ACTIVE')
        .reduce((sum, c) => sum + c.amount, 0);
    const completedRevenue = contracts
        .filter(c => c.status === 'COMPLETED')
        .reduce((sum, c) => sum + c.amount, 0);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navigation */}
            <nav className="bg-white shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <Link href="/business" className="text-xl font-bold text-primary-600">
                            ProMatch <span className="text-sm font-normal text-gray-500">ビジネス</span>
                        </Link>
                        <div className="flex items-center space-x-4">
                            <Link href="/business/projects" className="text-gray-600 hover:text-primary-600">
                                案件を探す
                            </Link>
                            <span className="text-gray-600">{session?.user?.email}</span>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto py-8 px-4">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">契約管理</h1>
                    <p className="text-gray-600 mt-1">進行中の契約と過去の契約履歴を管理できます</p>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">進行中の契約</p>
                                <p className="text-3xl font-bold text-blue-600">{statusCounts.ACTIVE}</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-2xl">📋</span>
                            </div>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">
                            売上見込: {formatCurrency(activeRevenue)}
                        </p>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">完了した契約</p>
                                <p className="text-3xl font-bold text-green-600">{statusCounts.COMPLETED}</p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                <span className="text-2xl">✅</span>
                            </div>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">
                            累計売上: {formatCurrency(completedRevenue)}
                        </p>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">承認待ち</p>
                                <p className="text-3xl font-bold text-yellow-600">{statusCounts.PENDING}</p>
                            </div>
                            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                                <span className="text-2xl">⏳</span>
                            </div>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">
                            クライアントの承認をお待ちください
                        </p>
                    </div>
                </div>

                {/* Status Filter Tabs */}
                <div className="bg-white rounded-lg shadow-sm mb-6">
                    <div className="border-b border-gray-200">
                        <nav className="flex -mb-px overflow-x-auto">
                            {[
                                { id: 'all', label: 'すべて' },
                                { id: 'ACTIVE', label: '進行中' },
                                { id: 'PENDING', label: '承認待ち' },
                                { id: 'COMPLETED', label: '完了' },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setFilterStatus(tab.id)}
                                    className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm ${
                                        filterStatus === tab.id
                                            ? 'border-primary-500 text-primary-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    {tab.label}
                                    <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                                        filterStatus === tab.id
                                            ? 'bg-primary-100 text-primary-600'
                                            : 'bg-gray-100 text-gray-600'
                                    }`}>
                                        {statusCounts[tab.id as keyof typeof statusCounts]}
                                    </span>
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>

                {/* Contracts List */}
                <div className="space-y-4">
                    {filteredContracts.length === 0 ? (
                        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                            <div className="text-4xl mb-4">📑</div>
                            <p className="text-gray-500">該当する契約がありません</p>
                        </div>
                    ) : (
                        filteredContracts.map((contract) => {
                            const statusInfo = CONTRACT_STATUS_LABELS[contract.status as keyof typeof CONTRACT_STATUS_LABELS];
                            const category = CATEGORIES.find(c => c.id === contract.projectCategory);
                            const completedMilestones = contract.milestones.filter(m => m.status === 'completed').length;
                            const progress = (completedMilestones / contract.milestones.length) * 100;
                            
                            return (
                                <div key={contract.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                    <div className="p-6">
                                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className="text-2xl">{category?.icon}</span>
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo?.color}`}>
                                                        {statusInfo?.label}
                                                    </span>
                                                </div>
                                                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                                    {contract.projectTitle}
                                                </h3>
                                                <p className="text-sm text-gray-500 mb-3">
                                                    クライアント: {contract.client.name}
                                                </p>
                                                
                                                {/* Progress Bar */}
                                                <div className="mb-4">
                                                    <div className="flex justify-between text-sm mb-1">
                                                        <span className="text-gray-600">進捗状況</span>
                                                        <span className="text-gray-900 font-medium">
                                                            {completedMilestones}/{contract.milestones.length} 完了
                                                        </span>
                                                    </div>
                                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                                        <div
                                                            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                                                            style={{ width: `${progress}%` }}
                                                        />
                                                    </div>
                                                </div>

                                                {/* Milestones */}
                                                <div className="space-y-2">
                                                    {contract.milestones.map((milestone) => (
                                                        <div
                                                            key={milestone.id}
                                                            className="flex items-center justify-between text-sm"
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                {milestone.status === 'completed' ? (
                                                                    <span className="text-green-500">✓</span>
                                                                ) : milestone.status === 'in_progress' ? (
                                                                    <span className="text-blue-500">●</span>
                                                                ) : (
                                                                    <span className="text-gray-300">○</span>
                                                                )}
                                                                <span className={milestone.status === 'completed' ? 'text-gray-500' : 'text-gray-700'}>
                                                                    {milestone.title}
                                                                </span>
                                                            </div>
                                                            <span className="text-gray-500">
                                                                {formatCurrency(milestone.amount)}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            
                                            <div className="lg:text-right flex-shrink-0 lg:w-48">
                                                <p className="text-2xl font-bold text-primary-600">
                                                    {formatCurrency(contract.amount)}
                                                </p>
                                                <p className="text-xs text-gray-400 mt-1">
                                                    契約開始: {formatDate(contract.startDate)}
                                                </p>
                                                {contract.endDate && (
                                                    <p className="text-xs text-gray-400">
                                                        完了日: {formatDate(contract.endDate)}
                                                    </p>
                                                )}
                                                {contract.nextPaymentDate && (
                                                    <p className="text-xs text-blue-600 mt-2">
                                                        次回支払: {formatDate(contract.nextPaymentDate)}
                                                    </p>
                                                )}
                                                
                                                {/* Review */}
                                                {contract.review && (
                                                    <div className="mt-4 p-3 bg-yellow-50 rounded-lg text-left">
                                                        <div className="flex items-center gap-1 mb-1">
                                                            {[...Array(5)].map((_, i) => (
                                                                <span
                                                                    key={i}
                                                                    className={i < contract.review!.rating ? 'text-yellow-400' : 'text-gray-300'}
                                                                >
                                                                    ★
                                                                </span>
                                                            ))}
                                                        </div>
                                                        <p className="text-xs text-gray-600">{contract.review.comment}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        
                                        {/* Actions */}
                                        <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-3">
                                            <Link
                                                href="/chat"
                                                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                                            >
                                                チャットで連絡 →
                                            </Link>
                                            {contract.status === 'ACTIVE' && (
                                                <button className="text-sm text-green-600 hover:text-green-700 font-medium">
                                                    進捗を更新
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Back to Dashboard */}
                <div className="mt-8 text-center">
                    <Link
                        href="/business"
                        className="text-primary-600 hover:text-primary-700 font-medium"
                    >
                        ← ビジネスダッシュボードに戻る
                    </Link>
                </div>
            </div>
        </div>
    );
}
