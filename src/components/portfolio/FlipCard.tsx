'use client';

import { useState } from 'react';
import Image from 'next/image';
import { RotateCcw, ExternalLink, Calendar, Briefcase } from 'lucide-react';
import { Portfolio } from '@/types';
import styles from './FlipCard.module.css';

interface FlipCardProps {
    portfolio: Portfolio;
    featured?: boolean;
}

export default function FlipCard({ portfolio, featured = false }: FlipCardProps) {
    const [isFlipped, setIsFlipped] = useState(false);

    const handleFlip = () => {
        setIsFlipped(!isFlipped);
    };

    const formatDate = (start: string | null, end: string | null) => {
        if (!start) return null;
        const startDate = new Date(start).toLocaleDateString('ko-KR', { year: 'numeric', month: 'short' });
        const endDate = end
            ? new Date(end).toLocaleDateString('ko-KR', { year: 'numeric', month: 'short' })
            : '진행중';
        return `${startDate} - ${endDate}`;
    };

    const period = formatDate(portfolio.project_start_date, portfolio.project_end_date);

    return (
        <div
            className={`${styles.flipCard} ${featured ? styles.featured : ''} ${isFlipped ? styles.flipped : ''}`}
            onClick={handleFlip}
        >
            <div className={styles.flipCardInner}>
                {/* 앞면 */}
                <div className={styles.flipCardFront}>
                    <div className={styles.imageWrapper}>
                        {portfolio.thumbnail_url ? (
                            <Image
                                src={portfolio.thumbnail_url}
                                alt={portfolio.title}
                                fill
                                className={styles.image}
                            />
                        ) : (
                            <div className={styles.placeholder}>
                                <span>{portfolio.title.charAt(0)}</span>
                            </div>
                        )}
                        <div className={styles.imageOverlay}>
                            <span className={styles.flipHint}>
                                <RotateCcw size={16} />
                                클릭하여 상세보기
                            </span>
                        </div>
                    </div>
                    <div className={styles.frontContent}>
                        <div className={styles.meta}>
                            <span className={styles.devType}>{portfolio.dev_type}</span>
                            {portfolio.category && (
                                <span className={styles.category}>{portfolio.category}</span>
                            )}
                        </div>
                        <h3 className={styles.title}>{portfolio.title}</h3>
                        {portfolio.company_name && (
                            <p className={styles.company}>
                                <Briefcase size={14} />
                                {portfolio.company_name}
                            </p>
                        )}
                        <p className={styles.summary}>{portfolio.summary}</p>
                        <div className={styles.footer}>
                            {period && (
                                <span className={styles.period}>
                                    <Calendar size={14} />
                                    {period}
                                </span>
                            )}
                            {portfolio.tags.length > 0 && (
                                <div className={styles.tags}>
                                    {portfolio.tags.slice(0, 3).map((tag, i) => (
                                        <span key={i} className={styles.tag}>{tag}</span>
                                    ))}
                                    {portfolio.tags.length > 3 && (
                                        <span className={styles.tagMore}>+{portfolio.tags.length - 3}</span>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* 뒷면 */}
                <div className={styles.flipCardBack}>
                    <div className={styles.backContent}>
                        <div className={styles.backHeader}>
                            <span className={styles.devType}>{portfolio.dev_type}</span>
                            <button
                                className={styles.flipBackBtn}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsFlipped(false);
                                }}
                            >
                                <RotateCcw size={16} />
                            </button>
                        </div>
                        <h3 className={styles.backTitle}>{portfolio.title}</h3>
                        {portfolio.company_name && (
                            <p className={styles.backCompany}>{portfolio.company_name}</p>
                        )}
                        <div className={styles.description}>
                            {portfolio.description || portfolio.summary}
                        </div>
                        {portfolio.participation_field && (
                            <div className={styles.backMeta}>
                                <span className={styles.metaLabel}>참여 분야</span>
                                <span className={styles.metaValue}>{portfolio.participation_field}</span>
                            </div>
                        )}
                        {portfolio.participation_rate && (
                            <div className={styles.backMeta}>
                                <span className={styles.metaLabel}>기여도</span>
                                <span className={styles.metaValue}>{portfolio.participation_rate}%</span>
                            </div>
                        )}
                        {portfolio.tags.length > 0 && (
                            <div className={styles.backTags}>
                                {portfolio.tags.map((tag, i) => (
                                    <span key={i} className={styles.tag}>{tag}</span>
                                ))}
                            </div>
                        )}
                        {portfolio.video_url && (
                            <a
                                href={portfolio.video_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.externalLink}
                                onClick={(e) => e.stopPropagation()}
                            >
                                데모 보기 <ExternalLink size={14} />
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
