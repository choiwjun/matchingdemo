import Link from 'next/link';

export default function ForBusinessPage() {
    const benefits = [
        {
            icon: '📈',
            title: '新規顧客の獲得',
            description: '毎月数千件の案件が登録されます。営業活動なしで新しいお客様と出会えます。',
        },
        {
            icon: '💰',
            title: '安定した収益',
            description: '継続案件や大型案件など、事業の成長につながる案件を獲得できます。',
        },
        {
            icon: '⏰',
            title: '効率的な営業',
            description: '案件を選んで提案するだけ。無駄な営業時間を削減し、本業に集中できます。',
        },
        {
            icon: '🛡️',
            title: '確実な入金',
            description: 'プラットフォームが支払いを仲介。未払いのリスクがありません。',
        },
        {
            icon: '⭐',
            title: '信頼の構築',
            description: 'レビュー・評価システムで実績を可視化。信頼が新規獲得につながります。',
        },
        {
            icon: '📱',
            title: 'スマート管理',
            description: '案件、提案、契約、請求をすべてプラットフォーム上で一元管理できます。',
        },
    ];

    const categories = [
        { icon: '🏗️', name: '建設・リフォーム' },
        { icon: '🧹', name: '清掃・整理' },
        { icon: '🚚', name: '引越し・運送' },
        { icon: '🔧', name: '修理・設置' },
        { icon: '💻', name: 'IT・技術' },
        { icon: '📚', name: '教育・レッスン' },
        { icon: '💆', name: '健康・美容' },
        { icon: '🎨', name: 'デザイン' },
        { icon: '🎉', name: 'イベント・行事' },
        { icon: '⚖️', name: '法律・税務' },
        { icon: '🐕', name: 'ペットサービス' },
        { icon: '📦', name: 'その他' },
    ];

    const plans = [
        {
            name: 'スタンダード',
            fee: '10%',
            description: '成約時のみ手数料が発生',
            features: [
                '案件閲覧・提案',
                'チャット機能',
                'プロフィールページ',
                'レビュー・評価機能',
                'メールサポート',
            ],
            cta: '今すぐ登録',
            highlighted: true,
        },
        {
            name: 'プレミアム',
            fee: '8%',
            description: '月額¥10,000 + 成約手数料',
            features: [
                'スタンダードの全機能',
                '優先表示',
                '認証バッジ',
                '詳細な分析レポート',
                '優先電話サポート',
            ],
            cta: 'お問い合わせ',
            highlighted: false,
        },
    ];

    const steps = [
        { number: '1', title: '会員登録', description: '基本情報を入力して登録（無料）' },
        { number: '2', title: '審査', description: '事業者情報の審査（2〜3営業日）' },
        { number: '3', title: 'プロフィール作成', description: '実績や強みをアピール' },
        { number: '4', title: '提案開始', description: '案件を探して提案を送信' },
    ];

    const testimonials = [
        {
            name: '株式会社ABCリフォーム',
            role: 'リフォーム業',
            content: 'ProMatchを始めてから、月の新規案件が3倍に増えました。営業コストをかけずに安定した受注ができています。',
            rating: 5,
        },
        {
            name: 'クリーンサービス山田',
            role: '清掃業',
            content: '個人で始めた清掃サービスですが、ProMatchのおかげで法人顧客も獲得できました。信頼できるプラットフォームです。',
            rating: 5,
        },
        {
            name: 'ITソリューションズ',
            role: 'IT・Web制作',
            content: 'Web制作の案件を中心に月10件以上の問い合わせがあります。手数料も納得の範囲で、利益が出ています。',
            rating: 4,
        },
    ];

    return (
        <div className="min-h-screen bg-white">
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
                                href="/auth/register?role=business"
                                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                            >
                                事業者登録
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="bg-gradient-to-b from-primary-600 to-primary-700 text-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">
                        ProMatchで、<br />ビジネスを加速させましょう
                    </h1>
                    <p className="text-xl text-primary-100 max-w-2xl mx-auto mb-8">
                        10,000件以上の案件から、あなたのサービスにマッチする案件を見つけて提案。<br />
                        登録無料、成果報酬型で安心してスタートできます。
                    </p>
                    <Link
                        href="/auth/register?role=business"
                        className="inline-block px-8 py-4 bg-white text-primary-600 text-lg font-semibold rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        無料で事業者登録
                    </Link>
                    <p className="mt-4 text-primary-200 text-sm">
                        登録は最短3分。今すぐ始められます。
                    </p>
                </div>
            </div>

            {/* Stats */}
            <div className="bg-gray-50 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div>
                            <p className="text-4xl font-bold text-primary-600">10,000+</p>
                            <p className="text-gray-600">月間案件数</p>
                        </div>
                        <div>
                            <p className="text-4xl font-bold text-primary-600">5,000+</p>
                            <p className="text-gray-600">登録事業者</p>
                        </div>
                        <div>
                            <p className="text-4xl font-bold text-primary-600">95%</p>
                            <p className="text-gray-600">顧客満足度</p>
                        </div>
                        <div>
                            <p className="text-4xl font-bold text-primary-600">50億円+</p>
                            <p className="text-gray-600">累計取引額</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Benefits */}
            <div className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                        ProMatchを利用するメリット
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {benefits.map((benefit, index) => (
                            <div key={index} className="text-center p-6">
                                <div className="text-5xl mb-4">{benefit.icon}</div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                                <p className="text-gray-600">{benefit.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Categories */}
            <div className="bg-gray-50 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
                        対応カテゴリ
                    </h2>
                    <p className="text-gray-600 text-center mb-12">
                        様々な業種の事業者様にご利用いただいています
                    </p>
                    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {categories.map((category, index) => (
                            <div
                                key={index}
                                className="bg-white p-4 rounded-xl shadow-sm text-center hover:shadow-md transition-shadow"
                            >
                                <div className="text-3xl mb-2">{category.icon}</div>
                                <p className="text-sm text-gray-700">{category.name}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* How to Start */}
            <div className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                        始め方は簡単
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {steps.map((step, index) => (
                            <div key={index} className="relative text-center">
                                <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                                    {step.number}
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                                <p className="text-gray-600">{step.description}</p>
                                {index < steps.length - 1 && (
                                    <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-gray-200 -z-10"></div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Pricing */}
            <div className="bg-gray-50 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
                        料金プラン
                    </h2>
                    <p className="text-gray-600 text-center mb-12">
                        シンプルで透明な料金体系。登録は無料です。
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {plans.map((plan, index) => (
                            <div
                                key={index}
                                className={`rounded-2xl p-8 ${
                                    plan.highlighted
                                        ? 'bg-primary-600 text-white ring-4 ring-primary-600 ring-offset-4'
                                        : 'bg-white border border-gray-200'
                                }`}
                            >
                                <h3 className={`text-2xl font-bold mb-2 ${plan.highlighted ? 'text-white' : 'text-gray-900'}`}>
                                    {plan.name}
                                </h3>
                                <p className={`text-4xl font-bold mb-2 ${plan.highlighted ? 'text-white' : 'text-primary-600'}`}>
                                    {plan.fee}
                                </p>
                                <p className={`mb-6 ${plan.highlighted ? 'text-primary-100' : 'text-gray-500'}`}>
                                    {plan.description}
                                </p>
                                <ul className="space-y-3 mb-8">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className="flex items-center gap-2">
                                            <span className={plan.highlighted ? 'text-primary-200' : 'text-primary-600'}>✓</span>
                                            <span className={plan.highlighted ? 'text-white' : 'text-gray-700'}>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                                <Link
                                    href={plan.highlighted ? '/auth/register?role=business' : '/contact'}
                                    className={`block text-center px-6 py-3 rounded-lg font-semibold transition-colors ${
                                        plan.highlighted
                                            ? 'bg-white text-primary-600 hover:bg-gray-100'
                                            : 'bg-primary-600 text-white hover:bg-primary-700'
                                    }`}
                                >
                                    {plan.cta}
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Testimonials */}
            <div className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                        事業者様の声
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <div className="flex items-center text-yellow-400 mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <span key={i} className={i < testimonial.rating ? '' : 'text-gray-300'}>★</span>
                                    ))}
                                </div>
                                <p className="text-gray-600 mb-4">「{testimonial.content}」</p>
                                <div>
                                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA */}
            <div className="bg-primary-600 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">
                        今すぐ始めましょう
                    </h2>
                    <p className="text-primary-100 mb-8">
                        無料登録は最短3分。審査完了後すぐに提案を開始できます。
                    </p>
                    <Link
                        href="/auth/register?role=business"
                        className="inline-block px-8 py-4 bg-white text-primary-600 text-lg font-semibold rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        無料で事業者登録
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
