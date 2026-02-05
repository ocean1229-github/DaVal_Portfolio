import { Client } from '@notionhq/client';
import { readFileSync } from 'fs';

// 환경변수 로드
const envFile = readFileSync('.env.local', 'utf-8');
const envVars = {};
envFile.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
        envVars[key.trim()] = valueParts.join('=').trim();
    }
});

const notion = new Client({ auth: envVars.NOTION_API_KEY });
const companyDbId = envVars.NOTION_COMPANY_DATABASE_ID;
const servicesDbId = envVars.NOTION_SERVICES_DATABASE_ID;

// 회사 정보 데이터
const companyData = [
    {
        section: 'hero',
        title: '자동화의 대중화',
        content: '중소기업의 성장을 돕는 AI 기반 Managed BPaaS 플랫폼. IT 인력이 부족해도, 자연어와 영상만으로 업무 자동화를 구축하고 유지보수까지 일괄 관리받을 수 있습니다.',
        order: 1
    },
    {
        section: 'about',
        title: '주식회사 데벨 (DaVal)',
        content: '데벨은 중소기업이 기술적 제약 없이 본업의 가치 창출에만 집중할 수 있는 환경을 조성합니다.\n\n• Empowerment: 기술을 통해 고객사의 잠재력을 극대화합니다.\n• Reliability: 구축부터 사후관리까지 책임지는 신뢰를 핵심으로 합니다.\n• Simplicity: 복잡한 관리 없이 요청만으로 결과물을 얻는 비효율의 최소화를 추구합니다.',
        order: 2
    },
    {
        section: 'vision',
        title: '우리의 비전',
        content: '단순한 도구 제공이 아니라, 고객사가 본연의 비즈니스에 집중할 수 있는 "시간"을 벌어줌으로써 실제적인 성장을 견인합니다.\n\n궁극적으로 단순 자동화를 넘어, 축적된 데이터를 기반으로 중소기업의 의사결정을 지원하는 "AI 경영 파트너"로 진화하고자 합니다.',
        order: 3
    },
    {
        section: 'history',
        title: '성장 로드맵',
        content: '• 현재: 전문가 기반 데이터 축적 및 초기 매출 달성\n• 단기: AI 구축 보조 시스템 고도화로 구축 비용 1/10 절감\n• 장기: 중소기업 AI 경영 파트너로 진화',
        order: 4
    }
];

// 서비스 데이터
const servicesData = [
    {
        title: 'Non-Technical Input',
        description: '코딩 지식이나 복잡한 툴 학습 없이, 자연어 프롬프트와 업무 시연 영상 링크만으로 자동화가 가능합니다. 원하는 업무를 설명하고 영상으로 보여주기만 하면 됩니다.',
        icon: 'brain',
        highlights: ['자연어 요청', '영상 기반 분석', '학습 비용 Zero'],
        order: 1
    },
    {
        title: 'Custom-Build Service',
        description: 'CIO급 전문가와 AI 시스템이 결합하여 해당 기업의 특수한 비즈니스 로직에 100% 맞춤형 자동화를 수일 내에 구축합니다. 템플릿이 아닌, 당신만의 솔루션입니다.',
        icon: 'code',
        highlights: ['100% 맞춤 구축', '전문가 + AI', '빠른 개발'],
        order: 2
    },
    {
        title: 'Full-Managed Platform',
        description: '구축 이후 API 변경이나 환경 변화에 따른 모든 유지보수를 DaVal 플랫폼 내에서 전담합니다. 한 번 만들면 평생 지속되는 관리 서비스를 제공합니다.',
        icon: 'shield',
        highlights: ['평생 유지보수', '실시간 모니터링', '자동 업데이트'],
        order: 3
    }
];

async function seedCompanyInfo() {
    console.log('=== 회사 정보 추가 중... ===\n');

    for (const data of companyData) {
        try {
            const response = await notion.pages.create({
                parent: { database_id: companyDbId },
                properties: {
                    Title: { title: [{ text: { content: data.title } }] },
                    Content: { rich_text: [{ text: { content: data.content } }] },
                    Section: { select: { name: data.section } },
                    Order: { number: data.order }
                }
            });
            console.log(`✓ ${data.section}: ${data.title}`);
        } catch (error) {
            console.error(`✗ ${data.section} 추가 실패:`, error.message);
        }
    }
}

async function seedServices() {
    console.log('\n=== 서비스 정보 추가 중... ===\n');

    for (const data of servicesData) {
        try {
            const response = await notion.pages.create({
                parent: { database_id: servicesDbId },
                properties: {
                    Title: { title: [{ text: { content: data.title } }] },
                    Description: { rich_text: [{ text: { content: data.description } }] },
                    Icon: { select: { name: data.icon } },
                    Highlights: { multi_select: data.highlights.map(h => ({ name: h })) },
                    Order: { number: data.order }
                }
            });
            console.log(`✓ 서비스: ${data.title}`);
        } catch (error) {
            console.error(`✗ ${data.title} 추가 실패:`, error.message);
        }
    }
}

async function main() {
    console.log('DaVal 회사 정보 시드 스크립트\n');
    console.log('Company DB:', companyDbId);
    console.log('Services DB:', servicesDbId);
    console.log('');

    if (!companyDbId || !servicesDbId) {
        console.error('환경변수가 설정되지 않았습니다.');
        return;
    }

    await seedCompanyInfo();
    await seedServices();

    console.log('\n=== 완료! ===');
    console.log('https://daval-portfolio.vercel.app/about 에서 확인하세요.');
}

main();
