import puppeteer from 'puppeteer';
import { readFileSync } from 'fs';

const LOGIN_URL = 'https://www.freemoa.net/m0/s02';
const PORTFOLIO_URL = 'https://www.freemoa.net/m5/portfolio_register';

// 환경변수 로드
const envFile = readFileSync('.env.local', 'utf-8');
const envVars = {};
envFile.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
        envVars[key.trim()] = valueParts.join('=').trim();
    }
});

// 포트폴리오 데이터 가져오기
async function fetchPortfolios() {
    const res = await fetch('https://daval-portfolio.vercel.app/api/portfolios');
    const json = await res.json();
    return json.data || [];
}

async function waitForLogin(page) {
    console.log('\n========================================');
    console.log('브라우저에서 구글 로그인을 완료해주세요!');
    console.log('로그인 완료 후 자동으로 진행됩니다...');
    console.log('========================================\n');

    // 로그인 버튼이 사라질 때까지 대기 (로그인 완료 의미)
    while (true) {
        await new Promise(r => setTimeout(r, 2000));
        const currentUrl = page.url();
        const loginBtn = await page.$('.loginBtn_new, a[href="/m0/s02"]');

        // 헤더에 로그인 버튼이 없으면 로그인 완료
        if (!loginBtn) {
            console.log('✓ 로그인 감지됨!');
            break;
        }

        // 메인 페이지로 리다이렉트되면 로그인 완료
        if (currentUrl === 'https://www.freemoa.net/' || currentUrl.includes('mypage')) {
            console.log('✓ 로그인 완료!');
            break;
        }
    }
}

async function analyzeForm(page) {
    console.log('\n포트폴리오 등록 페이지 분석 중...');
    await page.goto(PORTFOLIO_URL, { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 3000)); // 페이지 로딩 대기

    // 스크린샷
    await page.screenshot({ path: 'scripts/screenshots/portfolio-form.png', fullPage: true });

    // 폼 필드 분석
    const formData = await page.evaluate(() => {
        const inputs = Array.from(document.querySelectorAll('input, select, textarea'));
        return inputs.map(el => ({
            tag: el.tagName.toLowerCase(),
            type: el.type || '',
            name: el.name || '',
            id: el.id || '',
            placeholder: el.placeholder || '',
            className: el.className || '',
            value: el.value || '',
            options: el.tagName === 'SELECT' ? Array.from(el.options).map(o => ({ value: o.value, text: o.text })) : []
        })).filter(f => f.type !== 'hidden' && f.name !== 'ci_csrf_token');
    });

    console.log('\n=== 발견된 폼 필드 ===\n');
    formData.forEach((field, i) => {
        console.log(`[${i + 1}] <${field.tag}> name="${field.name}" id="${field.id}" type="${field.type}"`);
        if (field.placeholder) console.log(`    placeholder: "${field.placeholder}"`);
        if (field.options.length > 0) {
            console.log(`    options: ${field.options.slice(0, 10).map(o => `${o.value}:${o.text}`).join(', ')}`);
        }
    });

    // HTML 저장
    const html = await page.content();
    const fs = await import('fs');
    fs.writeFileSync('scripts/screenshots/portfolio-form.html', html);

    return formData;
}

async function main() {
    console.log('Freemoa 포트폴리오 자동 등록 스크립트\n');

    // 포트폴리오 데이터 가져오기
    console.log('포트폴리오 데이터 로딩...');
    const portfolios = await fetchPortfolios();
    console.log(`총 ${portfolios.length}개의 포트폴리오 발견\n`);

    portfolios.forEach((p, i) => {
        console.log(`${i + 1}. ${p.company_name || '(회사명 없음)'} - ${p.title}`);
    });

    // 브라우저 시작
    console.log('\n브라우저 시작...');
    const browser = await puppeteer.launch({
        headless: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1400,900'],
        defaultViewport: { width: 1400, height: 900 }
    });

    const page = await browser.newPage();

    try {
        // 로그인 페이지로 이동
        console.log('로그인 페이지 이동...');
        await page.goto(LOGIN_URL, { waitUntil: 'networkidle2' });

        // 로그인 대기
        await waitForLogin(page);

        // 포트폴리오 폼 분석
        const formFields = await analyzeForm(page);

        console.log('\n========================================');
        console.log('폼 분석 완료! 스크린샷 확인:');
        console.log('scripts/screenshots/portfolio-form.png');
        console.log('scripts/screenshots/portfolio-form.html');
        console.log('========================================');

        console.log('\n이 정보를 바탕으로 자동 등록 스크립트를 완성할 수 있습니다.');
        console.log('브라우저를 열어두고 수동으로 폼을 확인해보세요.');
        console.log('종료하려면 Ctrl+C를 누르세요.\n');

        // 브라우저 열어둠
        await new Promise(resolve => setTimeout(resolve, 600000)); // 10분 대기

    } catch (error) {
        console.error('에러:', error.message);
        await page.screenshot({ path: 'scripts/screenshots/error.png' });
    } finally {
        await browser.close();
    }
}

// screenshots 폴더 생성
import { mkdirSync } from 'fs';
try { mkdirSync('scripts/screenshots', { recursive: true }); } catch { }

main();
