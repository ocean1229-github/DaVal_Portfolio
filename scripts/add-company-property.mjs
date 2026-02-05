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

async function addCompanyProperty() {
    try {
        console.log('Adding Company property to Notion database...');

        await notion.databases.update({
            database_id: databaseId,
            properties: {
                Company: {
                    rich_text: {},
                },
            },
        });

        console.log('✅ Company property added successfully!');
    } catch (error) {
        console.error('❌ Failed to add property:', error.message);
    }
}

addCompanyProperty();
