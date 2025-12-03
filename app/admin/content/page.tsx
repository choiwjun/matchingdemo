'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

// Sample content data
const sampleContent = {
    notices: [
        {
            id: '1',
            title: '年末年始の営業について',
            content: '12月29日から1月3日まで、サポートセンターはお休みをいただきます。',
            isPublished: true,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
            views: 1234,
        },
        {
            id: '2',
            title: 'サービス手数料改定のお知らせ',
            content: '2024年4月1日より、プラットフォーム手数料を改定いたします。',
            isPublished: true,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
            views: 2567,
        },
        {
            id: '3',
            title: '新機能リリース予定',
            content: 'ビデオ通話機能を近日中にリリース予定です。',
            isPublished: false,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
            views: 0,
        },
    ],
    faqs: [
        {
            id: '1',
            question: 'サービスの利用料金はいくらですか？',
            answer: '利用者様は無料でご利用いただけます。事業者様は契約成立時に10%の手数料が発生します。',
            category: 'general',
            order: 1,
            isPublished: true,
        },
        {
            id: '2',
            question: '支払い方法は何がありますか？',
            answer: 'クレジットカード、銀行振込、PayPay、LINE Pay、楽天ペイに対応しております。',
            category: 'payment',
            order: 2,
            isPublished: true,
        },
        {
            id: '3',
            question: 'キャンセルはできますか？',
            answer: '契約成立前であれば、いつでもキャンセル可能です。契約成立後は、双方の合意が必要となります。',
            category: 'contract',
            order: 3,
            isPublished: true,
        },
        {
            id: '4',
            question: '事業者登録の審査にはどのくらいかかりますか？',
            answer: '通常2〜3営業日以内に審査結果をお知らせいたします。',
            category: 'business',
            order: 4,
            isPublished: true,
        },
    ],
    banners: [
        {
            id: '1',
            title: '新規登録キャンペーン',
            imageUrl: '/banners/campaign1.jpg',
            linkUrl: '/auth/register',
            position: 'home_top',
            isActive: true,
            startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
            endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 20).toISOString(),
        },
        {
            id: '2',
            title: '事業者募集中',
            imageUrl: '/banners/business.jpg',
            linkUrl: '/for-business',
            position: 'home_middle',
            isActive: true,
            startDate: null,
            endDate: null,
        },
    ],
    reports: [
        {
            id: '1',
            type: 'PROJECT',
            targetId: '123',
            targetTitle: '不適切な案件タイトル',
            reason: '誤解を招く内容',
            reporterEmail: 'user@example.jp',
            status: 'PENDING',
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
        },
        {
            id: '2',
            type: 'USER',
            targetId: '456',
            targetTitle: '問題のあるユーザー',
            reason: 'スパム行為',
            reporterEmail: 'reporter@example.jp',
            status: 'RESOLVED',
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
        },
    ],
};

type ContentTab = 'notices' | 'faqs' | 'banners' | 'reports';

