import Link from 'next/link';

export default function TermsPage() {
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

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="bg-white rounded-lg shadow-sm p-8 md:p-12">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">利用規約</h1>
                    <p className="text-gray-500 mb-8">最終更新日: 2024年1月1日</p>

                    <div className="prose prose-gray max-w-none">
                        <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">第1条（適用）</h2>
                        <p className="text-gray-600 mb-4">
                            本規約は、ProMatch（以下「当社」といいます）が提供するサービス「ProMatch」（以下「本サービス」といいます）の利用条件を定めるものです。登録ユーザーの皆さま（以下「ユーザー」といいます）には、本規約に従って、本サービスをご利用いただきます。
                        </p>

                        <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">第2条（利用登録）</h2>
                        <p className="text-gray-600 mb-4">
                            本サービスにおいては、登録希望者が本規約に同意の上、当社の定める方法によって利用登録を申請し、当社がこれを承認することによって、利用登録が完了するものとします。
                        </p>
                        <p className="text-gray-600 mb-4">
                            当社は、利用登録の申請者に以下の事由があると判断した場合、利用登録の申請を承認しないことがあり、その理由については一切の開示義務を負わないものとします。
                        </p>
                        <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
                            <li>利用登録の申請に際して虚偽の事項を届け出た場合</li>
                            <li>本規約に違反したことがある者からの申請である場合</li>
                            <li>その他、当社が利用登録を相当でないと判断した場合</li>
                        </ul>

                        <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">第3条（ユーザーIDおよびパスワードの管理）</h2>
                        <p className="text-gray-600 mb-4">
                            ユーザーは、自己の責任において、本サービスのユーザーIDおよびパスワードを適切に管理するものとします。
                        </p>
                        <p className="text-gray-600 mb-4">
                            ユーザーは、いかなる場合にも、ユーザーIDおよびパスワードを第三者に譲渡または貸与し、もしくは第三者と共用することはできません。当社は、ユーザーIDとパスワードの組み合わせが登録情報と一致してログインされた場合には、そのユーザーIDを登録しているユーザー自身による利用とみなします。
                        </p>

                        <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">第4条（利用料金および支払方法）</h2>
                        <p className="text-gray-600 mb-4">
                            ユーザーは、本サービス利用の対価として、当社が別途定め、本ウェブサイトに表示する利用料金を、当社が指定する方法により支払うものとします。
                        </p>
                        <p className="text-gray-600 mb-4">
                            事業者ユーザーは、契約成立時にプラットフォーム手数料（契約金額の10%）を当社に支払うものとします。
                        </p>

                        <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">第5条（禁止事項）</h2>
                        <p className="text-gray-600 mb-4">
                            ユーザーは、本サービスの利用にあたり、以下の行為をしてはなりません。
                        </p>
                        <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
                            <li>法令または公序良俗に違反する行為</li>
                            <li>犯罪行為に関連する行為</li>
                            <li>本サービスの内容等、本サービスに含まれる著作権、商標権ほか知的財産権を侵害する行為</li>
                            <li>当社、ほかのユーザー、またはその他第三者のサーバーまたはネットワークの機能を破壊したり、妨害したりする行為</li>
                            <li>本サービスによって得られた情報を商業的に利用する行為</li>
                            <li>当社のサービスの運営を妨害するおそれのある行為</li>
                            <li>不正アクセスをし、またはこれを試みる行為</li>
                            <li>他のユーザーに関する個人情報等を収集または蓄積する行為</li>
                            <li>不正な目的を持って本サービスを利用する行為</li>
                            <li>本サービスの他のユーザーまたはその他の第三者に不利益、損害、不快感を与える行為</li>
                            <li>他のユーザーに成りすます行為</li>
                            <li>当社が許諾しない本サービス上での宣伝、広告、勧誘、または営業行為</li>
                            <li>当社のサービスに関連して、反社会的勢力に対して直接または間接に利益を供与する行為</li>
                            <li>その他、当社が不適切と判断する行為</li>
                        </ul>

                        <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">第6条（本サービスの提供の停止等）</h2>
                        <p className="text-gray-600 mb-4">
                            当社は、以下のいずれかの事由があると判断した場合、ユーザーに事前に通知することなく本サービスの全部または一部の提供を停止または中断することができるものとします。
                        </p>
                        <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
                            <li>本サービスにかかるコンピュータシステムの保守点検または更新を行う場合</li>
                            <li>地震、落雷、火災、停電または天災などの不可抗力により、本サービスの提供が困難となった場合</li>
                            <li>コンピュータまたは通信回線等が事故により停止した場合</li>
                            <li>その他、当社が本サービスの提供が困難と判断した場合</li>
                        </ul>

                        <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">第7条（利用制限および登録抹消）</h2>
                        <p className="text-gray-600 mb-4">
                            当社は、ユーザーが以下のいずれかに該当する場合には、事前の通知なく、ユーザーに対して、本サービスの全部もしくは一部の利用を制限し、またはユーザーとしての登録を抹消することができるものとします。
                        </p>
                        <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
                            <li>本規約のいずれかの条項に違反した場合</li>
                            <li>登録事項に虚偽の事実があることが判明した場合</li>
                            <li>料金等の支払債務の不履行があった場合</li>
                            <li>当社からの連絡に対し、一定期間返答がない場合</li>
                            <li>本サービスについて、最終の利用から一定期間利用がない場合</li>
                            <li>その他、当社が本サービスの利用を適当でないと判断した場合</li>
                        </ul>

                        <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">第8条（退会）</h2>
                        <p className="text-gray-600 mb-4">
                            ユーザーは、当社の定める退会手続により、本サービスから退会できるものとします。
                        </p>

                        <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">第9条（保証の否認および免責事項）</h2>
                        <p className="text-gray-600 mb-4">
                            当社は、本サービスに事実上または法律上の瑕疵（安全性、信頼性、正確性、完全性、有効性、特定の目的への適合性、セキュリティなどに関する欠陥、エラーやバグ、権利侵害などを含みます。）がないことを明示的にも黙示的にも保証しておりません。
                        </p>
                        <p className="text-gray-600 mb-4">
                            当社は、本サービスに起因してユーザーに生じたあらゆる損害について、当社の故意又は重過失による場合を除き、一切の責任を負いません。
                        </p>

                        <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">第10条（サービス内容の変更等）</h2>
                        <p className="text-gray-600 mb-4">
                            当社は、ユーザーへの事前の告知をもって、本サービスの内容を変更、追加または廃止することがあり、ユーザーはこれを承諾するものとします。
                        </p>

                        <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">第11条（利用規約の変更）</h2>
                        <p className="text-gray-600 mb-4">
                            当社は以下の場合には、ユーザーの個別の同意を要せず、本規約を変更することができるものとします。
                        </p>
                        <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
                            <li>本規約の変更がユーザーの一般の利益に適合するとき</li>
                            <li>本規約の変更が本サービス利用契約の目的に反せず、かつ、変更の必要性、変更後の内容の相当性その他の変更に係る事情に照らして合理的なものであるとき</li>
                        </ul>

                        <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">第12条（個人情報の取扱い）</h2>
                        <p className="text-gray-600 mb-4">
                            当社は、本サービスの利用によって取得する個人情報については、当社「プライバシーポリシー」に従い適切に取り扱うものとします。
                        </p>

                        <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">第13条（通知または連絡）</h2>
                        <p className="text-gray-600 mb-4">
                            ユーザーと当社との間の通知または連絡は、当社の定める方法によって行うものとします。当社は、ユーザーから、当社が別途定める方式に従った変更届け出がない限り、現在登録されている連絡先が有効なものとみなして当該連絡先へ通知または連絡を行い、これらは、発信時にユーザーへ到達したものとみなします。
                        </p>

                        <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">第14条（権利義務の譲渡の禁止）</h2>
                        <p className="text-gray-600 mb-4">
                            ユーザーは、当社の書面による事前の承諾なく、利用契約上の地位または本規約に基づく権利もしくは義務を第三者に譲渡し、または担保に供することはできません。
                        </p>

                        <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">第15条（準拠法・裁判管轄）</h2>
                        <p className="text-gray-600 mb-4">
                            本規約の解釈にあたっては、日本法を準拠法とします。
                        </p>
                        <p className="text-gray-600 mb-4">
                            本サービスに関して紛争が生じた場合には、当社の本店所在地を管轄する裁判所を専属的合意管轄とします。
                        </p>

                        <div className="mt-12 pt-8 border-t border-gray-200">
                            <p className="text-gray-500 text-sm">
                                以上
                            </p>
                            <p className="text-gray-500 text-sm mt-2">
                                制定日: 2024年1月1日<br />
                                ProMatch運営事務局
                            </p>
                        </div>
                    </div>
                </div>

                {/* Back Link */}
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
