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
        projectTitle: 'マンション リビング リフォーム',
        projectCategory: 'construction',
        amount: 1200000,
        status: 'ACTIVE',
        user: { name: '田中 太郎', email: 'user@test.com' },
        business: { name: '株式会社ABCリフォーム', email: 'business@test.com' },
        startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString(),
    },
    {
        id: '2',
        projectTitle: 'オフィス定期清掃',
        projectCategory: 'cleaning',
        amount: 80000,
        status: 'ACTIVE',
        user: { name: '株式会社ABC', email: 'contact@abc.jp' },
        business: { name: 'クリーンサービス山田', email: 'business2@test.com' },
        startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 35).toISOString(),
    },
    {
        id: '3',
        projectTitle: 'Webサイト制作',
        projectCategory: 'it',
        amount: 500000,
        status: 'COMPLETED',
        user: { name: '株式会社XYZ', email: 'web@xyz.co.jp' },
        business: { name: 'ITソリューションズ', email: 'it@solutions.jp' },
        startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString(),
        endDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 65).toISOString(),
    },
    {
        id: '4',
        projectTitle: '引越し作業',
        projectCategory: 'moving',
        amount: 120000,
        status: 'PENDING',
        user: { name: '鈴木 一郎', email: 'suzuki@example.jp' },
        business: { name: '引越しサポート', email: 'moving@support.jp' },
        startDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(),
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    },
    {
        id: '5',
        projectTitle: 'キッチンリフォーム',
        projectCategory: 'construction',
        amount: 1500000,
        status: 'CANCELLED',
        user: { name: '高橋 様', email: 'takahashi@email.jp' },
        business: { name: '株式会社ABCリフォーム', email: 'business@test.com' },
        startDate: null,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20).toISOString(),
    },
];

export default function AdminContractsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [contracts] = useState(sampleContracts);
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState('');

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

    const filteredContracts = contracts.filter(contract => {
        const matchesSearch = contract.projectTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            contract.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            contract.business.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || contract.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const statusCounts = {
        all: contracts.length,
        PENDING: contracts.filter(c => c.status === 'PENDING').length,
        ACTIVE: contracts.filter(c => c.status === 'ACTIVE').length,
        COMPLETED: contracts.filter(c => c.status === 'COMPLETED').length,
        CANCELLED: contracts.filter(c => c.status === 'CANCELLED').length,
    };

    const totalAmount = contracts.reduce((sum, c) => sum + c.amount, 0);
    const activeAmount = contracts.filter(c => c.status === 'ACTIVE').reduce((sum, c) => sum + c.amount, 0);

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">契約管理</h1>
                <p className="text-gray-600 mt-1">プラットフォーム上の全契約を管理します</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl shadow-sm p-4">
                    <p className="text-sm text-gray-500">総契約数</p>
                    <p className="text-2xl font-bold text-gray-900">{contracts.length}</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-4">
                    <p className="text-sm text-gray-500">進行中</p>
                    <p className="text-2xl font-bold text-blue-600">{statusCounts.ACTIVE}</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-4">
                    <p className="text-sm text-gray-500">総取引額</p>
                    <p className="text-2xl font-bold text-primary-600">{formatCurrency(totalAmount)}</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-4">
                    <p className="text-sm text-gray-500">プラットフォーム手数料</p>
                    <p className="text-2xl font-bold text-green-600">{formatCurrency(totalAmount * 0.1)}</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="案件名、ユーザー名、事業者名で検索..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                    </div>
                    <select
                        value={filterStatus}
                        onChange={e => setFilterStatus(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                        <option value="all">すべてのステータス ({statusCounts.all})</option>
                        <option value="PENDING">承認待ち ({statusCounts.PENDING})</option>
                        <option value="ACTIVE">進行中 ({statusCounts.ACTIVE})</option>
                        <option value="COMPLETED">完了 ({statusCounts.COMPLETED})</option>
                        <option value="CANCELLED">キャンセル ({statusCounts.CANCELLED})</option>
                    </select>
                </div>
            </div>

            {/* Contracts Table */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">案件</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">依頼者</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">事業者</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">金額</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ステータス</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">契約日</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">操作</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredContracts.map((contract) => {
                                const statusInfo = CONTRACT_STATUS_LABELS[contract.status as keyof typeof CONTRACT_STATUS_LABELS];
                                const category = CATEGORIES.find(c => c.id === contract.projectCategory);
                                
                                return (
                                    <tr key={contract.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xl">{category?.icon}</span>
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">{contract.projectTitle}</div>
                                                    <div className="text-xs text-gray-500">{category?.nameKo}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900">{contract.user.name}</div>
                                            <div className="text-xs text-gray-500">{contract.user.email}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900">{contract.business.name}</div>
                                            <div className="text-xs text-gray-500">{contract.business.email}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                            {formatCurrency(contract.amount)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusInfo?.color}`}>
                                                {statusInfo?.label}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {formatDate(contract.createdAt)}
                                        </td>
                                        <td className="px-6 py-4 text-right text-sm">
                                            <button className="text-primary-600 hover:text-primary-900 mr-3">詳細</button>
                                            {contract.status === 'ACTIVE' && (
                                                <button className="text-red-600 hover:text-red-900">強制終了</button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Back to Admin Dashboard */}
            <div className="text-center">
                <Link href="/admin" className="text-primary-600 hover:text-primary-700 font-medium">
                    ← 管理ダッシュボードに戻る
                </Link>
            </div>
        </div>
    );
}
