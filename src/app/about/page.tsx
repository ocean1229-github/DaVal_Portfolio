import type { Metadata } from 'next';
import {
    Shield, Users, Wrench, Building2,
    MessageSquare, Palette, Code, Rocket, Phone, Mail,
    ChevronRight, CheckCircle2, BrainCircuit, Award, Clock, Briefcase
} from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getPortfolios } from '@/lib/notion';
import PrintButton from './PrintButton';
import styles from './about.module.css';

export const revalidate = 60;

export const metadata: Metadata = {
    title: 'DaVal - 회사소개서',
    description: '대기업이 검증한 기술력, PM급 개발자가 직접 만드는 프리미엄 IT 솔루션',
};

export default async function AboutPage() {
    let totalProjects = 21;
    try {
        const allPortfolios = await getPortfolios(true);
        totalProjects = allPortfolios.length;
    } catch {
        // Fallback count when Notion API is unavailable (e.g. build time)
    }

    return (
        <>
            <Header />
            <main className={styles.brochure} id="brochure-content">
                <PrintButton />

                {/* ========== PAGE 1: COVER ========== */}
                <section className={styles.cover}>
                    <div className={styles.coverGlow} />
                    <div className={styles.coverGlow2} />
                    <div className={styles.coverContent}>
                        <div className={styles.coverBrand}>
                            <span className={styles.brandLogo}>DaVal</span>
                        </div>
                        <h1 className={styles.coverTitle}>
                            귀사의 <span className={styles.accent}>비즈니스 성장</span>,<br />
                            IT로 가속합니다.
                        </h1>
                        <p className={styles.coverSub}>
                            대기업이 검증한 기술력으로, 기획부터 개발·운영까지<br />
                            책임지는 올인원 IT 파트너
                        </p>
                    </div>
                    <div className={styles.partners}>
                        <span className={styles.partnersLabel}>함께한 기업들</span>
                        <div className={styles.logoRow}>
                            {[
                                { src: '/logos/01_한화비전.png', alt: '한화비전' },
                                { src: '/logos/02_더현대.png', alt: '더현대' },
                                { src: '/logos/03_신세계.jpg', alt: '신세계' },
                                { src: '/logos/04_DnB.png', alt: 'D&B' },
                                { src: '/logos/05_POCA.png', alt: 'POCA' },
                                { src: '/logos/06_경기대학교.png', alt: '경기대학교' },
                                { src: '/logos/07_정샘물.png', alt: '정샘물' },
                                { src: '/logos/08_DECODE_Q.png', alt: 'DECODE Q' },
                                { src: '/logos/09_시현하다.png', alt: '시현하다' },
                                { src: '/logos/10_SoftSquared.png', alt: 'SoftSquared' },
                                { src: '/logos/11_AiLex.png', alt: 'AiLex' },
                                { src: '/logos/12_eform.png', alt: 'eform' },
                                { src: '/logos/13_DentiQube.png', alt: 'DentiQube' },
                                { src: '/logos/14_FutureworkLab.png', alt: 'FutureworkLab' },
                                { src: '/logos/15_SPACE_TAILOR.png', alt: 'SPACE TAILOR' },
                                { src: '/logos/16_BeyondCapture.png', alt: 'BeyondCapture' },
                                { src: '/logos/17_칭찬모아.png', alt: '칭찬모아' },
                                { src: '/logos/18_EmotionoGraphy.png', alt: 'EmotionoGraphy' },
                                { src: '/logos/19_Rilcy.png', alt: 'Rilcy' },
                                { src: '/logos/20_YOUNG_FEEL.png', alt: 'YOUNG FEEL' },
                                { src: '/logos/21_PARENTLY.png', alt: 'PARENTLY' },
                                { src: '/logos/22_DIAOCEAN.png', alt: 'DIAOCEAN' },
                            ].map((logo) => (
                                <div key={logo.alt} className={styles.logoItem}>
                                    <img src={logo.src} alt={logo.alt} />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ========== PAGE 2: TRUST NUMBERS + WHY US ========== */}
                <section className={styles.page}>
                    <div className={styles.pageInner}>
                        {/* Trust Numbers */}
                        <div className={styles.statsBar}>
                            <div className={styles.stat}>
                                <div className={styles.statIcon}><Briefcase size={20} /></div>
                                <span className={styles.statNumber}>{totalProjects}+</span>
                                <span className={styles.statLabel}>프로젝트 완료</span>
                            </div>
                            <div className={styles.statDivider} />
                            <div className={styles.stat}>
                                <div className={styles.statIcon}><Building2 size={20} /></div>
                                <span className={styles.statNumber}>5+</span>
                                <span className={styles.statLabel}>대기업 협업</span>
                            </div>
                            <div className={styles.statDivider} />
                            <div className={styles.stat}>
                                <div className={styles.statIcon}><Award size={20} /></div>
                                <span className={styles.statNumber}>NIA</span>
                                <span className={styles.statLabel}>최우수 선정</span>
                            </div>
                            <div className={styles.statDivider} />
                            <div className={styles.stat}>
                                <div className={styles.statIcon}><Clock size={20} /></div>
                                <span className={styles.statNumber}>24/7</span>
                                <span className={styles.statLabel}>매니지드 운영</span>
                            </div>
                        </div>

                        {/* Why DaVal */}
                        <div className={styles.sectionHeader}>
                            <span className={styles.sectionLabel}>WHY DAVAL</span>
                            <h2 className={styles.sectionTitle}>
                                외주 개발의 한계를 넘어,<br />
                                <span className={styles.accent}>비즈니스의 성장</span>을 설계합니다.
                            </h2>
                        </div>
                        <div className={styles.diffGrid}>
                            <div className={styles.diffCard}>
                                <div className={styles.diffIcon}>
                                    <Shield size={24} />
                                </div>
                                <h3>PM급 개발자 직접 리드</h3>
                                <p>
                                    주니어에게 맡기지 않습니다.<br />
                                    대표 및 PM급 총괄 개발자가 기획 단계부터 직접 참여하여
                                    비즈니스 로직을 설계합니다.
                                </p>
                            </div>
                            <div className={`${styles.diffCard} ${styles.diffCardHighlight}`}>
                                <span className={styles.diffBadge}>핵심 차별점</span>
                                <div className={`${styles.diffIcon} ${styles.diffIconGreen}`}>
                                    <Wrench size={24} />
                                </div>
                                <h3>Managed BPaaS</h3>
                                <p>
                                    한 번 만들고 끝이 아닙니다.<br />
                                    비즈니스 환경 변화, 기술 업데이트에 맞춰
                                    데벨이 지속적으로 관리하고 최신 상태를 유지합니다.
                                </p>
                            </div>
                            <div className={styles.diffCard}>
                                <div className={styles.diffIcon}>
                                    <Users size={24} />
                                </div>
                                <h3>원스톱 솔루션</h3>
                                <p>
                                    기획·디자인·개발, 따로 구하지 마세요.<br />
                                    데벨은 귀사의 프로젝트를 내 사업처럼 고민하고,
                                    한 팀이 A to Z를 끝까지 책임집니다.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* (주요 고객사 및 대표 프로젝트는 커버 로고로 대체) */}

                {/* ========== PAGE 5: SERVICES ========== */}
                <section className={`${styles.page} ${styles.pageAlt}`}>
                    <div className={styles.pageInner}>
                        <div className={styles.sectionHeader}>
                            <span className={styles.sectionLabel}>SERVICES</span>
                            <h2 className={styles.sectionTitle}>서비스 &amp; 견적 안내</h2>
                        </div>
                        <div className={styles.serviceGrid}>
                            <div className={styles.serviceCard}>
                                <div className={styles.serviceIcon}>
                                    <Code size={28} />
                                </div>
                                <span className={styles.serviceTag}>WEB &amp; APP</span>
                                <h3>Premium Web &amp; App</h3>
                                <p>랜딩페이지부터 복잡한 SaaS, 매칭 플랫폼까지 비즈니스에 최적화된 디지털 제품</p>
                                <ul className={styles.serviceFeatures}>
                                    <li><CheckCircle2 size={14} /> 반응형 웹사이트</li>
                                    <li><CheckCircle2 size={14} /> SaaS / 플랫폼</li>
                                    <li><CheckCircle2 size={14} /> 모바일 앱</li>
                                </ul>
                                <div className={styles.servicePrice}>
                                    <span className={styles.priceLabel}>시작가</span>
                                    <span className={styles.priceAmount}>50만원 ~</span>
                                </div>
                            </div>

                            <div className={`${styles.serviceCard} ${styles.serviceCardFeatured}`}>
                                <div className={styles.featuredBadge}>BEST</div>
                                <div className={`${styles.serviceIcon} ${styles.serviceIconGreen}`}>
                                    <BrainCircuit size={28} />
                                </div>
                                <span className={styles.serviceTag}>AI &amp; AUTOMATION</span>
                                <h3>AI &amp; 업무 자동화</h3>
                                <p>RPA, AI 문서 분석, 대시보드 자동화. 업무 환경이 변해도 지속 업데이트</p>
                                <ul className={styles.serviceFeatures}>
                                    <li><CheckCircle2 size={14} /> RPA 자동화</li>
                                    <li><CheckCircle2 size={14} /> AI 문서 분석</li>
                                    <li><CheckCircle2 size={14} /> 매니지드 운영</li>
                                </ul>
                                <div className={styles.servicePrice}>
                                    <span className={styles.priceLabel}>시작가</span>
                                    <span className={styles.priceAmount}>100만원 ~</span>
                                </div>
                            </div>

                            <div className={styles.serviceCard}>
                                <div className={styles.serviceIcon}>
                                    <Rocket size={28} />
                                </div>
                                <span className={styles.serviceTag}>CONSULTING</span>
                                <h3>IT 비즈니스 컨설팅</h3>
                                <p>요구사항 분석부터 아키텍처 설계까지, 기술적 의사결정 전문 컨설팅</p>
                                <ul className={styles.serviceFeatures}>
                                    <li><CheckCircle2 size={14} /> 요구사항 분석</li>
                                    <li><CheckCircle2 size={14} /> 아키텍처 설계</li>
                                    <li><CheckCircle2 size={14} /> 기술 로드맵</li>
                                </ul>
                                <div className={styles.servicePrice}>
                                    <span className={styles.priceLabel}>별도 상담</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ========== PAGE 6: PROCESS + TECH + CTA ========== */}
                <section className={styles.page}>
                    <div className={styles.pageInner}>
                        {/* Process */}
                        <div className={styles.sectionHeader}>
                            <span className={styles.sectionLabel}>WORK PROCESS</span>
                            <h2 className={styles.sectionTitle}>프로세스</h2>
                        </div>
                        <div className={styles.processRow}>
                            {[
                                { step: '01', title: '무료 상담', icon: <MessageSquare size={22} />, desc: '비즈니스 목표 분석\n최적 솔루션 제안' },
                                { step: '02', title: '기획·디자인', icon: <Palette size={22} />, desc: '사용자 중심 설계\n직관적 UI/UX' },
                                { step: '03', title: '전문 개발', icon: <Code size={22} />, desc: '주간 피드백\n투명한 진행 공유' },
                                { step: '04', title: '유지보수', icon: <Wrench size={22} />, desc: '1개월 무상 서비스\n지속 기술 지원' },
                            ].map((item, i) => (
                                <div key={item.step} className={styles.processStep}>
                                    <div className={styles.processIcon}>{item.icon}</div>
                                    <div className={styles.processLabel}>STEP {item.step}</div>
                                    <h4>{item.title}</h4>
                                    <p>{item.desc}</p>
                                    {i < 3 && <div className={styles.processArrow}><ChevronRight size={16} /></div>}
                                </div>
                            ))}
                        </div>

                        {/* Tech Stack */}
                        <div className={styles.techBar}>
                            <div className={styles.techGroup}>
                                <span className={styles.techLabel}>Frontend</span>
                                <span className={styles.techItems}>Next.js · React Native · TypeScript</span>
                            </div>
                            <div className={styles.techDivider} />
                            <div className={styles.techGroup}>
                                <span className={styles.techLabel}>Backend</span>
                                <span className={styles.techItems}>Node.js · Python · FastAPI · PostgreSQL</span>
                            </div>
                            <div className={styles.techDivider} />
                            <div className={styles.techGroup}>
                                <span className={styles.techLabel}>AI / ML</span>
                                <span className={styles.techItems}>OpenAI GPT · Claude API · LangChain · RAG · Vector DB · Notion DB</span>
                            </div>
                            <div className={styles.techDivider} />
                            <div className={styles.techGroup}>
                                <span className={styles.techLabel}>Infra</span>
                                <span className={styles.techItems}>AWS · Docker · CI/CD · Serverless</span>
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div className={styles.contactBlock}>
                            <h2 className={styles.contactTitle}>Contact</h2>
                            <div className={styles.contactGrid}>
                                <div className={styles.contactItem}>
                                    <Phone size={20} />
                                    <div>
                                        <span className={styles.contactLabel}>전화 문의</span>
                                        <span className={styles.contactValue}>010-9805-8736</span>
                                    </div>
                                </div>
                                <div className={styles.contactItem}>
                                    <Mail size={20} />
                                    <div>
                                        <span className={styles.contactLabel}>이메일</span>
                                        <span className={styles.contactValue}>business@epqpf.com</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

            </main>
            <Footer />
        </>
    );
}
