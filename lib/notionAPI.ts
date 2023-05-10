// @notionhq/client: https://www.npmjs.com/package/@notionhq/client
import { Client } from '@notionhq/client';

const notion = new Client({
    auth: process.env.NOTION_TOKEN,
});

type Post = {
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
    };
};



const getPageMetaData = (post: Post) => {
    return {
        id: post.id,
        title: post.properties.Name.title[0]?.plain_text,
        description: post.properties.Description.rich_text[0]?.plain_text,
        date: post.properties.Date?.date?.start,
        slug: post.properties.Slug.rich_text[0]?.plain_text,
    }
}

export const getAllPosts = async () => {
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
        ) {
            const typedPost: Post = {
                id: post.id,
                properties: {
                    Name: post.properties.Name,
                    Description: post.properties.Description,
                    Date: post.properties.Date,
                    Slug: post.properties.Slug,
                },
            }
            return getPageMetaData(typedPost);
        } else {
            return allPosts;
        }
    });
}
