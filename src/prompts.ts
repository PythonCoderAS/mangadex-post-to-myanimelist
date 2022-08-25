import * as sleep from "sleep-promise"
import {mountModal} from "./utils";
import SessionID from "./components/sessionId/sessionId";

export async function validateCsrfToken(){
  if (await GM.getValue("csrf_token")){
    return;
  }
  if (location.origin === "https://myanimelist.net" && location.pathname === "/"){
    await GM.setValue("csrf_token", document.querySelector<HTMLMetaElement>('meta[name="csrf_token"]')!.content)
  } else {
    const newWindow = window.open("https://myanimelist.net")!
    while (!await GM.getValue("csrf_token")){
      await sleep(100);
    }
    newWindow.close()
  }
}

export async function specifySessionToken(){
  if (await GM.getValue("csrf_token")){
    return;
  }
  mountModal(SessionID())
}
