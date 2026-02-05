import puppeteer from 'puppeteer';
import * as readline from 'readline';

const PORTFOLIO_URL = 'https://www.freemoa.net/m5/portfolio_register';

// 포트폴리오 데이터
async function fetchPortfolios() {
    const res = await fetch('https://daval-portfolio.vercel.app/api/portfolios');
    const json = await res.json();
    return json.data || [];
}

// 사용자 입력 대기
function waitForEnter(prompt) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    return new Promise(resolve => {
        rl.question(prompt, () => {
            rl.close();
            resolve();
        });
    });
}

async function fillForm(page, portfolio, index) {
    console.log(`\n폼 채우는 중...`);

    try {
        // 1. 제목
        const title = `${portfolio.company_name ? portfolio.company_name + ' - ' : ''}${portfolio.title}`;
        await page.evaluate((val) => { document.getElementById('pf_title').value = val; }, title);
        console.log(`  ✓ 제목: ${title}`);

        // 2. 참여분야 - 전체
        await page.evaluate(() => {
            const el = document.getElementById('is_all');
            if (el && !el.checked) el.click();
        });
        console.log(`  ✓ 참여분야: 전체`);

        // 3. 참여율
        await page.evaluate((val) => { document.getElementById('project_rate').value = val; }, '100');
        console.log(`  ✓ 참여율: 100%`);

        // 4. 포트폴리오 타입 - 이미지 없음
        await page.evaluate(() => {
            const radio = document.querySelector('input[value="noneimage"]');
            if (radio) radio.click();
        });
        console.log(`  ✓ 타입: 이미지 없음`);

        // 5. 기본 이미지
        const imgNum = (index % 5) + 1;
        await page.evaluate((num) => {
            const radio = document.querySelector(`input[name="defaultImgRadio"][value="${num}"]`);
            if (radio) radio.click();
        }, imgNum);
        console.log(`  ✓ 기본이미지: ${imgNum}`);

        // 6. 내용
        const detail = portfolio.description || portfolio.summary || portfolio.title;
        await page.evaluate((val) => { document.getElementById('pf_detail').value = val; }, detail.substring(0, 500));
        console.log(`  ✓ 내용 입력됨`);

        // 7. 태그
        if (portfolio.tags && portfolio.tags.length > 0) {
            const tagsStr = portfolio.tags.slice(0, 5).join(',');
            await page.evaluate((val) => { document.getElementById('pf_tags').value = val; }, tagsStr);
            console.log(`  ✓ 태그: ${tagsStr}`);
        }

        // 8. 개발분류 - 웹
        await page.evaluate(() => {
            const cb = document.getElementById('methodCheck_4');
            if (cb && !cb.checked) cb.click();
        });
        console.log(`  ✓ 개발분류: 웹`);

        // 9. 카테고리 - 기술
        await page.evaluate(() => {
            const cb = document.getElementById('categoryCheck_5');
            if (cb && !cb.checked) cb.click();
        });
        console.log(`  ✓ 카테고리: 기술`);

        console.log(`\n✅ 폼 입력 완료!`);
    } catch (err) {
        console.log(`\n❌ 에러: ${err.message}`);
    }
}

async function main() {
    console.log('=== Freemoa 포트폴리오 등록 도우미 ===\n');

    const portfolios = await fetchPortfolios();
    console.log(`총 ${portfolios.length}개 포트폴리오\n`);

    // 브라우저 시작
    const browser = await puppeteer.launch({
        headless: false,
        args: ['--no-sandbox', '--window-size=1400,900'],
        defaultViewport: { width: 1400, height: 900 }
    });

    const page = await browser.newPage();
    await page.goto(PORTFOLIO_URL, { waitUntil: 'networkidle2' });

    console.log('========================================');
    console.log('브라우저가 열렸습니다.');
    console.log('1. 먼저 구글 로그인을 완료하세요');
    console.log('2. 포트폴리오 등록 페이지로 이동하세요');
    console.log('========================================\n');

    await waitForEnter('로그인 완료 후 Enter를 누르세요... ');

    let index = 0;

    while (index < portfolios.length) {
        const portfolio = portfolios[index];

        console.log(`\n========================================`);
        console.log(`[${index + 1}/${portfolios.length}] ${portfolio.company_name || ''} - ${portfolio.title}`);
        console.log(`========================================`);

        // 포트폴리오 등록 페이지로 이동
        await page.goto(PORTFOLIO_URL, { waitUntil: 'networkidle2' });
        await new Promise(r => setTimeout(r, 2000));

        // 폼이 있는지 확인
        const hasForm = await page.$('#pf_title');
        if (!hasForm) {
            console.log('\n❌ 폼을 찾을 수 없습니다. 로그인 상태를 확인하세요.');
            await waitForEnter('다시 시도하려면 Enter... ');
            continue;
        }

        // 폼 채우기
        await fillForm(page, portfolio, index);

        console.log('\n내용을 확인하고 "등록" 버튼을 클릭하세요.');
        const answer = await waitForEnter('다음 포트폴리오로 계속하려면 Enter, 종료하려면 q 입력: ');

        if (answer === 'q') break;
        index++;
    }

    console.log('\n완료!');
    await browser.close();
}

main().catch(console.error);
