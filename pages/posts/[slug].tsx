import React from 'react'
import { getAllPosts, getSinglePost } from '../../lib/notionAPI'
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext, InferGetStaticPropsType, NextPage } from 'next';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import Link from 'next/link';
import { ParsedUrlQuery } from 'querystring';

const data = [
    {
        id: '6bb941a1-77e1-4093-98ce-31bb4eeeb741',
        title: '4回目の投稿です',
        description: 'これは4回目の投稿です。',
        date: '2023-05-09',
        slug: 'fourth-post',
        tags: ['blog', 'Typescript', 'tailwindCSS']
    },
    {
        id: '112fb3e1-c691-467f-8235-3ae92ae8ab2e',
        title: '3回目の投稿です',
        description: 'これは3回目の投稿です。',
        date: '2023-05-09',
        slug: 'third-post',
        tags: ['blog', 'Typescript']
    }];

export const getStaticPaths: GetStaticPaths = async () => {
    const allPosts = await getAllPosts();
    console.log('allPosts', allPosts);

    const paths = allPosts.map(({slug}: any) => ({ params: { slug } }));
    console.log('Paths', paths);
    

    return {
        paths: paths,
        fallback: 'blocking',
    }
}

interface PramsSlug extends ParsedUrlQuery {
    slug: string;
}

/**
 *  この関数はサーバー側のビルド時に呼び出されます。クライアント側では呼び出されないので、直接データベースクエリを実行できます。
 * @param params GetStaticPropsContext
 * @returns post
 */
export const getStaticProps: GetStaticProps = async ({ params }) => {
    const { slug } = params as PramsSlug;
    // post を取得するために外部 API をコールします。
    const post = await getSinglePost(slug);

    return {
        props: {
            post,
        },
        revalidate: 60 * 60 * 6,
    };
}

type NextPageProps = InferGetStaticPropsType<typeof getStaticProps>;

const Post: NextPage<NextPageProps> = ({ post }: NextPageProps) => {
    const { metaData, markdown } = post
    return (
        <section className="container lg:px-5 px-5 h-screen lg:w-2/5 mx-auto mt-20">
            <h2 className="w-full text-2xl font-medium">{metaData.title}</h2>
            <div className="border-b-2 w-1/3 mt-1 border-teal-900"></div>
            <span className="text-gray-500">Post date at {metaData.date}</span>
            <br />
            {metaData.tags.map((tag: string) => (
                <p key={tag} className="text-white bg-teal-900 rounded-xl font-medium mt-2 px-2 inline-block mr-2">{tag}</p>
            ))}

            <div className="mt-10 font-medium">
                <ReactMarkdown
                    children={markdown.parent}
                    components={{
                        code({ node, inline, className, children, ...props }) {
                            const match = /language-(\w+)/.exec(className || '')
                            return !inline && match ? (
                                <SyntaxHighlighter
                                    {...props}
                                    children={String(children).replace(/\n$/, '')}
                                    style={vscDarkPlus}
                                    language={match[1]}
                                    PreTag="div"
                                />
                            ) : (
                                <code {...props} className={className}>
                                    {children}
                                </code>
                            )
                        }
                    }}
                ></ReactMarkdown>

                <Link href={`/`}>
                    <span className='text-white bg-sky-600 rounded-xl font-medium px-2 inline-block mr-2" mx-3'>←ホームに戻る</span>
                </Link>
            </div>
        </section>
    )
}

export default Post