import CompanyEditor from '@/components/admin/CompanyEditor';
import styles from '../admin.module.css';

export default function CompanyAdminPage() {
    return (
        <div>
            <header className={styles.header}>
                <h1>회사 정보 관리</h1>
                <p>홈페이지와 소개 페이지에 표시될 회사 정보를 편집합니다.</p>
            </header>

            <CompanyEditor />
        </div>
    );
}
