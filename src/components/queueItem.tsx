import bbobHTML from "@bbob/html";
import presetHTML5 from "@bbob/preset-html5";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { convertHtmlToReact } from "@hedgedoc/html-to-react";
import { useContext, useState } from "preact/hooks";

import { QueueContext } from "../context";
import { Post } from "../types";
import styles from "./queue-item.module.css";

export default function QueueItem(props: Post & { index: number }) {
  const bbcode = bbobHTML(props.body, presetHTML5());
  const queue = useContext(QueueContext);
  // Needed to force re-render
  const [counter, setCounter] = useState(0);
  return (
    <div class={styles.queueItem}>
      <span class={styles.queueInfoItemRow}>
        <span>
          MAL ID: <b>{props.malId}</b> Chapter <b>{props.chapNum}</b>
        </span>
        <span>
          <button class={`${styles.actionButton} ${styles.editButton}`}>
            <FontAwesomeIcon icon={faPenToSquare} />
          </button>
          <button
            class={`${styles.actionButton} ${styles.deleteButton}`}
            onClick={() => {
              queue.deletePost(props.index);
              setCounter(counter + 1);
            }}
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </span>
      </span>
      <details>
        <summary>View Text</summary>
        <h4>Source</h4>
        <pre class={`${styles.fiveRowTextDiv} ${styles.previewBox}`}>
          {props.body}
        </pre>
        <h4>Preview</h4>
        <div class={`${styles.fiveRowTextDiv} ${styles.previewBox}`}>
          {convertHtmlToReact(bbcode)}
        </div>
      </details>
    </div>
  );
}
