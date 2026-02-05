import ServicesEditor from '@/components/admin/ServicesEditor';
import styles from '../../admin.module.css';

export default function ServicesAdminPage() {
    return (
        <div>
            <header className={styles.header}>
                <h1>서비스 및 강점 관리</h1>
                <p>DaVal의 주요 업무 분야와 강점을 편집합니다.</p>
            </header>

            <ServicesEditor />
        </div>
    );
}
