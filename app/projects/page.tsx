'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CATEGORIES, REGIONS, PROJECT_STATUS_LABELS, BUDGET_RANGES, SORT_OPTIONS } from '@/lib/constants';

// Sample projects data
const sampleProjects = [
    {
        id: '1',
        title: 'マンション リビング リフォーム',
        category: 'construction',
        description: '築20年のマンションのリビング（約20畳）のリフォームを検討しています。フローリングの張り替え、壁紙の交換、照明のLED化を希望します。',
        budgetMin: 1000000,
        budgetMax: 1500000,
        region: 'tokyo',
        status: 'OPEN',
        proposalCount: 5,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
        deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString(),
    },
    {
        id: '2',
        title: 'オフィス定期清掃（週2回）',
        category: 'cleaning',
        description: '50坪のオフィスの定期清掃をお願いできる業者様を探しています。週2回、始業前または終業後の作業を希望します。',
        budgetMin: 50000,
        budgetMax: 80000,
        region: 'kanagawa',
        status: 'OPEN',
        proposalCount: 8,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
        deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(),
    },
    {
        id: '3',
        title: 'エアコン取り付け工事（3台）',
        category: 'repair',
        description: '新居にエアコン3台の取り付けをお願いしたいです。エアコン本体は用意済みです。配管工事込みでお見積りをお願いします。',
        budgetMin: 30000,
        budgetMax: 50000,
        region: 'saitama',
        status: 'OPEN',
        proposalCount: 12,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
        deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10).toISOString(),
    },
    {
        id: '4',
        title: 'Webサイトリニューアル',
        category: 'it',
        description: '会社のコーポレートサイトのリニューアルを検討しています。WordPress希望、レスポンシブ対応、10ページ程度。',
        budgetMin: 300000,
        budgetMax: 500000,
        region: 'osaka',
        status: 'OPEN',
        proposalCount: 6,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
        deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
    },
    {
        id: '5',
        title: '引越し作業（単身・都内→都内）',
        category: 'moving',
        description: 'ワンルームから1LDKへの引越しです。荷物少なめ、大型家具は冷蔵庫とベッドのみ。日曜日希望。',
        budgetMin: 30000,
        budgetMax: 50000,
        region: 'tokyo',
        status: 'OPEN',
        proposalCount: 4,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
        deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 21).toISOString(),
    },
    {
        id: '6',
        title: '社内研修講師（ビジネスマナー）',
        category: 'education',
        description: '新入社員向けのビジネスマナー研修の講師を探しています。参加者20名、1日研修。教材提供含む。',
        budgetMin: 150000,
        budgetMax: 200000,
        region: 'aichi',
        status: 'OPEN',
        proposalCount: 3,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(),
        deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 45).toISOString(),
    },
    {
        id: '7',
        title: '結婚式二次会の司会・演出',
        category: 'event',
        description: '結婚式二次会（参加者60名程度）の司会と簡単な演出をお願いできる方を探しています。会場は都内レストラン。',
        budgetMin: 30000,
        budgetMax: 50000,
        region: 'tokyo',
        status: 'OPEN',
        proposalCount: 7,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
        deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 60).toISOString(),
    },
    {
        id: '8',
        title: 'ロゴデザイン制作',
        category: 'design',
        description: '新規立ち上げのカフェのロゴデザインをお願いします。ナチュラル・オーガニックなイメージ希望。複数案提案可能な方。',
        budgetMin: 50000,
        budgetMax: 100000,
        region: 'kyoto',
        status: 'OPEN',
        proposalCount: 15,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
        deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString(),
    },
];

