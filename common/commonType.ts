export interface NotionApiCustomPost {
    id: string;
    title: string;
    description: string;
    date: string | undefined;
    slug: string | undefined;
    tags: string[];
};