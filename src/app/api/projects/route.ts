import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export const dynamic = 'force-dynamic';

const COMMON_HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
    'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
};

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
            fetchFreemoaProjects(2), // Fetch 2 pages from Freemoa
        ]);

        const allProjects = [...wishketProjects, ...freemoaProjects];

        return NextResponse.json({
            success: true,
            data: allProjects,
            totalCount: allProjects.length,
            timestamp: new Date().toISOString(),
        });
    } catch (error: unknown) {
        console.error('Project fetch error:', error);
        return NextResponse.json(
            {
                success: false,
                error: '플랫폼 데이터를 가져오는 중 오류가 발생했습니다.',
                details: error instanceof Error ? error.message : String(error)
            },
            { status: 500 }
        );
    }
}

async function fetchWishketProjects(): Promise<Project[]> {
    try {
        const response = await fetch('https://www.wishket.com/project/', {
            headers: COMMON_HEADERS,
            next: { revalidate: 3600 }
        });

        if (!response.ok) throw new Error(`Wishket responded with ${response.status}`);

        const html = await response.text();
        const $ = cheerio.load(html);
        const projects: Project[] = [];

        $('.project-unit').each((_, el) => {
            try {
                const statusText = $(el).find('.status-mark.recruiting-mark').text().trim();
                // Filter for available projects (Recruiting)
                if (statusText.includes('모집 중')) {
                    const titleEl = $(el).find('.project-link p');
                    const linkEl = $(el).find('.project-link');

                    if (!titleEl.length || !linkEl.length) return;

                    const title = titleEl.text().trim();
                    const relativeUrl = linkEl.attr('href');
                    const budget = $(el).find('.project-unit-basic-info span:nth-of-type(2)').text().trim() || '협의';
                    const duration = $(el).find('.project-unit-basic-info span:nth-of-type(4)').text().trim() || '협의';

                    projects.push({
                        platform: 'wishket',
                        title,
                        url: relativeUrl ? `https://www.wishket.com${relativeUrl}` : '#',
                        budget,
                        duration,
                        status: '모집중'
                    });
                }
            } catch (err) {
                console.error('Error parsing Wishket project unit:', err);
            }
        });

        return projects;
    } catch (error) {
        console.error('Wishket fetch error:', error);
        return [];
    }
}

async function fetchFreemoaProjects(maxPages: number = 1): Promise<Project[]> {
    const allFreemoaProjects: Project[] = [];

    for (let page = 1; page <= maxPages; page++) {
        try {
            const response = await fetch(`https://www.freemoa.net/m4/s41?page=${page}`, {
                headers: COMMON_HEADERS,
                next: { revalidate: 3600 }
            });

            if (!response.ok) break;

            const html = await response.text();
            const $ = cheerio.load(html);

            $('.projTitle.projectInfo').each((_, el) => {
                try {
                    const prid = $(el).attr('data-pno');
                    if (!prid) return;

                    const title = $(el).find('p.title').text().trim();
                    if (!title) return;

                    // More robust status check
                    const statusEl = $(el).closest('.project_list_box').find('.state span');
                    const statusText = statusEl.text().trim() || '모집중';

                    if (statusText.includes('기한만료') || statusText.includes('계약완료')) return;

                    let budget = '상담후결정';
                    let duration = '상담후결정';

                    $(el).closest('.project_list_box').find('.info span').each((_, span) => {
                        const text = $(span).text();
                        if (text.includes('예상비용')) {
                            const val = $(span).next('b').text().trim();
                            if (val) budget = val;
                        } else if (text.includes('예상기간')) {
                            const val = $(span).next('b').text().trim();
                            if (val) duration = val;
                        }
                    });

                    allFreemoaProjects.push({
                        platform: 'freemoa',
                        title,
                        url: `https://www.freemoa.net/m4/s41?prid=${prid}`,
                        budget,
                        duration,
                        status: '모집중'
                    });
                } catch (err) {
                    console.error('Error parsing Freemoa project unit:', err);
                }
            });
        } catch (error) {
            console.error(`Freemoa page ${page} error:`, error);
            break;
        }
    }

    return allFreemoaProjects;
}
