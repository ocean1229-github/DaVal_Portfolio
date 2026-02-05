'use client';

import { useState, useEffect } from 'react';
import { Portfolio } from '@/types';
import { Edit, Trash2, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import styles from './admin-components.module.css';

export default function PortfolioTable() {
    const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchPortfolios = async () => {
        try {
            const res = await fetch('/api/portfolios');
            const json = await res.json();
            if (json.success) {
                setPortfolios(json.data);
            }
        } catch (err) {
            console.error('Failed to fetch portfolios', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPortfolios();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm('정말 삭제하시겠습니까?')) return;

        try {
            const res = await fetch(`/api/portfolios/${id}`, {
                method: 'DELETE',
            });
            const json = await res.json();
            if (json.success) {
                setPortfolios(portfolios.filter(p => p.id !== id));
            } else {
                alert('삭제 실패: ' + json.error);
            }
        } catch (err) {
            alert('삭제 중 오류가 발생했습니다.');
        }
    };

    if (loading) return <div>Loading portfolios...</div>;

    if (portfolios.length === 0) {
        return (
            <div className={styles.emptyState}>
                등록된 포트폴리오가 없습니다.
            </div>
        );
    }

    return (
        <div className={styles.tableContainer}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>썸네일</th>
                        <th>회사명</th>
                        <th>프로젝트 요약</th>
                        <th>분류</th>
                        <th>상태</th>
                        <th>관리</th>
                    </tr>
                </thead>
                <tbody>
                    {portfolios.map((portfolio) => (
                        <tr key={portfolio.id}>
                            <td>
                                {portfolio.thumbnail_url ? (
                                    <img src={portfolio.thumbnail_url} alt={portfolio.title} className={styles.thumbnail} />
                                ) : (
                                    <div className={styles.thumbnail} />
                                )}
                            </td>
                            <td>{portfolio.company_name || '-'}</td>
                            <td>{portfolio.title}</td>
                            <td>{portfolio.dev_type.toUpperCase()} / {portfolio.category}</td>
                            <td>
                                <span className={`${styles.badge} ${portfolio.is_published ? styles.published : styles.draft}`}>
                                    {portfolio.is_published ? '공개' : '초안'}
                                </span>
                            </td>
                            <td>
                                <div className={styles.actions}>
                                    <Link href={`/portfolio/${portfolio.slug}`} target="_blank" className={styles.iconBtn}>
                                        <ExternalLink size={18} />
                                    </Link>
                                    <Link href={`/admin/portfolio/${portfolio.id}`} className={styles.iconBtn}>
                                        <Edit size={18} />
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(portfolio.id)}
                                        className={`${styles.iconBtn} ${styles.deleteBtn}`}
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
