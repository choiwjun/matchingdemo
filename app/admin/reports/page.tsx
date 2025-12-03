'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

// Report type definition
interface Report {
    id: string;
    type: string;
    targetId: string;
    targetTitle: string;
    reason: string;
    description: string;
    reporterEmail: string;
    reporterName: string;
    status: string;
    createdAt: string;
    assignedTo?: string;
    notes?: string;
    resolvedAt?: string;
    resolution?: string;
}

// Sample reports data
const sampleReports: Report[] = [
    {
        id: '1',
        type: 'PROJECT',
        targetId: 'project-123',
        targetTitle: '怪しい案件タイトル',
        reason: 'SPAM',
        description: '明らかに詐欺目的の案件だと思われます。連絡先が海外の番号になっています。',
        reporterEmail: 'user@test.com',
        reporterName: '田中 太郎',
        status: 'PENDING',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    },
    {
        id: '2',
        type: 'USER',
        targetId: 'user-456',
        targetTitle: '問題のあるユーザー（spam@example.com）',
        reason: 'HARASSMENT',
        description: 'チャットで不適切なメッセージを送ってきました。スクリーンショットを添付します。',
        reporterEmail: 'business@test.com',
        reporterName: '株式会社ABCリフォーム',
        status: 'PENDING',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    },
    {
        id: '3',
        type: 'BUSINESS',
        targetId: 'business-789',
        targetTitle: '悪質業者（fake-business@example.com）',
        reason: 'FRAUD',
        description: '契約後に連絡が取れなくなりました。前払い金を持ち逃げされた可能性があります。',
        reporterEmail: 'victim@example.jp',
        reporterName: '被害者 様',
        status: 'IN_PROGRESS',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
        assignedTo: 'admin@test.com',
        notes: '調査中。警察への相談も検討。',
    },
    {
        id: '4',
        type: 'PROJECT',
        targetId: 'project-111',
        targetTitle: '不適切な内容の案件',
        reason: 'INAPPROPRIATE',
        description: '案件の説明文に不適切な表現が含まれています。',
        reporterEmail: 'reporter@example.jp',
        reporterName: '通報者',
        status: 'RESOLVED',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
        resolvedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(),
        resolution: '該当案件を削除し、投稿者に警告を送信しました。',
    },
    {
        id: '5',
        type: 'REVIEW',
        targetId: 'review-222',
        targetTitle: '虚偽のレビュー',
        reason: 'FAKE_REVIEW',
        description: '実際にサービスを利用していないのに悪意のあるレビューを投稿されました。',
        reporterEmail: 'business2@test.com',
        reporterName: 'クリーンサービス山田',
        status: 'DISMISSED',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
        resolvedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
        resolution: '調査の結果、レビューは正当なものと判断しました。',
    },
];

const reasonLabels: Record<string, string> = {
    SPAM: 'スパム・詐欺',
    HARASSMENT: 'ハラスメント',
    FRAUD: '詐欺・不正行為',
    INAPPROPRIATE: '不適切なコンテンツ',
    FAKE_REVIEW: '虚偽のレビュー',
    OTHER: 'その他',
};

