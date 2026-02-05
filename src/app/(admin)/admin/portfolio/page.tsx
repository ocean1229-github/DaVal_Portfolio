import Link from 'next/link';
import { Plus } from 'lucide-react';
import PortfolioTable from '@/components/admin/PortfolioTable';
import styles from '../admin.module.css';

export default function PortfolioManagement() {
    return (
        <div>
            <header className={styles.header} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1>Portfolios</h1>
                    <p>등록된 모든 포트폴리오를 관리합니다.</p>
                </div>
                <Link href="/admin/portfolio/new" className={styles.primaryBtn} style={{ padding: '0.8rem 1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Plus size={20} /> 새 포트폴리오
                </Link>
            </header>

            <PortfolioTable />
        </div>
    );
}
