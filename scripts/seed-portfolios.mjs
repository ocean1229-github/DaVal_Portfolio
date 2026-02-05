import { Client } from '@notionhq/client';
import { readFileSync } from 'fs';

// Read .env.local manually
const envFile = readFileSync('.env.local', 'utf-8');
const envVars = {};
envFile.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
        envVars[key.trim()] = valueParts.join('=').trim();
    }
});

const notion = new Client({
    auth: envVars.NOTION_API_KEY,
});

const databaseId = envVars.NOTION_DATABASE_ID;

const portfolios = [
    {
        title: 'SPACE TAILOR 프로젝트',
        slug: 'space-tailor',
        summary: 'SPACE TAILOR',
        category: '',
        dev_type: 'web',
        description: '',
        tags: [],
        display_order: 13,
    },
    {
        title: 'beyond captur 프로젝트',
        slug: 'beyond-captur',
        summary: 'beyond captur',
        category: '',
        dev_type: 'web',
        description: '',
        tags: [],
        display_order: 14,
    },
    {
        title: 'DentiQube 프로젝트',
        slug: 'dentiqube',
        summary: 'DentiQube',
        category: '',
        dev_type: 'web',
        description: '',
        tags: [],
        display_order: 15,
    },
    {
        title: '칭찬모아 프로젝트',
        slug: 'chingchanmoa',
        summary: '칭찬모아',
        category: '',
        dev_type: 'web',
        description: '',
        tags: [],
        display_order: 16,
    },
    {
        title: 'Rilcy 프로젝트',
        slug: 'rilcy',
        summary: 'Rilcy',
        category: '',
        dev_type: 'web',
        description: '',
        tags: [],
        display_order: 19,
    },
    {
        title: 'PARENTLY 프로젝트',
        slug: 'parently',
        summary: 'PARENTLY',
        category: '',
        dev_type: 'web',
        description: '',
        tags: [],
        display_order: 21,
    },
    {
        title: 'DIAOCEAN 프로젝트',
        slug: 'diaocean',
        summary: 'DIAOCEAN',
        category: '',
        dev_type: 'web',
        description: '',
        tags: [],
        display_order: 22,
    },
];

async function createPortfolio(data) {
    const properties = {
        Title: { title: [{ text: { content: data.title } }] },
        Slug: { rich_text: [{ text: { content: data.slug } }] },
        Summary: { rich_text: [{ text: { content: data.summary || '' } }] },
        Category: { rich_text: [{ text: { content: data.category || '' } }] },
        DevType: { select: { name: data.dev_type } },
        Description: { rich_text: [{ text: { content: data.description || '' } }] },
        Tags: { multi_select: data.tags.map(tag => ({ name: tag })) },
        Published: { checkbox: true },
        Order: { number: data.display_order },
    };

    const response = await notion.pages.create({
        parent: { database_id: databaseId },
        properties,
    });

    return response;
}

async function main() {
    console.log('Starting portfolio seed...');

    for (const portfolio of portfolios) {
        try {
            const result = await createPortfolio(portfolio);
            console.log(`Created: ${portfolio.summary} (${result.id})`);
        } catch (error) {
            console.error(`Failed to create ${portfolio.summary}:`, error.message);
        }
    }

    console.log('Done!');
}

main();
