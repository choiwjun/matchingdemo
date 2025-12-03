'use client';

import { useState } from 'react';
import Link from 'next/link';

const faqData = {
    general: {
        title: '一般的なご質問',
        questions: [
            {
                q: 'ProMatchとはどのようなサービスですか？',
                a: 'ProMatchは、サービスを必要とするお客様と専門事業者をマッチングするプラットフォームです。リフォーム、清掃、引越し、IT、教育など様々なカテゴリのサービスを提供しています。',
            },
            {
                q: '利用料金はかかりますか？',
                a: '一般ユーザー（依頼者）の方は完全無料でご利用いただけます。事業者の方は契約成立時に10%のプラットフォーム手数料が発生します。',
            },
            {
                q: '会員登録に必要なものは何ですか？',
                a: 'メールアドレスがあれば登録可能です。事業者として登録される場合は、事業者情報（会社名、所在地など）の入力と審査が必要になります。',
            },
            {
                q: '対応している地域はどこですか？',
                a: '日本全国でご利用いただけます。ただし、サービスの種類や事業者によって対応地域が異なる場合があります。',
            },
        ],
    },
    project: {
        title: '案件について',
        questions: [
            {
                q: '案件の登録方法を教えてください',
                a: 'ログイン後、ダッシュボードから「新規案件登録」ボタンをクリックし、必要事項（カテゴリ、詳細、予算、希望日程など）を入力してください。画像や資料の添付も可能です。',
            },
            {
                q: '案件を修正・削除することはできますか？',
                a: '提案を受ける前であれば、案件の修正・削除が可能です。提案を受けた後の大幅な変更は、提案者への影響を考慮してご遠慮いただいております。',
            },
            {
                q: '複数の提案から選ぶ基準はありますか？',
                a: '価格だけでなく、事業者の評価・レビュー、過去の実績、提案内容の具体性などを総合的にご判断ください。不明点があればチャットで直接確認することをおすすめします。',
            },
            {
                q: '提案の有効期限はありますか？',
                a: '案件登録から30日間が募集期間となります。期間内に適切な事業者が見つからない場合は、期間延長または再登録が可能です。',
            },
        ],
    },
    payment: {
        title: 'お支払いについて',
        questions: [
            {
                q: '利用できる支払い方法は何ですか？',
                a: 'クレジットカード（VISA、Mastercard、JCB、American Express）、銀行振込、PayPay、LINE Pay、楽天ペイに対応しています。',
            },
            {
                q: '支払いのタイミングはいつですか？',
                a: '原則として作業完了後のお支払いとなります。大型案件の場合は、着手金と完了金に分けてお支払いいただくこともあります。',
            },
            {
                q: '領収書は発行されますか？',
                a: 'はい、支払い完了後にマイページから領収書をダウンロードいただけます。',
            },
            {
                q: '返金は可能ですか？',
                a: '作業開始前のキャンセルであれば全額返金いたします。作業開始後のキャンセル・返金については、進捗状況に応じて個別に対応いたします。',
            },
        ],
    },
    business: {
        title: '事業者向け',
        questions: [
            {
                q: '事業者登録の審査にはどのくらいかかりますか？',
                a: '通常2〜3営業日以内に審査結果をメールでお知らせいたします。繁忙期は多少お時間をいただく場合があります。',
            },
            {
                q: '個人事業主でも登録できますか？',
                a: 'はい、個人事業主の方も登録可能です。必要な資格や許認可をお持ちであれば、法人・個人を問わずご登録いただけます。',
            },
            {
                q: '手数料はいくらですか？',
                a: 'スタンダードプランは契約成立金額の10%、プレミアムプラン（月額¥10,000）は8%となっています。',
            },
            {
                q: '売上金の入金タイミングはいつですか？',
                a: '作業完了確認から7営業日以内に、ご登録の銀行口座へお振込みいたします。',
            },
        ],
    },
    trouble: {
        title: 'トラブル・サポート',
        questions: [
            {
                q: 'トラブルが発生した場合はどうすればよいですか？',
                a: 'まずは当事者間でのチャットでの解決をお試しください。解決が難しい場合は、サポートセンターまでご連絡ください。プラットフォームが仲介して解決をサポートいたします。',
            },
            {
                q: '事業者と連絡が取れなくなりました',
                a: 'サポートセンターにご連絡ください。プラットフォーム側から事業者に連絡を試み、状況を確認いたします。',
            },
            {
                q: '作業品質に問題がありました',
                a: 'サポートセンターまでご連絡ください。状況を確認の上、再作業や返金などの対応を検討いたします。',
            },
            {
                q: 'サポートセンターの連絡先を教えてください',
                a: 'メール: support@promatch.jp、電話: 03-1234-5678（平日9:00〜18:00）でお問い合わせいただけます。',
            },
        ],
    },
};

