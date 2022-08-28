import * as SimpleTSX from "simple-tsx";

import queue from "../../queue";
import { Post } from "../../types";
import { FormModal } from "../formModal/formModal";
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
      <div>
        {props.malId ? (
          <input type="number" id="mal-id" name="mal-id" value={props.malId} />
        ) : (
          <input type="number" id="mal-id" name="mal-id" />
        )}
        <label for="mal-id">MyAnimeList Manga Entry ID</label>
      </div>
      <div>
        {props.chapNum ? (
          <input
            type="number"
            id="mal-chapter-num"
            name="mal-chapter-num"
            value={props.chapNum}
          />
        ) : (
          <input type="number" id="mal-chapter-num" name="mal-chapter-num" />
        )}
        <label for="mal-chapter-num">Chapter Number (whole numbers only)</label>
      </div>
      <div>
        <label for="post-body">Enter BBcode for forum post:</label>
        {props.body ? (
          <textarea id="post-body" name="post-body" rows="5">
            {props.body}
          </textarea>
        ) : (
          <textarea id="post-body" name="post-body" rows="5"></textarea>
        )}
      </div>
      <input type="submit">Post</input>
      <hr />
      <div>
        <b>Current Queued Posts: {queue.length}</b>
        <pre style="border: 1px solid #DDD; padding: 5px;">
          {JSON.stringify(queue.posts, undefined, 2)}
        </pre>
      </div>
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
