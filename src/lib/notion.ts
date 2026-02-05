import { Client } from '@notionhq/client';
import { Portfolio, CompanyInfo, Service, TeamMember } from '@/types';

const notion = new Client({
    auth: process.env.NOTION_API_KEY,
});

const databaseId = process.env.NOTION_DATABASE_ID!;

// Notion 속성에서 텍스트 추출 헬퍼
function getTextProperty(property: any): string {
    if (!property) return '';
    if (property.type === 'title') {
        return property.title?.[0]?.plain_text || '';
    }
    if (property.type === 'rich_text') {
        return property.rich_text?.[0]?.plain_text || '';
    }
    return '';
}

function getSelectProperty(property: any): string {
    return property?.select?.name || '';
}

function getMultiSelectProperty(property: any): string[] {
    return property?.multi_select?.map((item: any) => item.name) || [];
}

function getNumberProperty(property: any): number {
    return property?.number || 0;
}

function getCheckboxProperty(property: any): boolean {
    return property?.checkbox || false;
}

function getDateProperty(property: any): string | null {
    return property?.date?.start || null;
}

function getFilesProperty(property: any): string | null {
    const file = property?.files?.[0];
    if (!file) return null;
    // Notion 파일 URL (외부 또는 Notion 호스팅)
    return file.type === 'external' ? file.external?.url : file.file?.url;
}

// Notion 페이지를 Portfolio 타입으로 변환
export function notionPageToPortfolio(page: any): Portfolio {
    const props = page.properties;
    const companyName = getTextProperty(props.Company);

    return {
        id: page.id,
        title: getTextProperty(props.Title),
        company_name: companyName || null,
        slug: getTextProperty(props.Slug) || page.id.replace(/-/g, ''),
        project_start_date: getDateProperty(props.StartDate),
        project_end_date: getDateProperty(props.EndDate),
        participation_field: getTextProperty(props.ParticipationField),
        participation_rate: getNumberProperty(props.ParticipationRate),
        dev_type: (getSelectProperty(props.DevType) || 'web') as Portfolio['dev_type'],
        category: getTextProperty(props.Category),
        tags: getMultiSelectProperty(props.Tags),
        summary: getTextProperty(props.Summary),
        description: getTextProperty(props.Description),
        client_logo_url: getFilesProperty(props.Thumbnail),
        thumbnail_url: getFilesProperty(props.Thumbnail),
        video_url: '',
        video_type: null,
        is_published: getCheckboxProperty(props.Published),
        display_order: getNumberProperty(props.Order),
        created_at: page.created_time,
        updated_at: page.last_edited_time,
    };
}

// 모든 포트폴리오 조회
export async function getPortfolios(publishedOnly = false): Promise<Portfolio[]> {
    const filter = publishedOnly
        ? { property: 'Published', checkbox: { equals: true } }
        : undefined;

    const response = await notion.databases.query({
        database_id: databaseId,
        filter,
        sorts: [{ property: 'Order', direction: 'ascending' }],
    });

    return response.results.map(notionPageToPortfolio);
}

// 단일 포트폴리오 조회 (ID)
export async function getPortfolioById(id: string): Promise<Portfolio | null> {
    try {
        const page = await notion.pages.retrieve({ page_id: id });
        return notionPageToPortfolio(page);
    } catch {
        return null;
    }
}

// 단일 포트폴리오 조회 (Slug)
export async function getPortfolioBySlug(slug: string): Promise<Portfolio | null> {
    const response = await notion.databases.query({
        database_id: databaseId,
        filter: {
            property: 'Slug',
            rich_text: { equals: slug },
        },
    });

    if (response.results.length === 0) return null;
    return notionPageToPortfolio(response.results[0]);
}

// 포트폴리오 생성
export async function createPortfolio(data: Partial<Portfolio>): Promise<Portfolio> {
    const response = await notion.pages.create({
        parent: { database_id: databaseId },
        properties: buildNotionProperties(data),
    });

    return notionPageToPortfolio(response);
}

// 포트폴리오 수정
export async function updatePortfolio(id: string, data: Partial<Portfolio>): Promise<Portfolio> {
    const response = await notion.pages.update({
        page_id: id,
        properties: buildNotionProperties(data),
    });

    return notionPageToPortfolio(response);
}

// 포트폴리오 삭제 (아카이브)
export async function deletePortfolio(id: string): Promise<void> {
    await notion.pages.update({
        page_id: id,
        archived: true,
    });
}

