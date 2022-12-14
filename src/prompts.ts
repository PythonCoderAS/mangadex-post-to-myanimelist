import sleep from "sleep-promise";

export default async function validateCsrfToken() {
  if (await GM.getValue("csrf_token")) {
    return;
  }

  if (
    location.origin === "https://myanimelist.net" &&
    location.pathname === "/"
  ) {
    await GM.setValue(
      "csrf_token",
      document.querySelector<HTMLMetaElement>('meta[name="csrf_token"]')!
        .content
    );
  } else {
    const newWindow = window.open("https://myanimelist.net")!;
    while (!(await GM.getValue("csrf_token"))) {
      await sleep(100);
    }

    newWindow.close();
  }
}
