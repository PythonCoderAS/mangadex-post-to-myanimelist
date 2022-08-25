import * as SimpleTSX from "simple-tsx";
import forumPostStyles from "./forumPost.module.css"
import {FormModal} from "../formModal/formModal";
import onSubmit from "./submit";

export interface ForumPostProps {
  heading?: string
  malId?: number
  chapterNum?: number
  body?: string
  readonly?: boolean
}

export function ForumPost(props: ForumPostProps){
  const body: SimpleTSX.Element = (
    <div>
      {props.malId ? <input type="number" id="mal-id" name="mal-id" className={forumPostStyles.numberInput} value={props.malId}/> : <input type="number" id="mal-id" name="mal-id" className={forumPostStyles.numberInput}/>}
      <label for="mal-id">MyAnimeList Manga Entry ID</label>
      {props.chapterNum ? <input type="number" id="mal-chapter-num" name="mal-chapter-num" className={forumPostStyles.numberInput} value={props.chapterNum}/> : <input type="number" id="mal-chapter-num" name="mal-chapter-num" className={forumPostStyles.numberInput}/>}
      <label for="mal-chapter-num">Chapter Number (whole numbers only)</label>
      {props.body ? <textarea id="post-body" name="post-body" rows="5" class={forumPostStyles.textarea}>{props.body}</textarea> :
        <textarea id="post-body" name="post-body" rows="5" className={forumPostStyles.textarea}></textarea>}
    </div>
  )
  if (props.readonly){
    body.element.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>("input,textarea").forEach((value) => {
      value.readOnly = true
    })
  }
  const heading = props.heading || "Creating Forum Post"
  return (
    <FormModal heading={heading} body={body} onsubmit={onSubmit}/>
  )
}
