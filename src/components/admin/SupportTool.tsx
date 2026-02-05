'use client';

import { useState, useEffect } from 'react';
import { Portfolio } from '@/types';
import { Copy, Check } from 'lucide-react';
import styles from './admin-components.module.css';

export default function SupportTool() {
    const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
    const [selectedId, setSelectedId] = useState<string>('');
    const [copiedField, setCopiedField] = useState<string | null>(null);

    useEffect(() => {
        fetch('/api/portfolios')
            .then(res => res.json())
            .then(json => {
                if (json.success) setPortfolios(json.data);
            });
    }, []);

    const selected = portfolios.find(p => p.id === selectedId);

    const copyToClipboard = (text: string, field: string) => {
        navigator.clipboard.writeText(text);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2000);
    };

    const getPartnerFormat = (p: Portfolio) => {
        return `[${p.title}]\n- 기간: ${p.project_start_date?.split('T')[0]} ~ ${p.project_end_date?.split('T')[0]}\n- 역할: ${p.participation_field} (${p.participation_rate}%)\n- 요약: ${p.summary}\n- 기술: ${p.tags.join(', ')}`;
    };

    return (
        <div className={styles.supportTool}>
            <div className={styles.inputGroup}>
                <label>포트폴리오 선택</label>
                <select value={selectedId} onChange={e => setSelectedId(e.target.value)}>
                    <option value="">선택하세요</option>
                    {portfolios.map(p => (
                        <option key={p.id} value={p.id}>{p.title}</option>
                    ))}
                </select>
            </div>

            {selected && (
                <div className={styles.copyGrid}>
                    <div className={styles.copyCard}>
                        <div className={styles.cardHeader}>
                            <h3>제목</h3>
                            <button onClick={() => copyToClipboard(selected.title, 'title')}>
                                {copiedField === 'title' ? <Check size={16} /> : <Copy size={16} />}
                            </button>
                        </div>
                        <p>{selected.title}</p>
                    </div>

                    <div className={styles.copyCard}>
                        <div className={styles.cardHeader}>
                            <h3>요약 (파트너 정보용)</h3>
                            <button onClick={() => copyToClipboard(selected.summary || '', 'summary')}>
                                {copiedField === 'summary' ? <Check size={16} /> : <Copy size={16} />}
                            </button>
                        </div>
                        <p className={styles.multiline}>{selected.summary}</p>
                    </div>

                    <div className={styles.copyCard}>
                        <div className={styles.cardHeader}>
                            <h3>표준 파트너 포맷</h3>
                            <button onClick={() => copyToClipboard(getPartnerFormat(selected), 'format')}>
                                {copiedField === 'format' ? <Check size={16} /> : <Copy size={16} />}
                            </button>
                        </div>
                        <pre className={styles.preFormat}>
                            {getPartnerFormat(selected)}
                        </pre>
                    </div>
                </div>
            )}
        </div>
    );
}
