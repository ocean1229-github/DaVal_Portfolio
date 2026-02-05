import styles from "./page.module.css";
import { MoveRight, Zap, Shield, Layout } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <h1 className={styles.title}>
          Elevate Your <br />
          Portfolio with AI
        </h1>
        <p className={styles.subtitle}>
          DaVal은 소상공인과 기업을 위한 맞춤형 AI 자동화 프로그램 및 시스템을 구축합니다. <br />
          우리의 혁신적인 솔루션으로 비즈니스의 미래를 설계하세요.
        </p>
        <div className={styles.buttonGroup}>
          <Link href="/portfolio" className={styles.primaryBtn}>
            포트폴리오 보기 <MoveRight size={18} style={{ marginLeft: '8px', verticalAlign: 'middle' }} />
          </Link>
          <Link href="/about" className={styles.secondaryBtn}>
            회사 소개
          </Link>
          <Link href="/login" className={styles.ghostBtn}>
            관리자 로그인
          </Link>
        </div>
      </section>

      <section className={styles.features}>
        <div className={styles.card}>
          <Zap className="accent-icon" size={32} color="var(--accent-secondary)" />
          <h3>AI Automation</h3>
          <p>단순 반복 업무를 자동화하여 업무 효율성을 극대화합니다.</p>
        </div>
        <div className={styles.card}>
          <Layout className="accent-icon" size={32} color="var(--accent-primary)" />
          <h3>Custom System</h3>
          <p>기업의 환경과 요구사항에 최적화된 시스템을 구축합니다.</p>
        </div>
        <div className={styles.card}>
          <Shield className="accent-icon" size={32} color="var(--accent-secondary)" />
          <h3>Reliable Support</h3>
          <p>파트너 플랫폼(위시켓, 프리모아) 지원을 위한 완벽한 포트폴리오 관리를 제공합니다.</p>
        </div>
      </section>
    </main>
  );
}
