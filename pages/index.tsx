import Head from 'next/head'
import { getAllPosts } from '../lib/notionAPI'
import { PostfixUnaryExpression } from 'typescript';

// SSG
export const getStaticProps = async() => {
  const allPosts = await getAllPosts();

  return {
    props :{
      allPosts,
    },
    // ISR 60秒毎に再更新する。※今回は6時間毎
    revalidate: 60 * 60 * 6,
  }
}

export default function Home({ allPosts }: any) {
  console.log(allPosts);
  
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

    </>
  )
}
