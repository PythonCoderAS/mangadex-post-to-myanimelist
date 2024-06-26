/* eslint-disable no-continue */
import { isEqual } from "lodash";
import { DateTime } from "luxon";

import { ForumPostProps } from "./components/postModal";
import makeSelfMountingModal from "./components/selfMountingModal";
import { AddModalSignature, RemoveModalSignature } from "./context";
import Queue from "./queue";
import { Post } from "./types";
import { getTimestampAfter, sleep } from "./utils";

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
    console.log(
      `Sleeping until ${DateTime.now()
        .setZone("America/New_York")
        .plus(timeToSleep)
        .toLocaleString(DateTime.DATETIME_SHORT)}`
    );
    await sleep(timeToSleep);
  }
}

export default function worker(
  queue: Queue,
  addModal: AddModalSignature,
  removeModal: RemoveModalSignature,
  handler: (data: ForumPostProps) => unknown
) {
  window.navigator.locks.request("post-lock", async () => {
    console.log("Granted post lock.");
    while (true) {
      await sleepRequiredTime();
      if (queue.length > 0) {
        const post = queue.popItem()!;
        if (
          post.malId <= 0 ||
          post.chapNum <= 0 ||
          post.body.trim().length < 15
        ) {
          console.debug("Ignoring bad post:");
          console.debug(post);
          setTimeToWake(100);
          continue;
        }

        const previousRequestsData: Post[] = JSON.parse(
          await GM.getValue("previousRequests", "[]")
        );
        if (previousRequestsData.some((item: Post) => isEqual(item, post))) {
          console.log(
            `Skipping ${JSON.stringify(post)} because it was already posted.`
          );
          setTimeToWake(100);
          continue;
        }

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
          // eslint-disable-next-line @typescript-eslint/no-loop-func
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
                addModal(
                  makeSelfMountingModal({
                    heading: "MAL Token Error",
                    children: (
                      <p>
                        Requests are returning 400 Bad Requests. Check your MAL
                        login.
                      </p>
                    ),
                    removeModal,
                  })
                );
                console.log(
                  `Requeing ${JSON.stringify(post)} due to 400 error.`
                );
                requeue = true;
              } else if (response.status === 400) {
                // This usually means our CSRF token was invalid.
                // Delete it and reload the page to invole the CSRF regeneration process.
                console.log(
                  `Requeing ${JSON.stringify(
                    post
                  )} due to 400 error (suspected bad CSRF token).`
                );
                requeue = true;
                GM.deleteValue("csrf_token")
                  .then(() => sleep(250))
                  .then(location.reload);
              } else if (
                response.responseText.includes('<div class="badresult">')
              ) {
                if (
                  response.responseText.includes(
                    "Please wait a few moments before trying to post again."
                  )
                ) {
                  // This means there was another post in-between.
                  console.log(
                    `Requeing ${JSON.stringify(post)} due to rate limiting.`
                  );
                  requeue = true;
                } else {
                  handler({
                    heading: "Could Not Post, Please Edit and Re-Submit",
                    malId: post.malId,
                    chapNum: post.chapNum,
                    body: post.body,
                  });
                }
              } else if (
                response.responseText.includes('<div class="goodresult">')
              ) {
                // Success
                const newRequestsData: Post[] = [
                  ...previousRequestsData.slice(0),
                  post,
                ];
                if (newRequestsData.length > 100) {
                  newRequestsData.shift();
                }

                GM.setValue(
                  "previousRequests",
                  JSON.stringify(newRequestsData)
                );
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
    }
  });
}
