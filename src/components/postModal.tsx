import { useContext, useEffect, useRef, useState } from "preact/hooks";

import { ModalContext, QueueContext } from "../context";
import "../sceditor-imports";
import generateSubmitHandler from "../submit";
import { ModalClosedProps, Post } from "../types";
import editorStylesURL from "./editor-wysiwyg.css?url";
import "./editor.css";
import Form from "./form";
import formModule from "./form.module.css";
import Modal from "./modal";

export interface ForumPostProps extends Partial<Post> {
  heading?: string;
  malId?: number;
  chapNum?: number;
  body?: string;
  readonly?: boolean;
  loading?: boolean;
}

export default function PostModal(props: ForumPostProps & ModalClosedProps) {
  const queue = useContext(QueueContext);
  const { addModal, removeModal } = useContext(ModalContext);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [malId, setMalId] = useState(0);
  const [chapNum, setChapNum] = useState(-1);

  useEffect(() => {
    setMalId(props.malId ?? 0);
    setChapNum(props.chapNum ?? -1);
  }, [props.malId, props.chapNum]);

  useEffect(() => {
    if (textareaRef.current) {
      // @ts-expect-error SCeditor is pertty old and does not use typescript
      window.sceditor.create(textareaRef.current, {
        format: "bbcode",
        style: editorStylesURL,
        toolbarExclude: "left,emoticon,ltr,rtl",
        plugins: "undo",
      });
    }

    const currentRefValue = textareaRef.current;
    return () => {
      if (currentRefValue) {
        // @ts-expect-error SCeditor is pertty old and does not use typescript
        window.sceditor.instance(currentRefValue).destroy();
      }
    };
  }, [textareaRef]);

  return (
    <Modal
      setClosed={props.setClosed}
      closed={props.closed}
      heading={props.heading ?? "Create Forum Post"}
    >
      <Form
        method="dialog"
        formmethod="dialog"
        onSubmit={() => {
          const success = generateSubmitHandler({
            queue,
            addModal,
            removeModal,
            malId,
            chapNum,
            // @ts-expect-error SCeditor is pertty old and does not use typescript
            bodyText: window.sceditor.instance(textareaRef.current).val(),
          })();
          if (success) {
            props.setClosed(true);
            setMalId(0);
            setChapNum(-1);
            if (textareaRef.current) {
              // @ts-expect-error SCeditor is pertty old and does not use typescript
              window.sceditor.instance(textareaRef.current).val("");
            }
          }
        }}
      >
        <div>
          {props.loading ?? false ? <p>Fetching MAL Data...</p> : null}
          <div>
            <input
              type="number"
              id="mal-id"
              name="mal-id"
              value={malId === 0 ? undefined : malId}
              min={0}
              step={1}
              readOnly={props.readonly}
              required={true}
              onChange={(e) =>
                setMalId(parseInt((e.target as HTMLInputElement).value, 10))
              }
            />
            <label for="mal-id">MyAnimeList Manga Entry ID</label>
          </div>
          <div>
            <input
              type="number"
              id="mal-chapter-num"
              name="mal-chapter-num"
              min={0}
              step={1}
              value={chapNum === -1 ? undefined : chapNum}
              readOnly={props.readonly}
              required={true}
              onChange={(e) =>
                setChapNum(parseInt((e.target as HTMLInputElement).value, 10))
              }
            />
            <label for="mal-chapter-num">
              Chapter Number (whole numbers only)
            </label>
          </div>
          <div class={formModule.sceditorContainer}>
            <label for="post-body">Enter BBcode for forum post:</label>
            <textarea
              id="post-body"
              name="post-body"
              rows={5}
              value={props.body}
              readOnly={props.readonly}
              required={true}
              ref={textareaRef}
            />
          </div>
          <input type="submit" formmethod="dialog">
            Post
          </input>
        </div>
      </Form>
    </Modal>
  );
}