// Portfolio 데이터를 Notion 속성으로 변환
function buildNotionProperties(data: Partial<Portfolio>): any {
    const properties: any = {};

    if (data.title !== undefined) {
        properties.Title = { title: [{ text: { content: data.title } }] };
    }
    if (data.company_name !== undefined) {
        properties.Company = { rich_text: [{ text: { content: data.company_name || '' } }] };
    }
    if (data.slug !== undefined) {
        properties.Slug = { rich_text: [{ text: { content: data.slug } }] };
    }
    if (data.dev_type !== undefined) {
        properties.DevType = { select: { name: data.dev_type } };
    }
    if (data.category !== undefined) {
        properties.Category = { rich_text: [{ text: { content: data.category || '' } }] };
    }
    if (data.tags !== undefined) {
        properties.Tags = { multi_select: data.tags.map(tag => ({ name: tag })) };
    }
    if (data.summary !== undefined) {
        properties.Summary = { rich_text: [{ text: { content: data.summary || '' } }] };
    }
    if (data.description !== undefined) {
        properties.Description = { rich_text: [{ text: { content: data.description || '' } }] };
    }
    if (data.project_start_date !== undefined) {
        properties.StartDate = data.project_start_date
            ? { date: { start: data.project_start_date } }
            : { date: null };
    }
    if (data.project_end_date !== undefined) {
        properties.EndDate = data.project_end_date
            ? { date: { start: data.project_end_date } }
            : { date: null };
    }
    if (data.participation_field !== undefined) {
        properties.ParticipationField = { rich_text: [{ text: { content: data.participation_field || '' } }] };
    }
    if (data.participation_rate !== undefined) {
        properties.ParticipationRate = { number: data.participation_rate };
    }
    if (data.is_published !== undefined) {
        properties.Published = { checkbox: data.is_published };
    }
    if (data.display_order !== undefined) {
        properties.Order = { number: data.display_order };
    }
    // client_logo_url을 Thumbnail 속성에 저장
    if (data.client_logo_url !== undefined) {
        properties.Thumbnail = data.client_logo_url
            ? { files: [{ type: 'external', name: 'logo', external: { url: data.client_logo_url } }] }
            : { files: [] };
    }

    return properties;
}

export { notion, databaseId };

// --- Company Info Functions ---

const companyDatabaseId = process.env.NOTION_COMPANY_DATABASE_ID!;

function notionPageToCompanyInfo(page: any): CompanyInfo {
    const props = page.properties;
    return {
        id: page.id,
        section: (getSelectProperty(props.Section) || 'about') as CompanyInfo['section'],
        title: getTextProperty(props.Title),
        content: getTextProperty(props.Content),
        image_url: getFilesProperty(props.Image),
        order: getNumberProperty(props.Order),
        updated_at: page.last_edited_time,
    };
}

export async function getCompanyInfo(): Promise<CompanyInfo[]> {
    if (!companyDatabaseId) return [];
    try {
        const response = await notion.databases.query({
            database_id: companyDatabaseId,
            sorts: [{ property: 'Order', direction: 'ascending' }],
        });
        return response.results.map(notionPageToCompanyInfo);
    } catch (error) {
        console.error('Failed to fetch company info:', error);
        return [];
    }
}

export async function updateCompanyInfo(id: string, data: Partial<CompanyInfo>): Promise<CompanyInfo> {
    const properties: any = {};
    if (data.title !== undefined) properties.Title = { title: [{ text: { content: data.title } }] };
    if (data.content !== undefined) properties.Content = { rich_text: [{ text: { content: data.content } }] };
    if (data.order !== undefined) properties.Order = { number: data.order };
    if (data.section !== undefined) properties.Section = { select: { name: data.section } };
    if (data.image_url !== undefined) {
        properties.Image = data.image_url
            ? { files: [{ type: 'external', name: 'image', external: { url: data.image_url } }] }
            : { files: [] };
    }

    const response = await notion.pages.update({
        page_id: id,
        properties,
    });
    return notionPageToCompanyInfo(response);
}

export async function createCompanyInfo(data: Partial<CompanyInfo>): Promise<CompanyInfo> {
    if (!companyDatabaseId) throw new Error('Company database ID not configured');
    const properties: any = {};
    if (data.title) properties.Title = { title: [{ text: { content: data.title } }] };
    if (data.content) properties.Content = { rich_text: [{ text: { content: data.content } }] };
    if (data.order !== undefined) properties.Order = { number: data.order };
    if (data.section) properties.Section = { select: { name: data.section } };
    if (data.image_url) {
        properties.Image = { files: [{ type: 'external', name: 'image', external: { url: data.image_url } }] };
    }

    const response = await notion.pages.create({
        parent: { database_id: companyDatabaseId },
        properties,
    });
    return notionPageToCompanyInfo(response);
}

export async function deleteCompanyInfo(id: string): Promise<void> {
    await notion.pages.update({ page_id: id, archived: true });
}

// Alias for backward compatibility
export const updateCompanySection = updateCompanyInfo;
export const notionPageToCompanySection = notionPageToCompanyInfo;

// --- Services Functions ---

const servicesDatabaseId = process.env.NOTION_SERVICES_DATABASE_ID;

function notionPageToService(page: any): Service {
    const props = page.properties;
    return {
        id: page.id,
        title: getTextProperty(props.Title),
        description: getTextProperty(props.Description),
        icon: (getSelectProperty(props.Icon) || 'code') as Service['icon'],
        highlights: getMultiSelectProperty(props.Highlights),
        order: getNumberProperty(props.Order),
        updated_at: page.last_edited_time,
    };
}

