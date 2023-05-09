// @notionhq/client: https://www.npmjs.com/package/@notionhq/client
import { Client } from '@notionhq/client';

const notion = new Client({
    auth: process.env.NOTION_TOKEN,
});

type Post = {
    id: string;
    created_time: string,
    properties: {
        Name: {
            title: { plain_text: string }[];
        };
        Description: {
            rich_text: { plain_text: string }[];
        };
        // Date: {
        //     date: {
        //         start: string;
        //     };
        // };
        Slug: {
            rich_text: { plain_text: string }[];
        };
    };
};


const getPageMetaData = (post: any) => {
    return {
        id: post.id,
        created_time: post.created_time,
        title: post.properties.Name.title[0].plain_text,
        description: post.properties.Description.rich_text[0].plain_text,
        // date: post.properties.Date.date.start,
        slug: post.properties.Slug.rich_text[0].plain_text,
    }
}

export const getAllPosts = async () => {
    const posts = await notion.databases.query({
        database_id: process.env.NOTION_DATABASE_ID || '',
        page_size: 100,
    });

    const allPosts = posts.results;

    // return allPosts;

    return allPosts.map((post) => {
        if ("properties" in post){
            const typedPost: any = {
                id: post.id,
                created_time: post.created_time,
                properties: {
                    Name: post.properties.Name,
                    Description: post.properties.Description,
                    // Date: post.properties.Date,
                    Slug: post.properties.Slug,
                },
            }
            return getPageMetaData(typedPost);
        }
    })
}
