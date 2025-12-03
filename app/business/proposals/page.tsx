'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { PROPOSAL_STATUS_LABELS, CATEGORIES } from '@/lib/constants';

// Sample proposals data
const sampleProposals = [
    {
        id: '1',
        projectTitle: 'マンション リビング リフォーム',
        projectCategory: 'construction',
        amount: 1200000,
        status: 'PENDING',
        message: 'ご依頼内容を拝見いたしました。弊社は20年以上のリフォーム実績があり、お客様のご要望に沿った提案をさせていただきます。現地調査後、詳細なお見積もりをご提示いたします。',
        estimatedDays: 14,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
        client: {
            name: '田中 様',
            region: '東京都',
        },
    },
    {
        id: '2',
        projectTitle: 'オフィス定期清掃',
        projectCategory: 'cleaning',
        amount: 80000,
        status: 'ACCEPTED',
        message: '清掃スタッフは全員経験豊富で、オフィスビルの清掃実績も多数ございます。月4回の定期清掃プランをご提案いたします。',
        estimatedDays: 30,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
        client: {
            name: '株式会社ABC 様',
            region: '神奈川県',
        },
    },
    {
        id: '3',
        projectTitle: '給湯器交換工事',
        projectCategory: 'repair',
        amount: 180000,
        status: 'REJECTED',
        message: 'ガス給湯器の交換工事を承ります。当日施工可能です。保証期間は3年間となっております。',
        estimatedDays: 1,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
        client: {
            name: '佐藤 様',
            region: '埼玉県',
        },
    },
    {
        id: '4',
        projectTitle: 'Webサイトリニューアル',
        projectCategory: 'it',
        amount: 500000,
        status: 'PENDING',
        message: 'WordPress対応、レスポンシブデザイン、SEO対策込みでご提案いたします。制作実績は100サイト以上ございます。',
        estimatedDays: 30,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
        client: {
            name: '株式会社XYZ 様',
            region: '大阪府',
        },
    },
    {
        id: '5',
        projectTitle: '社内研修講師',
        projectCategory: 'education',
        amount: 250000,
        status: 'WITHDRAWN',
        message: 'ビジネスマナー研修の講師を承ります。受講者数に応じて柔軟に対応いたします。',
        estimatedDays: 2,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(),
        client: {
            name: '山田 様',
            region: '千葉県',
        },
    },
];

export default function BusinessProposalsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [proposals] = useState(sampleProposals);
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

    const filteredProposals = filterStatus === 'all'
        ? proposals
        : proposals.filter(p => p.status === filterStatus);

    const statusCounts = {
        all: proposals.length,
        PENDING: proposals.filter(p => p.status === 'PENDING').length,
        ACCEPTED: proposals.filter(p => p.status === 'ACCEPTED').length,
        REJECTED: proposals.filter(p => p.status === 'REJECTED').length,
        WITHDRAWN: proposals.filter(p => p.status === 'WITHDRAWN').length,
    };

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
                    <h1 className="text-2xl font-bold text-gray-900">提案履歴</h1>
                    <p className="text-gray-600 mt-1">過去に送信した提案の一覧と状況をご確認いただけます</p>
                </div>

                {/* Status Filter Tabs */}
                <div className="bg-white rounded-lg shadow-sm mb-6">
                    <div className="border-b border-gray-200">
                        <nav className="flex -mb-px overflow-x-auto">
                            {[
                                { id: 'all', label: 'すべて' },
                                { id: 'PENDING', label: '審査中' },
                                { id: 'ACCEPTED', label: '承認済み' },
                                { id: 'REJECTED', label: 'お見送り' },
                                { id: 'WITHDRAWN', label: '取り下げ' },
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

                {/* Proposals List */}
                <div className="space-y-4">
                    {filteredProposals.length === 0 ? (
                        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                            <div className="text-4xl mb-4">📝</div>
                            <p className="text-gray-500">該当する提案がありません</p>
                        </div>
                    ) : (
                        filteredProposals.map((proposal) => {
                            const statusInfo = PROPOSAL_STATUS_LABELS[proposal.status as keyof typeof PROPOSAL_STATUS_LABELS];
                            const category = CATEGORIES.find(c => c.id === proposal.projectCategory);
                            
                            return (
                                <div key={proposal.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                    <div className="p-6">
                                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className="text-2xl">{category?.icon}</span>
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo?.color}`}>
                                                        {statusInfo?.label}
                                                    </span>
                                                </div>
                                                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                                    {proposal.projectTitle}
                                                </h3>
                                                <p className="text-sm text-gray-500 mb-3">
                                                    {proposal.client.name} • {proposal.client.region}
                                                </p>
                                                <p className="text-gray-600 text-sm line-clamp-2">
                                                    {proposal.message}
                                                </p>
                                            </div>
                                            
                                            <div className="lg:text-right flex-shrink-0">
                                                <p className="text-2xl font-bold text-primary-600">
                                                    {formatCurrency(proposal.amount)}
                                                </p>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    作業期間: 約{proposal.estimatedDays}日
                                                </p>
                                                <p className="text-xs text-gray-400 mt-2">
                                                    提案日: {formatDate(proposal.createdAt)}
                                                </p>
                                            </div>
                                        </div>
                                        
                                        {/* Actions */}
                                        <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-3">
                                            <Link
                                                href={`/business/projects/${proposal.id}`}
                                                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                                            >
                                                案件詳細を見る →
                                            </Link>
                                            {proposal.status === 'ACCEPTED' && (
                                                <Link
                                                    href="/chat"
                                                    className="text-sm text-green-600 hover:text-green-700 font-medium"
                                                >
                                                    チャットで連絡 →
                                                </Link>
                                            )}
                                            {proposal.status === 'PENDING' && (
                                                <button className="text-sm text-red-600 hover:text-red-700 font-medium">
                                                    提案を取り下げる
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
