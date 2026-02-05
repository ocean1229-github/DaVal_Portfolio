import { getPortfolioById } from '@/lib/notion';
import { notFound } from 'next/navigation';
import PortfolioForm from '@/components/admin/PortfolioForm';
import styles from '../../admin.module.css';

type PageProps = { params: Promise<{ id: string }> };

export default async function EditPortfolio({ params }: PageProps) {
    const { id } = await params;

    const portfolio = await getPortfolioById(id);

    if (!portfolio) {
        notFound();
    }

    return (
        <div>
            <header className={styles.header}>
                <h1>포트폴리오 수정</h1>
                <p>{portfolio.title} 프로젝트의 정보를 수정합니다.</p>
            </header>

            <PortfolioForm initialData={portfolio} isEdit={true} />
        </div>
    );
}
