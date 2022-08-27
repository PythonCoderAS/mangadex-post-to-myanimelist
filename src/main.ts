import { DateTime } from "luxon";
import sleep from "sleep-promise";

import { ErrorModal } from "./components/errorModal/errorModal";
import { ForumPost } from "./components/forumPost/forumPost";
import queue from "./queue";
import { getTimestampAfter, mountModal } from "./utils";

async function setTimeToWake(ms: number) {
  const newMS = getTimestampAfter(ms).toMillis();
  await GM.setValue("sleep", newMS);
}

async function getTimeToSleep(): Promise<number> {
  const msToWakeOn = (await GM.getValue("sleep", 0)) as number;
  const currentTime = DateTime.now().setZone("America/New_York").toMillis();
  return msToWakeOn - currentTime;
}

async function sleepRequiredTime() {
  const timeToSleep = await getTimeToSleep();
  if (timeToSleep > 0) {
    await sleep(timeToSleep);
  }
}

// If there are queued posts and we haven't slept in over 6 minutes (more than enough time for one post), the queue is backed up and this likely means the worker thread is dead.
async function queueIsBackedUp() {
  return queue.length > 0 && (await getTimeToSleep()) > 6 * 60 * 1000;
}

export async function openWorkerIfNeeded() {
  if (
    location.origin === "https://mangadex.org" &&
    location.search.includes("lock=1")
  ) {
    return;
  }

  const backedUpQueue = await queueIsBackedUp();
  // If the queue is backed up, we want to take ownership of the queue.
  if (backedUpQueue) {
    window.open("https://mangadex.org/?lock=1");
  }
}

export async function worker() {
  if (
    !(
      location.origin === "https://mangadex.org" &&
      location.search.includes("lock=1")
    )
  ) {
    return;
  }

  await sleepRequiredTime();
  if (queue.length > 0) {
    const post = queue.getItem()!;
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
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
      onreadystatechange(response: GM.Response<void>) {
        GM.setValue(
          "lastPost",
          DateTime.now().setZone("America/New_York").toMillis()
        );
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
            queue.addItem(post);
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

export async function queueBackupMonitor() {
  const backedUp = await queueIsBackedUp();
  if (backedUp) {
    await openWorkerIfNeeded();
  }

  setTimeout(queueBackupMonitor, 10 * 1000);
}
