import { Client } from '@notionhq/client';
import { readFileSync } from 'fs';

const envFile = readFileSync('.env.local', 'utf-8');
const envVars = {};
envFile.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
        envVars[key.trim()] = valueParts.join('=').trim();
    }
});

const notion = new Client({ auth: envVars.NOTION_API_KEY });
const databaseId = envVars.NOTION_DATABASE_ID;

async function checkData() {
    const response = await notion.databases.query({
        database_id: databaseId,
        page_size: 5,
    });

    console.log('First 5 portfolios:\n');
    for (const page of response.results) {
        const props = page.properties;
        const title = props.Title?.title?.[0]?.plain_text || 'Untitled';
        const company = props.Company?.rich_text?.[0]?.plain_text || '(없음)';
        console.log(`- ${title}`);
        console.log(`  회사명: ${company}\n`);
    }
}

checkData();
