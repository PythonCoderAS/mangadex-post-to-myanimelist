import bbobHTML from "@bbob/html";
import presetHTML5 from "@bbob/preset-html5";
import { convertHtmlToReact } from "@hedgedoc/html-to-react";

import { Post } from "../types";
import styles from "./queue-item.module.css";

export default function QueueItem(props: Post) {
  const bbcode = bbobHTML(props.body, presetHTML5());
  return (
    <div class={styles.queueItem}>
      MAL ID: <b>{props.malId}</b> Chapter <b>{props.chapNum}</b>
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
