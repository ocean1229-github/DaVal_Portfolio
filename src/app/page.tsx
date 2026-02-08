import styles from "./page.module.css";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getPortfolios } from "@/lib/notion";
import { Portfolio } from "@/types";
import FlipCard from "@/components/portfolio/FlipCard";

export const revalidate = 60;

export default async function Home() {
  let portfolios: Portfolio[] = [];
  try {
    portfolios = await getPortfolios(true);
  } catch (e) {
    console.error('Failed to fetch portfolios:', e);
  }

  // 최신 6개만 메인에 표시
  const featuredPortfolios = portfolios.slice(0, 6);

  return (
    <>
      <Header />
      <main className={styles.main}>
        {/* Hero Section - 간결하게 */}
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1 className={styles.title}>
              <span className={styles.titleSub}>Selected Works by</span>
              <span className={styles.titleMain}>DaVal</span>
            </h1>
            <p className={styles.subtitle}>
              AI 자동화 · 웹/앱 개발 · 데이터 시스템
            </p>
          </div>
          <div className={styles.scrollIndicator}>
            <span>Scroll</span>
            <div className={styles.scrollLine}></div>
          </div>
        </section>

        {/* Featured Portfolio Grid */}
        <section className={styles.portfolio}>
          <div className={styles.portfolioHeader}>
            <h2 className={styles.portfolioTitle}>Featured Projects</h2>
            <Link href="/portfolio" className={styles.viewAllLink}>
              View All <ArrowRight size={16} />
            </Link>
          </div>

          {featuredPortfolios.length > 0 ? (
            <div className={styles.portfolioGrid}>
              {featuredPortfolios.map((portfolio, index) => (
                <FlipCard
                  key={portfolio.id}
                  portfolio={portfolio}
                  featured={index === 0}
                />
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <p>포트폴리오를 준비 중입니다.</p>
              <p className={styles.emptySubtext}>곧 다양한 프로젝트들을 소개해 드리겠습니다.</p>
            </div>
          )}
        </section>

        {/* Simple CTA */}
        <section className={styles.cta}>
          <div className={styles.ctaContent}>
            <h2>프로젝트를 함께 만들어갈 준비가 되셨나요?</h2>
            <div className={styles.ctaLinks}>
              <a
                href="https://daval.cloud"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.ctaPrimary}
              >
                DaVal 메인 사이트 <ArrowUpRight size={18} />
              </a>
              <a
                href="https://www.da-val.com"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.ctaSecondary}
              >
                상담 문의하기 <ArrowRight size={18} />
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
