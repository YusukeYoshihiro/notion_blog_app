import { Client } from '@notionhq/client';
import { PageObjectResponse, PartialPageObjectResponse, QueryDatabaseResponse, RichTextItemResponse, TextRichTextItemResponse } from '@notionhq/client/build/src/api-endpoints';
import { NotionToMarkdown } from 'notion-to-md';
import { MdStringObject } from 'notion-to-md/build/types';
import { NotionApiCustomPost } from '../common/commonType';
import { NUMBER_OF_POSTS_PER_PAGE } from '../constants/constants';
import { log } from 'console';

interface MetaDataAndMarkdown {
    metaData: NotionApiCustomPost
    markdown: MdStringObject
}

const notion = new Client({
    auth: process.env.NOTION_TOKEN,
});

const n2m = new NotionToMarkdown({ notionClient: notion })

/**
 * タグの取得
 * @param tags {　name : string　}
 * @returns string[]
 */
const getTags = (tags: { name: string }[]): string[] => {
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
export const getSinglePost = async (
    slug: string,
): Promise<MetaDataAndMarkdown | undefined> => {
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

        /**
         * Notion記事のIDを元にNotion記事ブロックを取得し、マークダウン化したもの
         */
        const mdBlocks = await n2m.pageToMarkdown(page.id);

        /**
         *  マークダウン化されたNotion記事ブロックを文字列にしたもの
         * */
        const mdString = n2m.toMarkdownString(mdBlocks);

        return {
            metaData: metaData,
            markdown: mdString,
        }
    } catch (error) {
        console.log(error);
        throw new Error('Failed to retrieved "Single Post by slug" from Notion API.');
    }
};

/**
 * Topページ用記事の取得
 * @param pageSize : number
 * @returns Promise<(NotionApiCustomPost | undefined)[]>
 */
export const getPostsForTopPage = async (
    pageSize: number,
): Promise<(NotionApiCustomPost | undefined)[]> => {
    try {
        const allPosts = await getAllPosts();
        const TopPagePosts = allPosts.slice(0, pageSize);
        return TopPagePosts

    } catch (error) {
        console.log(error);
        throw new Error('Failed to retrieved "Posts For Top Page" from Notion API.')
    }
}

/**
 * ページ番号に応じた記事の取得
 * @param page : number
 * @returns Promise<(NotionApiCustomPost | undefined)[]>
 */
export const getPostsByPage = async (
    page: number,
): Promise<(NotionApiCustomPost | undefined)[]> => {
    try {
        const allPosts = await getAllPosts();
    
        const startIndex = (page - 1) * NUMBER_OF_POSTS_PER_PAGE;
        const endIndex = startIndex + NUMBER_OF_POSTS_PER_PAGE;
    
        return allPosts.slice(startIndex, endIndex);
        
    } catch (error) {
        console.log(error);
        throw new Error('Failed to retrieved "Posts By Page" from Notion API.')
    }
}

/**
 * 動的にページ数を取得
 * @returns number
 */
export const getNumberOfPage = async (): Promise<number> => {
    const allPosts = await getAllPosts();

    const totalPosts = allPosts.length

    const getNumberOfPage = Math.floor(totalPosts / NUMBER_OF_POSTS_PER_PAGE)
        + (totalPosts % NUMBER_OF_POSTS_PER_PAGE > 0 ? 1 : 0)

    return getNumberOfPage
}

/**
 * タグごとに記事を取得
 * @param tagName :string
 * @param page :number
 * @returns Promise<(NotionApiCustomPost | undefined)[]>
 */
export const getPostsByTagAndPage = async (
    tagName: string,
    page: number,
): Promise<(NotionApiCustomPost | undefined)[]> => {
    const allPosts = await getAllPosts();
    const filteredPostsByTag = allPosts.filter((post) => {
        return post?.tags.find((tag: string) => tag === tagName)
    });

    const startIndex = (page - 1) * NUMBER_OF_POSTS_PER_PAGE;
    const endIndex = startIndex + NUMBER_OF_POSTS_PER_PAGE;

    return filteredPostsByTag.slice(startIndex, endIndex);
}

/**
 * タグごとにページ数を取得
 * @param tagName :string
 * @returns number
 */
export const getNumberOfPagesByTag = async (tagName: string): Promise<number> => {
    try {
        const allPosts = await getAllPosts();

        const filteredPostByTag = allPosts.filter((post) => {
            return post?.tags.find((tag: string) => tag === tagName)
        });

        const totalPostsByTag = filteredPostByTag.length

        const getNumberOfPagesByTag = Math.floor(totalPostsByTag / NUMBER_OF_POSTS_PER_PAGE)
            + (totalPostsByTag % NUMBER_OF_POSTS_PER_PAGE > 0 ? 1 : 0)

        return getNumberOfPagesByTag;

    } catch (error) {
        console.log(error);
        throw new Error(`Failed to retrieved "Number Of Pages By Tag" data from Notion API.`)
    }
}

/**
 * 全てのタグを重複なしに取得
 * @returns Promise<string[]>
 */
export const getAllTags = async (): Promise<(string | undefined)[]> => {
    try {
        const allPosts = await getAllPosts();

        // flatMap: 二次元配列を一次元配列に下げる
        const allTagsDuplicationLists = allPosts.flatMap((post) => {
            return post?.tags
        });

        // 重複を削除したリストの取得
        const setArr = new Set(allTagsDuplicationLists);
        const allTagList = Array.from(setArr);

        return allTagList;

    } catch (error) {
        console.log(error);
        throw new Error(`Failed to retrieved "tags" data from Notion API.`)
    }
}