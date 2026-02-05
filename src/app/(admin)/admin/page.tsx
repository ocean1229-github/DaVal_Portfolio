import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { getPortfolios } from '@/lib/notion';
import styles from './admin.module.css';
import { FolderKanban, Users, Eye, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

export default async function AdminDashboard() {
    const session = await getServerSession(authOptions);

    // Fetch stats from Notion
    let portfolioCount = 0;
    let publishedCount = 0;

    try {
        const allPortfolios = await getPortfolios(false);
        portfolioCount = allPortfolios.length;
        publishedCount = allPortfolios.filter(p => p.is_published).length;
    } catch (e) {
        console.error('Failed to fetch portfolio stats:', e);
    }

    return (
        <div className={styles.dashboard}>
            <header className={styles.header}>
                <h1>Dashboard</h1>
                <p>Welcome back, {session?.user?.name || 'Admin'}</p>
            </header>

            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ backgroundColor: 'rgba(112, 0, 255, 0.1)', color: 'var(--accent-primary)' }}>
                        <FolderKanban size={24} />
                    </div>
                    <div className={styles.statInfo}>
                        <span className={styles.statLabel}>Total Portfolios</span>
                        <span className={styles.statValue}>{portfolioCount}</span>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ backgroundColor: 'rgba(0, 212, 255, 0.1)', color: 'var(--accent-secondary)' }}>
                        <Eye size={24} />
                    </div>
                    <div className={styles.statInfo}>
                        <span className={styles.statLabel}>Published</span>
                        <span className={styles.statValue}>{publishedCount}</span>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-secondary)' }}>
                        <Users size={24} />
                    </div>
                    <div className={styles.statInfo}>
                        <span className={styles.statLabel}>Whitelisted Emails</span>
                        <span className={styles.statValue}>1+</span>
                    </div>
                </div>
            </div>

            <section className={styles.quickActions}>
                <h2>Quick Actions</h2>
                <div className={styles.actionGrid}>
                    <Link href="/admin/portfolio/new" className={styles.actionLink}>
                        <span>새 포트폴리오 등록</span>
                        <ArrowUpRight size={20} />
                    </Link>
                    <Link href="/admin/support" className={styles.actionLink}>
                        <span>파트너 지원 도구</span>
                        <ArrowUpRight size={20} />
                    </Link>
                    <Link href="/" target="_blank" className={styles.actionLink}>
                        <span>공개 사이트 보기</span>
                        <ArrowUpRight size={20} />
                    </Link>
                </div>
            </section>
        </div>
    );
}
