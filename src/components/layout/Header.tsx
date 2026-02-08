'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useRef } from 'react';
import styles from './Header.module.css';

export default function Header() {
    const pathname = usePathname();
    const router = useRouter();
    const clickCount = useRef(0);
    const clickTimer = useRef<NodeJS.Timeout | null>(null);

    const handleLogoClick = (e: React.MouseEvent) => {
        // 메인 페이지가 아니면 그냥 홈으로 이동
        if (pathname !== '/') return;

        e.preventDefault();
        clickCount.current += 1;

        // 2초 안에 5번 클릭하면 로그인으로
        if (clickCount.current >= 5) {
            clickCount.current = 0;
            if (clickTimer.current) clearTimeout(clickTimer.current);
            router.push('/login');
            return;
        }

        // 2초 후 카운트 리셋
        if (clickTimer.current) clearTimeout(clickTimer.current);
        clickTimer.current = setTimeout(() => {
            clickCount.current = 0;
        }, 2000);
    };

    return (
        <header className={styles.header}>
            <div className={styles.inner}>
                <Link
                    href="/"
                    className={styles.logo}
                    onClick={handleLogoClick}
                >
                    DaVal
                </Link>
                <nav className={styles.nav}>
                    <Link
                        href="/portfolio"
                        className={`${styles.navLink} ${pathname.startsWith('/portfolio') ? styles.active : ''}`}
                    >
                        Portfolio
                    </Link>
                    <a
                        href="https://www.da-val.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.navLink}
                    >
                        Contact
                    </a>
                </nav>
            </div>
        </header>
    );
}
