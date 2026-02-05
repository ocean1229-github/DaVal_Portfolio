'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Portfolio } from '@/types';
import { Save, X, Plus } from 'lucide-react';
import ImageUpload from './ImageUpload';
import styles from './admin-components.module.css';

interface PortfolioFormProps {
    initialData?: Portfolio;
    isEdit?: boolean;
}

export default function PortfolioForm({ initialData, isEdit = false }: PortfolioFormProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<Partial<Portfolio>>(
        initialData || {
            title: '',
            slug: '',
            project_start_date: '',
            project_end_date: '',
            participation_field: '',
            participation_rate: 100,
            dev_type: 'web',
            category: '',
            tags: [],
            summary: '',
            description: '',
            client_logo_url: '',
            thumbnail_url: '',
            video_url: '',
            video_type: null,
            is_published: false,
            display_order: 0,
        }
    );

    const [newTag, setNewTag] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target as HTMLInputElement;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
        }));
    };

    const handleAddTag = () => {
        if (newTag && !formData.tags?.includes(newTag)) {
            setFormData((prev) => ({
                ...prev,
                tags: [...(prev.tags || []), newTag],
            }));
            setNewTag('');
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setFormData((prev) => ({
            ...prev,
            tags: prev.tags?.filter((tag) => tag !== tagToRemove) || [],
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const url = isEdit ? `/api/portfolios/${initialData?.id}` : '/api/portfolios';
            const method = isEdit ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                router.push('/admin/portfolio');
                router.refresh();
            } else {
                const errorData = await response.json();
                alert(`저장에 실패했습니다: ${errorData.error}`);
            }
        } catch (error) {
            console.error('Error saving portfolio:', error);
            alert('오류가 발생했습니다.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formSection}>
                <h3>기본 정보</h3>
                <div className={styles.inputGroup}>
                    <label>프로젝트 제목</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title || ''}
                        onChange={handleChange}
                        required
                        placeholder="예: AI 기반 이커머스 추천 시스템"
                    />
                </div>
                <div className={styles.inputGroup}>
                    <label>슬러그 (URL용)</label>
                    <input
                        type="text"
                        name="slug"
                        value={formData.slug || ''}
                        onChange={handleChange}
                        required
                        placeholder="예: ai-ecommerce-recommendation"
                    />
                </div>
                <div className={styles.row}>
                    <div className={styles.inputGroup}>
                        <label>시작일</label>
                        <input
                            type="date"
                            name="project_start_date"
                            value={formData.project_start_date || ''}
                            onChange={handleChange}
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label>종료일 (비워두면 진행 중)</label>
                        <input
                            type="date"
                            name="project_end_date"
                            value={formData.project_end_date || ''}
                            onChange={handleChange}
                        />
                    </div>
                </div>
            </div>

            <div className={styles.formSection}>
                <h3>상세 내용</h3>
                <div className={styles.row}>
                    <div className={styles.inputGroup}>
                        <label>참여 분야</label>
                        <input
                            type="text"
                            name="participation_field"
                            value={formData.participation_field || ''}
                            onChange={handleChange}
                            placeholder="예: 기획, 디자인, 풀스택 개발"
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label>참여율 (%)</label>
                        <input
                            type="number"
                            name="participation_rate"
                            value={formData.participation_rate || 0}
                            onChange={handleChange}
                            min="0"
                            max="100"
                        />
                    </div>
                </div>
                <div className={styles.row}>
                    <div className={styles.inputGroup}>
                        <label>개발 유형</label>
                        <select
                            name="dev_type"
                            value={formData.dev_type || 'web'}
                            onChange={handleChange}
                        >
                            <option value="web">Web</option>
                            <option value="app">App</option>
                            <option value="ai">AI</option>
                            <option value="etc">Etc</option>
                        </select>
                    </div>
                    <div className={styles.inputGroup}>
                        <label>카테고리</label>
                        <input
                            type="text"
                            name="category"
                            value={formData.category || ''}
                            onChange={handleChange}
                            placeholder="예: E-commerce, SaaS"
                        />
                    </div>
                </div>
                <div className={styles.inputGroup}>
                    <label>태그</label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <input
                            type="text"
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                            placeholder="태그 입력 후 추가"
                            className={styles.input}
                        />
                        <button type="button" onClick={handleAddTag} className={styles.iconBtn}>
                            <Plus size={20} />
                        </button>
                    </div>
                    <div className={styles.tagGrid}>
                        {formData.tags?.map((tag) => (
                            <span key={tag} className={styles.tagBadge}>
                                {tag}
                                <X size={14} onClick={() => handleRemoveTag(tag)} />
                            </span>
                        ))}
                    </div>
                </div>
                <div className={styles.inputGroup}>
                    <label>요약 설명</label>
                    <textarea
                        name="summary"
                        value={formData.summary || ''}
                        onChange={handleChange}
                        rows={2}
                        placeholder="프로젝트의 핵심 내용을 간단히 요약하세요."
                    />
                </div>
                <div className={styles.inputGroup}>
                    <label>상세 설명</label>
                    <textarea
                        name="description"
                        value={formData.description || ''}
                        onChange={handleChange}
                        rows={6}
                        placeholder="상세 기술 스택, 담당 업무, 성과 등을 입력하세요."
                    />
                </div>
            </div>

            <div className={styles.formSection}>
                <h3>미디어 및 상태</h3>
                <div className={styles.row}>
                    <ImageUpload
                        label="클라이언트 로고"
                        value={formData.client_logo_url || null}
                        onChange={(url) => setFormData(prev => ({ ...prev, client_logo_url: url }))}
                        bucket="images"
                    />
                    <ImageUpload
                        label="대표 이미지 (Thumbnail)"
                        value={formData.thumbnail_url || null}
                        onChange={(url) => setFormData(prev => ({ ...prev, thumbnail_url: url }))}
                        bucket="images"
                    />
                </div>
                <div className={styles.inputGroup}>
                    <label>소개 영상 URL (유튜브 등)</label>
                    <input
                        type="text"
                        name="video_url"
                        value={formData.video_url || ''}
                        onChange={handleChange}
                        placeholder="https://..."
                    />
                </div>
                <div className={styles.row}>
                    <div className={styles.inputGroup}>
                        <label>정렬 순서 (낮을수록 앞)</label>
                        <input
                            type="number"
                            name="display_order"
                            value={formData.display_order || 0}
                            onChange={handleChange}
                        />
                    </div>
                    <div className={styles.inputGroup} style={{ justifyContent: 'center' }}>
                        <label className={styles.checkboxLabel}>
                            <input
                                type="checkbox"
                                name="is_published"
                                checked={formData.is_published || false}
                                onChange={(e) => setFormData(prev => ({ ...prev, is_published: e.target.checked }))}
                            />
                            공개 게시물로 설정
                        </label>
                    </div>
                </div>
            </div>

            <div className={styles.formActions}>
                <button
                    type="button"
                    onClick={() => router.back()}
                    className={styles.cancelBtn}
                >
                    취소
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={styles.submitBtn}
                >
                    <Save size={20} />
                    {isSubmitting ? '저장 중...' : (isEdit ? '수정 완료' : '등록하기')}
                </button>
            </div>
        </form>
    );
}
