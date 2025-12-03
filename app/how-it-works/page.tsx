import Link from 'next/link';

export default function HowItWorksPage() {
    const steps = [
        {
            number: '01',
            title: '案件を登録',
            description: '必要なサービスの内容、予算、希望日程などを入力して案件を登録します。写真や詳細な要望も添付できます。',
            icon: '📝',
            details: [
                'カテゴリ選択（リフォーム、清掃、修理など）',
                '詳細な要望を自由記述',
                '予算範囲の設定',
                '希望日程・納期の指定',
                '写真・資料の添付',
            ],
        },
        {
            number: '02',
            title: '提案を受け取る',
            description: '登録した案件に対して、複数の専門事業者から提案が届きます。価格、実績、評価を比較して検討できます。',
            icon: '📨',
            details: [
                '複数の事業者から提案を受け取り',
                '見積もり金額の比較',
                '事業者の実績・評価を確認',
                'チャットで詳細を相談',
                '追加質問・条件交渉',
            ],
        },
        {
            number: '03',
            title: '事業者を選定',
            description: '提案内容、価格、事業者の評価などを総合的に判断して、最適な事業者を選びます。',
            icon: '✅',
            details: [
                '提案内容の詳細確認',
                '事業者プロフィールの確認',
                '過去のレビュー・評価を参照',
                'チャットで最終確認',
                '契約条件の確定',
            ],
        },
        {
            number: '04',
            title: '契約・作業開始',
            description: '契約が成立したら、事業者が作業を開始します。進捗状況はプラットフォーム上で確認できます。',
            icon: '🤝',
            details: [
                '契約内容の最終確認',
                '着手金の支払い（必要に応じて）',
                '作業スケジュールの確定',
                '進捗状況のリアルタイム確認',
                'チャットで随時連絡',
            ],
        },
        {
            number: '05',
            title: '完了・支払い',
            description: '作業完了後、内容を確認して支払いを行います。最後にレビューを投稿して、今後の利用者の参考にしてください。',
            icon: '🎉',
            details: [
                '作業完了の確認',
                '最終チェック・検収',
                '安全な決済システムで支払い',
                'レビュー・評価の投稿',
                '完了報告書の受領',
            ],
        },
    ];

    const features = [
        {
            icon: '🔒',
            title: '安全な決済',
            description: '支払いはプラットフォームが仲介。作業完了まで事業者には支払われません。',
        },
        {
            icon: '✓',
            title: '認証済み事業者',
            description: 'すべての事業者は登録時に審査を行い、信頼できる事業者のみが参加しています。',
        },
        {
            icon: '💬',
            title: 'リアルタイムチャット',
            description: '事業者との連絡はプラットフォーム内のチャットで完結。履歴も残るので安心です。',
        },
        {
            icon: '⭐',
            title: '透明な評価システム',
            description: '過去の利用者によるレビュー・評価を確認して、事業者を選べます。',
        },
        {
            icon: '🛡️',
            title: '補償制度',
            description: '万が一のトラブル時も、プラットフォームが仲介してサポートいたします。',
        },
        {
            icon: '📱',
            title: 'いつでもアクセス',
            description: 'PC・スマートフォンから24時間いつでも案件の登録・確認ができます。',
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
                                href="/auth/register"
                                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                            >
                                無料登録
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="bg-gradient-to-b from-primary-50 to-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        ProMatchの使い方
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        簡単5ステップで、あなたにぴったりの専門家とマッチング。<br />
                        安心・安全なサービスをお届けします。
                    </p>
                </div>
            </div>

            {/* Steps Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="space-y-16">
                    {steps.map((step, index) => (
                        <div
                            key={step.number}
                            className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 items-center`}
                        >
                            <div className="flex-1">
                                <div className="flex items-center gap-4 mb-4">
                                    <span className="text-5xl">{step.icon}</span>
                                    <span className="text-6xl font-bold text-primary-100">{step.number}</span>
                                </div>
                                <h2 className="text-3xl font-bold text-gray-900 mb-4">{step.title}</h2>
                                <p className="text-lg text-gray-600 mb-6">{step.description}</p>
                                <ul className="space-y-3">
                                    {step.details.map((detail, i) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <span className="text-primary-600 mt-1">✓</span>
                                            <span className="text-gray-600">{detail}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="flex-1 w-full">
                                <div className="bg-gray-100 rounded-2xl aspect-video flex items-center justify-center">
                                    <span className="text-8xl opacity-50">{step.icon}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Features Section */}
            <div className="bg-gray-50 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                        ProMatchが選ばれる理由
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <div key={index} className="bg-white p-6 rounded-xl shadow-sm">
                                <div className="text-4xl mb-4">{feature.icon}</div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                                <p className="text-gray-600">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        さっそく始めてみましょう
                    </h2>
                    <p className="text-lg text-gray-600 mb-8">
                        登録は無料。まずは案件を登録して、専門家からの提案を待ちましょう。
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/auth/register"
                            className="px-8 py-4 bg-primary-600 text-white text-lg rounded-lg hover:bg-primary-700 transition-colors"
                        >
                            無料で会員登録
                        </Link>
                        <Link
                            href="/for-business"
                            className="px-8 py-4 border border-gray-300 text-gray-700 text-lg rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            事業者として登録
                        </Link>
                    </div>
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
