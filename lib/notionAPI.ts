import { Client } from '@notionhq/client';
import { NotionToMarkdown } from 'notion-to-md';

const notion = new Client({
    auth: process.env.NOTION_TOKEN,
});

const n2m = new NotionToMarkdown({ notionClient: notion })

export type NotionApiPostResponse = {
    id: string;
    properties: {
        Name: {
            title: { plain_text: string }[];
        };
        Description: {
            rich_text: { plain_text: string }[];
        };
        Date: {
            date: { start: string } | null
        };
        Slug: {
            rich_text: { plain_text: string }[];
        };
        Tags: {
            multi_select: { name: string }[];
        }
    };
};

const getPageMetaData = (post: NotionApiPostResponse) => {
    const getTags = (tags: { name: string }[]) => {
        const allTags = tags.map((tag: { name: string }) => {
            return tag.name;
        });
        return allTags;
    }

    return {
        id: post.id,
        title: post.properties.Name.title[0].plain_text,
        description: post.properties.Description.rich_text[0].plain_text,
        date: post.properties.Date?.date?.start,
        slug: post.properties.Slug.rich_text[0].plain_text,
        tags: getTags(post.properties.Tags.multi_select),
    }
}

export const getAllPosts = async () => {

    try {
        const posts = await notion.databases.query({
            database_id: process.env.NOTION_DATABASE_ID || '',
            page_size: 100,
        });
        const allPosts = posts.results;

        return allPosts.map((post) => {
            if ("properties" in post
                && "title" in post.properties.Name
                && "rich_text" in post.properties.Description
                && "rich_text" in post.properties.Slug
                && "date" in post.properties.Date
                && "multi_select" in post.properties.Tags
            ) {
                const typedPost: NotionApiPostResponse = {
                    id: post.id,
                    properties: {
                        Name: post.properties.Name,
                        Description: post.properties.Description,
                        Date: post.properties.Date,
                        Slug: post.properties.Slug,
                        Tags: post.properties.Tags,
                    },
                }
                return getPageMetaData(typedPost);
            }
        });
    } catch (error) {
        console.log(error);
        throw new Error("Failed to retrieved posts from Notion API.")
    }
}

export const getSinglePost = async (slug: any) => {
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

    const page: any = response.results[0];
    const metaData = getPageMetaData(page);

    const mdBlocks = await n2m.pageToMarkdown(page.id);
    const mdString = n2m.toMarkdownString(mdBlocks);
    console.log(mdString.parent);

    return {
        metaData,
        markdown: mdString,
    }
};