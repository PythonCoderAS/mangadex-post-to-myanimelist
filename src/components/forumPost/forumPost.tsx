import * as SimpleTSX from "simple-tsx";

import { Post } from "../../types";
import { FormModal } from "../formModal/formModal";
import forumPostStyles from "./forumPost.module.css";
import onSubmit from "./submit";

export interface ForumPostProps extends Partial<Post> {
  heading?: string;
  malId?: number;
  chapNum?: number;
  body?: string;
  readonly?: boolean;
}

export function ForumPost(props: ForumPostProps) {
  const body: SimpleTSX.Element = (
    <div>
      <div class={forumPostStyles.item}>
      {props.malId ? (
        <input
          type="number"
          id="mal-id"
          name="mal-id"
          class={forumPostStyles.number_input}
          value={props.malId}
        />
      ) : (
        <input
          type="number"
          id="mal-id"
          name="mal-id"
          class={forumPostStyles.number_input}
        />
      )}
      <label for="mal-id">MyAnimeList Manga Entry ID</label>
      </div>
      <div class={forumPostStyles.item}>
      {props.chapNum ? (
        <input
          type="number"
          id="mal-chapter-num"
          name="mal-chapter-num"
          class={forumPostStyles.number_input}
          value={props.chapNum}
        />
      ) : (
        <input
          type="number"
          id="mal-chapter-num"
          name="mal-chapter-num"
          class={forumPostStyles.number_input}
        />
      )}
      <label for="mal-chapter-num">Chapter Number (whole numbers only)</label>
      </div>
      <div class={forumPostStyles.item}>
      <label for="post-body">Enter BBcode for forum post:</label>
      {props.body ? (
        <textarea
          id="post-body"
          name="post-body"
          rows="5"
          class={forumPostStyles.textarea}
        >
          {props.body}
        </textarea>
      ) : (
        <textarea
          id="post-body"
          name="post-body"
          rows="5"
          class={forumPostStyles.textarea}
        ></textarea>
      )}
      </div>
      <input type="submit" class={forumPostStyles.submit_input}>Post</input>
    </div>
  );
  if (props.readonly) {
    body.element
      .querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(
        "input,textarea"
      )
      .forEach((value) => {
        value.readOnly = true;
      });
  }
  const heading = props.heading || "Creating Forum Post";
  return <FormModal heading={heading} body={body} onsubmit={onSubmit} />;
}
