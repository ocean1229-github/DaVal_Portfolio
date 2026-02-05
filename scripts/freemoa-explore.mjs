import puppeteer from 'puppeteer';

const LOGIN_URL = 'https://www.freemoa.net/m0/s02';
const PORTFOLIO_URL = 'https://www.freemoa.net/m5/portfolio_register';
const EMAIL = 'business@epqpf.com';
const PASSWORD = 'epqpf123698745~';

async function explorePortfolioForm() {
    console.log('브라우저 시작...');
    const browser = await puppeteer.launch({
        headless: false, // 브라우저 보이게
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    try {
        // 1. 로그인 페이지 이동
        console.log('로그인 페이지 이동...');
        await page.goto(LOGIN_URL, { waitUntil: 'networkidle2' });
        await page.screenshot({ path: 'scripts/screenshots/01-login-page.png' });

        // 2. 로그인 폼 입력
        console.log('로그인 시도...');

        // 이메일/아이디 입력 필드 찾기
        const emailSelectors = ['input[name="email"]', 'input[name="id"]', 'input[name="user_id"]', 'input[type="email"]', 'input[name="mb_id"]'];
        let emailInput = null;
        for (const selector of emailSelectors) {
            emailInput = await page.$(selector);
            if (emailInput) {
                console.log(`이메일 필드 발견: ${selector}`);
                break;
            }
        }

        // 비밀번호 입력 필드 찾기
        const pwdSelectors = ['input[name="password"]', 'input[name="pw"]', 'input[name="user_pw"]', 'input[type="password"]', 'input[name="mb_password"]'];
        let pwdInput = null;
        for (const selector of pwdSelectors) {
            pwdInput = await page.$(selector);
            if (pwdInput) {
                console.log(`비밀번호 필드 발견: ${selector}`);
                break;
            }
        }

        if (emailInput && pwdInput) {
            await emailInput.type(EMAIL, { delay: 50 });
            await pwdInput.type(PASSWORD, { delay: 50 });
            await page.screenshot({ path: 'scripts/screenshots/02-login-filled.png' });

            // 로그인 버튼 클릭
            const loginBtn = await page.$('button[type="submit"], input[type="submit"], .btn_login, .login-btn');
            if (loginBtn) {
                await loginBtn.click();
                await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 10000 }).catch(() => {});
            }
        }

        await page.screenshot({ path: 'scripts/screenshots/03-after-login.png' });
        console.log('현재 URL:', page.url());

        // 3. 포트폴리오 등록 페이지 이동
        console.log('포트폴리오 등록 페이지 이동...');
        await page.goto(PORTFOLIO_URL, { waitUntil: 'networkidle2' });
        await page.screenshot({ path: 'scripts/screenshots/04-portfolio-page.png' });

        // 4. 폼 구조 분석
        console.log('\n=== 폼 필드 분석 ===\n');

        const formData = await page.evaluate(() => {
            const inputs = Array.from(document.querySelectorAll('input, select, textarea'));
            return inputs.map(el => ({
                tag: el.tagName.toLowerCase(),
                type: el.type || '',
                name: el.name || '',
                id: el.id || '',
                placeholder: el.placeholder || '',
                className: el.className || '',
                options: el.tagName === 'SELECT' ? Array.from(el.options).map(o => ({ value: o.value, text: o.text })) : []
            }));
        });

        formData.forEach((field, i) => {
            console.log(`[${i + 1}] <${field.tag}> type="${field.type}" name="${field.name}" id="${field.id}"`);
            if (field.placeholder) console.log(`    placeholder: "${field.placeholder}"`);
            if (field.options.length > 0) {
                console.log(`    options: ${field.options.slice(0, 5).map(o => o.text).join(', ')}${field.options.length > 5 ? '...' : ''}`);
            }
        });

        // HTML 저장
        const html = await page.content();
        const fs = await import('fs');
        fs.writeFileSync('scripts/screenshots/portfolio-page.html', html);
        console.log('\nHTML 저장됨: scripts/screenshots/portfolio-page.html');

        console.log('\n완료! 브라우저를 확인하세요. 종료하려면 Ctrl+C');

        // 브라우저 열어둠
        await new Promise(resolve => setTimeout(resolve, 300000)); // 5분 대기

    } catch (error) {
        console.error('에러:', error.message);
        await page.screenshot({ path: 'scripts/screenshots/error.png' });
    } finally {
        await browser.close();
    }
}

// screenshots 폴더 생성
import { mkdirSync } from 'fs';
try { mkdirSync('scripts/screenshots', { recursive: true }); } catch {}

explorePortfolioForm();
