import { getPortfolios } from '@/lib/notion';
import PortfolioCard from '@/components/portfolio/PortfolioCard';
import { Portfolio } from '@/types';
import styles from './portfolio.module.css';

export const revalidate = 60; // ISR: 60초마다 재검증

export default async function PortfolioList() {
    let portfolios: Portfolio[] = [];
    let error: unknown = null;

    try {
        portfolios = await getPortfolios(true); // published only
    } catch (e) {
        error = e;
        console.error('Failed to fetch portfolios:', e);
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1>Portfolio</h1>
                <p>DaVal이 만들어온 혁신적인 솔루션들을 소개합니다.</p>
            </header>

            {error || portfolios.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '4rem' }}>
                    아직 등록된 포트폴리오가 없습니다.
                </div>
            ) : (
                <div className={styles.grid}>
                    {portfolios.map(portfolio => (
                        <PortfolioCard key={portfolio.id} portfolio={portfolio} />
                    ))}
                </div>
            )}
        </div>
    );
}
