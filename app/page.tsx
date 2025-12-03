import Link from 'next/link';
import { CATEGORIES } from '@/lib/constants';

export default function HomePage() {
    return (
        <div className="min-h-screen">
            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-50">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        <Link href="/" className="text-2xl font-bold text-primary-600">
                            Marketplace
                        </Link>
                        <nav className="hidden md:flex items-center gap-6">
                            <Link href="/projects" className="text-gray-600 hover:text-gray-900">
                                案件を探す
                            </Link>
                            <Link href="/how-it-works" className="text-gray-600 hover:text-gray-900">
                                ご利用方法
                            </Link>
                            <Link href="/for-business" className="text-gray-600 hover:text-gray-900">
                                事業者の方へ
                            </Link>
                        </nav>
                        <div className="flex items-center gap-4">
                            <Link
                                href="/auth/login"
                                className="text-gray-600 hover:text-gray-900"
                            >
                                ログイン
                            </Link>
                            <Link
                                href="/auth/register"
                                className="btn btn-primary"
                            >
                                新規登録
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 text-white">
                <div className="container mx-auto px-4 py-20 md:py-32">
                    <div className="max-w-3xl">
                        <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
                            必要なサービスを、<br />
                            専門家にお任せください
                        </h1>
                        <p className="text-xl md:text-2xl text-primary-100 mb-8">
                            案件を登録するだけで、厳選された専門家からご提案が届きます。
                            比較してお選びください。
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                href="/auth/register"
                                className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary-600 font-semibold rounded-xl hover:bg-primary-50 transition-colors"
                            >
                                無料で案件を登録する
                                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </Link>
                            <Link
                                href="/auth/register?role=BUSINESS"
                                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white/10 transition-colors"
                            >
                                事業者として登録する
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            様々なサービスを一箇所で
                        </h2>
                        <p className="text-xl text-gray-600">
                            必要なサービスを選んで専門家を見つけましょう。
                        </p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                        {CATEGORIES.map((category) => (
                            <Link
                                key={category.id}
                                href={`/projects?category=${category.id}`}
                                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all group"
                            >
                                <div className="text-4xl mb-4">{category.icon}</div>
                                <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                                    {category.nameKo}
                                </h3>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* How it Works */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            簡単3ステップで始められます
                        </h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <span className="text-2xl font-bold text-primary-600">1</span>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                案件を登録
                            </h3>
                            <p className="text-gray-600">
                                必要なサービスと条件を入力してください。写真やファイルも添付できます。
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <span className="text-2xl font-bold text-secondary-600">2</span>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                提案を受ける
                            </h3>
                            <p className="text-gray-600">
                                厳選された専門家から見積もりとご提案が届きます。比較してみてください。
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <span className="text-2xl font-bold text-green-600">3</span>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                専門家を選ぶ
                            </h3>
                            <p className="text-gray-600">
                                ご希望の専門家を選んでチャットでご相談ください。
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* For Business Section */}
            <section className="py-20 bg-gradient-to-br from-secondary-600 to-primary-600 text-white">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">
                                事業者の皆様へ<br />
                                新しいお客様との出会いを
                            </h2>
                            <ul className="space-y-4 mb-8">
                                <li className="flex items-start gap-3">
                                    <svg className="w-6 h-6 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-lg">マッチング成立時のみ手数料が発生</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <svg className="w-6 h-6 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-lg">審査済みのお客様と安心なお取引</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <svg className="w-6 h-6 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-lg">リアルタイム通知で迅速な対応</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <svg className="w-6 h-6 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-lg">ポートフォリオとレビューで信頼構築</span>
                                </li>
                            </ul>
                            <Link
                                href="/auth/register?role=BUSINESS"
                                className="inline-flex items-center px-8 py-4 bg-white text-secondary-600 font-semibold rounded-xl hover:bg-secondary-50 transition-colors"
                            >
                                事業者として始める
                            </Link>
                        </div>
                        <div className="hidden md:block">
                            <div className="bg-white/10 rounded-2xl p-8">
                                <div className="space-y-4">
                                    <div className="bg-white rounded-xl p-4 shadow-lg">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold">
                                                新
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900">新着案件のお知らせ</div>
                                                <div className="text-sm text-gray-500">たった今</div>
                                            </div>
                                        </div>
                                        <p className="text-gray-700">マンションインテリアリフォーム - 東京都港区</p>
                                        <div className="mt-2 text-primary-600 font-medium">予算：500万円〜1,000万円</div>
                                    </div>
                                    <div className="bg-white rounded-xl p-4 shadow-lg opacity-80">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold">
                                                ✓
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900">契約確定</div>
                                                <div className="text-sm text-gray-500">10分前</div>
                                            </div>
                                        </div>
                                        <p className="text-gray-700">浴室リフォーム案件が確定いたしました。</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div>
                            <div className="text-4xl md:text-5xl font-bold text-primary-600 mb-2">10K+</div>
                            <div className="text-gray-600">登録案件数</div>
                        </div>
                        <div>
                            <div className="text-4xl md:text-5xl font-bold text-primary-600 mb-2">5K+</div>
                            <div className="text-gray-600">厳選された専門家</div>
                        </div>
                        <div>
                            <div className="text-4xl md:text-5xl font-bold text-primary-600 mb-2">95%</div>
                            <div className="text-gray-600">顧客満足度</div>
                        </div>
                        <div>
                            <div className="text-4xl md:text-5xl font-bold text-primary-600 mb-2">50B+</div>
                            <div className="text-gray-600">累計取引額</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        今すぐ始めましょう
                    </h2>
                    <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                        無料で案件を登録し、専門家からのご提案をお待ちください。
                    </p>
                    <Link
                        href="/auth/register"
                        className="inline-flex items-center px-8 py-4 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors"
                    >
                        無料で始める
                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-16">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-4 gap-8">
                        <div>
                            <div className="text-2xl font-bold mb-4">Marketplace</div>
                            <p className="text-gray-400">
                                必要なサービスを専門家にお任せください。
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">サービス</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li><Link href="/projects" className="hover:text-white">案件を探す</Link></li>
                                <li><Link href="/how-it-works" className="hover:text-white">ご利用方法</Link></li>
                                <li><Link href="/for-business" className="hover:text-white">事業者の方へ</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">サポート</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li><Link href="/help" className="hover:text-white">よくあるご質問</Link></li>
                                <li><Link href="/contact" className="hover:text-white">お問い合わせ</Link></li>
                                <li><Link href="/terms" className="hover:text-white">利用規約</Link></li>
                                <li><Link href="/privacy" className="hover:text-white">プライバシーポリシー</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">お問い合わせ</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li>メール：support@marketplace.com</li>
                                <li>電話：03-0000-0000</li>
                                <li>平日 09:00 - 18:00</li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
                        <p>© 2024 Marketplace. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
