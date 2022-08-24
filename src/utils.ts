import {appendElementLeft, Element} from "simple-tsx";

export async function mountModal(modal: Element) {
  const base = document.body;
  modal.element
    .querySelector<HTMLSpanElement>("span[data-close]")!
    .addEventListener("click", function () {
      base.removeChild(this.parentElement!.parentElement!.parentElement!);
    });
  appendElementLeft(base, modal);
}
