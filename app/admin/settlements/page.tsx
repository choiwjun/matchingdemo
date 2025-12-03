'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

// Sample settlements data
const sampleSettlements = [
    {
        id: '1',
        businessName: '株式会社ABCリフォーム',
        businessEmail: 'business@test.com',
        projectTitle: 'キッチンリフォーム',
        contractAmount: 1500000,
        platformFee: 150000,
        netAmount: 1350000,
        status: 'PENDING',
        completedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
        scheduledDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5).toISOString(),
    },
    {
        id: '2',
        businessName: 'クリーンサービス山田',
        businessEmail: 'business2@test.com',
        projectTitle: 'オフィス定期清掃（3ヶ月分）',
        contractAmount: 240000,
        platformFee: 24000,
        netAmount: 216000,
        status: 'PROCESSING',
        completedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
        scheduledDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 1).toISOString(),
    },
    {
        id: '3',
        businessName: '株式会社ABCリフォーム',
        businessEmail: 'business@test.com',
        projectTitle: '浴室リフォーム',
        contractAmount: 850000,
        platformFee: 85000,
        netAmount: 765000,
        status: 'COMPLETED',
        completedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
        paidAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 23).toISOString(),
    },
    {
        id: '4',
        businessName: 'ITソリューションズ',
        businessEmail: 'it@solutions.jp',
        projectTitle: 'Webサイト制作',
        contractAmount: 500000,
        platformFee: 50000,
        netAmount: 450000,
        status: 'COMPLETED',
        completedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45).toISOString(),
        paidAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 38).toISOString(),
    },
    {
        id: '5',
        businessName: '株式会社教育サポート',
        businessEmail: 'edu@support.jp',
        projectTitle: '社内研修（5日間）',
        contractAmount: 300000,
        platformFee: 30000,
        netAmount: 270000,
        status: 'PENDING',
        completedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
        scheduledDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(),
    },
];

export default function AdminSettlementsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [settlements] = useState(sampleSettlements);
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

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'PENDING': return { label: '支払い待ち', color: 'bg-yellow-100 text-yellow-800' };
            case 'PROCESSING': return { label: '処理中', color: 'bg-blue-100 text-blue-800' };
            case 'COMPLETED': return { label: '支払い完了', color: 'bg-green-100 text-green-800' };
            case 'FAILED': return { label: '失敗', color: 'bg-red-100 text-red-800' };
            default: return { label: status, color: 'bg-gray-100 text-gray-800' };
        }
    };

    const filteredSettlements = filterStatus === 'all'
        ? settlements
        : settlements.filter(s => s.status === filterStatus);

    // Calculate totals
    const totalPending = settlements
        .filter(s => s.status === 'PENDING' || s.status === 'PROCESSING')
        .reduce((sum, s) => sum + s.netAmount, 0);
    const totalCompleted = settlements
        .filter(s => s.status === 'COMPLETED')
        .reduce((sum, s) => sum + s.netAmount, 0);
    const totalPlatformFee = settlements
        .filter(s => s.status === 'COMPLETED')
        .reduce((sum, s) => sum + s.platformFee, 0);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navigation */}
            <nav className="bg-white shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <Link href="/admin" className="text-xl font-bold text-primary-600">
                            ProMatch <span className="text-sm font-normal text-gray-500">管理</span>
                        </Link>
                        <div className="flex items-center space-x-4">
                            <span className="text-gray-600">{session?.user?.email}</span>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto py-8 px-4">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">精算管理</h1>
                    <p className="text-gray-600 mt-1">事業者への支払い精算を管理します</p>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">支払い待ち</p>
                                <p className="text-2xl font-bold text-yellow-600">{formatCurrency(totalPending)}</p>
                            </div>
                            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                                <span className="text-2xl">⏳</span>
                            </div>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">
                            {settlements.filter(s => s.status === 'PENDING' || s.status === 'PROCESSING').length}件
                        </p>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">支払い完了</p>
                                <p className="text-2xl font-bold text-green-600">{formatCurrency(totalCompleted)}</p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                <span className="text-2xl">✅</span>
                            </div>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">
                            {settlements.filter(s => s.status === 'COMPLETED').length}件
                        </p>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">プラットフォーム手数料</p>
                                <p className="text-2xl font-bold text-primary-600">{formatCurrency(totalPlatformFee)}</p>
                            </div>
                            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                                <span className="text-2xl">💰</span>
                            </div>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">手数料率: 10%</p>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">総取引額</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {formatCurrency(settlements.reduce((sum, s) => sum + s.contractAmount, 0))}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                                <span className="text-2xl">📊</span>
                            </div>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">全{settlements.length}件</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                    <div className="flex flex-wrap gap-2">
                        {[
                            { id: 'all', label: 'すべて' },
                            { id: 'PENDING', label: '支払い待ち' },
                            { id: 'PROCESSING', label: '処理中' },
                            { id: 'COMPLETED', label: '支払い完了' },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setFilterStatus(tab.id)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    filterStatus === tab.id
                                        ? 'bg-primary-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Settlements Table */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        事業者
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        案件
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        契約金額
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        手数料
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        支払額
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        ステータス
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        支払予定日
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        操作
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredSettlements.map((settlement) => {
                                    const statusInfo = getStatusLabel(settlement.status);
                                    
                                    return (
                                        <tr key={settlement.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {settlement.businessName}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {settlement.businessEmail}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900">{settlement.projectTitle}</div>
                                                <div className="text-xs text-gray-500">
                                                    完了日: {formatDate(settlement.completedAt)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {formatCurrency(settlement.contractAmount)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                                                -{formatCurrency(settlement.platformFee)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                                                {formatCurrency(settlement.netAmount)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusInfo.color}`}>
                                                    {statusInfo.label}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {settlement.paidAt 
                                                    ? formatDate(settlement.paidAt)
                                                    : settlement.scheduledDate 
                                                        ? formatDate(settlement.scheduledDate)
                                                        : '-'
                                                }
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                {settlement.status === 'PENDING' && (
                                                    <button className="text-primary-600 hover:text-primary-900 mr-3">
                                                        支払い処理
                                                    </button>
                                                )}
                                                <button className="text-gray-600 hover:text-gray-900">
                                                    詳細
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Back to Admin Dashboard */}
                <div className="mt-8 text-center">
                    <Link
                        href="/admin"
                        className="text-primary-600 hover:text-primary-700 font-medium"
                    >
                        ← 管理ダッシュボードに戻る
                    </Link>
                </div>
            </div>
        </div>
    );
}
