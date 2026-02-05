import SupportTool from '@/components/admin/SupportTool';
import styles from '../admin.module.css';

export default function SupportToolPage() {
    return (
        <div>
            <header className={styles.header}>
                <h1>Partner Support Tool</h1>
                <p>위시켓, 프리모아 지원 시 필요한 정보를 빠르게 복사할 수 있습니다.</p>
            </header>

            <SupportTool />
        </div>
    );
}
