import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';

export default async function BusinessLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    let session;
    
    try {
        session = await getServerSession(authOptions);
    } catch (error) {
        console.error('Session error in business layout:', error);
        redirect('/auth/login?error=session');
    }

    if (!session) {
        redirect('/auth/login');
    }

    if (session.user.role !== 'BUSINESS' && session.user.role !== 'ADMIN') {
        redirect('/dashboard');
    }

    return <>{children}</>;
}
