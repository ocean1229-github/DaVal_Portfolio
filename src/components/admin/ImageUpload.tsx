'use client';

import { useState } from 'react';
import { X, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';
import styles from './admin-components.module.css';

interface ImageUploadProps {
    value: string | null;
    onChange: (url: string | null) => void;
    label: string;
    bucket?: string;
}

export default function ImageUpload({ value, onChange, label }: ImageUploadProps) {
    const [inputUrl, setInputUrl] = useState(value || '');
    const [imageError, setImageError] = useState(false);

    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const url = e.target.value;
        setInputUrl(url);
        setImageError(false);
        onChange(url || null);
    };

    const removeImage = () => {
        setInputUrl('');
        setImageError(false);
        onChange(null);
    };

    const handleImageError = () => {
        setImageError(true);
    };

    return (
        <div className={styles.uploadGroup}>
            <label>{label}</label>
            <div className={styles.urlInputWrapper}>
                <LinkIcon size={16} className={styles.urlIcon} />
                <input
                    type="url"
                    value={inputUrl}
                    onChange={handleUrlChange}
                    placeholder="이미지 URL을 입력하세요 (https://...)"
                    className={styles.urlInput}
                />
                {inputUrl && (
                    <button type="button" onClick={removeImage} className={styles.clearBtn}>
                        <X size={16} />
                    </button>
                )}
            </div>

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