export default function AdminContentPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<ContentTab>('notices');
    const [content] = useState(sampleContent);

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

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('ja-JP', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const tabs = [
        { id: 'notices', label: 'お知らせ', icon: '📢', count: content.notices.length },
        { id: 'faqs', label: 'FAQ', icon: '❓', count: content.faqs.length },
        { id: 'banners', label: 'バナー', icon: '🖼️', count: content.banners.length },
        { id: 'reports', label: '通報', icon: '🚨', count: content.reports.filter(r => r.status === 'PENDING').length },
    ];

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
                <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">コンテンツ管理</h1>
                        <p className="text-gray-600 mt-1">お知らせ、FAQ、バナーなどのコンテンツを管理します</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-lg shadow-sm mb-6">
                    <div className="border-b border-gray-200">
                        <nav className="flex -mb-px overflow-x-auto">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as ContentTab)}
                                    className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm flex items-center gap-2 ${
                                        activeTab === tab.id
                                            ? 'border-primary-500 text-primary-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    <span>{tab.icon}</span>
                                    {tab.label}
                                    {tab.count > 0 && (
                                        <span className={`py-0.5 px-2 rounded-full text-xs ${
                                            activeTab === tab.id
                                                ? 'bg-primary-100 text-primary-600'
                                                : tab.id === 'reports' 
                                                    ? 'bg-red-100 text-red-600'
                                                    : 'bg-gray-100 text-gray-600'
                                        }`}>
                                            {tab.count}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>

                {/* Content Area */}
                <div className="bg-white rounded-lg shadow-sm">
                    {/* Notices Tab */}
                    {activeTab === 'notices' && (
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-lg font-semibold">お知らせ一覧</h2>
                                <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                                    + 新規作成
                                </button>
                            </div>
                            <div className="space-y-4">
                                {content.notices.map((notice) => (
                                    <div key={notice.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="font-medium text-gray-900">{notice.title}</h3>
                                                    <span className={`px-2 py-0.5 text-xs rounded-full ${
                                                        notice.isPublished 
                                                            ? 'bg-green-100 text-green-800' 
                                                            : 'bg-gray-100 text-gray-600'
                                                    }`}>
                                                        {notice.isPublished ? '公開中' : '下書き'}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-500 mb-2">{notice.content}</p>
                                                <div className="flex items-center gap-4 text-xs text-gray-400">
                                                    <span>作成日: {formatDate(notice.createdAt)}</span>
                                                    <span>閲覧数: {notice.views}</span>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button className="text-primary-600 hover:text-primary-700 text-sm">編集</button>
                                                <button className="text-red-600 hover:text-red-700 text-sm">削除</button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* FAQs Tab */}
                    {activeTab === 'faqs' && (
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-lg font-semibold">FAQ一覧</h2>
                                <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                                    + 新規作成
                                </button>
                            </div>
                            <div className="space-y-4">
                                {content.faqs.map((faq) => (
                                    <div key={faq.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="text-primary-600 font-bold">Q.</span>
                                                    <h3 className="font-medium text-gray-900">{faq.question}</h3>
                                                </div>
                                                <div className="flex items-start gap-2 ml-6">
                                                    <span className="text-gray-400 font-bold">A.</span>
                                                    <p className="text-sm text-gray-600">{faq.answer}</p>
                                                </div>
                                                <div className="flex items-center gap-4 text-xs text-gray-400 mt-2 ml-6">
                                                    <span className="px-2 py-0.5 bg-gray-100 rounded">{faq.category}</span>
                                                    <span>表示順: {faq.order}</span>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button className="text-primary-600 hover:text-primary-700 text-sm">編集</button>
                                                <button className="text-red-600 hover:text-red-700 text-sm">削除</button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Banners Tab */}
                    {activeTab === 'banners' && (
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-lg font-semibold">バナー一覧</h2>
                                <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                                    + 新規作成
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {content.banners.map((banner) => (
                                    <div key={banner.id} className="border border-gray-200 rounded-lg overflow-hidden">
                                        <div className="h-32 bg-gray-200 flex items-center justify-center text-4xl text-gray-400">
                                            🖼️
                                        </div>
                                        <div className="p-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <h3 className="font-medium text-gray-900">{banner.title}</h3>
                                                <span className={`px-2 py-0.5 text-xs rounded-full ${
                                                    banner.isActive 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : 'bg-gray-100 text-gray-600'
                                                }`}>
                                                    {banner.isActive ? 'アクティブ' : '非アクティブ'}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-500 mb-2">位置: {banner.position}</p>
                                            {banner.startDate && banner.endDate && (
                                                <p className="text-xs text-gray-400">
                                                    期間: {formatDate(banner.startDate)} 〜 {formatDate(banner.endDate)}
                                                </p>
                                            )}
                                            <div className="flex gap-2 mt-4">
                                                <button className="text-primary-600 hover:text-primary-700 text-sm">編集</button>
                                                <button className="text-red-600 hover:text-red-700 text-sm">削除</button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Reports Tab */}
                    {activeTab === 'reports' && (
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-lg font-semibold">通報一覧</h2>
                            </div>
                            <div className="space-y-4">
                                {content.reports.map((report) => (
                                    <div key={report.id} className={`border rounded-lg p-4 ${
                                        report.status === 'PENDING' 
                                            ? 'border-red-200 bg-red-50' 
                                            : 'border-gray-200'
                                    }`}>
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className={`px-2 py-0.5 text-xs rounded-full ${
                                                        report.type === 'PROJECT' 
                                                            ? 'bg-blue-100 text-blue-800' 
                                                            : 'bg-purple-100 text-purple-800'
                                                    }`}>
                                                        {report.type === 'PROJECT' ? '案件' : 'ユーザー'}
                                                    </span>
                                                    <span className={`px-2 py-0.5 text-xs rounded-full ${
                                                        report.status === 'PENDING'
                                                            ? 'bg-yellow-100 text-yellow-800'
                                                            : 'bg-green-100 text-green-800'
                                                    }`}>
                                                        {report.status === 'PENDING' ? '未対応' : '対応済み'}
                                                    </span>
                                                </div>
                                                <h3 className="font-medium text-gray-900 mb-1">{report.targetTitle}</h3>
                                                <p className="text-sm text-gray-600 mb-2">通報理由: {report.reason}</p>
                                                <div className="flex items-center gap-4 text-xs text-gray-400">
                                                    <span>通報者: {report.reporterEmail}</span>
                                                    <span>通報日: {formatDate(report.createdAt)}</span>
                                                </div>
                                            </div>
                                            {report.status === 'PENDING' && (
                                                <div className="flex gap-2">
                                                    <button className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700">
                                                        対応済み
                                                    </button>
                                                    <button className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700">
                                                        削除
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
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
