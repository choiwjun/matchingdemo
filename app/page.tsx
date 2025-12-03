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
                                프로젝트 찾기
                            </Link>
                            <Link href="/how-it-works" className="text-gray-600 hover:text-gray-900">
                                이용 방법
                            </Link>
                            <Link href="/for-business" className="text-gray-600 hover:text-gray-900">
                                사업자 안내
                            </Link>
                        </nav>
                        <div className="flex items-center gap-4">
                            <Link
                                href="/auth/login"
                                className="text-gray-600 hover:text-gray-900"
                            >
                                로그인
                            </Link>
                            <Link
                                href="/auth/register"
                                className="btn btn-primary"
                            >
                                회원가입
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
                            필요한 서비스,<br />
                            전문가에게 맡기세요
                        </h1>
                        <p className="text-xl md:text-2xl text-primary-100 mb-8">
                            프로젝트를 등록하면 검증된 전문가들이 제안을 보내드립니다.
                            비교하고 선택하세요.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                href="/auth/register"
                                className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary-600 font-semibold rounded-xl hover:bg-primary-50 transition-colors"
                            >
                                무료로 프로젝트 등록하기
                                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </Link>
                            <Link
                                href="/auth/register?role=BUSINESS"
                                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white/10 transition-colors"
                            >
                                사업자로 가입하기
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
                            다양한 서비스를 한 곳에서
                        </h2>
                        <p className="text-xl text-gray-600">
                            필요한 서비스를 선택하고 전문가를 찾아보세요.
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
                            간단한 3단계로 시작하세요
                        </h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <span className="text-2xl font-bold text-primary-600">1</span>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                프로젝트 등록
                            </h3>
                            <p className="text-gray-600">
                                필요한 서비스와 조건을 입력하세요. 사진과 파일도 첨부할 수 있어요.
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <span className="text-2xl font-bold text-secondary-600">2</span>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                제안 받기
                            </h3>
                            <p className="text-gray-600">
                                검증된 전문가들이 견적과 제안을 보내드립니다. 비교해보세요.
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <span className="text-2xl font-bold text-green-600">3</span>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                전문가 선택
                            </h3>
                            <p className="text-gray-600">
                                마음에 드는 전문가를 선택하고 채팅으로 상담하세요.
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
                                사업자이신가요?<br />
                                새로운 고객을 만나보세요
                            </h2>
                            <ul className="space-y-4 mb-8">
                                <li className="flex items-start gap-3">
                                    <svg className="w-6 h-6 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-lg">매칭된 프로젝트에만 수수료 발생</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <svg className="w-6 h-6 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-lg">검증된 의뢰인과 안전한 거래</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <svg className="w-6 h-6 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-lg">실시간 알림으로 빠른 대응</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <svg className="w-6 h-6 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-lg">포트폴리오와 리뷰로 신뢰 구축</span>
                                </li>
                            </ul>
                            <Link
                                href="/auth/register?role=BUSINESS"
                                className="inline-flex items-center px-8 py-4 bg-white text-secondary-600 font-semibold rounded-xl hover:bg-secondary-50 transition-colors"
                            >
                                사업자로 시작하기
                            </Link>
                        </div>
                        <div className="hidden md:block">
                            <div className="bg-white/10 rounded-2xl p-8">
                                <div className="space-y-4">
                                    <div className="bg-white rounded-xl p-4 shadow-lg">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold">
                                                새
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900">새 프로젝트 알림</div>
                                                <div className="text-sm text-gray-500">방금 전</div>
                                            </div>
                                        </div>
                                        <p className="text-gray-700">아파트 인테리어 리모델링 - 서울 강남구</p>
                                        <div className="mt-2 text-primary-600 font-medium">예산: 500만원 ~ 1,000만원</div>
                                    </div>
                                    <div className="bg-white rounded-xl p-4 shadow-lg opacity-80">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold">
                                                ✓
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900">계약 확정</div>
                                                <div className="text-sm text-gray-500">10분 전</div>
                                            </div>
                                        </div>
                                        <p className="text-gray-700">욕실 리모델링 프로젝트가 확정되었습니다.</p>
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
                            <div className="text-gray-600">등록된 프로젝트</div>
                        </div>
                        <div>
                            <div className="text-4xl md:text-5xl font-bold text-primary-600 mb-2">5K+</div>
                            <div className="text-gray-600">검증된 전문가</div>
                        </div>
                        <div>
                            <div className="text-4xl md:text-5xl font-bold text-primary-600 mb-2">95%</div>
                            <div className="text-gray-600">만족도</div>
                        </div>
                        <div>
                            <div className="text-4xl md:text-5xl font-bold text-primary-600 mb-2">50B+</div>
                            <div className="text-gray-600">누적 거래액</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        지금 바로 시작하세요
                    </h2>
                    <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                        무료로 프로젝트를 등록하고 전문가들의 제안을 받아보세요.
                    </p>
                    <Link
                        href="/auth/register"
                        className="inline-flex items-center px-8 py-4 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors"
                    >
                        무료로 시작하기
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
                                필요한 서비스를 전문가에게 맡기세요.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">서비스</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li><Link href="/projects" className="hover:text-white">프로젝트 찾기</Link></li>
                                <li><Link href="/how-it-works" className="hover:text-white">이용 방법</Link></li>
                                <li><Link href="/for-business" className="hover:text-white">사업자 안내</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">고객 지원</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li><Link href="/help" className="hover:text-white">자주 묻는 질문</Link></li>
                                <li><Link href="/contact" className="hover:text-white">문의하기</Link></li>
                                <li><Link href="/terms" className="hover:text-white">이용약관</Link></li>
                                <li><Link href="/privacy" className="hover:text-white">개인정보처리방침</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">연락처</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li>이메일: support@marketplace.com</li>
                                <li>전화: 1588-0000</li>
                                <li>평일 09:00 - 18:00</li>
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
