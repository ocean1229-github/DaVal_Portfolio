'use client';

import { useState, useEffect } from 'react';
import { CompanyInfo, SectionType } from '@/types';
import { Save, Loader2, Check, Plus, Trash2 } from 'lucide-react';
import ImageUpload from './ImageUpload';
import styles from './admin-components.module.css';

const SECTION_OPTIONS: { value: SectionType; label: string }[] = [
    { value: 'hero', label: 'Hero (메인 배너)' },
    { value: 'about', label: 'About (회사 소개)' },
    { value: 'vision', label: 'Vision (비전/미션)' },
    { value: 'history', label: 'History (연혁)' },
];

export default function CompanyEditor() {
    const [sections, setSections] = useState<CompanyInfo[]>([]);
    const [loading, setLoading] = useState(true);
    const [savingId, setSavingId] = useState<string | null>(null);
    const [savedId, setSavedId] = useState<string | null>(null);
    const [isCreating, setIsCreating] = useState(false);

    const [newSection, setNewSection] = useState<Partial<CompanyInfo>>({
        section: 'about',
        title: '',
        content: '',
        image_url: null,
        order: 0,
    });

    useEffect(() => {
        fetchSections();
    }, []);

    const fetchSections = async () => {
        try {
            const res = await fetch('/api/company');
            const json = await res.json();
            if (json.success) setSections(json.data);
        } catch (error) {
            console.error('Failed to fetch company info:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (id: string, data: Partial<CompanyInfo>) => {
        setSavingId(id);
        try {
            const response = await fetch(`/api/company/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                setSavedId(id);
                setTimeout(() => setSavedId(null), 2000);
            }
        } catch (error) {
            console.error('Update failed:', error);
        } finally {
            setSavingId(null);
        }
    };

    const handleCreate = async () => {
        if (!newSection.title) return;
        setIsCreating(true);
        try {
            const response = await fetch('/api/company', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...newSection, order: sections.length }),
            });

            if (response.ok) {
                const json = await response.json();
                setSections([...sections, json.data]);
                setNewSection({ section: 'about', title: '', content: '', image_url: null, order: 0 });
            }
        } catch (error) {
            console.error('Create failed:', error);
        } finally {
            setIsCreating(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('정말 삭제하시겠습니까?')) return;
        try {
            await fetch(`/api/company/${id}`, { method: 'DELETE' });
            setSections(sections.filter(s => s.id !== id));
        } catch (error) {
            console.error('Delete failed:', error);
        }
    };

    const handleLocalChange = (id: string, field: keyof CompanyInfo, value: any) => {
        setSections(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
    };

    if (loading) return <div className={styles.emptyState}>Loading company data...</div>;

    return (
        <div className={styles.companyEditor}>
            {/* Existing Sections */}
            {sections.map((section) => (
                <div key={section.id} className={styles.formSection}>
                    <div className={styles.cardHeader}>
                        <h3>{SECTION_OPTIONS.find(o => o.value === section.section)?.label || section.section}</h3>
                        <button onClick={() => handleDelete(section.id)} className={`${styles.iconBtn} ${styles.deleteBtn}`}>
                            <Trash2 size={16} />
                        </button>
                    </div>

                    <div className={styles.row}>
                        <div className={styles.inputGroup}>
                            <label>섹션 타입</label>
                            <select
                                value={section.section}
                                onChange={(e) => handleLocalChange(section.id, 'section', e.target.value)}
                            >
                                {SECTION_OPTIONS.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>
                        <div className={styles.inputGroup}>
                            <label>순서</label>
                            <input
                                type="number"
                                value={section.order}
                                onChange={(e) => handleLocalChange(section.id, 'order', parseInt(e.target.value))}
                            />
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label>제목</label>
                        <input
                            type="text"
                            value={section.title}
                            onChange={(e) => handleLocalChange(section.id, 'title', e.target.value)}
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label>내용</label>
                        <textarea
                            rows={4}
                            value={section.content}
                            onChange={(e) => handleLocalChange(section.id, 'content', e.target.value)}
                        />
                    </div>

                    <ImageUpload
                        label="이미지"
                        value={section.image_url}
                        onChange={(url) => handleLocalChange(section.id, 'image_url', url)}
                    />

                    <div className={styles.formActions}>
                        <button
                            className={styles.submitBtn}
                            onClick={() => handleUpdate(section.id, section)}
                            disabled={savingId === section.id}
                        >
                            {savingId === section.id ? <Loader2 className={styles.spinner} size={18} /> : (
                                savedId === section.id ? <Check size={18} /> : <Save size={18} />
                            )}
                            {savingId === section.id ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </div>
            ))}

            {/* Add New Section */}
            <div className={styles.formSection}>
                <div className={styles.cardHeader}>
                    <h3>새 섹션 추가</h3>
                </div>

                <div className={styles.row}>
                    <div className={styles.inputGroup}>
                        <label>섹션 타입</label>
                        <select
                            value={newSection.section}
                            onChange={(e) => setNewSection({ ...newSection, section: e.target.value as SectionType })}
                        >
                            {SECTION_OPTIONS.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className={styles.inputGroup}>
                    <label>제목</label>
                    <input
                        type="text"
                        value={newSection.title}
                        onChange={(e) => setNewSection({ ...newSection, title: e.target.value })}
                        placeholder="섹션 제목을 입력하세요"
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label>내용</label>
                    <textarea
                        rows={4}
                        value={newSection.content}
                        onChange={(e) => setNewSection({ ...newSection, content: e.target.value })}
                        placeholder="섹션 내용을 입력하세요"
                    />
                </div>

                <div className={styles.formActions}>
                    <button
                        className={styles.submitBtn}
                        onClick={handleCreate}
                        disabled={isCreating || !newSection.title}
                    >
                        {isCreating ? <Loader2 className={styles.spinner} size={18} /> : <Plus size={18} />}
                        {isCreating ? 'Adding...' : 'Add Section'}
                    </button>
                </div>
            </div>
        </div>
    );
}
