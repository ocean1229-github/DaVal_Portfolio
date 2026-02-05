'use client';

import { useState, useEffect } from 'react';
import { TeamMember, RoleType } from '@/types';
import { Save, Loader2, Check, Plus, Trash2, X } from 'lucide-react';
import ImageUpload from './ImageUpload';
import styles from './admin-components.module.css';

const ROLE_OPTIONS: { value: RoleType; label: string }[] = [
    { value: 'ceo', label: 'CEO' },
    { value: 'cto', label: 'CTO' },
    { value: 'developer', label: 'Developer' },
    { value: 'designer', label: 'Designer' },
    { value: 'manager', label: 'Manager' },
    { value: 'intern', label: 'Intern' },
];

export default function TeamEditor() {
    const [members, setMembers] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [savingId, setSavingId] = useState<string | null>(null);
    const [savedId, setSavedId] = useState<string | null>(null);
    const [isCreating, setIsCreating] = useState(false);

    const [newMember, setNewMember] = useState<Partial<TeamMember>>({
        name: '',
        role: 'developer',
        bio: '',
        photo_url: null,
        skills: [],
        order: 0,
    });
    const [newSkill, setNewSkill] = useState('');

    useEffect(() => {
        fetchMembers();
    }, []);

    const fetchMembers = async () => {
        try {
            const res = await fetch('/api/team');
            const json = await res.json();
            if (json.success) setMembers(json.data);
        } catch (error) {
            console.error('Failed to fetch team members:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (id: string, data: Partial<TeamMember>) => {
        setSavingId(id);
        try {
            const response = await fetch(`/api/team/${id}`, {
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
        if (!newMember.name) return;
        setIsCreating(true);
        try {
            const response = await fetch('/api/team', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...newMember, order: members.length }),
            });

            if (response.ok) {
                const json = await response.json();
                setMembers([...members, json.data]);
                setNewMember({ name: '', role: 'developer', bio: '', photo_url: null, skills: [], order: 0 });
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
            await fetch(`/api/team/${id}`, { method: 'DELETE' });
            setMembers(members.filter(m => m.id !== id));
        } catch (error) {
            console.error('Delete failed:', error);
        }
    };

    const handleLocalChange = (id: string, field: keyof TeamMember, value: any) => {
        setMembers(prev => prev.map(m => m.id === id ? { ...m, [field]: value } : m));
    };

    const addSkill = (id: string, skill: string) => {
        if (!skill.trim()) return;
        const member = members.find(m => m.id === id);
        if (member && !member.skills.includes(skill)) {
            handleLocalChange(id, 'skills', [...member.skills, skill]);
        }
    };

    const removeSkill = (id: string, skill: string) => {
        const member = members.find(m => m.id === id);
        if (member) {
            handleLocalChange(id, 'skills', member.skills.filter(s => s !== skill));
        }
    };

    if (loading) return <div className={styles.emptyState}>Loading team members...</div>;

    return (
        <div className={styles.companyEditor}>
            {/* Existing Members */}
            {members.map((member) => (
                <div key={member.id} className={styles.formSection}>
                    <div className={styles.cardHeader}>
                        <h3>{member.name || '새 팀원'}</h3>
                        <button onClick={() => handleDelete(member.id)} className={`${styles.iconBtn} ${styles.deleteBtn}`}>
                            <Trash2 size={16} />
                        </button>
                    </div>

                    <div className={styles.row}>
                        <div className={styles.inputGroup}>
                            <label>이름</label>
                            <input
                                type="text"
                                value={member.name}
                                onChange={(e) => handleLocalChange(member.id, 'name', e.target.value)}
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>직책</label>
                            <select
                                value={member.role}
                                onChange={(e) => handleLocalChange(member.id, 'role', e.target.value)}
                            >
                                {ROLE_OPTIONS.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label>소개</label>
                        <textarea
                            rows={3}
                            value={member.bio}
                            onChange={(e) => handleLocalChange(member.id, 'bio', e.target.value)}
                        />
                    </div>

                    <ImageUpload
                        label="프로필 사진"
                        value={member.photo_url}
                        onChange={(url) => handleLocalChange(member.id, 'photo_url', url)}
                    />

                    <div className={styles.inputGroup}>
                        <label>보유 기술</label>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <input
                                type="text"
                                placeholder="기술 입력 후 Enter"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        addSkill(member.id, (e.target as HTMLInputElement).value);
                                        (e.target as HTMLInputElement).value = '';
                                    }
                                }}
                            />
                        </div>
                        <div className={styles.tagGrid}>
                            {member.skills.map(skill => (
                                <span key={skill} className={styles.tagBadge}>
                                    {skill}
                                    <X size={14} onClick={() => removeSkill(member.id, skill)} style={{ cursor: 'pointer' }} />
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label>순서</label>
                        <input
                            type="number"
                            value={member.order}
                            onChange={(e) => handleLocalChange(member.id, 'order', parseInt(e.target.value))}
                            style={{ width: '100px' }}
                        />
                    </div>

                    <div className={styles.formActions}>
                        <button
                            className={styles.submitBtn}
                            onClick={() => handleUpdate(member.id, member)}
                            disabled={savingId === member.id}
                        >
                            {savingId === member.id ? <Loader2 className={styles.spinner} size={18} /> : (
                                savedId === member.id ? <Check size={18} /> : <Save size={18} />
                            )}
                            {savingId === member.id ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </div>
            ))}

            {/* Add New Member */}
            <div className={styles.formSection}>
                <div className={styles.cardHeader}>
                    <h3>새 팀원 추가</h3>
                </div>

                <div className={styles.row}>
                    <div className={styles.inputGroup}>
                        <label>이름</label>
                        <input
                            type="text"
                            value={newMember.name}
                            onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                            placeholder="예: 홍길동"
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label>직책</label>
                        <select
                            value={newMember.role}
                            onChange={(e) => setNewMember({ ...newMember, role: e.target.value as RoleType })}
                        >
                            {ROLE_OPTIONS.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className={styles.inputGroup}>
                    <label>소개</label>
                    <textarea
                        rows={3}
                        value={newMember.bio}
                        onChange={(e) => setNewMember({ ...newMember, bio: e.target.value })}
                        placeholder="팀원 소개를 입력하세요"
                    />
                </div>

                <div className={styles.formActions}>
                    <button
                        className={styles.submitBtn}
                        onClick={handleCreate}
                        disabled={isCreating || !newMember.name}
                    >
                        {isCreating ? <Loader2 className={styles.spinner} size={18} /> : <Plus size={18} />}
                        {isCreating ? 'Adding...' : 'Add Member'}
                    </button>
                </div>
            </div>
        </div>
    );
}
