import { useContext } from "preact/hooks";

import { ModalContext, QueueContext } from "../context";
import generateSubmitHandler from "../submit";
import { ModalClosedProps, Post } from "../types";
import Form from "./form";
import Modal from "./modal";

export interface ForumPostProps extends Partial<Post> {
  heading?: string;
  malId?: number;
  chapNum?: number;
  body?: string;
  readonly?: boolean;
}

export default function PostModal(props: ForumPostProps & ModalClosedProps) {
  const queue = useContext(QueueContext);
  const { addModal, removeModal } = useContext(ModalContext);
  return (
    <Modal setClosed={props.setClosed} closed={props.closed}>
      <Form
        formmethod="dialog"
        onSubmit={generateSubmitHandler(queue, addModal, removeModal)}
      >
        <div>
          <div>
            <input
              type="number"
              id="mal-id"
              name="mal-id"
              value={props.malId}
              readOnly={props.readonly}
            />
            <label for="mal-id">MyAnimeList Manga Entry ID</label>
          </div>
          <div>
            <input
              type="number"
              id="mal-chapter-num"
              name="mal-chapter-num"
              value={props.chapNum}
              readOnly={props.readonly}
            />
            <label for="mal-chapter-num">
              Chapter Number (whole numbers only)
            </label>
          </div>
          <div>
            <label for="post-body">Enter BBcode for forum post:</label>
            <textarea id="post-body" name="post-body" rows={5}>
              {props.body ?? null}
            </textarea>
          </div>
          <input type="submit">Post</input>
        </div>
      </Form>
    </Modal>
  );
}
