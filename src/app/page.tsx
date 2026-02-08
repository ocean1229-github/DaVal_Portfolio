import styles from "./page.module.css";
import { ArrowRight, Sparkles, Zap, Shield, Code2, TrendingUp, Clock, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className={styles.main}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.heroBadge}>
            <Sparkles size={14} />
            <span>AI 기반 업무 자동화 전문</span>
          </div>

          <h1 className={styles.title}>
            비즈니스의 미래를
            <br />
            <span className={styles.gradientText}>자동화</span>로 설계합니다
          </h1>

          <p className={styles.subtitle}>
            DaVal은 소상공인부터 기업까지, 맞춤형 AI 자동화 시스템을 구축합니다.
            <br />
            반복 업무는 줄이고, 본질에 집중하세요.
          </p>

          <div className={styles.buttonGroup}>
            <Link href="#contact" className={styles.primaryBtn}>
              무료 상담 신청
              <ArrowRight size={18} />
            </Link>
            <Link href="/portfolio" className={styles.secondaryBtn}>
              프로젝트 둘러보기
            </Link>
          </div>

          {/* Floating Stats */}
          <div className={styles.floatingStats}>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>50+</span>
              <span className={styles.statLabel}>완료 프로젝트</span>
            </div>
            <div className={styles.statDivider}></div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>98%</span>
              <span className={styles.statLabel}>고객 만족도</span>
            </div>
            <div className={styles.statDivider}></div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>24h</span>
              <span className={styles.statLabel}>빠른 응답</span>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className={styles.services} id="services">
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>What We Do</span>
            <h2 className={styles.sectionTitle}>
              복잡한 문제를 <span className={styles.highlight}>심플하게</span> 해결합니다
            </h2>
          </div>

          <div className={styles.serviceGrid}>
            <div className={styles.serviceCard}>
              <div className={styles.serviceIcon}>
                <Zap size={28} />
              </div>
              <h3>AI 업무 자동화</h3>
              <p>ChatGPT, Claude 등 최신 AI를 활용한 문서 작성, 데이터 분석, 고객 응대 자동화</p>
              <ul className={styles.serviceList}>
                <li><CheckCircle2 size={16} /> 반복 업무 90% 절감</li>
                <li><CheckCircle2 size={16} /> 24시간 무중단 운영</li>
              </ul>
            </div>

            <div className={styles.serviceCard}>
              <div className={styles.serviceIcon}>
                <Code2 size={28} />
              </div>
              <h3>맞춤형 시스템 개발</h3>
              <p>기업 환경에 최적화된 웹/앱 시스템, 관리자 대시보드, API 연동 개발</p>
              <ul className={styles.serviceList}>
                <li><CheckCircle2 size={16} /> 확장 가능한 설계</li>
                <li><CheckCircle2 size={16} /> 유지보수 지원</li>
              </ul>
            </div>

            <div className={styles.serviceCard}>
              <div className={styles.serviceIcon}>
                <TrendingUp size={28} />
              </div>
              <h3>데이터 수집/분석</h3>
              <p>웹 크롤링, 데이터 파이프라인 구축, 실시간 모니터링 대시보드</p>
              <ul className={styles.serviceList}>
                <li><CheckCircle2 size={16} /> 실시간 데이터 수집</li>
                <li><CheckCircle2 size={16} /> 시각화 리포트</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Why Us Section */}
        <section className={styles.whyUs}>
          <div className={styles.whyUsContent}>
            <span className={styles.sectionLabel}>Why DaVal</span>
            <h2 className={styles.sectionTitle}>
              왜 <span className={styles.highlight}>DaVal</span>인가요?
            </h2>
            <p className={styles.whyUsDesc}>
              10년간의 개발/디자인 경험을 바탕으로,
              단순한 외주가 아닌 비즈니스 파트너로서 함께합니다.
            </p>

            <div className={styles.benefitList}>
              <div className={styles.benefitItem}>
                <div className={styles.benefitIcon}><Clock size={20} /></div>
                <div>
                  <h4>빠른 커뮤니케이션</h4>
                  <p>24시간 내 초기 응답, 주간 단위 진행 공유</p>
                </div>
              </div>
              <div className={styles.benefitItem}>
                <div className={styles.benefitIcon}><Shield size={20} /></div>
                <div>
                  <h4>투명한 견적</h4>
                  <p>숨겨진 비용 없이 명확한 범위와 일정 제시</p>
                </div>
              </div>
              <div className={styles.benefitItem}>
                <div className={styles.benefitIcon}><Sparkles size={20} /></div>
                <div>
                  <h4>사후 지원</h4>
                  <p>프로젝트 완료 후에도 유지보수 및 개선 지원</p>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.whyUsVisual}>
            <div className={styles.glowOrb}></div>
            <div className={styles.statsCard}>
              <div className={styles.statsRow}>
                <span className={styles.statsValue}>10+</span>
                <span className={styles.statsLabel}>년 경력</span>
              </div>
              <div className={styles.statsRow}>
                <span className={styles.statsValue}>위시켓/프리모아</span>
                <span className={styles.statsLabel}>검증된 파트너</span>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className={styles.ctaSection} id="contact">
          <div className={styles.ctaGlow}></div>
          <div className={styles.ctaContent}>
            <h2>프로젝트가 있으신가요?</h2>
            <p>
              아이디어 단계부터 구체적인 요구사항까지,
              <br />
              편하게 상담 신청해 주세요. 24시간 내 연락드립니다.
            </p>

            <form className={styles.contactForm}>
              <div className={styles.formRow}>
                <input
                  type="text"
                  placeholder="회사/담당자명"
                  className={styles.formInput}
                  required
                />
                <input
                  type="email"
                  placeholder="이메일 주소"
                  className={styles.formInput}
                  required
                />
              </div>
              <textarea
                placeholder="프로젝트에 대해 간단히 설명해 주세요"
                className={styles.formTextarea}
                rows={4}
              ></textarea>
              <button type="submit" className={styles.submitBtn}>
                상담 신청하기
                <ArrowRight size={18} />
              </button>
            </form>

            <p className={styles.ctaNote}>
              * 상담은 무료이며, 부담 없이 문의해 주세요.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
