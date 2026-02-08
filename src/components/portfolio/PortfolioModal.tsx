'use client';

import { useState, useEffect } from 'react';
import { X, Calendar, Briefcase, ExternalLink, Tag } from 'lucide-react';
import { Portfolio } from '@/types';
import styles from './PortfolioModal.module.css';

interface PortfolioModalProps {
    portfolio: Portfolio | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function PortfolioModal({ portfolio, isOpen, onClose }: PortfolioModalProps) {
    const [isFlipped, setIsFlipped] = useState(false);

    // ESC 키로 닫기
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            document.addEventListener('keydown', handleEsc);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = '';
        };
    }, [isOpen, onClose]);

    // 모달 닫을 때 플립 상태 초기화
    useEffect(() => {
        if (!isOpen) setIsFlipped(false);
    }, [isOpen]);

    if (!isOpen || !portfolio) return null;

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
        <div className={styles.overlay} onClick={onClose}>
            {/* Close Button */}
            <button className={styles.closeBtn} onClick={onClose}>
                <X size={24} />
            </button>

            {/* Flip Hint */}
            <div className={styles.hint}>
                {isFlipped ? '다시 클릭하여 앞면 보기' : '카드를 클릭하여 상세 정보 보기'}
            </div>

            {/* Modal Card */}
            <div
                className={`${styles.modalCard} ${isFlipped ? styles.flipped : ''}`}
                onClick={(e) => {
                    e.stopPropagation();
                    setIsFlipped(!isFlipped);
                }}
            >
                <div className={styles.cardInner}>
                    {/* Front */}
                    <div className={styles.cardFront}>
                        <div className={styles.imageSection}>
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
                        </div>
                        <div className={styles.contentSection}>
                            <div className={styles.badges}>
                                <span className={styles.typeBadge}>{portfolio.dev_type}</span>
                                {portfolio.category && (
                                    <span className={styles.categoryBadge}>{portfolio.category}</span>
                                )}
                            </div>
                            <h2 className={styles.title}>{portfolio.title}</h2>
                            {portfolio.company_name && (
                                <p className={styles.company}>
                                    <Briefcase size={16} />
                                    {portfolio.company_name}
                                </p>
                            )}
                            <p className={styles.summary}>{portfolio.summary}</p>
                            <div className={styles.metaRow}>
                                {period && (
                                    <span className={styles.period}>
                                        <Calendar size={14} />
                                        {period}
                                    </span>
                                )}
                            </div>
                            {portfolio.tags.length > 0 && (
                                <div className={styles.tags}>
                                    {portfolio.tags.map((tag, i) => (
                                        <span key={i} className={styles.tag}>
                                            <Tag size={12} />
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Back */}
                    <div className={styles.cardBack}>
                        <div className={styles.backContent}>
                            <div className={styles.backHeader}>
                                <span className={styles.typeBadge}>{portfolio.dev_type}</span>
                            </div>
                            <h2 className={styles.backTitle}>{portfolio.title}</h2>
                            {portfolio.company_name && (
                                <p className={styles.backCompany}>{portfolio.company_name}</p>
                            )}
                            <div className={styles.description}>
                                {portfolio.description || portfolio.summary}
                            </div>
                            <div className={styles.backMetas}>
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
                                {period && (
                                    <div className={styles.backMeta}>
                                        <span className={styles.metaLabel}>프로젝트 기간</span>
                                        <span className={styles.metaValue}>{period}</span>
                                    </div>
                                )}
                            </div>
                            {portfolio.video_url && (
                                <a
                                    href={portfolio.video_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.demoLink}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    데모 보기 <ExternalLink size={16} />
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
