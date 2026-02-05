'use client';

import { useState, useRef } from 'react';
import { X, Link as LinkIcon, Image as ImageIcon, Upload, Loader2 } from 'lucide-react';
import { uploadImage } from '@/lib/supabase';
import styles from './admin-components.module.css';

interface ImageUploadProps {
    value: string | null;
    onChange: (url: string | null) => void;
    label: string;
    bucket?: string;
}

export default function ImageUpload({ value, onChange, label, bucket = 'images' }: ImageUploadProps) {
    const [inputUrl, setInputUrl] = useState(value || '');
    const [imageError, setImageError] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const url = e.target.value;
        setInputUrl(url);
        setImageError(false);
        setUploadError(null);
        onChange(url || null);
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // 파일 크기 체크 (5MB)
        if (file.size > 5 * 1024 * 1024) {
            setUploadError('파일 크기는 5MB 이하여야 합니다.');
            return;
        }

        // 이미지 타입 체크
        if (!file.type.startsWith('image/')) {
            setUploadError('이미지 파일만 업로드 가능합니다.');
            return;
        }

        setIsUploading(true);
        setUploadError(null);

        try {
            const url = await uploadImage(file, bucket);
            if (url) {
                setInputUrl(url);
                setImageError(false);
                onChange(url);
            } else {
                setUploadError('업로드에 실패했습니다.');
            }
        } catch (err) {
            console.error('Upload failed:', err);
            setUploadError('업로드 중 오류가 발생했습니다.');
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const removeImage = () => {
        setInputUrl('');
        setImageError(false);
        setUploadError(null);
        onChange(null);
    };

    const handleImageError = () => {
        setImageError(true);
    };

    return (
        <div className={styles.uploadGroup}>
            <label>{label}</label>

            {/* 파일 업로드 버튼 */}
            <div className={styles.uploadButtonWrapper}>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                    disabled={isUploading}
                />
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className={styles.uploadBtn}
                    disabled={isUploading}
                >
                    {isUploading ? (
                        <>
                            <Loader2 size={16} className={styles.spinner} />
                            업로드 중...
                        </>
                    ) : (
                        <>
                            <Upload size={16} />
                            파일 선택
                        </>
                    )}
                </button>
                <span className={styles.uploadHint}>또는 URL 직접 입력</span>
            </div>

            {/* URL 입력 */}
            <div className={styles.urlInputWrapper}>
                <LinkIcon size={16} className={styles.urlIcon} />
                <input
                    type="url"
                    value={inputUrl}
                    onChange={handleUrlChange}
                    placeholder="이미지 URL을 입력하세요 (https://...)"
                    className={styles.urlInput}
                    disabled={isUploading}
                />
                {inputUrl && (
                    <button type="button" onClick={removeImage} className={styles.clearBtn}>
                        <X size={16} />
                    </button>
                )}
            </div>

            {/* 에러 메시지 */}
            {uploadError && (
                <div className={styles.uploadErrorMsg}>{uploadError}</div>
            )}

            {/* 미리보기 */}
            {inputUrl && (
                <div className={styles.previewWrapper}>
                    {imageError ? (
                        <div className={styles.previewError}>
                            <ImageIcon size={24} />
                            <span>이미지를 불러올 수 없습니다</span>
                        </div>
                    ) : (
                        <img
                            src={inputUrl}
                            alt="Preview"
                            className={styles.previewThumbnail}
                            onError={handleImageError}
                        />
                    )}
                </div>
            )}
        </div>
    );
}
