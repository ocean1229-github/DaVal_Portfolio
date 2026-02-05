import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import Sidebar from '@/components/admin/Sidebar';
import styles from './admin.module.css';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect('/login');
    }

    return (
        <div className={styles.adminLayout}>
            <Sidebar userName={session.user?.name || ''} />
            <main className={styles.content}>
                {children}
            </main>
        </div>
    );
}
