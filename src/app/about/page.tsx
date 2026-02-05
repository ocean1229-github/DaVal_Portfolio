import { getCompanyInfo, getServices, getTeamMembers } from '@/lib/notion';
import { Code, Brain, Rocket, Shield, Zap, Layout, Database, Cloud } from 'lucide-react';
import styles from './about.module.css';

export const revalidate = 60;

const ICON_MAP: Record<string, React.ReactNode> = {
    code: <Code size={32} />,
    brain: <Brain size={32} />,
    rocket: <Rocket size={32} />,
    shield: <Shield size={32} />,
    zap: <Zap size={32} />,
    layout: <Layout size={32} />,
    database: <Database size={32} />,
    cloud: <Cloud size={32} />,
};

const ROLE_LABELS: Record<string, string> = {
    ceo: 'CEO',
    cto: 'CTO',
    developer: 'Developer',
    designer: 'Designer',
    manager: 'Manager',
    intern: 'Intern',
};

export default async function AboutPage() {
    const [sections, services, teamMembers] = await Promise.all([
        getCompanyInfo(),
        getServices(),
        getTeamMembers(),
    ]);

    const hasContent = sections.length > 0 || services.length > 0 || teamMembers.length > 0;

    return (
        <div className={styles.container}>
            {!hasContent ? (
                <div className={styles.empty}>회사 정보가 아직 등록되지 않았습니다.</div>
            ) : (
                <div className={styles.aboutWrapper}>
                    {/* Company Info Sections */}
                    {sections.map((section) => (
                        <section key={section.id} className={`${styles.section} ${styles[section.section] || ''}`}>
                            <div className={styles.sectionHeader}>
                                <h1>{section.title}</h1>
                            </div>

                            <div className={`${styles.contentGrid} ${section.image_url ? styles.hasImage : ''}`}>
                                {section.image_url && (
                                    <div className={styles.imageWrapper}>
                                        <img src={section.image_url} alt={section.title} className={styles.sectionImage} />
                                    </div>
                                )}
                                <div className={styles.textContent}>
                                    {section.content.split('\n\n').map((paragraph: string, i: number) => (
                                        <p key={i}>
                                            {paragraph.split('\n').map((line: string, j: number, arr: string[]) => (
                                                <span key={j}>
                                                    {line}
                                                    {j < arr.length - 1 && <br />}
                                                </span>
                                            ))}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        </section>
                    ))}

                    {/* Services Section */}
                    {services.length > 0 && (
                        <section className={styles.section}>
                            <div className={styles.sectionHeader}>
                                <h1>서비스 & 강점</h1>
                            </div>

                            <div className={styles.servicesGrid}>
                                {services.map((service) => (
                                    <div key={service.id} className={styles.serviceCard}>
                                        <div className={styles.serviceIcon}>
                                            {ICON_MAP[service.icon] || <Code size={32} />}
                                        </div>
                                        <h3>{service.title}</h3>
                                        <p>{service.description}</p>
                                        {service.highlights.length > 0 && (
                                            <div className={styles.highlights}>
                                                {service.highlights.map((h) => (
                                                    <span key={h} className={styles.highlight}>{h}</span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Team Section */}
                    {teamMembers.length > 0 && (
                        <section className={styles.section}>
                            <div className={styles.sectionHeader}>
                                <h1>팀 소개</h1>
                            </div>

                            <div className={styles.teamGrid}>
                                {teamMembers.map((member) => (
                                    <div key={member.id} className={styles.teamCard}>
                                        <div className={styles.teamPhoto}>
                                            {member.photo_url ? (
                                                <img src={member.photo_url} alt={member.name} />
                                            ) : (
                                                <div className={styles.photoPlaceholder}>
                                                    {member.name.charAt(0)}
                                                </div>
                                            )}
                                        </div>
                                        <div className={styles.teamInfo}>
                                            <h3>{member.name}</h3>
                                            <span className={styles.role}>{ROLE_LABELS[member.role] || member.role}</span>
                                            <p>{member.bio}</p>
                                            {member.skills.length > 0 && (
                                                <div className={styles.skills}>
                                                    {member.skills.map((skill) => (
                                                        <span key={skill} className={styles.skill}>{skill}</span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            )}
        </div>
    );
}
