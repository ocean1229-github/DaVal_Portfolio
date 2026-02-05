'use client';

import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { LogIn } from 'lucide-react';
import styles from './login.module.css';

export default function LoginPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'authenticated') {
            router.push('/admin'); // Redirect to admin dashboard
        }
    }, [status, router]);

    if (status === 'loading') {
        return <div className={styles.container}>Loading...</div>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.loginCard}>
                <h1 className={styles.title}>Admin Login</h1>
                <p className={styles.subtitle}>DaVal 포트폴리오 관리를 위해 구글 계정으로 로그인하세요.</p>

                <button
                    onClick={() => signIn('google')}
                    className={styles.googleBtn}
                >
                    <LogIn size={20} style={{ marginRight: '10px' }} />
                    Google로 계속하기
                </button>

                <div className={styles.footer}>
                    <p>등록된 화이트리스트 계정만 접근 가능합니다.</p>
                </div>
            </div>
        </div>
    );
}
