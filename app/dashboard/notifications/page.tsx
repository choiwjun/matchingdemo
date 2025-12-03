'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { NOTIFICATION_TYPE_LABELS } from '@/lib/constants';

// Sample notification data
const sampleNotifications = [
    {
        id: '1',
        type: 'NEW_PROPOSAL',
        title: '新しい提案が届きました',
        message: '「マンション リビング リフォーム」案件に株式会社ABCリフォームから提案が届きました。',
        isRead: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        link: '/dashboard/projects/1',
    },
    {
        id: '2',
        type: 'NEW_MESSAGE',
        title: '新着メッセージ',
        message: '山田様からメッセージが届いています。「お見積もりの件について...」',
        isRead: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        link: '/chat',
    },
    {
        id: '3',
        type: 'CONTRACT_CONFIRMED',
        title: '契約が確定しました',
        message: '「オフィス定期清掃」案件の契約が確定しました。作業開始日をご確認ください。',
        isRead: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        link: '/dashboard/contracts',
    },
    {
        id: '4',
        type: 'REVIEW_REQUEST',
        title: 'レビューをお願いします',
        message: '「給湯器交換工事」が完了しました。サービスのレビューをお願いいたします。',
        isRead: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
        link: '/dashboard/contracts',
    },
    {
        id: '5',
        type: 'PAYMENT_COMPLETED',
        title: 'お支払いが完了しました',
        message: '「キッチンリフォーム」のお支払い（¥850,000）が正常に処理されました。',
        isRead: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
        link: '/dashboard/contracts',
    },
    {
        id: '6',
        type: 'SYSTEM',
        title: 'システムメンテナンスのお知らせ',
        message: '12月10日（日）午前2時〜午前5時までメンテナンスを実施いたします。',
        isRead: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
        link: null,
    },
];

export default function NotificationsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [notifications, setNotifications] = useState(sampleNotifications);
    const [filter, setFilter] = useState<'all' | 'unread'>('all');

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
        const date = new Date(dateString);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        
        if (diff < 1000 * 60 * 60) {
            return `${Math.floor(diff / (1000 * 60))}分前`;
        } else if (diff < 1000 * 60 * 60 * 24) {
            return `${Math.floor(diff / (1000 * 60 * 60))}時間前`;
        } else if (diff < 1000 * 60 * 60 * 24 * 7) {
            return `${Math.floor(diff / (1000 * 60 * 60 * 24))}日前`;
        }
        return date.toLocaleDateString('ja-JP');
    };

    const markAsRead = (id: string) => {
        setNotifications(notifications.map(n => 
            n.id === id ? { ...n, isRead: true } : n
        ));
    };

    const markAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    };

    const filteredNotifications = filter === 'all' 
        ? notifications 
        : notifications.filter(n => !n.isRead);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navigation */}
            <nav className="bg-white shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <Link href="/dashboard" className="text-xl font-bold text-primary-600">
                            ProMatch
                        </Link>
                        <div className="flex items-center space-x-4">
                            <span className="text-gray-600">{session?.user?.email}</span>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-4xl mx-auto py-8 px-4">
                <div className="bg-white rounded-lg shadow-sm">
                    {/* Header */}
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">通知</h1>
                                <p className="text-gray-600 mt-1">
                                    {unreadCount > 0 ? `未読 ${unreadCount}件` : 'すべて既読です'}
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="flex bg-gray-100 rounded-lg p-1">
                                    <button
                                        onClick={() => setFilter('all')}
                                        className={`px-3 py-1 rounded-md text-sm transition-colors ${
                                            filter === 'all' 
                                                ? 'bg-white text-primary-600 shadow-sm' 
                                                : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                    >
                                        すべて
                                    </button>
                                    <button
                                        onClick={() => setFilter('unread')}
                                        className={`px-3 py-1 rounded-md text-sm transition-colors ${
                                            filter === 'unread' 
                                                ? 'bg-white text-primary-600 shadow-sm' 
                                                : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                    >
                                        未読
                                    </button>
                                </div>
                                {unreadCount > 0 && (
                                    <button
                                        onClick={markAllAsRead}
                                        className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                                    >
                                        すべて既読にする
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Notification List */}
                    <div className="divide-y divide-gray-100">
                        {filteredNotifications.length === 0 ? (
                            <div className="p-12 text-center">
                                <div className="text-4xl mb-4">🔔</div>
                                <p className="text-gray-500">
                                    {filter === 'unread' ? '未読の通知はありません' : '通知はありません'}
                                </p>
                            </div>
                        ) : (
                            filteredNotifications.map((notification) => {
                                const typeInfo = NOTIFICATION_TYPE_LABELS[notification.type as keyof typeof NOTIFICATION_TYPE_LABELS];
                                return (
                                    <div
                                        key={notification.id}
                                        className={`p-4 hover:bg-gray-50 transition-colors ${
                                            !notification.isRead ? 'bg-blue-50/50' : ''
                                        }`}
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className={`text-2xl ${typeInfo?.color || 'text-gray-600'}`}>
                                                {typeInfo?.icon || '🔔'}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className={`font-medium ${!notification.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                                                        {notification.title}
                                                    </h3>
                                                    {!notification.isRead && (
                                                        <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
                                                    )}
                                                </div>
                                                <p className="text-gray-600 text-sm mb-2">
                                                    {notification.message}
                                                </p>
                                                <div className="flex items-center gap-4">
                                                    <span className="text-xs text-gray-400">
                                                        {formatDate(notification.createdAt)}
                                                    </span>
                                                    {notification.link && (
                                                        <Link
                                                            href={notification.link}
                                                            onClick={() => markAsRead(notification.id)}
                                                            className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                                                        >
                                                            詳細を確認 →
                                                        </Link>
                                                    )}
                                                </div>
                                            </div>
                                            {!notification.isRead && (
                                                <button
                                                    onClick={() => markAsRead(notification.id)}
                                                    className="text-xs text-gray-400 hover:text-gray-600"
                                                >
                                                    既読
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Back to Dashboard */}
                <div className="mt-6 text-center">
                    <Link
                        href="/dashboard"
                        className="text-primary-600 hover:text-primary-700 font-medium"
                    >
                        ← ダッシュボードに戻る
                    </Link>
                </div>
            </div>
        </div>
    );
}
