'use client';

import { useState, useEffect } from 'react';
import { Service, IconType } from '@/types';
import { Save, Loader2, Check, Plus, Trash2, Code, Brain, Rocket, Shield, Zap, Layout, Database, Cloud } from 'lucide-react';
import styles from './admin-components.module.css';

const ICON_OPTIONS: { value: IconType; label: string; icon: React.ReactNode }[] = [
    { value: 'code', label: 'Code', icon: <Code size={16} /> },
    { value: 'brain', label: 'Brain', icon: <Brain size={16} /> },
    { value: 'rocket', label: 'Rocket', icon: <Rocket size={16} /> },
    { value: 'shield', label: 'Shield', icon: <Shield size={16} /> },
    { value: 'zap', label: 'Zap', icon: <Zap size={16} /> },
    { value: 'layout', label: 'Layout', icon: <Layout size={16} /> },
    { value: 'database', label: 'Database', icon: <Database size={16} /> },
    { value: 'cloud', label: 'Cloud', icon: <Cloud size={16} /> },
];

export default function ServicesEditor() {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [savingId, setSavingId] = useState<string | null>(null);
    const [savedId, setSavedId] = useState<string | null>(null);
    const [isCreating, setIsCreating] = useState(false);

    const [newService, setNewService] = useState<Partial<Service>>({
        title: '',
        description: '',
        icon: 'code',
        highlights: [],
        order: 0,
    });
    const [newHighlight, setNewHighlight] = useState('');

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            const res = await fetch('/api/services');
            const json = await res.json();
            if (json.success) setServices(json.data);
        } catch (error) {
            console.error('Failed to fetch services:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (id: string, data: Partial<Service>) => {
        setSavingId(id);
        try {
            const response = await fetch(`/api/services/${id}`, {
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
        if (!newService.title) return;
        setIsCreating(true);
        try {
            const response = await fetch('/api/services', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...newService, order: services.length }),
            });

            if (response.ok) {
                const json = await response.json();
                setServices([...services, json.data]);
                setNewService({ title: '', description: '', icon: 'code', highlights: [], order: 0 });
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
            await fetch(`/api/services/${id}`, { method: 'DELETE' });
            setServices(services.filter(s => s.id !== id));
        } catch (error) {
            console.error('Delete failed:', error);
        }
    };

    const handleLocalChange = (id: string, field: keyof Service, value: any) => {
        setServices(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
    };

    const addHighlight = (id: string, highlight: string) => {
        if (!highlight.trim()) return;
        const service = services.find(s => s.id === id);
        if (service && !service.highlights.includes(highlight)) {
            handleLocalChange(id, 'highlights', [...service.highlights, highlight]);
        }
    };

    const removeHighlight = (id: string, highlight: string) => {
        const service = services.find(s => s.id === id);
        if (service) {
            handleLocalChange(id, 'highlights', service.highlights.filter(h => h !== highlight));
        }
    };

    if (loading) return <div className={styles.emptyState}>Loading services...</div>;

    return (
        <div className={styles.companyEditor}>
            {/* Existing Services */}
            {services.map((service) => (
                <div key={service.id} className={styles.formSection}>
                    <div className={styles.cardHeader}>
                        <h3>{service.title || '새 서비스'}</h3>
                        <button onClick={() => handleDelete(service.id)} className={`${styles.iconBtn} ${styles.deleteBtn}`}>
                            <Trash2 size={16} />
                        </button>
                    </div>

                    <div className={styles.inputGroup}>
                        <label>서비스명</label>
                        <input
                            type="text"
                            value={service.title}
                            onChange={(e) => handleLocalChange(service.id, 'title', e.target.value)}
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label>설명</label>
                        <textarea
                            rows={3}
                            value={service.description}
                            onChange={(e) => handleLocalChange(service.id, 'description', e.target.value)}
                        />
                    </div>

                    <div className={styles.row}>
                        <div className={styles.inputGroup}>
                            <label>아이콘</label>
                            <select
                                value={service.icon}
                                onChange={(e) => handleLocalChange(service.id, 'icon', e.target.value)}
                            >
                                {ICON_OPTIONS.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>
                        <div className={styles.inputGroup}>
                            <label>순서</label>
                            <input
                                type="number"
                                value={service.order}
                                onChange={(e) => handleLocalChange(service.id, 'order', parseInt(e.target.value))}
                            />
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label>강점 태그</label>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <input
                                type="text"
                                placeholder="강점 입력 후 Enter"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        addHighlight(service.id, (e.target as HTMLInputElement).value);
                                        (e.target as HTMLInputElement).value = '';
                                    }
                                }}
                            />
                        </div>
                        <div className={styles.tagGrid}>
                            {service.highlights.map(h => (
                                <span key={h} className={styles.tagBadge}>
                                    {h}
                                    <span onClick={() => removeHighlight(service.id, h)} style={{ cursor: 'pointer' }}>×</span>
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className={styles.formActions}>
                        <button
                            className={styles.submitBtn}
                            onClick={() => handleUpdate(service.id, service)}
                            disabled={savingId === service.id}
                        >
                            {savingId === service.id ? <Loader2 className={styles.spinner} size={18} /> : (
                                savedId === service.id ? <Check size={18} /> : <Save size={18} />
                            )}
                            {savingId === service.id ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </div>
            ))}

            {/* Add New Service */}
            <div className={styles.formSection}>
                <div className={styles.cardHeader}>
                    <h3>새 서비스 추가</h3>
                </div>

                <div className={styles.inputGroup}>
                    <label>서비스명</label>
                    <input
                        type="text"
                        value={newService.title}
                        onChange={(e) => setNewService({ ...newService, title: e.target.value })}
                        placeholder="예: AI 자동화 솔루션"
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label>설명</label>
                    <textarea
                        rows={3}
                        value={newService.description}
                        onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                        placeholder="서비스에 대한 설명을 입력하세요"
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label>아이콘</label>
                    <select
                        value={newService.icon}
                        onChange={(e) => setNewService({ ...newService, icon: e.target.value as IconType })}
                    >
                        {ICON_OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>

                <div className={styles.formActions}>
                    <button
                        className={styles.submitBtn}
                        onClick={handleCreate}
                        disabled={isCreating || !newService.title}
                    >
                        {isCreating ? <Loader2 className={styles.spinner} size={18} /> : <Plus size={18} />}
                        {isCreating ? 'Adding...' : 'Add Service'}
                    </button>
                </div>
            </div>
        </div>
    );
}
