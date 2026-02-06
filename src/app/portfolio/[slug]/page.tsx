import { getPortfolioBySlug } from '@/lib/notion';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Calendar, Users, Target, Tag } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import styles from '../portfolio.module.css';

export const revalidate = 60; // ISR: 60초마다 재검증

type PageProps = { params: Promise<{ slug: string }> };

export default async function PortfolioDetail({ params }: PageProps) {
    const { slug } = await params;

    const portfolio = await getPortfolioBySlug(slug);

    if (!portfolio) {
        notFound();
    }

    return (
        <>
            <Header />
            <div className={styles.container}>
                <header className={styles.detailHeader}>
                    <Link href="/portfolio" className={styles.backBtn}>
                        <ChevronLeft size={20} /> 포트폴리오 목록으로
                    </Link>
                    <h1>{portfolio.title}</h1>
                </header>

                <div className={styles.vignette}>
                    {portfolio.thumbnail_url ? (
                        <img src={portfolio.thumbnail_url} alt={portfolio.title} className={styles.thumbnail} />
                    ) : (
                        <div style={{ padding: '8rem', textAlign: 'center', background: 'var(--bg-secondary)' }}>
                            대표 이미지 없음
                        </div>
                    )}
                </div>

                <div className={styles.detailGrid}>
                    <div className={styles.mainContent}>
                        <section className={styles.descriptionSection}>
                            <h2>Project Overview</h2>
                            <div className={styles.description}>
                                {portfolio.description}
                            </div>
                        </section>
                    </div>

                    <aside className={styles.sidebar}>
                        <div className={styles.infoBox}>
                            <h4>Information</h4>
                            <div className={styles.infoList}>
                                <div className={styles.infoItem}>
                                    <div className={styles.infoLabel}>
                                        <Calendar size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} /> 기간
                                    </div>
                                    <div className={styles.infoValue}>
                                        {portfolio.project_start_date} ~ {portfolio.project_end_date || '진행 중'}
                                    </div>
                                </div>

                                <div className={styles.infoItem}>
                                    <div className={styles.infoLabel}>
                                        <Users size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} /> 참여 분야 / 기여도
                                    </div>
                                    <div className={styles.infoValue}>
                                        {portfolio.participation_field} ({portfolio.participation_rate}%)
                                    </div>
                                </div>

                                <div className={styles.infoItem}>
                                    <div className={styles.infoLabel}>
                                        <Target size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} /> 서비스 분류
                                    </div>
                                    <div className={styles.infoValue}>
                                        {portfolio.dev_type.toUpperCase()} / {portfolio.category}
                                    </div>
                                </div>

                                <div className={styles.infoItem}>
                                    <div className={styles.infoLabel}>
                                        <Tag size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} /> 태그
                                    </div>
                                    <div className={styles.infoValue}>
                                        {portfolio.tags.map((tag: string) => (
                                            <span key={tag} style={{ color: 'var(--text-muted)', marginRight: '8px' }}>#{tag}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
            <Footer />
        </>
    );
}
