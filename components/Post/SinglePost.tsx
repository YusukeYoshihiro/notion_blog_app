import Link from 'next/link';
import React from 'react';

export interface SinglePostProp {
    id: string;
    title: string;
    description: string;
    date: string | undefined;
    slug: string | undefined;
    tags: string[];
    isPaginationPage: boolean,
};

const SinglePost: React.FC<SinglePostProp> = (props: SinglePostProp) => {
    const {
        id,
        title,
        description,
        date,
        tags,
        slug,
        isPaginationPage,
    } = props;

    return (
        <>
            {isPaginationPage ? (
                <>
                    <section
                        className="bg-teal-600 
                        mb-8 mx-auto 
                        rounded-md 
                        p-5 
                        shadow-2xl 
                        hover:shadow-none 
                        hover:translate-y-1 
                        transition-all 
                        duration-300"
                    >
                        <div className="lg:flex flex-col">
                            <Link href={`/posts/${slug}`}>
                                <h2
                                    className="text-gray-100 
                                    text-2xl 
                                    font-medium 
                                    mb-2 
                                    hover:text-sky-900 
                                    transition-all 
                                    duration-300"
                                >
                                    {title}
                                </h2>
                            </Link>
                            <div className="text-gray-300">{date}</div>
                            <div>
                                {tags.map((tag: string, index: number) => (
                                    <Link
                                        href={`/posts/tag/${tag}/page/1`}
                                        key={index}
                                    >
                                        <span
                                            key={index}
                                            className="text-gray-100 
                                            bg-gray-600 
                                            rounded-xl 
                                            px-2 
                                            pb-1
                                            font-medium 
                                            mr-2
                                            border-2 
                                            border-solid 
                                            border-teal-900
                                            hover:bg-gray-100 
                                            hover:text-gray-600 
                                            hover:border-teal-950
                                            duration-300
                                            transition-all
                                            "
                                        >
                                            {tag}
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                        <p className="text-gray-100">{description}</p>
                    </section>
                </>
            ) : (
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
                    <div className="lg:flex flex-col">
                        <Link href={`/posts/${slug}`}>
                            <h2 className="text-gray-100 text-2xl font-medium mb-2 hover:text-sky-900 transition-all duration-300">{title}</h2>
                        </Link>
                        <div className="text-gray-300">{date}</div>
                        <div>
                            {tags.map((tag: string, index: number) => (
                                <Link
                                    href={`/posts/tag/${tag}/page/1`}
                                    key={index}
                                >
                                    <span
                                        key={index}
                                        className="text-gray-100 
                                        bg-gray-600 
                                        rounded-xl 
                                        px-2 
                                        pb-1 
                                        font-medium 
                                        mr-2
                                        border-2 
                                        border-solid 
                                        border-teal-900
                                        hover:bg-gray-100 
                                        hover:text-gray-600 
                                        duration-300
                                        transition-all
                                        "
                                    >
                                        {tag}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </div>
                    <p className="text-gray-100">{description}</p>
                </section>
            )}
        </>
    );

}

export default SinglePost