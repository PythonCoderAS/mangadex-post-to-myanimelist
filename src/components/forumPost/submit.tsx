import * as SimpleTSX from "simple-tsx";

import { queuePost } from "../../main";
import { Post } from "../../types";
import { mountModal } from "../../utils";
import { ErrorModal } from "../errorModal/errorModal";

export default async function onSubmit(this: HTMLFormElement) {
  const malId = parseInt(
    this.querySelector<HTMLInputElement>("#mal-id")!.value,
    10
  );
  const chapNum = parseInt(
    this.querySelector<HTMLInputElement>("#mal-chapter-num")!.value,
    10
  );
  const bodyText = this.querySelector<HTMLTextAreaElement>("#post-body")!.value;
  if (Number.isNaN(malId) || !Number.isInteger(malId)) {
    mountModal(
      <ErrorModal
        body={
          <p>
            The given MAL ID <code>{malId}</code> is not a valid MAL manga ID.
          </p>
        }
      />
    );
    return true;
  }
  if (Number.isNaN(chapNum) || !Number.isInteger(chapNum)) {
    mountModal(
      <ErrorModal
        body={
          <>
            <p>
              The given chapter number <code>{chapNum}</code> is not a valid
              chapter number.
            </p>
            <br />
            <small>
              As a reminder, MyAnimeList only accepts positive non-zero integer
              chapter numbers.
            </small>
          </>
        }
      />
    );
    return true;
  }
  if (bodyText.length < 15) {
    mountModal(
      <ErrorModal
        body={
          <p>The body is too small! A post must have at least 15 characters.</p>
        }
      />
    );
    return true;
  }
  if (bodyText.length > 65535) {
    mountModal(
      <ErrorModal
        body={
          <p>
            The body is too large! A post must have 65535 or less characters.
          </p>
        }
      />
    );
    return true;
  }
  const post: Post = {
    malId,
    chapNum,
    body: bodyText,
  };
  await queuePost(post);
}
