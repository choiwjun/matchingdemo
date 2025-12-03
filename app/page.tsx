import Link from 'next/link';

export default function HomePage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
            {/* Hero Section */}
            <div className="container mx-auto px-4 py-16">
                <div className="text-center max-w-4xl mx-auto">
                    <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 animate-fade-in">
                        프로젝트와 전문가를 연결하는
                        <span className="block text-primary-600 mt-2">마켓플레이스</span>
                    </h1>
                    <p className="text-xl text-gray-600 mb-12 animate-slide-up">
                        필요한 서비스를 등록하고, 전문 사업자의 제안을 받아보세요.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
                        <Link href="/auth/register?role=user" className="btn btn-primary text-lg px-8 py-4">
                            프로젝트 등록하기
                        </Link>
                        <Link href="/auth/register?role=business" className="btn btn-outline text-lg px-8 py-4">
                            사업자로 시작하기
                        </Link>
                    </div>
                </div>

                {/* Features */}
                <div className="grid md:grid-cols-3 gap-8 mt-24">
                    <div className="card text-center hover:shadow-lg transition-shadow">
                        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">간편한 프로젝트 등록</h3>
                        <p className="text-gray-600">
                            필요한 서비스를 상세히 등록하고 여러 전문가의 제안을 받아보세요.
                        </p>
                    </div>

                    <div className="card text-center hover:shadow-lg transition-shadow">
                        <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">실시간 채팅</h3>
                        <p className="text-gray-600">
                            사업자와 실시간으로 소통하며 프로젝트 세부사항을 조율하세요.
                        </p>
                    </div>

                    <div className="card text-center hover:shadow-lg transition-shadow">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">안전한 거래</h3>
                        <p className="text-gray-600">
                            검증된 사업자와 안전하게 계약하고 리뷰를 통해 신뢰를 쌓으세요.
                        </p>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="mt-24 text-center">
                    <div className="card bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
                        <h2 className="text-3xl font-bold mb-4">지금 바로 시작하세요</h2>
                        <p className="text-lg mb-8 opacity-90">
                            이미 계정이 있으신가요?
                        </p>
                        <Link href="/auth/login" className="btn bg-white text-primary-600 hover:bg-gray-100 text-lg px-8 py-4">
                            로그인
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