export default function AdminReportsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [reports, setReports] = useState(sampleReports);
    const [filterStatus, setFilterStatus] = useState<string>('PENDING');
    const [selectedReport, setSelectedReport] = useState<Report | null>(null);

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
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getStatusInfo = (status: string) => {
        switch (status) {
            case 'PENDING': return { label: '未対応', color: 'bg-red-100 text-red-800' };
            case 'IN_PROGRESS': return { label: '対応中', color: 'bg-yellow-100 text-yellow-800' };
            case 'RESOLVED': return { label: '解決済み', color: 'bg-green-100 text-green-800' };
            case 'DISMISSED': return { label: '却下', color: 'bg-gray-100 text-gray-800' };
            default: return { label: status, color: 'bg-gray-100 text-gray-800' };
        }
    };

    const getTypeInfo = (type: string) => {
        switch (type) {
            case 'PROJECT': return { label: '案件', icon: '📝', color: 'text-blue-600' };
            case 'USER': return { label: 'ユーザー', icon: '👤', color: 'text-purple-600' };
            case 'BUSINESS': return { label: '事業者', icon: '🏢', color: 'text-orange-600' };
            case 'REVIEW': return { label: 'レビュー', icon: '⭐', color: 'text-yellow-600' };
            default: return { label: type, icon: '📋', color: 'text-gray-600' };
        }
    };

    const filteredReports = filterStatus === 'all'
        ? reports
        : reports.filter(r => r.status === filterStatus);

    const handleUpdateStatus = (id: string, newStatus: string) => {
        const resolution = newStatus === 'RESOLVED' || newStatus === 'DISMISSED' 
            ? prompt('対応内容を入力してください：')
            : null;
        
        if (newStatus === 'RESOLVED' || newStatus === 'DISMISSED') {
            if (!resolution) return;
        }

        setReports(reports.map(r => 
            r.id === id ? { 
                ...r, 
                status: newStatus, 
                ...(resolution ? { resolution, resolvedAt: new Date().toISOString() } : {}),
                ...(newStatus === 'IN_PROGRESS' ? { assignedTo: session?.user?.email } : {})
            } : r
        ));
        setSelectedReport(null);
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">通報管理</h1>
                <p className="text-gray-600 mt-1">ユーザーからの通報を確認・対応します</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4">
                <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                    <p className="text-sm text-red-700">未対応</p>
                    <p className="text-3xl font-bold text-red-800">
                        {reports.filter(r => r.status === 'PENDING').length}
                    </p>
                </div>
                <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
                    <p className="text-sm text-yellow-700">対応中</p>
                    <p className="text-3xl font-bold text-yellow-800">
                        {reports.filter(r => r.status === 'IN_PROGRESS').length}
                    </p>
                </div>
                <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                    <p className="text-sm text-green-700">解決済み</p>
                    <p className="text-3xl font-bold text-green-800">
                        {reports.filter(r => r.status === 'RESOLVED').length}
                    </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <p className="text-sm text-gray-700">却下</p>
                    <p className="text-3xl font-bold text-gray-800">
                        {reports.filter(r => r.status === 'DISMISSED').length}
                    </p>
                </div>
            </div>

            {/* Filter */}
            <div className="flex gap-2">
                {[
                    { id: 'PENDING', label: '未対応' },
                    { id: 'IN_PROGRESS', label: '対応中' },
                    { id: 'RESOLVED', label: '解決済み' },
                    { id: 'DISMISSED', label: '却下' },
                    { id: 'all', label: 'すべて' },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setFilterStatus(tab.id)}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            filterStatus === tab.id
                                ? 'bg-primary-600 text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Reports List */}
            <div className="space-y-4">
                {filteredReports.length === 0 ? (
                    <div className="bg-white rounded-xl p-12 text-center">
                        <div className="text-4xl mb-4">🛡️</div>
                        <p className="text-gray-500">該当する通報がありません</p>
                    </div>
                ) : (
                    filteredReports.map((report) => {
                        const statusInfo = getStatusInfo(report.status);
                        const typeInfo = getTypeInfo(report.type);
                        
                        return (
                            <div
                                key={report.id}
                                className={`bg-white rounded-xl shadow-sm p-6 ${
                                    report.status === 'PENDING' ? 'border-l-4 border-red-500' : ''
                                }`}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className={`text-xl ${typeInfo.color}`}>{typeInfo.icon}</span>
                                            <span className="text-sm text-gray-500">{typeInfo.label}</span>
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusInfo.color}`}>
                                                {statusInfo.label}
                                            </span>
                                            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
                                                {reasonLabels[report.reason] || report.reason}
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                            {report.targetTitle}
                                        </h3>
                                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                            {report.description}
                                        </p>
                                        <div className="flex items-center gap-4 text-xs text-gray-400">
                                            <span>通報者: {report.reporterName}</span>
                                            <span>通報日: {formatDate(report.createdAt)}</span>
                                            {report.assignedTo && <span>担当: {report.assignedTo}</span>}
                                        </div>
                                        {report.resolution && (
                                            <div className="mt-3 p-3 bg-gray-50 rounded-lg text-sm text-gray-700">
                                                <strong>対応内容:</strong> {report.resolution}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex gap-2 ml-4">
                                        <button
                                            onClick={() => setSelectedReport(report)}
                                            className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                                        >
                                            詳細
                                        </button>
                                        {report.status === 'PENDING' && (
                                            <button
                                                onClick={() => handleUpdateStatus(report.id, 'IN_PROGRESS')}
                                                className="px-4 py-2 text-sm bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                                            >
                                                対応開始
                                            </button>
                                        )}
                                        {report.status === 'IN_PROGRESS' && (
                                            <>
                                                <button
                                                    onClick={() => handleUpdateStatus(report.id, 'RESOLVED')}
                                                    className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700"
                                                >
                                                    解決
                                                </button>
                                                <button
                                                    onClick={() => handleUpdateStatus(report.id, 'DISMISSED')}
                                                    className="px-4 py-2 text-sm bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                                                >
                                                    却下
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
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
