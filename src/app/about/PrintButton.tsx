'use client';

import { Download } from 'lucide-react';
import styles from './about.module.css';

export default function PrintButton() {
    const handlePrint = () => {
        window.print();
    };

    return (
        <button className={styles.printBtn} onClick={handlePrint} title="PDF로 저장">
            <Download size={18} />
            <span>PDF 다운로드</span>
        </button>
    );
}
