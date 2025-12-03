'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AdminStatisticsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [period, setPeriod] = useState('month');

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

    // Sample statistics data
    const stats = {
        overview: {
            totalUsers: 1234,
            totalBusinesses: 456,
            totalProjects: 789,
            totalContracts: 345,
            totalRevenue: 125000000,
            platformFee: 12500000,
        },
        growth: {
            users: 15.2,
            businesses: 12.8,
            projects: 23.5,
            contracts: 18.9,
            revenue: 28.3,
        },
        monthly: [
            { month: '1月', users: 80, projects: 45, contracts: 20, revenue: 8500000 },
            { month: '2月', users: 95, projects: 52, contracts: 25, revenue: 9200000 },
            { month: '3月', users: 110, projects: 68, contracts: 32, revenue: 10800000 },
            { month: '4月', users: 125, projects: 75, contracts: 38, revenue: 11500000 },
            { month: '5月', users: 140, projects: 82, contracts: 42, revenue: 12200000 },
            { month: '6月', users: 155, projects: 90, contracts: 48, revenue: 13500000 },
        ],
        categories: [
            { name: '建設・リフォーム', count: 234, revenue: 45000000 },
            { name: '清掃・整理', count: 189, revenue: 12000000 },
            { name: 'IT・技術', count: 156, revenue: 28000000 },
            { name: '引越し・運送', count: 98, revenue: 8500000 },
            { name: '修理・設置', count: 87, revenue: 6200000 },
            { name: 'その他', count: 125, revenue: 25300000 },
        ],
        regions: [
            { name: '東京都', count: 345, percentage: 35 },
            { name: '大阪府', count: 156, percentage: 16 },
            { name: '神奈川県', count: 123, percentage: 12 },
            { name: '愛知県', count: 98, percentage: 10 },
            { name: '福岡県', count: 67, percentage: 7 },
            { name: 'その他', count: 200, percentage: 20 },
        ],
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('ja-JP', {
            style: 'currency',
            currency: 'JPY',
            notation: 'compact',
        }).format(amount);
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">統計・分析</h1>
                    <p className="text-gray-600 mt-1">プラットフォームの利用状況を分析します</p>
                </div>
                <div className="flex gap-2">
                    {['week', 'month', 'year'].map(p => (
                        <button
                            key={p}
                            onClick={() => setPeriod(p)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium ${
                                period === p 
                                    ? 'bg-primary-600 text-white'
                                    : 'bg-white text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                            {p === 'week' ? '週間' : p === 'month' ? '月間' : '年間'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div className="bg-white rounded-xl shadow-sm p-4">
                    <p className="text-sm text-gray-500">総ユーザー数</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.overview.totalUsers.toLocaleString()}</p>
                    <p className="text-xs text-green-600">+{stats.growth.users}%</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-4">
                    <p className="text-sm text-gray-500">総事業者数</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.overview.totalBusinesses.toLocaleString()}</p>
                    <p className="text-xs text-green-600">+{stats.growth.businesses}%</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-4">
                    <p className="text-sm text-gray-500">総案件数</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.overview.totalProjects.toLocaleString()}</p>
                    <p className="text-xs text-green-600">+{stats.growth.projects}%</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-4">
                    <p className="text-sm text-gray-500">総契約数</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.overview.totalContracts.toLocaleString()}</p>
                    <p className="text-xs text-green-600">+{stats.growth.contracts}%</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-4">
                    <p className="text-sm text-gray-500">総取引額</p>
                    <p className="text-2xl font-bold text-primary-600">{formatCurrency(stats.overview.totalRevenue)}</p>
                    <p className="text-xs text-green-600">+{stats.growth.revenue}%</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-4">
                    <p className="text-sm text-gray-500">プラットフォーム収益</p>
                    <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.overview.platformFee)}</p>
                    <p className="text-xs text-gray-500">手数料10%</p>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid lg:grid-cols-2 gap-8">
                {/* Monthly Trend */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">月別推移</h3>
                    <div className="space-y-4">
                        {stats.monthly.map((month, index) => (
                            <div key={month.month} className="flex items-center gap-4">
                                <span className="w-12 text-sm text-gray-500">{month.month}</span>
                                <div className="flex-1">
                                    <div className="flex gap-1 h-6">
                                        <div 
                                            className="bg-blue-500 rounded-l"
                                            style={{ width: `${(month.users / 200) * 100}%` }}
                                            title={`ユーザー: ${month.users}`}
                                        />
                                        <div 
                                            className="bg-green-500"
                                            style={{ width: `${(month.projects / 200) * 100}%` }}
                                            title={`案件: ${month.projects}`}
                                        />
                                        <div 
                                            className="bg-purple-500 rounded-r"
                                            style={{ width: `${(month.contracts / 200) * 100}%` }}
                                            title={`契約: ${month.contracts}`}
                                        />
                                    </div>
                                </div>
                                <span className="text-sm text-gray-700 w-24 text-right">
                                    {formatCurrency(month.revenue)}
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center gap-4 mt-4 pt-4 border-t">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-blue-500 rounded"></div>
                            <span className="text-xs text-gray-500">ユーザー</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-green-500 rounded"></div>
                            <span className="text-xs text-gray-500">案件</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-purple-500 rounded"></div>
                            <span className="text-xs text-gray-500">契約</span>
                        </div>
                    </div>
                </div>

                {/* Categories */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">カテゴリ別実績</h3>
                    <div className="space-y-4">
                        {stats.categories.map((category) => (
                            <div key={category.name}>
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm text-gray-700">{category.name}</span>
                                    <span className="text-sm text-gray-500">{category.count}件</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="flex-1 bg-gray-100 rounded-full h-2">
                                        <div 
                                            className="bg-primary-500 h-2 rounded-full"
                                            style={{ width: `${(category.revenue / 50000000) * 100}%` }}
                                        />
                                    </div>
                                    <span className="text-sm font-medium text-gray-900 w-20 text-right">
                                        {formatCurrency(category.revenue)}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Regional Distribution */}
            <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">地域別分布</h3>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                        {stats.regions.map((region) => (
                            <div key={region.name} className="flex items-center gap-4">
                                <span className="w-24 text-sm text-gray-700">{region.name}</span>
                                <div className="flex-1 bg-gray-100 rounded-full h-4">
                                    <div 
                                        className="bg-secondary-500 h-4 rounded-full"
                                        style={{ width: `${region.percentage}%` }}
                                    />
                                </div>
                                <span className="text-sm text-gray-500 w-16 text-right">
                                    {region.count}件 ({region.percentage}%)
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center justify-center">
                        <div className="relative w-48 h-48">
                            {/* Simplified pie chart representation */}
                            <svg viewBox="0 0 100 100" className="transform -rotate-90">
                                {stats.regions.reduce((acc, region, index) => {
                                    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#6B7280'];
                                    const startAngle = acc.offset;
                                    const angle = (region.percentage / 100) * 360;
                                    const largeArc = angle > 180 ? 1 : 0;
                                    const endAngle = startAngle + angle;
                                    
                                    const startX = 50 + 40 * Math.cos((startAngle * Math.PI) / 180);
                                    const startY = 50 + 40 * Math.sin((startAngle * Math.PI) / 180);
                                    const endX = 50 + 40 * Math.cos((endAngle * Math.PI) / 180);
                                    const endY = 50 + 40 * Math.sin((endAngle * Math.PI) / 180);
                                    
                                    acc.paths.push(
                                        <path
                                            key={region.name}
                                            d={`M 50 50 L ${startX} ${startY} A 40 40 0 ${largeArc} 1 ${endX} ${endY} Z`}
                                            fill={colors[index]}
                                            className="hover:opacity-80 transition-opacity"
                                        />
                                    );
                                    acc.offset = endAngle;
                                    return acc;
                                }, { paths: [] as React.ReactNode[], offset: 0 }).paths}
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-gray-900">989</p>
                                    <p className="text-xs text-gray-500">総件数</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Export Section */}
            <div className="bg-gray-50 rounded-xl p-6 flex items-center justify-between">
                <div>
                    <h3 className="font-semibold text-gray-900">データをエクスポート</h3>
                    <p className="text-sm text-gray-500">詳細なレポートをダウンロードできます</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                        CSV
                    </button>
                    <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                        PDF
                    </button>
                    <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                        Excel
                    </button>
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
