import ProjectList from '@/components/admin/ProjectList';
import styles from '../../admin.module.css';

export default function ProjectsPage() {
    return (
        <div>
            <header className={styles.header}>
                <h1>프로젝트 탐색</h1>
                <p>위시켓 및 프리모아의 실시간 프로젝트 목록을 확인하고 지원하세요.</p>
            </header>

            <ProjectList />
        </div>
    );
}
