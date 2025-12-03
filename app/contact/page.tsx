'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        category: '',
        subject: '',
        message: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setIsSubmitting(false);
        setIsSubmitted(true);
    };

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-gray-50">
                <nav className="bg-white shadow-sm sticky top-0 z-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-16 items-center">
                            <Link href="/" className="text-xl font-bold text-primary-600">
                                ProMatch
                            </Link>
                        </div>
                    </div>
                </nav>

                <div className="max-w-2xl mx-auto px-4 py-16 text-center">
                    <div className="bg-white rounded-lg shadow-sm p-12">
                        <div className="text-6xl mb-6">✅</div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">
                            お問い合わせを受け付けました
                        </h1>
                        <p className="text-gray-600 mb-8">
                            内容を確認の上、2〜3営業日以内にご返信いたします。<br />
                            しばらくお待ちください。
                        </p>
                        <Link
                            href="/"
                            className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                        >
                            トップページに戻る
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

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

            <div className="max-w-4xl mx-auto px-4 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">お問い合わせ</h1>
                    <p className="text-gray-600">
                        ご質問・ご意見がございましたら、お気軽にお問い合わせください。
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 mb-12">
                    <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                        <div className="text-3xl mb-4">📧</div>
                        <h3 className="font-semibold text-gray-900 mb-2">メール</h3>
                        <p className="text-gray-600 text-sm">support@promatch.jp</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                        <div className="text-3xl mb-4">📞</div>
                        <h3 className="font-semibold text-gray-900 mb-2">電話</h3>
                        <p className="text-gray-600 text-sm">03-1234-5678</p>
                        <p className="text-xs text-gray-400 mt-1">平日 9:00〜18:00</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                        <div className="text-3xl mb-4">❓</div>
                        <h3 className="font-semibold text-gray-900 mb-2">FAQ</h3>
                        <Link href="/faq" className="text-primary-600 text-sm hover:underline">
                            よくあるご質問を見る →
                        </Link>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">お問い合わせフォーム</h2>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    お名前 <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                    placeholder="山田 太郎"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    メールアドレス <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                    placeholder="example@email.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                お問い合わせ種類 <span className="text-red-500">*</span>
                            </label>
                            <select
                                required
                                value={formData.category}
                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            >
                                <option value="">選択してください</option>
                                <option value="general">一般的なご質問</option>
                                <option value="account">アカウントについて</option>
                                <option value="payment">お支払いについて</option>
                                <option value="trouble">トラブル・クレーム</option>
                                <option value="business">事業者登録について</option>
                                <option value="other">その他</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                件名 <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.subject}
                                onChange={e => setFormData({ ...formData, subject: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                placeholder="お問い合わせの件名"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                お問い合わせ内容 <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                required
                                rows={6}
                                value={formData.message}
                                onChange={e => setFormData({ ...formData, message: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                placeholder="お問い合わせ内容を詳しくご記入ください"
                            />
                        </div>

                        <div className="flex items-center justify-between pt-4">
                            <p className="text-sm text-gray-500">
                                <span className="text-red-500">*</span> は必須項目です
                            </p>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                            >
                                {isSubmitting ? '送信中...' : '送信する'}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="mt-8 text-center">
                    <Link href="/" className="text-primary-600 hover:text-primary-700 font-medium">
                        ← トップページに戻る
                    </Link>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-400 py-12">
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