export async function getServices(): Promise<Service[]> {
    if (!servicesDatabaseId) return [];
    try {
        const response = await notion.databases.query({
            database_id: servicesDatabaseId,
            sorts: [{ property: 'Order', direction: 'ascending' }],
        });
        return response.results.map(notionPageToService);
    } catch (error) {
        console.error('Failed to fetch services:', error);
        return [];
    }
}

export async function createService(data: Partial<Service>): Promise<Service> {
    if (!servicesDatabaseId) throw new Error('Services database ID not configured');
    const properties: any = {};
    if (data.title) properties.Title = { title: [{ text: { content: data.title } }] };
    if (data.description) properties.Description = { rich_text: [{ text: { content: data.description } }] };
    if (data.icon) properties.Icon = { select: { name: data.icon } };
    if (data.highlights) properties.Highlights = { multi_select: data.highlights.map(h => ({ name: h })) };
    if (data.order !== undefined) properties.Order = { number: data.order };

    const response = await notion.pages.create({
        parent: { database_id: servicesDatabaseId },
        properties,
    });
    return notionPageToService(response);
}

export async function updateService(id: string, data: Partial<Service>): Promise<Service> {
    const properties: any = {};
    if (data.title !== undefined) properties.Title = { title: [{ text: { content: data.title } }] };
    if (data.description !== undefined) properties.Description = { rich_text: [{ text: { content: data.description } }] };
    if (data.icon !== undefined) properties.Icon = { select: { name: data.icon } };
    if (data.highlights !== undefined) properties.Highlights = { multi_select: data.highlights.map(h => ({ name: h })) };
    if (data.order !== undefined) properties.Order = { number: data.order };

    const response = await notion.pages.update({ page_id: id, properties });
    return notionPageToService(response);
}

export async function deleteService(id: string): Promise<void> {
    await notion.pages.update({ page_id: id, archived: true });
}

// --- Team Functions ---

const teamDatabaseId = process.env.NOTION_TEAM_DATABASE_ID;

function notionPageToTeamMember(page: any): TeamMember {
    const props = page.properties;
    return {
        id: page.id,
        name: getTextProperty(props.Name),
        role: (getSelectProperty(props.Role) || 'developer') as TeamMember['role'],
        bio: getTextProperty(props.Bio),
        photo_url: getFilesProperty(props.Photo),
        skills: getMultiSelectProperty(props.Skills),
        order: getNumberProperty(props.Order),
        updated_at: page.last_edited_time,
    };
}

export async function getTeamMembers(): Promise<TeamMember[]> {
    if (!teamDatabaseId) return [];
    try {
        const response = await notion.databases.query({
            database_id: teamDatabaseId,
            sorts: [{ property: 'Order', direction: 'ascending' }],
        });
        return response.results.map(notionPageToTeamMember);
    } catch (error) {
        console.error('Failed to fetch team members:', error);
        return [];
    }
}

export async function createTeamMember(data: Partial<TeamMember>): Promise<TeamMember> {
    if (!teamDatabaseId) throw new Error('Team database ID not configured');
    const properties: any = {};
    if (data.name) properties.Name = { title: [{ text: { content: data.name } }] };
    if (data.role) properties.Role = { select: { name: data.role } };
    if (data.bio) properties.Bio = { rich_text: [{ text: { content: data.bio } }] };
    if (data.photo_url) {
        properties.Photo = { files: [{ type: 'external', name: 'photo', external: { url: data.photo_url } }] };
    }
    if (data.skills) properties.Skills = { multi_select: data.skills.map(s => ({ name: s })) };
    if (data.order !== undefined) properties.Order = { number: data.order };

    const response = await notion.pages.create({
        parent: { database_id: teamDatabaseId },
        properties,
    });
    return notionPageToTeamMember(response);
}

export async function updateTeamMember(id: string, data: Partial<TeamMember>): Promise<TeamMember> {
    const properties: any = {};
    if (data.name !== undefined) properties.Name = { title: [{ text: { content: data.name } }] };
    if (data.role !== undefined) properties.Role = { select: { name: data.role } };
    if (data.bio !== undefined) properties.Bio = { rich_text: [{ text: { content: data.bio } }] };
    if (data.photo_url !== undefined) {
        properties.Photo = data.photo_url
            ? { files: [{ type: 'external', name: 'photo', external: { url: data.photo_url } }] }
            : { files: [] };
    }
    if (data.skills !== undefined) properties.Skills = { multi_select: data.skills.map(s => ({ name: s })) };
    if (data.order !== undefined) properties.Order = { number: data.order };

    const response = await notion.pages.update({ page_id: id, properties });
    return notionPageToTeamMember(response);
}

export async function deleteTeamMember(id: string): Promise<void> {
    await notion.pages.update({ page_id: id, archived: true });
}
