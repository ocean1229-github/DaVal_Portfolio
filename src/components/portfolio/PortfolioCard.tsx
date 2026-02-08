'use client';

import { Portfolio } from '@/types';
import styles from '@/app/portfolio/portfolio.module.css';
import { ArrowUpRight } from 'lucide-react';

interface PortfolioCardProps {
    portfolio: Portfolio;
    onClick?: () => void;
}

export default function PortfolioCard({ portfolio, onClick }: PortfolioCardProps) {
    return (
        <div className={styles.card} onClick={onClick}>
            <div className={styles.thumbnailContainer}>
                {/* Prism glass effect layers */}
                <div className={styles.prismLayer} />
                <div className={styles.glowOrb} />
                {portfolio.thumbnail_url ? (
                    <img src={portfolio.thumbnail_url} alt={portfolio.title} className={styles.thumbnail} />
                ) : (
                    <div className={styles.thumbnailPlaceholder}>
                        <span>{portfolio.title.charAt(0)}</span>
                    </div>
                )}
                {/* Hover overlay */}
                <div className={styles.cardOverlay}>
                    <div className={styles.overlayIcon}>
                        <ArrowUpRight size={24} />
                    </div>
                    <span className={styles.overlayText}>자세히 보기</span>
                </div>
            </div>
            <div className={styles.cardContent}>
                <span className={styles.typeBadge}>{portfolio.dev_type}</span>
                <h3>{portfolio.title}</h3>
                <p>{portfolio.summary}</p>
                <div className={styles.cardFooter}>
                    <div className={styles.tags}>
                        {portfolio.tags.slice(0, 3).map(tag => (
                            <span key={tag} className={styles.tag}>#{tag}</span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
