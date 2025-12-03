import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';

export default async function BusinessLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect('/auth/login');
    }

    if (session.user.role !== 'BUSINESS' && session.user.role !== 'ADMIN') {
        redirect('/dashboard');
    }

    return <>{children}</>;
}
