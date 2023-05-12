import Link from 'next/link';
import React from 'react'

export type PropsPost = {
    id: string;
    title: string;
    description: string;
    date: string;
    tags: string[];
    slug: string;
};

const SinglePost = (props: PropsPost) => {
    const {
        id,
        title,
        description,
        date,
        tags,
        slug,
    } = props;

    return (
        <section
            className="lg:w-1/2 
                bg-teal-600 
                mb-8 mx-auto 
                rounded-md 
                p-5 
                shadow-2xl 
                hover:shadow-none 
                hover:translate-y-1 
                transition-all 
                duration-300"
        >
            <div className="flex items-center gap-3">
                <Link href={`/posts/${slug}`}>
                    <h2 className="text-gray-100 text-2xl font-medium mb-2 hover:text-sky-900 transition-all duration-300">{title}</h2>
                </Link>
                <div className="text-gray-100">{date}</div>
                {tags.map(tag => (
                    <span key={tag} className="text-gray-100 bg-gray-500 rounded-xl px-2 pb-1 font-medium">{tag}</span>
                ))}
            </div>
            <p className="text-gray-100">{description}</p>
        </section>
    );

}

export default SinglePost