export default function ProjectsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedRegion, setSelectedRegion] = useState('');
    const [selectedBudget, setSelectedBudget] = useState('');
    const [sortBy, setSortBy] = useState('createdAt-desc');

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('ja-JP', {
            style: 'currency',
            currency: 'JPY',
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('ja-JP', {
            month: 'short',
            day: 'numeric',
        });
    };

    const getDaysRemaining = (deadline: string) => {
        const days = Math.ceil((new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        return days;
    };

    let filteredProjects = sampleProjects.filter(project => {
        const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            project.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = !selectedCategory || project.category === selectedCategory;
        const matchesRegion = !selectedRegion || project.region === selectedRegion;
        const matchesBudget = !selectedBudget || (() => {
            const range = BUDGET_RANGES.find(r => r.id === selectedBudget);
            if (!range) return true;
            return project.budgetMax >= range.min && (range.max === null || project.budgetMin <= range.max);
        })();
        return matchesSearch && matchesCategory && matchesRegion && matchesBudget;
    });

    // Sort
    filteredProjects = filteredProjects.sort((a, b) => {
        switch (sortBy) {
            case 'createdAt-desc':
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            case 'createdAt-asc':
                return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            case 'budget-desc':
                return b.budgetMax - a.budgetMax;
            case 'budget-asc':
                return a.budgetMin - b.budgetMin;
            case 'deadline-asc':
                return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
            default:
                return 0;
        }
    });

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navigation */}
            <nav className="bg-white shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <Link href="/" className="text-xl font-bold text-primary-600">
                            ProMatch
                        </Link>
                        <div className="flex items-center space-x-4">
                            <Link href="/how-it-works" className="hidden md:inline text-gray-600 hover:text-primary-600">
                                ご利用ガイド
                            </Link>
                            <Link href="/auth/login" className="text-gray-600 hover:text-primary-600">
                                ログイン
                            </Link>
                            <Link
                                href="/auth/register"
                                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                            >
                                無料登録
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">案件を探す</h1>
                    <p className="text-gray-600 mt-2">
                        全{filteredProjects.length}件の案件が見つかりました
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Filters Sidebar */}
                    <div className="lg:w-72 flex-shrink-0">
                        <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                            <h2 className="font-semibold text-gray-900 mb-4">絞り込み</h2>
                            
                            {/* Search */}
                            <div className="mb-6">
                                <label className="block text-sm text-gray-600 mb-2">キーワード</label>
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                    placeholder="キーワードで検索..."
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                />
                            </div>

                            {/* Category */}
                            <div className="mb-6">
                                <label className="block text-sm text-gray-600 mb-2">カテゴリ</label>
                                <select
                                    value={selectedCategory}
                                    onChange={e => setSelectedCategory(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                >
                                    <option value="">すべてのカテゴリ</option>
                                    {CATEGORIES.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.icon} {cat.nameKo}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Region */}
                            <div className="mb-6">
                                <label className="block text-sm text-gray-600 mb-2">地域</label>
                                <select
                                    value={selectedRegion}
                                    onChange={e => setSelectedRegion(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                >
                                    <option value="">すべての地域</option>
                                    {REGIONS.map(region => (
                                        <option key={region.id} value={region.id}>{region.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Budget */}
                            <div className="mb-6">
                                <label className="block text-sm text-gray-600 mb-2">予算</label>
                                <select
                                    value={selectedBudget}
                                    onChange={e => setSelectedBudget(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                >
                                    <option value="">すべての予算</option>
                                    {BUDGET_RANGES.map(range => (
                                        <option key={range.id} value={range.id}>{range.label}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Reset Filters */}
                            <button
                                onClick={() => {
                                    setSearchTerm('');
                                    setSelectedCategory('');
                                    setSelectedRegion('');
                                    setSelectedBudget('');
                                }}
                                className="w-full py-2 text-sm text-gray-600 hover:text-primary-600"
                            >
                                絞り込みをリセット
                            </button>
                        </div>
                    </div>

                    {/* Projects List */}
                    <div className="flex-1">
                        {/* Sort */}
                        <div className="flex justify-between items-center mb-4">
                            <p className="text-sm text-gray-500">
                                {filteredProjects.length}件の案件
                            </p>
                            <select
                                value={sortBy}
                                onChange={e => setSortBy(e.target.value)}
                                className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            >
                                {SORT_OPTIONS.projects.map(option => (
                                    <option key={option.id} value={option.id}>{option.label}</option>
                                ))}
                            </select>
                        </div>

                        {/* Projects */}
                        <div className="space-y-4">
                            {filteredProjects.length === 0 ? (
                                <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                                    <div className="text-4xl mb-4">🔍</div>
                                    <p className="text-gray-500">条件に一致する案件が見つかりませんでした</p>
                                    <p className="text-sm text-gray-400 mt-2">絞り込み条件を変更してみてください</p>
                                </div>
                            ) : (
                                filteredProjects.map(project => {
                                    const category = CATEGORIES.find(c => c.id === project.category);
                                    const region = REGIONS.find(r => r.id === project.region);
                                    const statusInfo = PROJECT_STATUS_LABELS[project.status as keyof typeof PROJECT_STATUS_LABELS];
                                    const daysRemaining = getDaysRemaining(project.deadline);
                                    
                                    return (
                                        <Link
                                            key={project.id}
                                            href={`/business/projects/${project.id}`}
                                            className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                                        >
                                            <div className="p-6">
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <span className="text-2xl">{category?.icon}</span>
                                                            <span className="text-sm text-gray-500">{category?.nameKo}</span>
                                                            <span className={`px-2 py-0.5 text-xs rounded-full ${statusInfo?.color}`}>
                                                                {statusInfo?.label}
                                                            </span>
                                                        </div>
                                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                                            {project.title}
                                                        </h3>
                                                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                                            {project.description}
                                                        </p>
                                                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                                                            <span>📍 {region?.name}</span>
                                                            <span>💬 {project.proposalCount}件の提案</span>
                                                            <span className={daysRemaining <= 3 ? 'text-red-600 font-medium' : ''}>
                                                                ⏰ 残り{daysRemaining}日
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="text-right flex-shrink-0">
                                                        <p className="text-xl font-bold text-primary-600">
                                                            {formatCurrency(project.budgetMin)}
                                                        </p>
                                                        <p className="text-sm text-gray-500">
                                                            〜 {formatCurrency(project.budgetMax)}
                                                        </p>
                                                        <p className="text-xs text-gray-400 mt-2">
                                                            投稿日: {formatDate(project.createdAt)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })
                            )}
                        </div>

                        {/* Pagination placeholder */}
                        {filteredProjects.length > 0 && (
                            <div className="mt-8 flex justify-center">
                                <nav className="flex items-center gap-2">
                                    <button className="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-500 bg-gray-100 cursor-not-allowed">
                                        前へ
                                    </button>
                                    <button className="px-4 py-2 text-sm border border-primary-500 rounded-lg text-white bg-primary-600">
                                        1
                                    </button>
                                    <button className="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                                        2
                                    </button>
                                    <button className="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                                        3
                                    </button>
                                    <button className="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                                        次へ
                                    </button>
                                </nav>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-400 py-12 mt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="text-2xl font-bold text-white">ProMatch</div>
                        <div className="flex flex-wrap justify-center gap-6">
                            <Link href="/how-it-works" className="hover:text-white">ご利用ガイド</Link>
                            <Link href="/faq" className="hover:text-white">FAQ</Link>
                            <Link href="/terms" className="hover:text-white">利用規約</Link>
                            <Link href="/privacy" className="hover:text-white">プライバシーポリシー</Link>
                        </div>
                    </div>
                    <div className="mt-8 text-center text-sm">
                        © 2024 ProMatch. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
}
