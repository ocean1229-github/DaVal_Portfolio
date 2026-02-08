'use client';

import { useState } from 'react';
import { Portfolio } from '@/types';
import PortfolioCard from './PortfolioCard';
import PortfolioModal from './PortfolioModal';
import styles from '@/app/portfolio/portfolio.module.css';

interface PortfolioListProps {
    portfolios: Portfolio[];
}

export default function PortfolioList({ portfolios }: PortfolioListProps) {
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
                {portfolios.map(portfolio => (
                    <PortfolioCard
                        key={portfolio.id}
                        portfolio={portfolio}
                        onClick={() => handleCardClick(portfolio)}
                    />
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
