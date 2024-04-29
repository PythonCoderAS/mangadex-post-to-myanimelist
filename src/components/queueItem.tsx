import presetReact from "@bbob/preset-react";
import BBCode from "@bbob/react";

import { Post } from "../types";
import styles from "./queue-item.module.css";

const plugins = [presetReact()];

export default function QueueItem(props: Post) {
  console.log(props);
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
          <BBCode plugins={plugins}>{props.body}</BBCode>
        </div>
      </details>
    </div>
  );
}
