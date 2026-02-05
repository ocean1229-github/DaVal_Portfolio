// Freemoa 포트폴리오 자동 입력 스크립트
// 사용법: 브라우저에서 F12 → Console 탭 → 이 코드 붙여넣기 → Enter

(async function() {
    // 포트폴리오 데이터 가져오기
    const res = await fetch('https://daval-portfolio.vercel.app/api/portfolios');
    const json = await res.json();
    const portfolios = json.data || [];

    console.log(`총 ${portfolios.length}개 포트폴리오 로드됨`);

    // 현재 인덱스 (localStorage에 저장)
    let currentIndex = parseInt(localStorage.getItem('freemoa_index') || '0');

    if (currentIndex >= portfolios.length) {
        console.log('모든 포트폴리오 완료!');
        localStorage.removeItem('freemoa_index');
        return;
    }

    const portfolio = portfolios[currentIndex];
    console.log(`[${currentIndex + 1}/${portfolios.length}] ${portfolio.company_name || ''} - ${portfolio.title}`);

    // 폼 채우기
    const title = `${portfolio.company_name ? portfolio.company_name + ' - ' : ''}${portfolio.title}`;

    // 제목
    document.getElementById('pf_title').value = title;
    console.log('✓ 제목:', title);

    // 참여분야 - 전체
    const isAll = document.getElementById('is_all');
    if (isAll && !isAll.checked) isAll.click();
    console.log('✓ 참여분야: 전체');

    // 참여율
    document.getElementById('project_rate').value = '100';
    console.log('✓ 참여율: 100%');

    // 포트폴리오 타입 - 이미지 없음
    const noneImg = document.querySelector('input[value="noneimage"]');
    if (noneImg) noneImg.click();
    console.log('✓ 타입: 이미지 없음');

    // 기본 이미지 선택
    const imgNum = (currentIndex % 5) + 1;
    const defaultImg = document.querySelector(`input[name="defaultImgRadio"][value="${imgNum}"]`);
    if (defaultImg) defaultImg.click();
    console.log('✓ 기본이미지:', imgNum);

    // 내용
    const detail = portfolio.description || portfolio.summary || portfolio.title;
    document.getElementById('pf_detail').value = detail.substring(0, 500);
    console.log('✓ 내용 입력됨');

    // 태그
    if (portfolio.tags && portfolio.tags.length > 0) {
        const tagsStr = portfolio.tags.slice(0, 5).join(',');
        document.getElementById('pf_tags').value = tagsStr;
        console.log('✓ 태그:', tagsStr);
    }

    // 개발분류 - 웹
    const methodWeb = document.getElementById('methodCheck_4');
    if (methodWeb && !methodWeb.checked) methodWeb.click();
    console.log('✓ 개발분류: 웹');

    // 카테고리 - 기술
    const catTech = document.getElementById('categoryCheck_5');
    if (catTech && !catTech.checked) catTech.click();
    console.log('✓ 카테고리: 기술');

    // 다음 인덱스 저장
    localStorage.setItem('freemoa_index', (currentIndex + 1).toString());

    console.log('\n========================================');
    console.log('✅ 폼 입력 완료!');
    console.log('내용 확인 후 "등록" 버튼을 클릭하세요.');
    console.log(`남은 포트폴리오: ${portfolios.length - currentIndex - 1}개`);
    console.log('다음 포트폴리오: 등록 후 이 페이지에서 다시 스크립트 실행');
    console.log('========================================');
})();
