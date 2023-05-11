import React from 'react'
import { getSinglePost } from '../../lib/notionAPI'
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from 'next'
import { PropsPost } from '../../components/Post/SinglePost'

export const getStaticPaths: GetStaticPaths = async () => {
    return {
        paths: [
            { params: { slug: 'first-post' } },
            { params: { slug: 'second-post' } },
            { params: { slug: 'third-post' } },
        ],
        fallback: 'blocking',
    }
}

export const getStaticProps: GetStaticProps = async ({ params }: GetStaticPropsContext) => {
    const post = await getSinglePost(params!.slug)

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
            <h2 className="w-full text-2xl font-medium">3回目の投稿</h2>
            <div className="border-b-2 w-1/3 mt-1 border-teal-900"></div>
            <span className="text-gray-500">2023/2/19</span>
            <br />
            <p className="text-white bg-teal-900 rounded-xl font-medium mt-2 px-2 inline-block">Next.js</p>

            <div className="mt-10 font-medium">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste provident maxime hic reiciendis reprehenderit rerum ea deserunt sint sunt. Iste, distinctio? Nam magnam nulla earum recusandae voluptas placeat minima est?
            </div>
        </section>
    )
}

export default Post