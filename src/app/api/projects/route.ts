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

// 여러 프록시 서비스를 순차적으로 시도
async function fetchFreemoaViaProxy(): Promise<Project[]> {
    const targetUrl = 'https://www.freemoa.net/m4/s41?workType=1';

    // 시도할 프록시 목록
    const proxies = [
        `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`,
        `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`,
        `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(targetUrl)}`,
    ];

    for (const proxyUrl of proxies) {
        try {
            console.log(`Trying proxy: ${proxyUrl.substring(0, 50)}...`);

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10초 타임아웃

            const response = await fetch(proxyUrl, {
                headers: {
                    'User-Agent': COMMON_HEADERS['User-Agent'],
                },
                cache: 'no-store',
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                console.log(`Proxy returned ${response.status}, trying next...`);
                continue;
            }

            const html = await response.text();

            if (!html || html.length < 100) {
                console.log('Empty or too short response, trying next...');
                continue;
            }

            const projects = parseFreemoaHtml(html);
            if (projects.length > 0) {
                console.log(`Success! Found ${projects.length} projects via proxy`);
                return projects;
            }
        } catch (err) {
            console.log(`Proxy failed: ${err instanceof Error ? err.message : String(err)}`);
            continue;
        }
    }

    throw new Error('All proxies failed');
}

// 프리모아 HTML 페이지에서 프로젝트 추출
function parseFreemoaHtml(html: string): Project[] {
    const $ = cheerio.load(html);
    const projects: Project[] = [];

    // 프리모아 프로젝트 목록 구조 분석 (여러 셀렉터 시도)
    const selectors = [
        '.project-list-item',
        '.proj_li',
        '.project_item',
        '[class*="proj"]',
        'li[data-idx]',
        '.list_item',
    ];

    for (const selector of selectors) {
        $(selector).each((_, el) => {
            try {
                const titleEl = $(el).find('a, .title, h3, h4, .proj_title').first();
                const title = titleEl.text().trim();
                if (!title || title.length < 5) return;

                const link = titleEl.attr('href') || $(el).find('a').first().attr('href') || '';
                const url = link.startsWith('http') ? link : `https://www.freemoa.net${link}`;

                // 중복 체크
                if (projects.some(p => p.title === title)) return;

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

        if (projects.length > 0) break;
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
