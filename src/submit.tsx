import makeSelfMountingModal from "./components/selfMountingModal";
import { AddModalSignature, RemoveModalSignature } from "./context";
import Queue from "./queue";
import { Post } from "./types";

export default function generateSubmitHandler(
  queue: Queue,
  addModal: AddModalSignature,
  removeModal: RemoveModalSignature
) {
  // eslint-disable-next-line consistent-return
  return async function () {
    const malId = parseInt(
      document.querySelector<HTMLInputElement>("#mal-id")!.value,
      10
    );
    const chapNum = parseInt(
      document.querySelector<HTMLInputElement>("#mal-chapter-num")!.value,
      10
    );
    const bodyText =
    document.querySelector<HTMLTextAreaElement>("#post-body")!.value;
    if (Number.isNaN(malId) || !Number.isInteger(malId)) {
      addModal(
        makeSelfMountingModal({
          heading: "Invalid MAL ID",
          children: (
            <p>
              The given MAL ID <code>{malId}</code> is not a valid MAL manga ID.
            </p>
          ),
          removeModal,
        })
      );
      return true;
    }

    if (Number.isNaN(chapNum) || !Number.isInteger(chapNum)) {
      addModal(
        makeSelfMountingModal({
          heading: "Invalid Chapter Number",
          children: (
            <>
              <p>
                The given chapter number <code>{chapNum}</code> is not a valid
                chapter number.
              </p>
              <br />
              <small>
                As a reminder, MyAnimeList only accepts positive non-zero
                integer chapter numbers.
              </small>
            </>
          ),
          removeModal,
        })
      );
      return true;
    }

    if (bodyText.length < 15) {
      addModal(
        makeSelfMountingModal({
          heading: "Body too short",
          children: (
            <p>
              The body is too small! A post must have at least 15 characters.
            </p>
          ),
          removeModal,
        })
      );
      return true;
    }

    if (bodyText.length > 65535) {
      addModal(
        makeSelfMountingModal({
          heading: "Body too long",
          children: (
            <p>
              The body is too large! A post must have 65535 or less characters.
            </p>
          ),
          removeModal,
        })
      );
      return true;
    }

    const post: Post = {
      malId,
      chapNum,
      body: bodyText,
    };
    queue.addItem(post);
  };
}
