import getPostDataFromChapter from "./chapter";
import { ForumPostProps } from "./components/postModal";
import getPostDataFromTitle from "./title";

export default function generateOnKeyDownHandler(
  dataHandler: (data: ForumPostProps) => unknown,
  setPrimaryModalLoading: (loading: boolean) => void
) {
  return async function (event: KeyboardEvent): Promise<void> {
    const key = event.code.toLowerCase().replace("key", "");
    if ((location.origin === "https://mangadex.org" || import.meta.env.DEV) && event.shiftKey && key === "p") {
        // We have our keybind, display our modal.
        setPrimaryModalLoading(true);
        const titleMatch = location.pathname.match(
          /title\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/
        );
        const chapterMatch = location.pathname.match(
          /chapter\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/
        );
        if (titleMatch) {
          // We're at a title page, we can get more information.
          try {
            const data = await getPostDataFromTitle(titleMatch[1]);
          if (data) {
            dataHandler(data);
          }} catch (error) {
            console.error(error);
            dataHandler({});
          }
        } else if (chapterMatch) {
          // We're at a chapter page, we can get more information.
          try {
            const data = await getPostDataFromChapter(chapterMatch[1]);
          if (data) {
            dataHandler(data);
          }
          } catch (error) {
            console.error(error);
            dataHandler({});
          }
        } else {
          dataHandler({});
        }

        setPrimaryModalLoading(false);
      }
    };
  }
