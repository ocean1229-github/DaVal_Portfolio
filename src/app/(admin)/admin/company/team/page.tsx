import TeamEditor from '@/components/admin/TeamEditor';
import styles from '../../admin.module.css';

export default function TeamAdminPage() {
    return (
        <div>
            <header className={styles.header}>
                <h1>팀 소개 관리</h1>
                <p>DaVal 팀원들의 정보를 편집합니다.</p>
            </header>

            <TeamEditor />
        </div>
    );
}
