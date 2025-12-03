'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { REGIONS } from '@/lib/constants';

export default function ProfilePage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const [profile, setProfile] = useState({
        name: '田中 太郎',
        email: session?.user?.email || 'user@test.com',
        phone: '090-1234-5678',
        region: 'tokyo',
        address: '東京都渋谷区○○町1-2-3',
        bio: 'リフォーム・清掃サービスを探しています。丁寧で信頼できる業者様との取引を希望しております。',
        avatarUrl: null as string | null,
        notifications: {
            email: true,
            sms: false,
            push: true,
        },
    });

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setIsSaving(false);
        setIsEditing(false);
        setShowSuccess(true);
        
        setTimeout(() => setShowSuccess(false), 3000);
    };

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
                {/* Success Message */}
                {showSuccess && (
                    <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        プロフィールが正常に更新されました。
                    </div>
                )}

                <div className="bg-white rounded-lg shadow-sm">
                    {/* Header */}
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">プロフィール設定</h1>
                                <p className="text-gray-600 mt-1">アカウント情報の確認・編集</p>
                            </div>
                            {!isEditing && (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                    </svg>
                                    編集する
                                </button>
                            )}
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6">
                        {/* Avatar Section */}
                        <div className="flex items-center space-x-6 mb-8 pb-8 border-b border-gray-200">
                            <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 text-3xl font-bold">
                                {profile.name.charAt(0)}
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900">{profile.name}</h2>
                                <p className="text-gray-600">{profile.email}</p>
                                {isEditing && (
                                    <button
                                        type="button"
                                        className="mt-2 text-sm text-primary-600 hover:text-primary-700"
                                    >
                                        プロフィール画像を変更
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Basic Info */}
                        <div className="space-y-6 mb-8">
                            <h3 className="text-lg font-semibold text-gray-900">基本情報</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        お名前
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={profile.name}
                                            onChange={e => setProfile({ ...profile, name: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                        />
                                    ) : (
                                        <p className="px-4 py-2 bg-gray-50 rounded-lg">{profile.name}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        メールアドレス
                                    </label>
                                    <p className="px-4 py-2 bg-gray-50 rounded-lg text-gray-600">
                                        {profile.email}
                                        <span className="text-xs text-gray-400 ml-2">(変更不可)</span>
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        電話番号
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="tel"
                                            value={profile.phone}
                                            onChange={e => setProfile({ ...profile, phone: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                        />
                                    ) : (
                                        <p className="px-4 py-2 bg-gray-50 rounded-lg">{profile.phone}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        地域
                                    </label>
                                    {isEditing ? (
                                        <select
                                            value={profile.region}
                                            onChange={e => setProfile({ ...profile, region: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                        >
                                            {REGIONS.map(region => (
                                                <option key={region.id} value={region.id}>
                                                    {region.name}
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        <p className="px-4 py-2 bg-gray-50 rounded-lg">
                                            {REGIONS.find(r => r.id === profile.region)?.name}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    住所
                                </label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={profile.address}
                                        onChange={e => setProfile({ ...profile, address: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                    />
                                ) : (
                                    <p className="px-4 py-2 bg-gray-50 rounded-lg">{profile.address}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    自己紹介
                                </label>
                                {isEditing ? (
                                    <textarea
                                        value={profile.bio}
                                        onChange={e => setProfile({ ...profile, bio: e.target.value })}
                                        rows={4}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                    />
                                ) : (
                                    <p className="px-4 py-2 bg-gray-50 rounded-lg whitespace-pre-wrap">
                                        {profile.bio}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Notification Settings */}
                        <div className="space-y-6 mb-8 pb-8 border-t border-gray-200 pt-8">
                            <h3 className="text-lg font-semibold text-gray-900">通知設定</h3>
                            
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-gray-900">メール通知</p>
                                        <p className="text-sm text-gray-500">重要なお知らせをメールで受信</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => isEditing && setProfile({
                                            ...profile,
                                            notifications: { ...profile.notifications, email: !profile.notifications.email }
                                        })}
                                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                                            profile.notifications.email ? 'bg-primary-600' : 'bg-gray-200'
                                        } ${!isEditing ? 'opacity-60 cursor-not-allowed' : ''}`}
                                    >
                                        <span
                                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                                profile.notifications.email ? 'translate-x-5' : 'translate-x-0'
                                            }`}
                                        />
                                    </button>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-gray-900">SMS通知</p>
                                        <p className="text-sm text-gray-500">緊急のお知らせをSMSで受信</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => isEditing && setProfile({
                                            ...profile,
                                            notifications: { ...profile.notifications, sms: !profile.notifications.sms }
                                        })}
                                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                                            profile.notifications.sms ? 'bg-primary-600' : 'bg-gray-200'
                                        } ${!isEditing ? 'opacity-60 cursor-not-allowed' : ''}`}
                                    >
                                        <span
                                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                                profile.notifications.sms ? 'translate-x-5' : 'translate-x-0'
                                            }`}
                                        />
                                    </button>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-gray-900">プッシュ通知</p>
                                        <p className="text-sm text-gray-500">ブラウザでプッシュ通知を受信</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => isEditing && setProfile({
                                            ...profile,
                                            notifications: { ...profile.notifications, push: !profile.notifications.push }
                                        })}
                                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                                            profile.notifications.push ? 'bg-primary-600' : 'bg-gray-200'
                                        } ${!isEditing ? 'opacity-60 cursor-not-allowed' : ''}`}
                                    >
                                        <span
                                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                                profile.notifications.push ? 'translate-x-5' : 'translate-x-0'
                                            }`}
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        {isEditing && (
                            <div className="flex justify-end space-x-4">
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    キャンセル
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                                >
                                    {isSaving ? '保存中...' : '変更を保存'}
                                </button>
                            </div>
                        )}
                    </form>

                    {/* Security Section */}
                    <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-lg">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">セキュリティ</h3>
                        <div className="space-y-4">
                            <button className="flex items-center text-primary-600 hover:text-primary-700">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                </svg>
                                パスワードを変更
                            </button>
                            <button className="flex items-center text-red-600 hover:text-red-700">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                アカウントを削除
                            </button>
                        </div>
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
