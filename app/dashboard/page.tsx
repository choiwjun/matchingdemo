'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface DashboardStats {
    projectCount: number;
    activeContractCount: number;
    pendingProposalCount: number;
}

export default function DashboardPage() {
    const { data: session, status } = useSession();
    const [stats, setStats] = useState<DashboardStats>({
        projectCount: 0,
        activeContractCount: 0,
        pendingProposalCount: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 데모용 - 실제로는 API에서 가져옴
        const fetchStats = async () => {
            try {
                // TODO: API 연동 시 실제 데이터 fetch
                // const res = await fetch('/api/dashboard/stats');
                // const data = await res.json();
                // setStats(data);
                
                // 현재는 데모 데이터
                setStats({
                    projectCount: 0,
                    activeContractCount: 0,
                    pendingProposalCount: 0,
                });
            } catch (error) {
                console.error('Failed to fetch stats:', error);
            } finally {
                setLoading(false);
            }
        };

        if (session) {
            fetchStats();
        }
    }, [session]);

    if (status === 'loading' || loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (!session) {
        return null;
    }

    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-8 text-white">
                <h1 className="text-2xl md:text-3xl font-bold mb-2">
                    ようこそ、{session.user?.email?.split('@')[0]}さん！ 👋
                </h1>
                <p className="text-primary-100 mb-6">
                    ご希望のサービスを登録して、専門家からのご提案をお待ちください。
                </p>
                <Link
                    href="/dashboard/projects/new"
                    className="inline-flex items-center gap-2 bg-white text-primary-600 px-6 py-3 rounded-lg font-medium hover:bg-primary-50 transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    新規案件を登録
                </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">登録した案件</p>
                            <p className="text-3xl font-bold text-gray-900 mt-1">{stats.projectCount}</p>
                        </div>
                        <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">審査中の提案</p>
                            <p className="text-3xl font-bold text-gray-900 mt-1">{stats.pendingProposalCount}</p>
                        </div>
                        <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">進行中の契約</p>
                            <p className="text-3xl font-bold text-gray-900 mt-1">{stats.activeContractCount}</p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">完了した契約</p>
                            <p className="text-3xl font-bold text-gray-900 mt-1">0</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Projects - Empty State */}
            <div className="bg-white rounded-xl shadow-sm">
                <div className="p-6 border-b">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-900">最近の案件</h2>
                        <Link href="/dashboard/projects" className="text-sm text-primary-600 hover:text-primary-700">
                            すべて見る →
                        </Link>
                    </div>
                </div>
                <div className="p-8 text-center">
                    <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-gray-500">登録された案件がありません。</p>
                    <Link
                        href="/dashboard/projects/new"
                        className="inline-block mt-4 text-primary-600 hover:text-primary-700"
                    >
                        最初の案件を登録する
                    </Link>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-3 gap-4">
                <Link
                    href="/dashboard/projects/new"
                    className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow group"
                >
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary-200 transition-colors">
                        <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                    </div>
                    <h3 className="font-semibold text-gray-900">新規案件</h3>
                    <p className="text-sm text-gray-500 mt-1">サービス依頼を登録してください</p>
                </Link>

                <Link
                    href="/chat"
                    className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow group"
                >
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                    </div>
                    <h3 className="font-semibold text-gray-900">チャット</h3>
                    <p className="text-sm text-gray-500 mt-1">事業者とご相談ください</p>
                </Link>

                <Link
                    href="/dashboard/profile"
                    className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow group"
                >
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                    <h3 className="font-semibold text-gray-900">プロフィール管理</h3>
                    <p className="text-sm text-gray-500 mt-1">アカウント情報を編集してください</p>
                </Link>
            </div>
        </div>
    );
}
