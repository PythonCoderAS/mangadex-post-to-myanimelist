import Modal from "../modal/modal";
import * as SimpleTSX from "simple-tsx";
import forumPostStyles from "./forumPost.module.css"

export interface ForumPostProps {
  malId?: number
  chapterNum?: number
}

export function ForumPost(props: ForumPostProps){
  const form = (
    <form action="#" onsubmit={() => false}>
      {props.malId ? <input type="number" id="mal-id" name="mal-id" className={forumPostStyles.numberInput}/> : null}
      <label for="mal-id">MyAnimeList Manga Entry ID</label>
      {props.chapterNum ? <input type="number" id="mal-chapter-num" name="mal-chapter-num" className={forumPostStyles.numberInput}/> : null}
      <label for="mal-chapter-num">Chapter Number (whole numbers only)</label>
      <textarea id="post-body" name="post-body" rows="5" class={forumPostStyles.textarea}></textarea>
    </form>
  )
  return (
    <Modal header="Creating Forum Post" body={form} />
  )
}
