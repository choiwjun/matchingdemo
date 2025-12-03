import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect('/auth/login');
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-sm border-b">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-8">
                            <h1 className="text-xl font-bold text-primary-600">Marketplace</h1>
                            <div className="hidden md:flex gap-4">
                                {session.user.role === 'USER' && (
                                    <>
                                        <a href="/dashboard" className="text-gray-700 hover:text-primary-600 px-3 py-2">
                                            대시보드
                                        </a>
                                        <a href="/dashboard/projects" className="text-gray-700 hover:text-primary-600 px-3 py-2">
                                            내 프로젝트
                                        </a>
                                        <a href="/dashboard/contracts" className="text-gray-700 hover:text-primary-600 px-3 py-2">
                                            계약
                                        </a>
                                    </>
                                )}
                                {session.user.role === 'BUSINESS' && (
                                    <>
                                        <a href="/business" className="text-gray-700 hover:text-primary-600 px-3 py-2">
                                            대시보드
                                        </a>
                                        <a href="/business/projects" className="text-gray-700 hover:text-primary-600 px-3 py-2">
                                            프로젝트 찾기
                                        </a>
                                        <a href="/business/proposals" className="text-gray-700 hover:text-primary-600 px-3 py-2">
                                            내 제안
                                        </a>
                                    </>
                                )}
                                {session.user.role === 'ADMIN' && (
                                    <>
                                        <a href="/admin" className="text-gray-700 hover:text-primary-600 px-3 py-2">
                                            대시보드
                                        </a>
                                        <a href="/admin/users" className="text-gray-700 hover:text-primary-600 px-3 py-2">
                                            사용자 관리
                                        </a>
                                        <a href="/admin/projects" className="text-gray-700 hover:text-primary-600 px-3 py-2">
                                            프로젝트 관리
                                        </a>
                                    </>
                                )}
                                <a href="/chat" className="text-gray-700 hover:text-primary-600 px-3 py-2">
                                    채팅
                                </a>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <button className="relative p-2 text-gray-600 hover:text-primary-600">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                            </button>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-medium">
                                    {session.user.email[0].toUpperCase()}
                                </div>
                                <span className="hidden md:block text-sm text-gray-700">{session.user.email}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
            <main className="container mx-auto px-4 py-8">
                {children}
            </main>
        </div>
    );
}
