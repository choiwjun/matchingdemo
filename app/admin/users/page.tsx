'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

// Sample users data
const sampleUsers = [
    {
        id: '1',
        name: '田中 太郎',
        email: 'user@test.com',
        role: 'USER',
        status: 'ACTIVE',
        region: '東京都',
        projectCount: 5,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
        lastLoginAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    },
    {
        id: '2',
        name: '株式会社ABCリフォーム',
        email: 'business@test.com',
        role: 'BUSINESS',
        status: 'ACTIVE',
        region: '東京都',
        isVerified: true,
        proposalCount: 15,
        contractCount: 8,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString(),
        lastLoginAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    },
    {
        id: '3',
        name: 'クリーンサービス山田',
        email: 'business2@test.com',
        role: 'BUSINESS',
        status: 'PENDING',
        region: '大阪府',
        isVerified: false,
        proposalCount: 3,
        contractCount: 0,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
        lastLoginAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    },
    {
        id: '4',
        name: '佐藤 花子',
        email: 'hanako@example.jp',
        role: 'USER',
        status: 'ACTIVE',
        region: '神奈川県',
        projectCount: 2,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(),
        lastLoginAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    },
    {
        id: '5',
        name: '鈴木 一郎',
        email: 'suzuki@example.jp',
        role: 'USER',
        status: 'SUSPENDED',
        region: '埼玉県',
        projectCount: 1,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90).toISOString(),
        lastLoginAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
    },
    {
        id: '6',
        name: 'システム管理者',
        email: 'admin@test.com',
        role: 'ADMIN',
        status: 'ACTIVE',
        region: '東京都',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 365).toISOString(),
        lastLoginAt: new Date().toISOString(),
    },
];

export default function AdminUsersPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [users] = useState(sampleUsers);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState<string>('all');
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

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('ja-JP', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const getRoleLabel = (role: string) => {
        switch (role) {
            case 'USER': return { label: '一般', color: 'bg-gray-100 text-gray-800' };
            case 'BUSINESS': return { label: '事業者', color: 'bg-blue-100 text-blue-800' };
            case 'ADMIN': return { label: '管理者', color: 'bg-purple-100 text-purple-800' };
            default: return { label: role, color: 'bg-gray-100 text-gray-800' };
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'ACTIVE': return { label: 'アクティブ', color: 'bg-green-100 text-green-800' };
            case 'PENDING': return { label: '承認待ち', color: 'bg-yellow-100 text-yellow-800' };
            case 'SUSPENDED': return { label: '停止中', color: 'bg-red-100 text-red-800' };
            default: return { label: status, color: 'bg-gray-100 text-gray-800' };
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = filterRole === 'all' || user.role === filterRole;
        const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
        return matchesSearch && matchesRole && matchesStatus;
    });

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
                        <h1 className="text-2xl font-bold text-gray-900">ユーザー管理</h1>
                        <p className="text-gray-600 mt-1">全{users.length}件のユーザー</p>
                    </div>
                    <button className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        ユーザーを追加
                    </button>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <input
                                type="text"
                                placeholder="名前またはメールアドレスで検索..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            />
                        </div>
                        <select
                            value={filterRole}
                            onChange={e => setFilterRole(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        >
                            <option value="all">すべてのロール</option>
                            <option value="USER">一般ユーザー</option>
                            <option value="BUSINESS">事業者</option>
                            <option value="ADMIN">管理者</option>
                        </select>
                        <select
                            value={filterStatus}
                            onChange={e => setFilterStatus(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        >
                            <option value="all">すべてのステータス</option>
                            <option value="ACTIVE">アクティブ</option>
                            <option value="PENDING">承認待ち</option>
                            <option value="SUSPENDED">停止中</option>
                        </select>
                    </div>
                </div>

                {/* Users Table */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        ユーザー
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        ロール
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        ステータス
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        地域
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        登録日
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        最終ログイン
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        操作
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredUsers.map((user) => {
                                    const roleInfo = getRoleLabel(user.role);
                                    const statusInfo = getStatusLabel(user.status);
                                    
                                    return (
                                        <tr key={user.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold">
                                                        {user.name.charAt(0)}
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="flex items-center">
                                                            <span className="text-sm font-medium text-gray-900">
                                                                {user.name}
                                                            </span>
                                                            {user.role === 'BUSINESS' && user.isVerified && (
                                                                <span className="ml-2 text-green-500" title="認証済み">✓</span>
                                                            )}
                                                        </div>
                                                        <div className="text-sm text-gray-500">{user.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${roleInfo.color}`}>
                                                    {roleInfo.label}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusInfo.color}`}>
                                                    {statusInfo.label}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {user.region}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatDate(user.createdAt)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatDate(user.lastLoginAt)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button className="text-primary-600 hover:text-primary-900 mr-3">
                                                    詳細
                                                </button>
                                                {user.status === 'PENDING' && (
                                                    <button className="text-green-600 hover:text-green-900 mr-3">
                                                        承認
                                                    </button>
                                                )}
                                                {user.status === 'ACTIVE' && user.role !== 'ADMIN' && (
                                                    <button className="text-red-600 hover:text-red-900">
                                                        停止
                                                    </button>
                                                )}
                                                {user.status === 'SUSPENDED' && (
                                                    <button className="text-green-600 hover:text-green-900">
                                                        復元
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