export default function FAQPage() {
    const [activeCategory, setActiveCategory] = useState('general');
    const [openQuestions, setOpenQuestions] = useState<string[]>([]);

    const toggleQuestion = (id: string) => {
        setOpenQuestions(prev =>
            prev.includes(id) ? prev.filter(q => q !== id) : [...prev, id]
        );
    };

    const categories = Object.entries(faqData).map(([key, value]) => ({
        id: key,
        title: value.title,
    }));

    const currentFaq = faqData[activeCategory as keyof typeof faqData];

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

            {/* Header */}
            <div className="bg-white border-b border-gray-200 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        よくあるご質問（FAQ）
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        お客様からよくいただくご質問をまとめています。<br />
                        こちらで解決しない場合は、サポートセンターまでお問い合わせください。
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Category Sidebar */}
                    <div className="lg:w-64 flex-shrink-0">
                        <div className="bg-white rounded-lg shadow-sm p-4 sticky top-24">
                            <h2 className="font-semibold text-gray-900 mb-4">カテゴリ</h2>
                            <nav className="space-y-1">
                                {categories.map(category => (
                                    <button
                                        key={category.id}
                                        onClick={() => setActiveCategory(category.id)}
                                        className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                                            activeCategory === category.id
                                                ? 'bg-primary-100 text-primary-700 font-medium'
                                                : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                    >
                                        {category.title}
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </div>

                    {/* FAQ Content */}
                    <div className="flex-1">
                        <div className="bg-white rounded-lg shadow-sm">
                            <div className="p-6 border-b border-gray-200">
                                <h2 className="text-xl font-semibold text-gray-900">{currentFaq.title}</h2>
                            </div>
                            <div className="divide-y divide-gray-200">
                                {currentFaq.questions.map((item, index) => {
                                    const questionId = `${activeCategory}-${index}`;
                                    const isOpen = openQuestions.includes(questionId);
                                    
                                    return (
                                        <div key={index}>
                                            <button
                                                onClick={() => toggleQuestion(questionId)}
                                                className="w-full text-left p-6 flex items-start justify-between gap-4 hover:bg-gray-50 transition-colors"
                                            >
                                                <div className="flex items-start gap-3">
                                                    <span className="text-primary-600 font-bold mt-0.5">Q.</span>
                                                    <span className="font-medium text-gray-900">{item.q}</span>
                                                </div>
                                                <svg
                                                    className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${
                                                        isOpen ? 'rotate-180' : ''
                                                    }`}
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </button>
                                            {isOpen && (
                                                <div className="px-6 pb-6">
                                                    <div className="flex items-start gap-3 pl-0 ml-6 pt-2 border-t border-gray-100">
                                                        <span className="text-gray-400 font-bold">A.</span>
                                                        <p className="text-gray-600">{item.a}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact CTA */}
                <div className="mt-12 bg-primary-50 rounded-2xl p-8 text-center">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        お探しの答えが見つかりませんでしたか？
                    </h3>
                    <p className="text-gray-600 mb-6">
                        サポートセンターまでお気軽にお問い合わせください。
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="mailto:support@promatch.jp"
                            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                        >
                            メールで問い合わせ
                        </a>
                        <a
                            href="tel:03-1234-5678"
                            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-white transition-colors"
                        >
                            電話: 03-1234-5678
                        </a>
                    </div>
                    <p className="text-sm text-gray-500 mt-4">
                        電話受付時間: 平日 9:00〜18:00
                    </p>
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
