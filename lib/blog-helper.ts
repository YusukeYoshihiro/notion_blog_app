/**
 * タグが存在する場合、タグ検索時のページに遷移させる。
 * タグが存在しない場合、全体の投稿ページに遷移させる。
 * @param tag :string
 * @param page : number
 * @returns string
 */
export const getPageLink = (tag: string, page: number): string => {
    return tag ? `/posts/tag/${tag}/page/${page}` : `/posts/page/${page}`
}