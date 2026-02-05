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

async function debug() {
    const response = await notion.databases.query({
        database_id: databaseId,
        page_size: 1,
    });

    const page = response.results[0];
    console.log('=== 모든 속성 키 ===');
    console.log(Object.keys(page.properties).join(', '));

    console.log('\n=== Company 관련 속성 ===');
    for (const [key, value] of Object.entries(page.properties)) {
        if (key.toLowerCase().includes('company')) {
            console.log(`${key}:`, JSON.stringify(value, null, 2));
        }
    }
}

debug();
