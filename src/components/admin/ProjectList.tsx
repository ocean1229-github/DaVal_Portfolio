'use client';

import { useState, useEffect } from 'react';
import { ExternalLink, RefreshCw, Clock, DollarSign } from 'lucide-react';
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

    const wishketCount = projects.filter(p => p.platform === 'wishket').length;
    const freemoaCount = projects.filter(p => p.platform === 'freemoa').length;

    return (
        <div className={styles.projectExplorer}>
            <div className={styles.explorerHeader}>
                <div className={styles.headerInfo}>
                    <span className={styles.projectCount}>
                        위시켓 <strong>{wishketCount}</strong>개
                        {freemoaCount > 0 && ` • 프리모아 ${freemoaCount}개`}
                    </span>
                    {lastUpdated && (
                        <p className={styles.lastUpdated}>
                            업데이트: {lastUpdated.toLocaleTimeString()}
                        </p>
                    )}
                </div>
                <div className={styles.headerActions}>
                    <a
                        href="https://www.freemoa.net/m4/s41"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.linkBtn}
                    >
                        프리모아 직접 방문 <ExternalLink size={14} />
                    </a>
                    <button onClick={fetchProjects} className={styles.refreshBtn} disabled={loading}>
                        <RefreshCw size={16} /> 새로고침
                    </button>
                </div>
            </div>

            <div className={styles.projectGrid}>
                {projects.length === 0 ? (
                    <div className={styles.emptyState}>검색된 프로젝트가 없습니다.</div>
                ) : (
                    projects.map((project, idx) => (
                        <div key={`${project.platform}-${idx}`} className={styles.projectCard}>
                            <div className={styles.cardHeader}>
                                <span className={`${styles.platformBadge} ${styles[project.platform]}`}>
                                    {project.platform === 'wishket' ? '위시켓' : '프리모아'}
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
        </div>
    );
}
