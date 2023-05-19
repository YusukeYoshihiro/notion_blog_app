import Link from 'next/link'
import React from 'react'
import { getPageLink } from '../../lib/blog-helper'
import { NextPage } from 'next'

interface PaginationProps {
    numberOfPage: number
    tag: string | ""
}

const Pagination: NextPage<PaginationProps> = (props: PaginationProps) => {
    const { numberOfPage, tag } = props;

    let pages: number[] = [];
    for (let i = 1; i <= numberOfPage; i++) {
        pages.push(i);
    }

    return (
        <section className="mb-8 lg:w-1/2 mx-auto rounded-md p-5">
            <ul className="flex items-center justify-center gap-4">
                ...
                {pages.map((page) => (
                    <li
                        key={page}
                        className="bg-teal-800 
                        rounded-lg 
                        w-6 
                        h-8 
                        relative
                        border 
                        border-solid 
                        hover:border-teal-700
                        hover:bg-gray-100
                        duration-300
                        transition-all"
                    >
                        <Link
                            href={getPageLink(tag, page)}
                            className="absolute 
                            top-2/4 
                            left-2/4
                            -translate-x-2/4 
                            -translate-y-2/4 
                            text-lx 
                            text-gray-400"
                        >
                            {page}
                        </Link>
                    </li>
                ))}
            </ul>
        </section>
    )
}

export default Pagination