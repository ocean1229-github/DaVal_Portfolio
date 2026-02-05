import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export const dynamic = 'force-dynamic';

interface Project {
    platform: 'wishket' | 'freemoa';
    title: string;
    url: string;
    budget: string;
    duration: string;
    status: string;
}

export async function GET() {
    try {
        const [wishketProjects, freemoaProjects] = await Promise.all([
            fetchWishketProjects(),
            fetchFreemoaProjects(),
        ]);

        return NextResponse.json({
            success: true,
            data: [...wishketProjects, ...freemoaProjects],
        });
    } catch (error: any) {
        console.error('Project fetch error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch projects' },
            { status: 500 }
        );
    }
}

async function fetchWishketProjects(): Promise<Project[]> {
    try {
        const response = await fetch('https://www.wishket.com/project/', {
            next: { revalidate: 3600 }
        });
        const html = await response.text();
        const $ = cheerio.load(html);
        const projects: Project[] = [];

        $('.project-unit').each((_, el) => {
            const status = $(el).find('.status-mark.recruiting-mark').text().trim();
            if (status.includes('모집 중')) {
                const title = $(el).find('.project-link p').text().trim();
                const relativeUrl = $(el).find('.project-link').attr('href');
                const budget = $(el).find('.project-unit-basic-info span:nth-of-type(2)').text().trim();
                const duration = $(el).find('.project-unit-basic-info span:nth-of-type(4)').text().trim();

                projects.push({
                    platform: 'wishket',
                    title,
                    url: `https://www.wishket.com${relativeUrl}`,
                    budget,
                    duration,
                    status: '모집중'
                });
            }
        });

        return projects;
    } catch (error) {
        console.error('Wishket error:', error);
        return [];
    }
}

async function fetchFreemoaProjects(): Promise<Project[]> {
    try {
        const response = await fetch('https://www.freemoa.net/m4/s41?page=1', {
            next: { revalidate: 3600 }
        });
        const html = await response.text();
        const $ = cheerio.load(html);
        const projects: Project[] = [];

        $('.projTitle.projectInfo').each((_, el) => {
            const prid = $(el).attr('data-pno');
            if (prid) {
                const title = $(el).find('p.title').text().trim();
                const status = $(el).closest('.project_list_box').find('.state span').text().trim() || '모집중';

                // Find budget/duration by looking for labels
                let budget = '';
                let duration = '';

                $(el).closest('.project_list_box').find('.info span').each((_, span) => {
                    const text = $(span).text();
                    if (text.includes('예상비용')) {
                        budget = $(span).next('b').text().trim();
                    } else if (text.includes('예상기간')) {
                        duration = $(span).next('b').text().trim();
                    }
                });

                projects.push({
                    platform: 'freemoa',
                    title,
                    url: `https://www.freemoa.net/m4/s41?prid=${prid}`,
                    budget,
                    duration,
                    status: '모집중'
                });
            }
        });

        return projects;
    } catch (error) {
        console.error('Freemoa error:', error);
        return [];
    }
}
