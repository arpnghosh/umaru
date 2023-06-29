import { Client } from "@notionhq/client";
import dotenv from 'dotenv';
dotenv.config();

const notionToken = process.env.NOTION_TOKEN;
const databaseId = process.env.NOTION_DATABASE_SECRET;

const notion = new Client({
  auth: notionToken,
});

export async function createNotionPage(name, feedbacknotion) {
  try {
    const response = await notion.pages.create({
      parent: {
        database_id: databaseId,
      },
      properties: {
        'Name': {
          'title': [
            {
              'text': {
                'content': name,
              },
            },
          ],
        },
        'Date': {
          'date': {
            'start': new Date().toISOString().split('T')[0],
          },
        },
        'Feedback': {
          'rich_text': [
            {
              'text': {
                'content': feedbacknotion,
              },
            },
          ],
        },
      },
    });

    console.log(response.public_url);
  } catch (error) {
    console.error(error);
    throw error;
  }
}
