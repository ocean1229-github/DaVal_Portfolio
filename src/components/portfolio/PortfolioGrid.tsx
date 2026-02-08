'use client';

import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Portfolio } from '@/types';
import PortfolioModal from './PortfolioModal';
import styles from './PortfolioGrid.module.css';

interface PortfolioGridProps {
    portfolios: Portfolio[];
}

export default function PortfolioGrid({ portfolios }: PortfolioGridProps) {
    const [selectedPortfolio, setSelectedPortfolio] = useState<Portfolio | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleCardClick = (portfolio: Portfolio) => {
        setSelectedPortfolio(portfolio);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <div className={styles.grid}>
                {portfolios.map((portfolio, index) => (
                    <div
                        key={portfolio.id}
                        className={`${styles.card} ${index === 0 ? styles.featured : ''}`}
                        onClick={() => handleCardClick(portfolio)}
                    >
                        <div className={styles.imageWrapper}>
                            {portfolio.thumbnail_url ? (
                                <img
                                    src={portfolio.thumbnail_url}
                                    alt={portfolio.title}
                                    className={styles.image}
                                />
                            ) : (
                                <div className={styles.placeholder}>
                                    <span>{portfolio.title.charAt(0)}</span>
                                </div>
                            )}
                            <div className={styles.overlay}>
                                <div className={styles.overlayIcon}>
                                    <ArrowUpRight size={28} />
                                </div>
                                <span className={styles.overlayText}>자세히 보기</span>
                            </div>
                        </div>
                        <div className={styles.content}>
                            <span className={styles.type}>{portfolio.dev_type}</span>
                            <h3 className={styles.title}>{portfolio.title}</h3>
                            <p className={styles.summary}>{portfolio.summary}</p>
                        </div>
                        {/* Glass Shine */}
                        <div className={styles.shine} />
                    </div>
                ))}
            </div>

            <PortfolioModal
                portfolio={selectedPortfolio}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
            />
        </>
    );
}
