import puppeteer from 'puppeteer';

const PORTFOLIO_URL = 'https://www.freemoa.net/m5/portfolio_register';

// 포트폴리오 데이터 가져오기
async function fetchPortfolios() {
    const res = await fetch('https://daval-portfolio.vercel.app/api/portfolios');
    const json = await res.json();
    return json.data || [];
}

async function fillForm(page, portfolio, index) {
    console.log(`\n[${index + 1}] ${portfolio.company_name || ''} - ${portfolio.title}`);

    // 1. 제목 입력
    const title = `${portfolio.company_name ? portfolio.company_name + ' - ' : ''}${portfolio.title}`;
    await page.$eval('#pf_title', (el, val) => el.value = val, title);
    console.log(`  제목: ${title}`);

    // 2. 참여분야 - 전체 클릭
    const isAllChecked = await page.$eval('#is_all', el => el.checked);
    if (!isAllChecked) {
        await page.click('#is_all');
    }
    console.log(`  참여분야: 전체`);

    // 3. 참여율
    const rate = portfolio.participation_rate || 100;
    await page.$eval('#project_rate', (el, val) => el.value = val, rate.toString());
    console.log(`  참여율: ${rate}%`);

    // 4. 포트폴리오 타입 - 이미지 없음
    await page.click('input[value="noneimage"]');

    // 5. 기본 이미지 선택
    const imgNum = (index % 5) + 1;
    await page.click(`input[name="defaultImgRadio"][value="${imgNum}"]`);
    console.log(`  기본이미지: ${imgNum}`);

    // 6. 내용 입력
    const detail = portfolio.description || portfolio.summary || portfolio.title;
    await page.$eval('#pf_detail', (el, val) => el.value = val, detail.substring(0, 500));
    console.log(`  내용: ${detail.substring(0, 30)}...`);

    // 7. 태그 입력
    if (portfolio.tags && portfolio.tags.length > 0) {
        const tagsStr = portfolio.tags.slice(0, 5).join(',');
        await page.$eval('#pf_tags', (el, val) => el.value = val, tagsStr);
        console.log(`  태그: ${tagsStr}`);
    }

    // 8. 개발분류 - 웹 선택
    await page.click('#methodCheck_4').catch(() => {});

    // 9. 카테고리 - 기술 선택
    await page.click('#categoryCheck_5').catch(() => {});

    console.log(`  ✓ 폼 입력 완료!`);
}

async function main() {
    console.log('=== Freemoa 포트폴리오 등록 도우미 ===\n');

    const portfolios = await fetchPortfolios();
    console.log(`총 ${portfolios.length}개 포트폴리오 로드됨\n`);

    const browser = await puppeteer.launch({
        headless: false,
        args: ['--no-sandbox', '--window-size=1400,900'],
        defaultViewport: { width: 1400, height: 900 }
    });

    const page = await browser.newPage();

    // 포트폴리오 등록 페이지로 바로 이동
    console.log('포트폴리오 등록 페이지로 이동합니다...');
    console.log('로그인이 필요하면 로그인 후 다시 포트폴리오 등록 페이지로 와주세요.\n');

    await page.goto(PORTFOLIO_URL, { waitUntil: 'networkidle2' });

    let currentIndex = 0;

    // URL 변경 감지하여 폼 자동 채우기
    page.on('framenavigated', async (frame) => {
        if (frame === page.mainFrame()) {
            const url = page.url();
            if (url.includes('portfolio_register') && currentIndex < portfolios.length) {
                await new Promise(r => setTimeout(r, 2000));

                // 로그인 체크 - 폼이 있는지 확인
                const hasForm = await page.$('#pf_title');
                if (hasForm) {
                    await fillForm(page, portfolios[currentIndex], currentIndex);
                    currentIndex++;

                    console.log(`\n========================================`);
                    console.log(`폼이 채워졌습니다! 내용 확인 후 "등록" 클릭하세요.`);
                    console.log(`등록 완료 후 다시 이 페이지로 오면 다음 포트폴리오가 채워집니다.`);
                    console.log(`남은 포트폴리오: ${portfolios.length - currentIndex}개`);
                    console.log(`========================================\n`);
                }
            }
        }
    });

    console.log('========================================');
    console.log('준비 완료!');
    console.log('');
    console.log('1. 로그인이 필요하면 로그인하세요');
    console.log('2. 포트폴리오 등록 페이지에서 폼이 자동으로 채워집니다');
    console.log('3. 내용 확인 후 "등록" 버튼을 클릭하세요');
    console.log('4. 등록 완료 후 다시 등록 페이지로 오면 다음 것이 채워집니다');
    console.log('');
    console.log('종료: Ctrl+C');
    console.log('========================================\n');

    // 1시간 대기
    await new Promise(r => setTimeout(r, 3600000));
    await browser.close();
}

main().catch(console.error);
