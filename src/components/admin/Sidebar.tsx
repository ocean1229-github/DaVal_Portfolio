'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    FolderKanban,
    Building2,
    LogOut,
    PlusCircle,
    List,
    FileText,
    Briefcase,
    Users
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import styles from '@/app/(admin)/admin/admin.module.css';

export default function Sidebar({ userName }: { userName?: string }) {
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path;
    const startsWith = (path: string) => pathname.startsWith(path);

    const navItems = [
        {
            label: 'Dashboard',
            icon: <LayoutDashboard size={20} />,
            href: '/admin'
        },
        {
            label: 'Portfolios',
            icon: <FolderKanban size={20} />,
            href: '/admin/portfolio',
            subItems: [
                { label: '전체 목록', href: '/admin/portfolio', icon: <List size={16} /> },
                { label: '새 등록', href: '/admin/portfolio/new', icon: <PlusCircle size={16} /> }
            ]
        },
        {
            label: 'Company',
            icon: <Building2 size={20} />,
            href: '/admin/company',
            subItems: [
                { label: '회사 소개', href: '/admin/company', icon: <FileText size={16} /> },
                { label: '서비스/강점', href: '/admin/company/services', icon: <Briefcase size={16} /> },
                { label: '팀 소개', href: '/admin/company/team', icon: <Users size={16} /> }
            ]
        }
    ];

    return (
        <aside className={styles.sidebar}>
            <div className={styles.sidebarHeader}>
                <div className={styles.logo}>
                    <Link href="/admin">DaVal Admin</Link>
                </div>
                {userName && <div className={styles.userInfo}>{userName}님 안녕하세요</div>}
            </div>

            <nav className={styles.nav}>
                {navItems.map((item) => (
                    <div key={item.label} className={styles.navGroup}>
                        <Link
                            href={item.href}
                            className={`${styles.navLink} ${isActive(item.href) || (item.subItems && startsWith(item.href)) ? styles.active : ''}`}
                        >
                            <span className={styles.icon}>{item.icon}</span>
                            <span className={styles.label}>{item.label}</span>
                        </Link>

                        {(isActive(item.href) || startsWith(item.href)) && item.subItems && (
                            <div className={styles.subItems}>
                                {item.subItems.map((sub) => (
                                    <Link
                                        key={sub.label}
                                        href={sub.href}
                                        className={`${styles.subNavLink} ${isActive(sub.href) ? styles.subActive : ''}`}
                                    >
                                        <span className={styles.subIcon}>{sub.icon}</span>
                                        <span>{sub.label}</span>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </nav>

            <div className={styles.sidebarFooter}>
                <button onClick={() => signOut()} className={styles.logoutBtn}>
                    <LogOut size={18} /> Logout
                </button>
            </div>
        </aside>
    );
}
