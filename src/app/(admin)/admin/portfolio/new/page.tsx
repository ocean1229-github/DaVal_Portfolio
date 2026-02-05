import PortfolioForm from '@/components/admin/PortfolioForm';
import styles from '../../admin.module.css';

export default function NewPortfolio() {
    return (
        <div>
            <header className={styles.header}>
                <h1>새 포트폴리오 등록</h1>
                <p>프로젝트의 상세 정보를 입력하세요.</p>
            </header>

            <PortfolioForm />
        </div>
    );
}
