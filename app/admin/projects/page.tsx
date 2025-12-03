'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { PROJECT_STATUS_LABELS, CATEGORIES } from '@/lib/constants';

// Sample projects data
const sampleProjects = [
    {
        id: '1',
        title: 'マンション リビング リフォーム',
        category: 'construction',
        status: 'OPEN',
        budgetMin: 1000000,
        budgetMax: 1500000,
        region: '東京都',
        proposalCount: 5,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
        user: {
            name: '田中 太郎',
            email: 'user@test.com',
        },
    },
    {
        id: '2',
        title: 'オフィス定期清掃',
        category: 'cleaning',
        status: 'IN_PROGRESS',
        budgetMin: 50000,
        budgetMax: 100000,
        region: '神奈川県',
        proposalCount: 8,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
        user: {
            name: '株式会社ABC',
            email: 'contact@abc.jp',
        },
    },
    {
        id: '3',
        title: '給湯器交換工事',
        category: 'repair',
        status: 'COMPLETED',
        budgetMin: 100000,
        budgetMax: 200000,
        region: '埼玉県',
        proposalCount: 12,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
        user: {
            name: '佐藤 花子',
            email: 'hanako@example.jp',
        },
    },
    {
        id: '4',
        title: 'Webサイトリニューアル',
        category: 'it',
        status: 'OPEN',
        budgetMin: 300000,
        budgetMax: 500000,
        region: '大阪府',
        proposalCount: 3,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
        user: {
            name: '株式会社XYZ',
            email: 'web@xyz.co.jp',
        },
    },
    {
        id: '5',
        title: '引越し作業（単身）',
        category: 'moving',
        status: 'CANCELLED',
        budgetMin: 30000,
        budgetMax: 50000,
        region: '千葉県',
        proposalCount: 6,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(),
        user: {
            name: '山田 一郎',
            email: 'yamada@example.jp',
        },
    },
    {
        id: '6',
        title: '社内研修講師',
        category: 'education',
        status: 'OPEN',
        budgetMin: 200000,
        budgetMax: 300000,
        region: '東京都',
        proposalCount: 2,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
        user: {
            name: '株式会社教育',
            email: 'hr@education.jp',
        },
    },
];

export default function AdminProjectsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [projects] = useState(sampleProjects);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [filterCategory, setFilterCategory] = useState<string>('all');

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

    const filteredProjects = projects.filter(project => {
        const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            project.user.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || project.status === filterStatus;
        const matchesCategory = filterCategory === 'all' || project.category === filterCategory;
        return matchesSearch && matchesStatus && matchesCategory;
    });

    const statusCounts = {
        all: projects.length,
        OPEN: projects.filter(p => p.status === 'OPEN').length,
        IN_PROGRESS: projects.filter(p => p.status === 'IN_PROGRESS').length,
        COMPLETED: projects.filter(p => p.status === 'COMPLETED').length,
        CANCELLED: projects.filter(p => p.status === 'CANCELLED').length,
    };

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
                    <h1 className="text-2xl font-bold text-gray-900">案件管理</h1>
                    <p className="text-gray-600 mt-1">全{projects.length}件の案件</p>
                </div>

                {/* Status Summary Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    {[
                        { id: 'OPEN', icon: '📝', label: '募集中' },
                        { id: 'IN_PROGRESS', icon: '🔄', label: '進行中' },
                        { id: 'COMPLETED', icon: '✅', label: '完了' },
                        { id: 'CANCELLED', icon: '❌', label: 'キャンセル' },
                    ].map((item) => {
                        const statusInfo = PROJECT_STATUS_LABELS[item.id as keyof typeof PROJECT_STATUS_LABELS];
                        return (
                            <button
                                key={item.id}
                                onClick={() => setFilterStatus(filterStatus === item.id ? 'all' : item.id)}
                                className={`p-4 rounded-lg border-2 transition-all ${
                                    filterStatus === item.id
                                        ? 'border-primary-500 bg-primary-50'
                                        : 'border-transparent bg-white shadow-sm hover:border-gray-200'
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-2xl">{item.icon}</span>
                                    <span className="text-2xl font-bold text-gray-900">
                                        {statusCounts[item.id as keyof typeof statusCounts]}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500 mt-1">{item.label}</p>
                            </button>
                        );
                    })}
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <input
                                type="text"
                                placeholder="案件タイトルまたは投稿者名で検索..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            />
                        </div>
                        <select
                            value={filterCategory}
                            onChange={e => setFilterCategory(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        >
                            <option value="all">すべてのカテゴリ</option>
                            {CATEGORIES.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.icon} {cat.nameKo}</option>
                            ))}
                        </select>
                        <select
                            value={filterStatus}
                            onChange={e => setFilterStatus(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        >
                            <option value="all">すべてのステータス</option>
                            {Object.entries(PROJECT_STATUS_LABELS).map(([key, value]) => (
                                <option key={key} value={key}>{value.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Projects Table */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        案件
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        投稿者
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        予算
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        ステータス
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        提案数
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        投稿日
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        操作
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredProjects.map((project) => {
                                    const statusInfo = PROJECT_STATUS_LABELS[project.status as keyof typeof PROJECT_STATUS_LABELS];
                                    const category = CATEGORIES.find(c => c.id === project.category);
                                    
                                    return (
                                        <tr key={project.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <span className="text-2xl mr-3">{category?.icon}</span>
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {project.title}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {category?.nameKo} • {project.region}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{project.user.name}</div>
                                                <div className="text-sm text-gray-500">{project.user.email}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {formatCurrency(project.budgetMin)} 〜 {formatCurrency(project.budgetMax)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusInfo?.color}`}>
                                                    {statusInfo?.label}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {project.proposalCount}件
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatDate(project.createdAt)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button className="text-primary-600 hover:text-primary-900 mr-3">
                                                    詳細
                                                </button>
                                                {project.status === 'OPEN' && (
                                                    <button className="text-red-600 hover:text-red-900">
                                                        停止
                                                    </button>
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
