import Head from 'next/head'
import { getAllPosts } from '../lib/notionAPI'
import SinglePost from '../components/Post/SinglePost';
import { GetStaticProps } from 'next';
import { NotionApiCustomPost } from '../common/commonType';
import { FC } from 'react';

interface HomeProps {
  allPosts: NotionApiCustomPost[]
}

// SSG
export const getStaticProps: GetStaticProps = async () => {
  const allPosts = await getAllPosts();

  return {
    props: {
      allPosts,
    },
    // ISR 60秒毎に再更新する。※今回は6時間毎
    revalidate: 60 * 60 * 6,
  }
}

const Home: React.FC<HomeProps> = (props: HomeProps) => {
  const { allPosts } = props

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
          <h1 className="text-5xl font-medium text-center mb-16">Notion Blog 🚀</h1>
          {allPosts.map((post) => (
            <div className="mx-4" key={post.id}>
              <SinglePost
                id={post.id}
                title={post.title}
                description={post.description}
                date={post.date}
                tags={post.tags}
                slug={post.slug}
              />
            </div>
          ))}
        </main>
      </div>
    </>
  )
}

export default Home;