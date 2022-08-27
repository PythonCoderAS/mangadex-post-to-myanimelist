import * as SimpleTSX from "simple-tsx";

import Modal from "../modal/modal";
import formModalStyles from "./formModal.module.css";

export interface FormModalProps {
  onsubmit: (this: HTMLFormElement) => Promise<any>;
  body: SimpleTSX.Element;
  heading: string | SimpleTSX.Element;
}

export function FormModal(props: FormModalProps) {
  async function onsubmit(this: HTMLFormElement) {
    const val = await props.onsubmit.bind(this)() ?? true;
    if (val){
      const modal = this.parentElement!.parentElement!.parentElement!
      modal.parentElement!.removeChild(modal)
    }
    return false;
  }
  const form = <form class={formModalStyles.form} onsubmit={onsubmit}>{props.body}</form>;
  return <Modal header={props.heading} body={form} dividingLine={true} />;
}
