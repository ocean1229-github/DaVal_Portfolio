import { getPortfolios } from '@/lib/notion';
import PortfolioList from '@/components/portfolio/PortfolioList';
import { Portfolio } from '@/types';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import styles from './portfolio.module.css';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export const revalidate = 60;

export default async function PortfolioPage() {
    let portfolios: Portfolio[] = [];
    let error: unknown = null;

    try {
        portfolios = await getPortfolios(true);
    } catch (e) {
        error = e;
        console.error('Failed to fetch portfolios:', e);
    }

    return (
        <>
            <Header />
            <div className={styles.container}>
                <header className={styles.header}>
                    <span className={styles.headerLabel}>Our Work</span>
                    <h1>Portfolio</h1>
                    <p>DaVal이 만들어온 혁신적인 솔루션들을 소개합니다.</p>
                </header>

                {error || portfolios.length === 0 ? (
                    <div className={styles.emptyState}>
                        <div className={styles.emptyContent}>
                            <h3>포트폴리오 준비 중</h3>
                            <p>곧 다양한 프로젝트들을 소개해 드리겠습니다.</p>
                            <Link href="/#contact" className={styles.ctaLink}>
                                프로젝트 문의하기 <ArrowRight size={16} />
                            </Link>
                        </div>
                    </div>
                ) : (
                    <PortfolioList portfolios={portfolios} />
                )}

                {/* CTA Section */}
                <section className={styles.ctaSection}>
                    <h2>비슷한 프로젝트가 필요하신가요?</h2>
                    <p>아이디어만 있어도 괜찮습니다. 함께 구체화해 드립니다.</p>
                    <Link href="/#contact" className={styles.ctaButton}>
                        무료 상담 신청 <ArrowRight size={18} />
                    </Link>
                </section>
            </div>
            <Footer />
        </>
    );
}
