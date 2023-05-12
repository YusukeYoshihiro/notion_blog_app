import { Client } from '@notionhq/client';
import { PageObjectResponse, PartialPageObjectResponse, QueryDatabaseResponse, RichTextItemResponse, TextRichTextItemResponse } from '@notionhq/client/build/src/api-endpoints';
import { NotionToMarkdown } from 'notion-to-md';
import { MdStringObject } from 'notion-to-md/build/types';
import { NotionApiCustomPost } from '../common/commonType';

interface MetaDataAndMarkdown {
    metaData: NotionApiCustomPost
    markdown: MdStringObject
}

const notion = new Client({
    auth: process.env.NOTION_TOKEN,
});

const n2m = new NotionToMarkdown({ notionClient: notion })

const getTags = (tags: { name: string }[]) => {
    const allTags = tags.map((tag: { name: string }) => {
        return tag.name;
    });
    return allTags;
}

/**
 * Get all posts data
 * @returns Promise<(NotionApiCustomPost | undefined)[]>
 */
export const getAllPosts = async (): Promise<(NotionApiCustomPost | undefined)[]> => {
    try {
        const posts = await notion.databases.query({
            database_id: process.env.NOTION_DATABASE_ID || '',
            page_size: 100,
        });
        const allPosts: (PageObjectResponse | PartialPageObjectResponse)[] = posts.results;

        return allPosts.map((post) => {
            if (!("properties" in post
                && "title" in post.properties.Name
                && "rich_text" in post.properties.Description
                && "rich_text" in post.properties.Slug
                && "date" in post.properties.Date
                && "multi_select" in post.properties.Tags
            )) {
                return
            }

            const typedPost: NotionApiCustomPost = {
                id: post.id,
                title: post.properties.Name.title[0].plain_text,
                description: post.properties.Description.rich_text[0].plain_text,
                date: post.properties.Date.date?.start,
                slug: post.properties.Slug.rich_text[0].plain_text,
                tags: getTags(post.properties.Tags.multi_select),
            }
            return typedPost;
        })
    } catch (error) {
        console.log(error);
        throw new Error("Failed to retrieved posts from Notion API.")
    }
}

/**
 * Get single post data as metaData AND markdownData
 * @param slug : string
 * @returns Promise<MetaDataAndMarkdown | undefined>
 */
export const getSinglePost = async (slug: string): Promise<MetaDataAndMarkdown | undefined> => {
    try {
        if (!slug) {
            return
        }

        const response = await notion.databases.query({
            database_id: process.env.NOTION_DATABASE_ID || '',
            filter: {
                property: 'Slug',
                formula: {
                    string: {
                        equals: slug,
                    }
                }
            },
        });

        const page: PageObjectResponse | PartialPageObjectResponse = response.results[0];

        if (!("properties" in page
            && "title" in page.properties.Name
            && "rich_text" in page.properties.Description
            && "rich_text" in page.properties.Slug
            && "date" in page.properties.Date
            && "multi_select" in page.properties.Tags)
        ) {
            return
        }

        const metaData = {
            id: page.id,
            title: page.properties.Name.title[0].plain_text,
            description: page.properties.Description.rich_text[0].plain_text,
            date: page.properties.Date.date?.start,
            slug: page.properties.Slug.rich_text[0].plain_text,
            tags: getTags(page.properties.Tags.multi_select),
        }

        const mdBlocks = await n2m.pageToMarkdown(page.id);
        const mdString = n2m.toMarkdownString(mdBlocks);

        return {
            metaData: metaData,
            markdown: mdString,
        }
    } catch (error) {
        console.log(error);
        throw new Error('slug is not founded');
    }
};