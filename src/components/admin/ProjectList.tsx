'use client';

import { useState, useEffect } from 'react';
import { ExternalLink, RefreshCw, Clock, DollarSign, ArrowUpRight } from 'lucide-react';
import styles from './admin-components.module.css';

interface Project {
    platform: 'wishket' | 'freemoa';
    title: string;
    url: string;
    budget: string;
    duration: string;
    status: string;
}

export default function ProjectList() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
    const [activeTab, setActiveTab] = useState<'wishket' | 'freemoa'>('wishket');

    const fetchProjects = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch('/api/projects');
            const json = await res.json();
            if (json.success) {
                setProjects(json.data);
                setLastUpdated(new Date(json.timestamp || new Date()));
            } else {
                setError(json.error || '데이터를 불러오는 데 실패했습니다.');
            }
        } catch (err) {
            console.error('Failed to fetch projects', err);
            setError('네트워크 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <RefreshCw className={styles.spinner} size={24} />
                <p>프로젝트를 수집하고 있습니다...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.errorContainer}>
                <p className={styles.errorMsg}>{error}</p>
                <button onClick={fetchProjects} className={styles.refreshBtn}>
                    <RefreshCw size={16} /> 다시 시도
                </button>
            </div>
        );
    }

    const wishketProjects = projects.filter(p => p.platform === 'wishket');
    const freemoaProjects = projects.filter(p => p.platform === 'freemoa');

    return (
        <div className={styles.projectExplorer}>
            {/* 탭 네비게이션 */}
            <div className={styles.tabNav}>
                <button
                    className={`${styles.tabBtn} ${activeTab === 'wishket' ? styles.active : ''}`}
                    onClick={() => setActiveTab('wishket')}
                >
                    위시켓 <span className={styles.tabCount}>{wishketProjects.length}</span>
                </button>
                <button
                    className={`${styles.tabBtn} ${activeTab === 'freemoa' ? styles.active : ''}`}
                    onClick={() => setActiveTab('freemoa')}
                >
                    프리모아 <span className={styles.tabCount}>{freemoaProjects.length > 0 ? freemoaProjects.length : '직접확인'}</span>
                </button>
            </div>

            {/* 위시켓 탭 */}
            {activeTab === 'wishket' && (
                <>
                    <div className={styles.explorerHeader}>
                        <div className={styles.headerInfo}>
                            <span className={styles.projectCount}>
                                외주(도급) 프로젝트 <strong>{wishketProjects.length}</strong>개
                            </span>
                            {lastUpdated && (
                                <p className={styles.lastUpdated}>
                                    업데이트: {lastUpdated.toLocaleTimeString()}
                                </p>
                            )}
                        </div>
                        <button onClick={fetchProjects} className={styles.refreshBtn} disabled={loading}>
                            <RefreshCw size={16} /> 새로고침
                        </button>
                    </div>

                    <div className={styles.projectGrid}>
                        {wishketProjects.length === 0 ? (
                            <div className={styles.emptyState}>위시켓 프로젝트를 불러오는 중...</div>
                        ) : (
                            wishketProjects.map((project, idx) => (
                                <div key={`wishket-${idx}`} className={styles.projectCard}>
                                    <div className={styles.cardHeader}>
                                        <span className={`${styles.platformBadge} ${styles.wishket}`}>
                                            위시켓
                                        </span>
                                        <span className={styles.statusBadge}>{project.status}</span>
                                    </div>
                                    <h3 className={styles.projectTitle}>{project.title}</h3>
                                    <div className={styles.projectDetails}>
                                        <div className={styles.detailItem}>
                                            <DollarSign size={14} />
                                            <span>{project.budget}</span>
                                        </div>
                                        <div className={styles.detailItem}>
                                            <Clock size={14} />
                                            <span>{project.duration}</span>
                                        </div>
                                    </div>
                                    <a
                                        href={project.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={styles.applyBtn}
                                    >
                                        상세 보기 <ExternalLink size={14} />
                                    </a>
                                </div>
                            ))
                        )}
                    </div>
                </>
            )}

            {/* 프리모아 탭 */}
            {activeTab === 'freemoa' && (
                <>
                    <div className={styles.explorerHeader}>
                        <div className={styles.headerInfo}>
                            <span className={styles.projectCount}>
                                도급(원격) 프로젝트
                            </span>
                            <p className={styles.lastUpdated}>
                                프리모아는 보안 정책으로 자동 수집이 제한됩니다
                            </p>
                        </div>
                    </div>

                    {freemoaProjects.length > 0 ? (
                        <div className={styles.projectGrid}>
                            {freemoaProjects.map((project, idx) => (
                                <div key={`freemoa-${idx}`} className={styles.projectCard}>
                                    <div className={styles.cardHeader}>
                                        <span className={`${styles.platformBadge} ${styles.freemoa}`}>
                                            프리모아
                                        </span>
                                        <span className={styles.statusBadge}>{project.status}</span>
                                    </div>
                                    <h3 className={styles.projectTitle}>{project.title}</h3>
                                    <div className={styles.projectDetails}>
                                        <div className={styles.detailItem}>
                                            <DollarSign size={14} />
                                            <span>{project.budget}</span>
                                        </div>
                                        <div className={styles.detailItem}>
                                            <Clock size={14} />
                                            <span>{project.duration}</span>
                                        </div>
                                    </div>
                                    <a
                                        href={project.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={styles.applyBtn}
                                    >
                                        상세 보기 <ExternalLink size={14} />
                                    </a>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className={styles.freemoaDirectAccess}>
                            <div className={styles.directAccessCard}>
                                <h3>프리모아 프로젝트 확인하기</h3>
                                <p>프리모아는 보안 정책으로 인해 서버에서 직접 데이터를 가져올 수 없습니다.</p>
                                <p>아래 버튼을 클릭하여 도급(원격) 필터가 적용된 프로젝트 목록을 확인하세요.</p>
                                <a
                                    href="https://www.freemoa.net/m4/s41?workType=1"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.freemoaLinkBtn}
                                >
                                    <ArrowUpRight size={18} />
                                    프리모아에서 도급(원격) 프로젝트 보기
                                </a>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
