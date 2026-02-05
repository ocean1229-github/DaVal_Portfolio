import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export const dynamic = 'force-dynamic';

const COMMON_HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'application/json, text/html',
    'Accept-Language': 'ko-KR,ko;q=0.9',
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
    const errors: string[] = [];

    let wishketProjects: Project[] = [];
    let freemoaProjects: Project[] = [];

    try {
        wishketProjects = await fetchWishketProjects();
    } catch (e) {
        errors.push(`Wishket: ${e instanceof Error ? e.message : String(e)}`);
    }

    try {
        freemoaProjects = await fetchFreemoaProjects();
    } catch (e) {
        errors.push(`Freemoa: ${e instanceof Error ? e.message : String(e)}`);
    }

    const allProjects = [...wishketProjects, ...freemoaProjects];

    return NextResponse.json({
        success: true,
        data: allProjects,
        totalCount: allProjects.length,
        timestamp: new Date().toISOString(),
        debug: {
            wishketCount: wishketProjects.length,
            freemoaCount: freemoaProjects.length,
            errors: errors.length > 0 ? errors : undefined,
        }
    });
}

// 위시켓: 외주(도급) 필터 적용
async function fetchWishketProjects(): Promise<Project[]> {
    try {
        // d=A4FwvCCGDODWD6AjGBTAJkA%3D = 외주(도급) 필터
        const response = await fetch('https://www.wishket.com/project/?d=A4FwvCCGDODWD6AjGBTAJkA%3D', {
            headers: {
                ...COMMON_HEADERS,
                'X-Requested-With': 'XMLHttpRequest',
            },
        });

        if (!response.ok) throw new Error(`Wishket: ${response.status}`);

        const data = await response.json();
        const html = data.result;
        const $ = cheerio.load(html);
        const projects: Project[] = [];

        $('.project-info-box').each((_, el) => {
            try {
                const statusText = $(el).find('.status-mark.recruiting-mark').text().trim();
                if (!statusText.includes('모집 중')) return;

                const titleEl = $(el).find('.project-link p');
                const linkEl = $(el).find('.project-link');
                if (!titleEl.length || !linkEl.length) return;

                const title = titleEl.text().trim();
                const relativeUrl = linkEl.attr('href') || '';

                // 예산 추출
                const budgetEl = $(el).find('.budget .body-1-medium');
                const budget = budgetEl.text().trim() || '협의';

                // 기간 추출
                const termEl = $(el).find('.term .body-1-medium');
                const duration = termEl.text().trim() || '협의';

                projects.push({
                    platform: 'wishket',
                    title,
                    url: `https://www.wishket.com${relativeUrl}`,
                    budget,
                    duration,
                    status: '모집중'
                });
            } catch (err) {
                console.error('Wishket parse error:', err);
            }
        });

        return projects;
    } catch (error) {
        console.error('Wishket fetch error:', error);
        return [];
    }
}

// 프리모아: 도급(원격) 필터 적용 (workType=1)
// 프록시 서비스를 통해 IP 차단 우회 시도
async function fetchFreemoaProjects(): Promise<Project[]> {
    // 방법 1: 직접 요청 시도
    try {
        const directResult = await fetchFreemoaDirect();
        if (directResult.length > 0) {
            return directResult;
        }
    } catch (e) {
        console.log('Direct fetch failed, trying proxy...', e);
    }

    // 방법 2: 프록시 서비스를 통한 요청
    try {
        const proxyResult = await fetchFreemoaViaProxy();
        return proxyResult;
    } catch (e) {
        console.log('Proxy fetch also failed', e);
        throw e;
    }
}

// 직접 요청
async function fetchFreemoaDirect(): Promise<Project[]> {
    const params = new URLSearchParams();
    params.append('page', '1');
    params.append('workType', '1');

    const response = await fetch('https://www.freemoa.net/m4a/s41a', {
        method: 'POST',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-Requested-With': 'XMLHttpRequest',
            'Referer': 'https://www.freemoa.net/m4/s41',
            'Origin': 'https://www.freemoa.net',
        },
        body: params.toString(),
        cache: 'no-store',
    });

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const text = await response.text();

    if (text.includes('<!DOCTYPE') || text.includes('<html')) {
        throw new Error('Received HTML instead of JSON - possibly blocked');
    }

    return parseFreemoaResponse(text);
}

// 프록시를 통한 요청 (allorigins.win 사용)
async function fetchFreemoaViaProxy(): Promise<Project[]> {
    // allorigins는 GET만 지원하므로 HTML 페이지를 가져와서 파싱
    const targetUrl = 'https://www.freemoa.net/m4/s41?workType=1';
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`;

    const response = await fetch(proxyUrl, {
        headers: {
            'User-Agent': COMMON_HEADERS['User-Agent'],
        },
        cache: 'no-store',
    });

    if (!response.ok) {
        throw new Error(`Proxy HTTP ${response.status}`);
    }

    const html = await response.text();

    // HTML에서 프로젝트 데이터 추출 시도
    const $ = cheerio.load(html);
    const projects: Project[] = [];

    // 프리모아 HTML 구조에서 프로젝트 추출
    $('.project-list-item, .proj_li, [class*="project"]').each((_, el) => {
        try {
            const titleEl = $(el).find('a, .title, h3, h4').first();
            const title = titleEl.text().trim();
            if (!title || title.length < 5) return;

            const link = titleEl.attr('href') || $(el).find('a').first().attr('href') || '';
            const url = link.startsWith('http') ? link : `https://www.freemoa.net${link}`;

            projects.push({
                platform: 'freemoa',
                title,
                url,
                budget: '프리모아에서 확인',
                duration: '프리모아에서 확인',
                status: '모집중'
            });
        } catch (err) {
            // skip
        }
    });

    if (projects.length === 0) {
        throw new Error('Could not parse projects from proxy response');
    }

    return projects.slice(0, 10);
}

// 프리모아 JSON 응답 파싱
function parseFreemoaResponse(text: string): Project[] {
    const data = JSON.parse(text);

    if (data.ERROR?.NO !== 0) {
        throw new Error(`API Error: ${data.ERROR?.MSG || 'Unknown'}`);
    }

    const projectList = data?.DATA?.PROJECT?.LIST || [];

    return projectList.slice(0, 10).map((p: {
        proj_idx: string;
        title: string;
        cost_min: string;
        cost_max: string;
        during: string;
    }) => ({
        platform: 'freemoa' as const,
        title: p.title,
        url: `https://www.freemoa.net/m4/s41?prid=${p.proj_idx}`,
        budget: p.cost_min && p.cost_max
            ? `${Number(p.cost_min).toLocaleString()}~${Number(p.cost_max).toLocaleString()}만원`
            : '협의',
        duration: p.during ? `${p.during}일` : '협의',
        status: '모집중'
    }));
}
