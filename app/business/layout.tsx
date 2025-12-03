'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function BusinessLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/login');
        } else if (status === 'authenticated') {
            if (session?.user?.role !== 'BUSINESS' && session?.user?.role !== 'ADMIN') {
                router.push('/dashboard');
            }
        }
    }, [status, session, router]);

    if (status === 'loading') {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (!session || (session.user?.role !== 'BUSINESS' && session.user?.role !== 'ADMIN')) {
        return null;
    }

    return <>{children}</>;
}
