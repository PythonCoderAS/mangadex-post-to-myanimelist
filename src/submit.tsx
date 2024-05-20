import makeSelfMountingModal from "./components/selfMountingModal";
import { AddModalSignature, RemoveModalSignature } from "./context";
import Queue from "./queue";
import { Post } from "./types";
import validText from "./validate";

export default function generateSubmitHandler(params: {
  queue: Queue;
  addModal: AddModalSignature;
  removeModal: RemoveModalSignature;
  malId: number;
  chapNum: number;
  bodyText: string;
}): () => boolean {
  const { queue, addModal, removeModal, malId, chapNum, bodyText } = params;
  return function () {
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
      return false;
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
      return false;
    }

    if (bodyText.length < 15 || !validText(bodyText)) {
      addModal(
        makeSelfMountingModal({
          heading: "Body too short",
          children: (
            <p>
              The body is too small! A post must have at least 15 characters, not including whitespace, BBCode tags, quotes and images.
            </p>
          ),
          removeModal,
        })
      );
      return false;
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
      return false;
    }

    const post: Post = {
      malId,
      chapNum,
      body: bodyText,
    };
    if (import.meta.env.DEV) {
      console.log(post);
    }

    queue.addItem(post);
    return true;
  };
}
