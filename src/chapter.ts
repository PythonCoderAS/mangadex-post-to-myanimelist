import { Post } from "./types";

export default function getPostDataFromChapter(
  uuid: string
): Promise<Partial<Post> | null> {
  return new Promise((resolve) => {
    GM.xmlHttpRequest({
      method: "GET",
      url: `https://api.mangadex.org/chapter/${uuid}?includes[]=manga`,
      onreadystatechange(response: GM.Response<void>): void {
        if (response.readyState === 4) {
          if (response.status === 200) {
            // Technically, this is a lie because there are types other than `manga`, but the find() takes care of it.
            const data: {
              data: {
                attributes: { chapter: string | null };
                relationships: {
                  type: "manga";
                  attributes: { links: { mal?: string } | void[] };
                }[];
              };
            } = JSON.parse(response.responseText);
            let chapNum: number | undefined = Number(
              data.data.attributes.chapter
            );
            if (Number.isNaN(chapNum)) {
              chapNum = undefined;
            } else {
              chapNum = Math.trunc(chapNum)
            }

            const manga = data.data.relationships.find(
              (item) => item.type === "manga"
            )!;
            const malId = Array.isArray(manga.attributes.links)
              ? null
              : manga.attributes.links.mal || null;
            if (malId === null) {
              return resolve({ chapNum });
            }

            return resolve({
              malId: Number(malId),
              chapNum,
            });
          }

          console.log(
            `[MangaDex API] Chapter ${uuid} returned non-success code ${response.status} and response ${response.responseText}.`
          );
          return resolve(null);
        }

        return undefined;
      },
    });
  });
}
