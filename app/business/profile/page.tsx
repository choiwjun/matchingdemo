'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { REGIONS, CATEGORIES } from '@/lib/constants';

export default function BusinessProfilePage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const [profile, setProfile] = useState({
        companyName: '株式会社ABCリフォーム',
        representativeName: '山田 太郎',
        email: session?.user?.email || 'business@test.com',
        phone: '03-1234-5678',
        region: 'tokyo',
        address: '東京都新宿区○○町1-2-3 ABCビル5F',
        businessNumber: '1234567890123',
        establishedYear: '2010',
        employeeCount: '15',
        website: 'https://abc-reform.example.jp',
        description: '創業15年、住宅リフォーム・リノベーションを専門に手掛けております。お客様のご要望に寄り添い、高品質な施工をお約束いたします。キッチン・浴室・トイレなどの水回りから、フルリノベーションまで幅広く対応可能です。',
        categories: ['construction', 'repair'],
        certifications: [
            '一級建築士事務所登録',
            '建設業許可（内装仕上工事業）',
            'リフォーム産業協会会員',
        ],
        portfolio: [
            { title: 'マンションフルリノベーション', year: '2024', description: '築30年マンションの全面改装' },
            { title: 'キッチン・浴室リフォーム', year: '2024', description: '最新設備への入替工事' },
            { title: 'オフィス内装工事', year: '2023', description: '50坪オフィスの内装設計施工' },
        ],
        isVerified: true,
        rating: 4.8,
        reviewCount: 47,
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

    const toggleCategory = (categoryId: string) => {
        if (profile.categories.includes(categoryId)) {
            setProfile({
                ...profile,
                categories: profile.categories.filter(c => c !== categoryId),
            });
        } else {
            setProfile({
                ...profile,
                categories: [...profile.categories, categoryId],
            });
        }
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
                        ビジネスプロフィールが正常に更新されました。
                    </div>
                )}

                {/* Verification Status */}
                {profile.isVerified && (
                    <div className="mb-6 bg-green-50 border border-green-200 px-4 py-3 rounded-lg flex items-center">
                        <span className="text-green-600 text-xl mr-3">✓</span>
                        <div>
                            <p className="text-green-800 font-medium">認証済み事業者</p>
                            <p className="text-sm text-green-600">このアカウントはProMatchによって認証されています。</p>
                        </div>
                    </div>
                )}

                <div className="bg-white rounded-lg shadow-sm">
                    {/* Header */}
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">ビジネスプロフィール</h1>
                                <p className="text-gray-600 mt-1">事業者情報の確認・編集</p>
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
                        {/* Company Header Section */}
                        <div className="flex items-center space-x-6 mb-8 pb-8 border-b border-gray-200">
                            <div className="w-24 h-24 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600 text-3xl font-bold">
                                {profile.companyName.charAt(0)}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <h2 className="text-xl font-semibold text-gray-900">{profile.companyName}</h2>
                                    {profile.isVerified && (
                                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                            認証済み
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center mt-2">
                                    <div className="flex items-center text-yellow-400">
                                        {[...Array(5)].map((_, i) => (
                                            <span key={i} className={i < Math.floor(profile.rating) ? '' : 'text-gray-300'}>★</span>
                                        ))}
                                    </div>
                                    <span className="ml-2 text-gray-600">
                                        {profile.rating} ({profile.reviewCount}件のレビュー)
                                    </span>
                                </div>
                                {isEditing && (
                                    <button
                                        type="button"
                                        className="mt-2 text-sm text-primary-600 hover:text-primary-700"
                                    >
                                        ロゴ画像を変更
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
                                        会社名
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={profile.companyName}
                                            onChange={e => setProfile({ ...profile, companyName: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                        />
                                    ) : (
                                        <p className="px-4 py-2 bg-gray-50 rounded-lg">{profile.companyName}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        代表者名
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={profile.representativeName}
                                            onChange={e => setProfile({ ...profile, representativeName: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                        />
                                    ) : (
                                        <p className="px-4 py-2 bg-gray-50 rounded-lg">{profile.representativeName}</p>
                                    )}
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

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        設立年
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={profile.establishedYear}
                                            onChange={e => setProfile({ ...profile, establishedYear: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                        />
                                    ) : (
                                        <p className="px-4 py-2 bg-gray-50 rounded-lg">{profile.establishedYear}年</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        従業員数
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={profile.employeeCount}
                                            onChange={e => setProfile({ ...profile, employeeCount: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                        />
                                    ) : (
                                        <p className="px-4 py-2 bg-gray-50 rounded-lg">{profile.employeeCount}名</p>
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
                                    Webサイト
                                </label>
                                {isEditing ? (
                                    <input
                                        type="url"
                                        value={profile.website}
                                        onChange={e => setProfile({ ...profile, website: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                    />
                                ) : (
                                    <p className="px-4 py-2 bg-gray-50 rounded-lg">
                                        <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">
                                            {profile.website}
                                        </a>
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    事業内容・紹介文
                                </label>
                                {isEditing ? (
                                    <textarea
                                        value={profile.description}
                                        onChange={e => setProfile({ ...profile, description: e.target.value })}
                                        rows={4}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                    />
                                ) : (
                                    <p className="px-4 py-2 bg-gray-50 rounded-lg whitespace-pre-wrap">
                                        {profile.description}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Categories */}
                        <div className="space-y-6 mb-8 pb-8 border-t border-gray-200 pt-8">
                            <h3 className="text-lg font-semibold text-gray-900">対応カテゴリ</h3>
                            <div className="flex flex-wrap gap-3">
                                {CATEGORIES.map(category => (
                                    <button
                                        key={category.id}
                                        type="button"
                                        onClick={() => isEditing && toggleCategory(category.id)}
                                        className={`px-4 py-2 rounded-full border transition-colors ${
                                            profile.categories.includes(category.id)
                                                ? 'bg-primary-100 border-primary-300 text-primary-700'
                                                : 'bg-gray-50 border-gray-200 text-gray-600'
                                        } ${!isEditing ? 'cursor-default' : 'cursor-pointer hover:border-primary-300'}`}
                                    >
                                        <span className="mr-2">{category.icon}</span>
                                        {category.nameKo}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Certifications */}
                        <div className="space-y-6 mb-8 pb-8 border-t border-gray-200 pt-8">
                            <h3 className="text-lg font-semibold text-gray-900">資格・認証</h3>
                            <div className="space-y-2">
                                {profile.certifications.map((cert, index) => (
                                    <div key={index} className="flex items-center gap-2 text-gray-700">
                                        <span className="text-green-500">✓</span>
                                        {cert}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Portfolio */}
                        <div className="space-y-6 mb-8 pb-8 border-t border-gray-200 pt-8">
                            <h3 className="text-lg font-semibold text-gray-900">実績・ポートフォリオ</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {profile.portfolio.map((item, index) => (
                                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                                        <div className="w-full h-32 bg-gray-200 rounded-lg mb-3 flex items-center justify-center text-4xl text-gray-400">
                                            📷
                                        </div>
                                        <h4 className="font-medium text-gray-900">{item.title}</h4>
                                        <p className="text-sm text-gray-500">{item.year} • {item.description}</p>
                                    </div>
                                ))}
                            </div>
                            {isEditing && (
                                <button
                                    type="button"
                                    className="mt-4 text-primary-600 hover:text-primary-700 font-medium"
                                >
                                    + 実績を追加
                                </button>
                            )}
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
                </div>

                {/* Back to Dashboard */}
                <div className="mt-6 text-center">
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
