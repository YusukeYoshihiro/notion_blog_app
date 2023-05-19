import Head from 'next/head'
import { getAllTags, getPostsForTopPage } from './api/notionAPI'
import SinglePost from '../components/Post/SinglePost';
import { GetStaticProps, NextPage } from 'next';
import { NotionApiCustomPost } from '../common/commonType';
import Link from 'next/link';
import Tag from '../components/Tag/Tag';
import { NUMBER_OF_POSTS_PER_PAGE } from '../constants/constants';

interface HomeProps {
  allPosts: NotionApiCustomPost[]
  allTags: string[],
}

// SSG
export const getStaticProps: GetStaticProps = async () => {
  const allPosts = await getPostsForTopPage(NUMBER_OF_POSTS_PER_PAGE);

  const allTags = await getAllTags();

  return {
    props: {
      allPosts,
      allTags,
    },
    // ISR 10秒毎に再更新する.
    revalidate: 10,
  }
}

const Home: NextPage<HomeProps> = (props: HomeProps) => {
  const { allPosts, allTags } = props

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
          {allPosts.map((post) => (
            <div className="mx-4" key={post.id}>
              <SinglePost
                id={post.id}
                title={post.title}
                description={post.description}
                date={post.date}
                tags={post.tags}
                slug={post.slug}
                isPaginationPage={false}
              />
            </div>
          ))}
          <Link 
          href={`/posts/page/1`} 
          className='mb-6 lg:w-1/2 mx-auto px-5 block text-right'
          >
            ...もっと見る
          </Link>
          <Tag tags={allTags}/>
        </main>
      </div>
    </>
  )
}

export default Home;