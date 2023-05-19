import React from 'react'
import { getAllPosts, getSinglePost } from '../../lib/notionAPI'
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import Link from 'next/link';
import { ParsedUrlQuery } from 'querystring';
import { MdStringObject } from 'notion-to-md/build/types';
import { NotionApiCustomPost } from '../../common/commonType';

interface PramsSlug extends ParsedUrlQuery {
    slug: string;
}

export const getStaticPaths: GetStaticPaths = async () => {
    const posts = await getAllPosts();
    const paths = posts.map((post) => ({ params: { slug: post?.slug } }));

    return {
        paths: paths,
        fallback: 'blocking',
    }
}

/**
 *  この関数はサーバー側のビルド時に呼び出されます。
 *  クライアント側では呼び出されないので、直接データベースクエリを実行できます。
 * @param params GetStaticPropsContext
 * @returns post
 */
export const getStaticProps: GetStaticProps = async ({ params }) => {
    const { slug } = params as PramsSlug;

    const post = await getSinglePost(slug);

    return {
        props: {
            post,
        },
        revalidate: 60 * 60 * 6,
    };
}

type PostProps = {
    post: {
        metaData: NotionApiCustomPost
        markdown: MdStringObject
    }
}

const Post: NextPage<PostProps> = ({ post }: PostProps) => {
    const { metaData, markdown } = post

    return (
        <section className="container lg:px-5 px-5 h-screen lg:w-2/5 mx-auto mt-20">
            <h2 className="w-full text-2xl font-medium">{metaData.title}</h2>
            <div className="border-b-2 w-1/3 mt-1 border-teal-900"></div>
            <span className="text-gray-500">Post date at {metaData.date}</span>
            <br />
            {metaData.tags.map((tag: string, index: number) => (
                <Link
                    href={`/posts/tag/${tag}/page/1`}
                    key={index}
                >
                    <p
                        key={index}
                        className="text-white 
                        border-2
                        border-solid 
                        border-teal-900
                        bg-teal-900 
                        rounded-xl 
                        font-medium
                        mt-2 
                        px-2 
                        inline-block
                        mr-2
                        hover:bg-white 
                        hover:text-teal-900 
                        hover:border-teal-900
                        duration-300
                        transition-all"
                    >
                        {tag}
                    </p>
                </Link>
            ))}

            <div className="mt-10 font-medium">
                <ReactMarkdown
                    children={markdown.parent}
                    components={{
                        code({ node, inline, className, children }) {
                            const match = /language-(\w+)/.exec(className || '')
                            return !inline && match ? (
                                <SyntaxHighlighter
                                    children={String(children).replace(/\n$/, '')}
                                    style={vscDarkPlus}
                                    language={match[1]}
                                    PreTag="div"
                                />
                            ) : (
                                <code className={className}>
                                    {children}
                                </code>
                            )
                        }
                    }}
                ></ReactMarkdown>

                <Link href={`/`}>
                    <span 
                        className="text-white
                        text-xl
                        bg-sky-600 
                        rounded-xl 
                        font-medium 
                        px-2 
                        inline-block 
                        mr-2
                        mx-3 
                        mt-10
                        border-2 
                        border-solid 
                        border-sky-900
                        hover:bg-white 
                        hover:text-sky-600 
                        duration-300 
                        transition-all"
                    >
                        ←ホームに戻る
                    </span>
                </Link>
            </div>
        </section>
    )
}

export default Post