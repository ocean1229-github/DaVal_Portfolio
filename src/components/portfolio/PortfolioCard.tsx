import Link from 'next/link';
import { Portfolio } from '@/types';
import styles from '@/app/portfolio/portfolio.module.css';
import { ArrowUpRight } from 'lucide-react';

export default function PortfolioCard({ portfolio }: { portfolio: Portfolio }) {
    return (
        <div className={styles.card}>
            <div className={styles.thumbnailContainer}>
                {portfolio.thumbnail_url ? (
                    <img src={portfolio.thumbnail_url} alt={portfolio.title} className={styles.thumbnail} />
                ) : (
                    <div className={styles.thumbnail} />
                )}
            </div>
            <div className={styles.cardContent}>
                <span className={styles.typeBadge}>{portfolio.dev_type} / {portfolio.category}</span>
                <h3>{portfolio.title}</h3>
                <p>{portfolio.summary}</p>
                <div className={styles.cardFooter}>
                    <div className={styles.tags}>
                        {portfolio.tags.slice(0, 2).map(tag => (
                            <span key={tag} className={styles.tag}>#{tag}</span>
                        ))}
                    </div>
                    <Link href={`/portfolio/${portfolio.slug}`} className={styles.detailLink}>
                        상세보기 <ArrowUpRight size={16} />
                    </Link>
                </div>
            </div>
        </div>
    );
}
