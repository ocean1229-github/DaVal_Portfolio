'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Header.module.css';

export default function Header() {
    const pathname = usePathname();

    return (
        <header className={styles.header}>
            <div className={styles.inner}>
                <Link href="/" className={styles.logo}>
                    DaVal
                </Link>
                <nav className={styles.nav}>
                    <Link
                        href="/portfolio"
                        className={`${styles.navLink} ${pathname.startsWith('/portfolio') ? styles.active : ''}`}
                    >
                        Portfolio
                    </Link>
                    <Link
                        href="/about"
                        className={`${styles.navLink} ${pathname === '/about' ? styles.active : ''}`}
                    >
                        About
                    </Link>
                    <Link href="/login" className={styles.loginLink}>
                        Login
                    </Link>
                </nav>
            </div>
        </header>
    );
}
