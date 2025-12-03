'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

// Verification type definition
interface Document {
    name: string;
    type: string;
}

interface Verification {
    id: string;
    companyName: string;
    representativeName: string;
    email: string;
    phone: string;
    businessNumber: string;
    category: string;
    region: string;
    website: string | null;
    description: string;
    documents: Document[];
    status: string;
    submittedAt: string;
    reviewedAt?: string;
    rejectReason?: string;
}

// Sample verifications data
const sampleVerifications: Verification[] = [
    {
        id: '1',
        companyName: 'クリーンサービス山田',
        representativeName: '山田 一郎',
        email: 'business2@test.com',
        phone: '03-2222-3333',
        businessNumber: '1234567890123',
        category: '清掃・整理',
        region: '大阪府',
        website: 'https://clean-yamada.example.jp',
        description: '創業10年、オフィス・住宅の清掃サービスを提供しています。',
        documents: [
            { name: '登記簿謄本.pdf', type: 'registration' },
            { name: '営業許可証.pdf', type: 'license' },
        ],
        status: 'PENDING',
        submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    },
    {
        id: '2',
        companyName: '株式会社テックソリューション',
        representativeName: '佐藤 健太',
        email: 'tech@solution.jp',
        phone: '03-4444-5555',
        businessNumber: '9876543210123',
        category: 'IT・技術',
        region: '東京都',
        website: 'https://tech-solution.example.jp',
        description: 'Webサイト制作、システム開発を専門としています。',
        documents: [
            { name: '登記簿謄本.pdf', type: 'registration' },
        ],
        status: 'PENDING',
        submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
    },
    {
        id: '3',
        companyName: '引越しサポート株式会社',
        representativeName: '高橋 修',
        email: 'moving@support.jp',
        phone: '06-1111-2222',
        businessNumber: '5555666677778',
        category: '引越し・運송',
        region: '神奈川県',
        website: null,
        description: '丁寧な引越しサービスを心がけています。',
        documents: [
            { name: '登記簿謄本.pdf', type: 'registration' },
            { name: '運送業許可証.pdf', type: 'license' },
        ],
        status: 'PENDING',
        submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    },
    {
        id: '4',
        companyName: '株式会社ABCリフォーム',
        representativeName: '山田 太郎',
        email: 'business@test.com',
        phone: '03-1234-5678',
        businessNumber: '1111222233334',
        category: '建設・リフォーム',
        region: '東京都',
        website: 'https://abc-reform.example.jp',
        description: '創業15年、住宅リフォームを専門に手掛けています。',
        documents: [
            { name: '登記簿謄本.pdf', type: 'registration' },
            { name: '建設業許可証.pdf', type: 'license' },
        ],
        status: 'APPROVED',
        submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
        reviewedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 28).toISOString(),
    },
    {
        id: '5',
        companyName: '怪しい業者',
        representativeName: '不明',
        email: 'spam@example.com',
        phone: '000-0000-0000',
        businessNumber: '0000000000000',
        category: 'その他',
        region: '不明',
        website: null,
        description: '...',
        documents: [],
        status: 'REJECTED',
        submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
        reviewedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 9).toISOString(),
        rejectReason: '必要書類の不備、事業者情報の確認ができませんでした。',
    },
];

