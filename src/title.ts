import { Post } from "./types";

export default function getPostDataFromTitle(
  uuid: string
): Promise<Partial<Post> | null> {
  return new Promise((resolve) => {
    GM.xmlHttpRequest({
      method: "GET",
      url: `https://api.mangadex.org/manga/${uuid}`,
      onreadystatechange(response: GM.Response<void>): void {
        if (response.readyState === 4) {
          if (response.status === 200) {
            const data: {
              data: { attributes: { links: { mal?: string } | void[] } };
            } = JSON.parse(response.responseText);
            const malId = Array.isArray(data.data.attributes.links)
              ? null
              : data.data.attributes.links.mal || null;
            if (malId === null) {
              return resolve(null);
            }

            return resolve({
              malId: Number(malId),
            });
          }

          console.log(
            `[MangaDex API] Manga ${uuid} returned non-success code ${response.status} and response ${response.responseText}.`
          );
          return resolve(null);
        }

        return undefined;
      },
    });
  });
}
