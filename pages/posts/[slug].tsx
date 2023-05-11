import React from 'react'
import { getAllPosts, getSinglePost } from '../../lib/notionAPI'
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from 'next';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import Link from 'next/link';
// import prism from 'react-syntax-highlighter/dist/cjs/styles/prism/prism';
// import { docco } from 'react-syntax-highlighter/dist/cjs/styles/hljs';

export const getStaticPaths: GetStaticPaths = async () => {
    const allPosts = await getAllPosts();
    const paths = allPosts.map(({ slug }: any) => ({ params: { slug } }));

    return {
        paths: paths,
        fallback: 'blocking',
    }
}

export const getStaticProps: GetStaticProps = async ({ params }: GetStaticPropsContext) => {
    const post = await getSinglePost(params!.slug);

    return {
        props: {
            post,
        },
        revalidate: 60 * 60 * 6,
    };
}

const Post = ({ post }: any) => {
    return (
        <section className="container lg:px-5 px-5 h-screen lg:w-2/5 mx-auto mt-20">
            <h2 className="w-full text-2xl font-medium">{post.metaData.title}</h2>
            <div className="border-b-2 w-1/3 mt-1 border-teal-900"></div>
            <span className="text-gray-500">Post date at {post.metaData.date}</span>
            <br />
            {post.metaData.tags.map((tag: string) => (
                <p key={tag} className="text-white bg-teal-900 rounded-xl font-medium mt-2 px-2 inline-block mr-2">{tag}</p>
            ))}

            <div className="mt-10 font-medium">
                <ReactMarkdown
                    children={post.markdown.parent}
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