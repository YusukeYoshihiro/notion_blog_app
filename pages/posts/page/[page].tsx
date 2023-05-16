import Head from 'next/head'
import { getAllPosts, getNumberOfPage, getPostsByPage, getPostsForTopPage } from '../../../lib/notionAPI'
import SinglePost from '../../../components/Post/SinglePost';
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from 'next';
import { NotionApiCustomPost } from '../../../common/commonType';
import Pagination from '../../../components/Pagination/Pagination';

interface HomeProps {
    allPosts: NotionApiCustomPost[],
    postsByPage: NotionApiCustomPost[],
    numberOfPage: number,
}

export const getStaticPaths: GetStaticPaths = async () => {
    const numberOfPage = await getNumberOfPage();

    /**
     *  [
            { params: { page: '1' } }, 
            { params: { page: '2' } },
            { params: { page: '3' } },
            ......
        ],
     */
    let params = [];
    for (let i = 1; i <= numberOfPage; i++) {
        params.push({ params: { page: i.toString() } })

    }

    return {
        paths: params,
        fallback: 'blocking'
    }
}

// SSG
export const getStaticProps: GetStaticProps = async (context: GetStaticPropsContext) => {
    const currentPage = context.params?.page;

    const postsByPage = await getPostsByPage(
        parseInt(currentPage!.toString(), 10)
    );

    const numberOfPage = await getNumberOfPage();

    return {
        props: {
            postsByPage,
            numberOfPage,
        },
        // ISR 60秒毎に再更新する。※今回は6時間毎
        revalidate: 60 * 60 * 6,
    }
}

const BlogPageList: React.FC<HomeProps> = ({ postsByPage, numberOfPage }: HomeProps) => {

    return (
        <>
            <div className="container h-full w-full mx-auto">
                <Head >
                    <title>Notion-Blog</title>
                    <meta name="description" content="Generated by create next app" />
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                    <link rel="icon" href="/favicon.ico" />
                </Head>

                <main className="container w-full mt-16">
                    <h1 className="text-5xl font-medium text-center mb-16">Notion Blog 📒</h1>
                    <section className="sm:grid grid-cols-2 w-5/6 gap-3 mx-auto">
                        {postsByPage.map((post) => (
                            <div key={post.id}>
                                <SinglePost
                                    id={post.id}
                                    title={post.title}
                                    description={post.description}
                                    date={post.date}
                                    tags={post.tags}
                                    slug={post.slug}
                                    isPaginationPage={true}
                                />
                            </div>
                        ))}
                    </section>
                    <Pagination numberOfPage={numberOfPage} />
                </main>
            </div>
        </>
    )
}

export default BlogPageList;