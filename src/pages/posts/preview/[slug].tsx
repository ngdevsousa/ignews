import { GetStaticPaths, GetStaticProps } from "next";
import { useSession } from "next-auth/client";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { RichText } from "prismic-dom";
import { useEffect } from "react";
import { getPrismicClient } from "../../../services/prismic";
import styles from "../post.module.scss";

interface PostProps {
  post: {
    slug: string;
    title: string;
    content: string;
    updatedAt: string;
  };
}

export default function Post({ post }: PostProps) {
  const [session] = useSession();
  const router = useRouter();
  useEffect(() => {
    if (session?.userSubscription) {
      router.push(`/posts/${post.slug}`);
    }
  }, [session]);

  return (
    <>
      <Head>
        <title>{post.title} | IgNews</title>
      </Head>

      <main className={styles.container}>
        <article className={styles.post}>
          <h1>{post.title}</h1>
          <time>{post.updatedAt}</time>
          <div
            className={`${styles.postContent} ${styles.previewContent}`}
            dangerouslySetInnerHTML={{ __html: post.content }}
          ></div>
          <div className={styles.continueReading}>
            Want to continue reading?
            <Link href="/">
              <a>Subscribe now</a>
            </Link>
          </div>
        </article>
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking"
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;
  const prismic = getPrismicClient();
  const res = await prismic.getByUID("post", String(slug), {});

  const post = {
    slug,
    title: RichText.asText(res.data.title),
    content: RichText.asHtml(res.data.content.splice(0, 1)),
    updatedAt: new Date(res.last_publication_date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    })
  };
  return {
    props: { post },
    redirect: 60 * 30 // 30min
  };
};
