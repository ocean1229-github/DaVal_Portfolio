'use client';

import { useState } from 'react';

const SUPPORT_FIELDS = [
    { label: '회사명', value: 'DaVal (데벨)' },
    { label: '대표자', value: '강두현' },
    { label: '연락처', value: '010-9805-8736' },
    { label: '이메일', value: 'business@epqpf.com' },
    { label: '포트폴리오', value: 'https://portfolio.da-val.com' },
    { label: '홈페이지', value: 'https://www.da-val.com' },
];

export default function SupportTool() {
    const [copied, setCopied] = useState<string | null>(null);

    const handleCopy = async (label: string, value: string) => {
        await navigator.clipboard.writeText(value);
        setCopied(label);
        setTimeout(() => setCopied(null), 2000);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '24px' }}>
            {SUPPORT_FIELDS.map((field) => (
                <div
                    key={field.label}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px 16px',
                        background: 'rgba(255,255,255,0.05)',
                        borderRadius: '8px',
                        border: '1px solid rgba(255,255,255,0.1)',
                    }}
                >
                    <div>
                        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>
                            {field.label}
                        </div>
                        <div style={{ fontSize: '14px' }}>{field.value}</div>
                    </div>
                    <button
                        onClick={() => handleCopy(field.label, field.value)}
                        style={{
                            padding: '6px 14px',
                            fontSize: '13px',
                            borderRadius: '6px',
                            background: copied === field.label ? 'rgba(16,185,129,0.2)' : 'rgba(139,92,246,0.15)',
                            color: copied === field.label ? '#10b981' : '#a78bfa',
                            border: '1px solid',
                            borderColor: copied === field.label ? 'rgba(16,185,129,0.3)' : 'rgba(139,92,246,0.3)',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                        }}
                    >
                        {copied === field.label ? 'Copied!' : 'Copy'}
                    </button>
                </div>
            ))}
        </div>
    );
}
