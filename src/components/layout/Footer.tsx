import styles from './Footer.module.css';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.inner}>
                <span className={styles.brand}>DaVal</span>
                <span className={styles.copy}>&copy; {new Date().getFullYear()} DaVal. All rights reserved.</span>
            </div>
        </footer>
    );
}
