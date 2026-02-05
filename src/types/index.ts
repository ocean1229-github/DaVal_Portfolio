export type DevType = 'web' | 'app' | 'ai' | 'etc';

export interface Portfolio {
    id: string;
    title: string;
    slug: string;
    project_start_date: string | null;
    project_end_date: string | null;
    participation_field: string | null;
    participation_rate: number | null;
    dev_type: DevType;
    category: string | null;
    tags: string[];
    summary: string | null;
    description: string | null;
    client_logo_url: string | null;
    thumbnail_url: string | null;
    video_url: string | null;
    video_type: 'youtube' | 'vimeo' | 'upload' | null;
    is_published: boolean;
    display_order: number;
    created_at: string;
    updated_at: string;
}

export interface PortfolioImage {
    id: string;
    portfolio_id: string;
    image_url: string;
    alt_text: string | null;
    display_order: number;
    created_at: string;
}

export interface AdminWhitelist {
    id: string;
    email: string;
    created_at: string;
}

// Company Info
export type SectionType = 'hero' | 'about' | 'vision' | 'history';

export interface CompanyInfo {
    id: string;
    section: SectionType;
    title: string;
    content: string;
    image_url: string | null;
    order: number;
    updated_at: string;
}

// Services (주요 업무 분야 및 강점)
export type IconType = 'code' | 'brain' | 'rocket' | 'shield' | 'zap' | 'layout' | 'database' | 'cloud';

export interface Service {
    id: string;
    title: string;
    description: string;
    icon: IconType;
    highlights: string[];
    order: number;
    updated_at: string;
}

// Team (직원 소개)
export type RoleType = 'ceo' | 'cto' | 'developer' | 'designer' | 'manager' | 'intern';

export interface TeamMember {
    id: string;
    name: string;
    role: RoleType;
    bio: string;
    photo_url: string | null;
    skills: string[];
    order: number;
    updated_at: string;
}

// Legacy alias for backward compatibility
export type CompanySection = CompanyInfo;
