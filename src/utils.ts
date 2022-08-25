import {appendElement, Element} from "simple-tsx";
import {DateTime} from "luxon";

export async function mountModal(modal: Element) {
  const base = document.body;
  modal.element
    .querySelector<HTMLSpanElement>("span[data-close]")!
    .addEventListener("click", function () {
      base.removeChild(this.parentElement!.parentElement!.parentElement!);
    });
  appendElement(base, modal);
}

export function getTimestampAfter(ms: number, datetime?: DateTime): DateTime{
  const time = datetime ?? DateTime.now().setZone("America/New_York")
  return time.plus({millisecond: ms})
}
