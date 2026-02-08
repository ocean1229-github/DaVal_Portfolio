import { ArrowUpRight } from 'lucide-react';
import styles from './Footer.module.css';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.inner}>
                {/* Brand Section */}
                <div className={styles.brandSection}>
                    <span className={styles.brand}>DaVal</span>
                    <p className={styles.tagline}>AI 자동화 · 웹/앱 개발 · 데이터 시스템</p>
                </div>

                {/* Links Section */}
                <div className={styles.linksSection}>
                    <div className={styles.linkGroup}>
                        <h4>Services</h4>
                        <a href="https://daval.cloud" target="_blank" rel="noopener noreferrer">
                            DaVal Cloud <ArrowUpRight size={12} />
                        </a>
                        <a href="https://www.da-val.com" target="_blank" rel="noopener noreferrer">
                            상담 문의 <ArrowUpRight size={12} />
                        </a>
                    </div>
                    <div className={styles.linkGroup}>
                        <h4>Portfolio</h4>
                        <a href="/portfolio">프로젝트 보기</a>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className={styles.bottomBar}>
                    <span className={styles.copy}>&copy; {new Date().getFullYear()} DaVal. All rights reserved.</span>
                </div>
            </div>
        </footer>
    );
}
