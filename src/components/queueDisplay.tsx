import { useContext } from "preact/hooks";

import { QueueContext } from "../context";
import QueueItem from "./queueItem";

if (import.meta.env.DEV) {
  await import("./editor-wysiwyg.css");
}

export default function QueueDisplay() {
  const queue = useContext(QueueContext);

  return (
    <div>
      <h4>Queue</h4>
      <ul>
        {queue.posts.map((post, index) => (
          <li key={`${post.malId} | ${post.chapNum}`}>
            <QueueItem {...post} index={index} />
          </li>
        ))}
      </ul>
    </div>
  );
}
