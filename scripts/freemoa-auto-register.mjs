import puppeteer from 'puppeteer';

const LOGIN_URL = 'https://www.freemoa.net/m0/s02';
const PORTFOLIO_URL = 'https://www.freemoa.net/m5/portfolio_register';

// 개발분류 매핑
const METHOD_MAP = {
    'web': 4,       // 웹
    'app': [1, 2],  // iOS + Android
    'ios': 1,
    'android': 2,
    'mobile': 5,    // 모바일웹
    'etc': 18,      // 기타
};

// 카테고리 매핑
const CATEGORY_MAP = {
    'photo booth': 4,       // 문화
    'lms': 1,              // 교육,학원
    '신용등급 평가': 12,    // 금융
    '전자계약': 5,         // 기술
    '심리상담': 2,         // 의료
    '영상': 16,            // 컨텐츠
    'default': 5,          // 기술
};

// 포트폴리오 데이터 가져오기
async function fetchPortfolios() {
    const res = await fetch('https://daval-portfolio.vercel.app/api/portfolios');
    const json = await res.json();
    return json.data || [];
}

async function waitForLogin(page) {
    console.log('\n========================================');
    console.log('브라우저에서 구글 로그인을 완료해주세요!');
    console.log('로그인 완료되면 Enter를 눌러 계속...');
    console.log('========================================\n');

    // 60초 대기 후 자동 진행
    await new Promise(r => setTimeout(r, 60000));
    console.log('✓ 60초 대기 완료, 진행합니다...');
}

async function registerPortfolio(page, portfolio, index, total) {
    console.log(`\n[${index + 1}/${total}] ${portfolio.company_name} - ${portfolio.title}`);

    // 포트폴리오 등록 페이지로 이동
    await page.goto(PORTFOLIO_URL, { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 2000));

    // 1. 제목 입력
    const title = `${portfolio.company_name ? portfolio.company_name + ' - ' : ''}${portfolio.title}`;
    await page.evaluate((val) => {
        document.getElementById('pf_title').value = val;
    }, title);
    console.log(`  - 제목: ${title}`);

    // 2. 기간 입력 (시작일/종료일)
    if (portfolio.project_start_date) {
        const startDate = new Date(portfolio.project_start_date).toISOString().split('T')[0];
        await page.evaluate((val) => {
            document.getElementById('pf_bdate').value = val;
        }, startDate);
    }
    if (portfolio.project_end_date) {
        const endDate = new Date(portfolio.project_end_date).toISOString().split('T')[0];
        await page.evaluate((val) => {
            document.getElementById('pf_edate').value = val;
        }, endDate);
    }

    // 3. 참여분야 체크 (전체 선택)
    await page.click('#is_all');
    console.log(`  - 참여분야: 전체`);

    // 4. 참여율
    const rate = portfolio.participation_rate || 100;
    await page.evaluate((val) => {
        document.getElementById('project_rate').value = val;
    }, rate.toString());
    console.log(`  - 참여율: ${rate}%`);

    // 5. 포트폴리오 타입 (이미지 없음 선택)
    await page.click('input[value="noneimage"]');

    // 6. 기본 이미지 선택 (랜덤)
    const imgNum = (index % 5) + 1;
    await page.click(`input[name="defaultImgRadio"][value="${imgNum}"]`);

    // 7. 내용 입력
    const detail = portfolio.description || portfolio.summary || portfolio.title;
    await page.evaluate((val) => {
        document.getElementById('pf_detail').value = val;
    }, detail.substring(0, 500));
    console.log(`  - 내용: ${detail.substring(0, 50)}...`);

    // 8. 태그 입력
    if (portfolio.tags && portfolio.tags.length > 0) {
        const tagsStr = portfolio.tags.slice(0, 5).join(',');
        await page.evaluate((val) => {
            document.getElementById('pf_tags').value = val;
        }, tagsStr);
        console.log(`  - 태그: ${tagsStr}`);
    }

    // 9. 개발분류 선택
    const devType = portfolio.dev_type?.toLowerCase() || 'etc';
    const methodValue = METHOD_MAP[devType] || METHOD_MAP['etc'];
    if (Array.isArray(methodValue)) {
        for (const v of methodValue) {
            await page.click(`#methodCheck_${v}`).catch(() => {});
        }
    } else {
        await page.click(`#methodCheck_${methodValue}`).catch(() => {});
    }

    // 10. 카테고리 선택
    const category = portfolio.category?.toLowerCase() || 'default';
    const categoryValue = CATEGORY_MAP[category] || CATEGORY_MAP['default'];
    await page.click(`#categoryCheck_${categoryValue}`).catch(() => {});

    // 스크린샷 저장
    await page.screenshot({
        path: `scripts/screenshots/register-${index + 1}.png`,
        fullPage: true
    });

    console.log(`  ✓ 폼 입력 완료 (스크린샷: register-${index + 1}.png)`);

    // 제출은 수동으로 확인 후 진행하도록 대기
    return true;
}

async function main() {
    console.log('=== Freemoa 포트폴리오 자동 등록 ===\n');

    // 포트폴리오 데이터 가져오기
    console.log('포트폴리오 데이터 로딩...');
    const portfolios = await fetchPortfolios();
    console.log(`총 ${portfolios.length}개의 포트폴리오\n`);

    // 브라우저 시작
    const browser = await puppeteer.launch({
        headless: false,
        args: ['--no-sandbox', '--window-size=1400,900'],
        defaultViewport: { width: 1400, height: 900 }
    });

    const page = await browser.newPage();

    try {
        // 로그인
        await page.goto(LOGIN_URL, { waitUntil: 'networkidle2' });
        await waitForLogin(page);

        console.log('\n========================================');
        console.log('등록을 시작합니다.');
        console.log('각 포트폴리오 폼 입력 후 직접 확인하고');
        console.log('"등록" 버튼을 눌러주세요.');
        console.log('========================================\n');

        // 첫 번째 포트폴리오만 먼저 테스트
        if (portfolios.length > 0) {
            await registerPortfolio(page, portfolios[0], 0, portfolios.length);

            console.log('\n========================================');
            console.log('첫 번째 포트폴리오 폼이 입력되었습니다.');
            console.log('브라우저에서 내용을 확인하고 "등록" 버튼을 눌러주세요.');
            console.log('');
            console.log('다음 포트폴리오를 계속하려면 여기서 Enter를 누르세요.');
            console.log('종료하려면 Ctrl+C를 누르세요.');
            console.log('========================================\n');
        }

        // 대기
        await new Promise(resolve => setTimeout(resolve, 3600000)); // 1시간 대기

    } catch (error) {
        console.error('에러:', error.message);
    } finally {
        await browser.close();
    }
}

// screenshots 폴더 생성
import { mkdirSync } from 'fs';
try { mkdirSync('scripts/screenshots', { recursive: true }); } catch {}

main();
