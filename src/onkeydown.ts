import getPostDataFromChapter from "./chapter";
import { ForumPost } from "./components/forumPost/forumPost";
import getPostDataFromTitle from "./title";
import { mountModal } from "./utils";

async function onkeydown(event: KeyboardEvent): Promise<void> {
  const key = event.code.toLowerCase().replace("key", "");
  if (location.origin === "https://mangadex.org") {
    if (event.shiftKey && key === "p") {
      // We have our keybind, display our modal.
      const titleMatch = location.pathname.match(
        /title\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/
      );
      const chapterMatch = location.pathname.match(
        /chapter\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/
      );
      if (titleMatch) {
        // We're at a title page, we can get more information.
        const data = await getPostDataFromTitle(titleMatch[1]);
        if (data) {
          return mountModal(ForumPost(data));
        }
      } else if (chapterMatch) {
        // We're at a chapter page, we can get more information.
        const data = await getPostDataFromChapter(chapterMatch[1]);
        if (data) {
          return mountModal(ForumPost(data));
        }
      }

      mountModal(ForumPost({}));
    }
  }

  return undefined;
}

export default function assignHandler() {
  window.addEventListener("keydown", onkeydown);
}
