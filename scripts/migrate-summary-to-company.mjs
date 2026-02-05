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

async function migrateSummaryToCompany() {
    try {
        console.log('Fetching all portfolios...');

        const response = await notion.databases.query({
            database_id: databaseId,
        });

        console.log(`Found ${response.results.length} portfolios`);

        for (const page of response.results) {
            const props = page.properties;
            const title = props.Title?.title?.[0]?.plain_text || 'Untitled';
            const summary = props.Summary?.rich_text?.[0]?.plain_text || '';

            if (summary) {
                console.log(`Migrating: "${title}" - Company: "${summary}"`);

                await notion.pages.update({
                    page_id: page.id,
                    properties: {
                        Company: {
                            rich_text: [{ text: { content: summary } }],
                        },
                    },
                });
            } else {
                console.log(`Skipping: "${title}" - No summary`);
            }
        }

        console.log('\n✅ Migration completed!');
    } catch (error) {
        console.error('❌ Migration failed:', error.message);
    }
}

migrateSummaryToCompany();
