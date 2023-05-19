import { NextPage } from 'next';
import Link from 'next/link'
import React from 'react'

interface TagsProps {
    tags: string[];
}

const Tag: NextPage<TagsProps> = (props: TagsProps) => {
    const { tags } = props;

    return (
        <div className="mx-4">
            <section
                className="lg:w-1/2 
                mb-8 mx-auto 
                bg-sky-500 
                rounded-md p-5 
                shadow-2xl 
                hover:shadow-none 
                hover:translate-y-1 
                duration-300 
                transition-all"
            >
                <div className="font-medium mb-4 text-gray-100">タグ検索:(タグをクリック)</div>
                <div className="flex flex-wrap gap-5">
                    {tags.map((tag: string, index: number) => (
                        <Link
                            href={`/posts/tag/${tag}/page/1`}
                            key={index}
                        >
                            <span
                                className="cursor-pointer 
                                px-2 
                                text-gray-100
                                font-medium 
                                pb-1 
                                rounded-xl 
                                bg-gray-600
                                inline-block
                                border-2 
                                border-solid 
                                border-sky-900
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
            </section>
        </div>
    )
}

export default Tag