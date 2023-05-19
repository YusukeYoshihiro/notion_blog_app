# Notion API Blog App
[Demo](https://notion-blog-he5c5koaj-yusukeyoshihiro.vercel.app/)

<img width='650' src="https://github.com/YusukeYoshihiro/notion_blog_app/assets/58486430/a1de592e-9e62-424c-a96e-3bb3edb05a20">

### 詳細
　NotionをDBとして、Notionに記載した内容をBlog記事として表示
 
 <img width="800" alt="notion_db" src="https://github.com/YusukeYoshihiro/notion_blog_app/assets/58486430/92b2a075-7b5b-4e53-8391-af1a98229f91">

### 主要機能
  - API連携
    - Notion APIと連携し、NotionをDBとしてCMC化
  - タグの検索機能
  - チェックボックスに公開非、公開の設定
  - 日付順の最新の投稿を表示
  - ページネーション
  
### 技術スタック
  - Next.js
  - Typescript
  - tailwindcss
  - API
    - [Notion API](https://developers.notion.com/reference/intro)
  - ライブラリ
    - [`react-markdown`](https://www.npmjs.com/package/react-markdown)
    - [`react-syntax-highlighter`](https://www.npmjs.com/package/react-syntax-highlighter)
  - 開発環境 & デプロイメント
    - Git/CLI
    - Github
    - Vercel


This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
