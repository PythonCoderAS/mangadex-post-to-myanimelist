import { DateTime } from "luxon";
import sleep from "sleep-promise";

import { ErrorModal } from "./components/errorModal/errorModal";
// eslint-disable-next-line import/no-cycle
import { ForumPost } from "./components/forumPost/forumPost";
import { Post } from "./types";
import { getTimestampAfter, mountModal } from "./utils";

export async function queuePost(post: Post) {
  const posts: Post[] = JSON.parse(
    (await GM.getValue("queue", "[]")) as string
  );
  posts.push(post);
  await GM.setValue("queue", JSON.stringify(posts));
}

async function setTimeToWake(ms: number) {
  const newMS = getTimestampAfter(ms).toMillis();
  await GM.setValue("sleep", newMS);
}

async function sleepRequiredTime() {
  const msToWakeOn = (await GM.getValue("sleep", 0)) as number;
  const currentTime = DateTime.now().setZone("America/New_York").toMillis();
  if (msToWakeOn > currentTime) {
    await sleep(msToWakeOn - currentTime);
  }
}

export async function worker() {
  await sleepRequiredTime();
  const posts: Post[] = JSON.parse(
    (await GM.getValue("queue", "[]")) as string
  );
  if (posts.length > 0) {
    const post = posts.splice(0, 1)[0];
    await GM.setValue("queue", JSON.stringify(posts));
    GM.xmlHttpRequest({
      url: `https://myanimelist.net/forum/?${new URLSearchParams({
        action: "post",
        manga_id: String(post.malId),
      })}`,
      data: new URLSearchParams({
        topic_title: "",
        epNum: String(post.chapNum),
        epcheck: "1",
        msg_text: post.body,
        pollQuestion: "",
        "pollOption[]": "",
        action_type: "submit",
        manga_id: String(post.malId),
        csrf_token: (await GM.getValue("csrf_token")) as string,
      }).toString(),
      headers: {
        Cookie: `MALSESSIONID=${await GM.getValue("MALSESSIONID")}`,
      },
      method: "POST",
      onreadystatechange(response: GM.Response<void>) {
        let requeue = false;
        if (response.readyState === 4) {
          if (
            response.status === 404 &&
            response.responseText.includes(
              '<h1 class="h1">400 Bad Request</h1>'
            )
          ) {
            mountModal(
              ErrorModal({
                body: "Requests are returning 400 Bad Requests. Re-include your MAL session token.",
              })
            );
            GM.deleteValue("MALSESSIONID");
            requeue = true;
          } else if (
            response.responseText.includes('<div class="badresult">')
          ) {
            if (
              response.responseText.includes(
                "Please wait a few moments before trying to post again."
              )
            ) {
              // This means there was another post in-between.
              requeue = true;
            } else {
              mountModal(
                ForumPost({
                  heading: "Could Not Post, Please Edit and Re-Submit",
                  malId: post.malId,
                  chapNum: post.chapNum,
                  body: post.body,
                  readonly: true,
                })
              );
            }
          } else if (
            response.responseText.includes('<div class="goodresult">')
          ) {
            // Success, we ignore it.
          }

          if (requeue) {
            queuePost(post);
          }
        }
      },
    });
    setTimeToWake((5 * 60 + 10) * 1000);
  } else {
    setTimeToWake(1000);
  }

  setTimeout(worker, 0);
}