export default function AdminVerificationsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [verifications, setVerifications] = useState(sampleVerifications);
    const [filterStatus, setFilterStatus] = useState<string>('PENDING');
    const [selectedVerification, setSelectedVerification] = useState<Verification | null>(null);

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
            case 'PENDING': return { label: '審査待ち', color: 'bg-yellow-100 text-yellow-800' };
            case 'APPROVED': return { label: '承認済み', color: 'bg-green-100 text-green-800' };
            case 'REJECTED': return { label: '却下', color: 'bg-red-100 text-red-800' };
            default: return { label: status, color: 'bg-gray-100 text-gray-800' };
        }
    };

    const filteredVerifications = filterStatus === 'all'
        ? verifications
        : verifications.filter(v => v.status === filterStatus);

    const handleApprove = (id: string) => {
        setVerifications(verifications.map(v => 
            v.id === id ? { ...v, status: 'APPROVED', reviewedAt: new Date().toISOString() } : v
        ));
        setSelectedVerification(null);
    };

    const handleReject = (id: string) => {
        const reason = prompt('却下理由を入力してください：');
        if (reason) {
            setVerifications(verifications.map(v => 
                v.id === id ? { ...v, status: 'REJECTED', reviewedAt: new Date().toISOString(), rejectReason: reason } : v
            ));
            setSelectedVerification(null);
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">事業者認証管理</h1>
                <p className="text-gray-600 mt-1">事業者の認証申請を審査・管理します</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
                    <p className="text-sm text-yellow-700">審査待ち</p>
                    <p className="text-3xl font-bold text-yellow-800">
                        {verifications.filter(v => v.status === 'PENDING').length}
                    </p>
                </div>
                <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                    <p className="text-sm text-green-700">承認済み</p>
                    <p className="text-3xl font-bold text-green-800">
                        {verifications.filter(v => v.status === 'APPROVED').length}
                    </p>
                </div>
                <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                    <p className="text-sm text-red-700">却下</p>
                    <p className="text-3xl font-bold text-red-800">
                        {verifications.filter(v => v.status === 'REJECTED').length}
                    </p>
                </div>
            </div>

            {/* Filter */}
            <div className="flex gap-2">
                {[
                    { id: 'PENDING', label: '審査待ち' },
                    { id: 'APPROVED', label: '承認済み' },
                    { id: 'REJECTED', label: '却下' },
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

            {/* Verifications List */}
            <div className="space-y-4">
                {filteredVerifications.length === 0 ? (
                    <div className="bg-white rounded-xl p-12 text-center">
                        <div className="text-4xl mb-4">📋</div>
                        <p className="text-gray-500">該当する申請がありません</p>
                    </div>
                ) : (
                    filteredVerifications.map((verification) => {
                        const statusInfo = getStatusInfo(verification.status);
                        
                        return (
                            <div
                                key={verification.id}
                                className="bg-white rounded-xl shadow-sm p-6"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                {verification.companyName}
                                            </h3>
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusInfo.color}`}>
                                                {statusInfo.label}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                                            <div>
                                                <span className="text-gray-400">代表者：</span>
                                                {verification.representativeName}
                                            </div>
                                            <div>
                                                <span className="text-gray-400">メール：</span>
                                                {verification.email}
                                            </div>
                                            <div>
                                                <span className="text-gray-400">カテゴリ：</span>
                                                {verification.category}
                                            </div>
                                            <div>
                                                <span className="text-gray-400">地域：</span>
                                                {verification.region}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 text-xs text-gray-400">
                                            <span>申請日: {formatDate(verification.submittedAt)}</span>
                                            {verification.reviewedAt && (
                                                <span>審査日: {formatDate(verification.reviewedAt)}</span>
                                            )}
                                            <span>書類: {verification.documents.length}件</span>
                                        </div>
                                        {verification.rejectReason && (
                                            <div className="mt-3 p-3 bg-red-50 rounded-lg text-sm text-red-700">
                                                却下理由: {verification.rejectReason}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex gap-2 ml-4">
                                        <button
                                            onClick={() => setSelectedVerification(verification)}
                                            className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                                        >
                                            詳細
                                        </button>
                                        {verification.status === 'PENDING' && (
                                            <>
                                                <button
                                                    onClick={() => handleApprove(verification.id)}
                                                    className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700"
                                                >
                                                    承認
                                                </button>
                                                <button
                                                    onClick={() => handleReject(verification.id)}
                                                    className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700"
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

            {/* Detail Modal */}
            {selectedVerification && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold text-gray-900">認証申請詳細</h2>
                                <button
                                    onClick={() => setSelectedVerification(null)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>
                        <div className="p-6 space-y-6">
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-3">基本情報</h3>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div><span className="text-gray-500">会社名：</span>{selectedVerification.companyName}</div>
                                    <div><span className="text-gray-500">代表者：</span>{selectedVerification.representativeName}</div>
                                    <div><span className="text-gray-500">メール：</span>{selectedVerification.email}</div>
                                    <div><span className="text-gray-500">電話：</span>{selectedVerification.phone}</div>
                                    <div><span className="text-gray-500">法人番号：</span>{selectedVerification.businessNumber}</div>
                                    <div><span className="text-gray-500">地域：</span>{selectedVerification.region}</div>
                                    <div className="col-span-2"><span className="text-gray-500">Webサイト：</span>{selectedVerification.website || '未登録'}</div>
                                </div>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-3">事業内容</h3>
                                <p className="text-sm text-gray-600">{selectedVerification.description}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-3">提出書類</h3>
                                <div className="space-y-2">
                                    {selectedVerification.documents.length === 0 ? (
                                        <p className="text-sm text-gray-500">書類なし</p>
                                    ) : (
                                        selectedVerification.documents.map((doc, index) => (
                                            <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                                                <span className="text-xl">📄</span>
                                                <span className="text-sm text-gray-700">{doc.name}</span>
                                                <button className="ml-auto text-primary-600 text-sm hover:underline">
                                                    ダウンロード
                                                </button>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                        {selectedVerification.status === 'PENDING' && (
                            <div className="p-6 border-t flex justify-end gap-3">
                                <button
                                    onClick={() => handleReject(selectedVerification.id)}
                                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                >
                                    却下
                                </button>
                                <button
                                    onClick={() => handleApprove(selectedVerification.id)}
                                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                >
                                    承認
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Back to Admin Dashboard */}
            <div className="text-center">
                <Link href="/admin" className="text-primary-600 hover:text-primary-700 font-medium">
                    ← 管理ダッシュボードに戻る
                </Link>
            </div>
        </div>
    );
}
