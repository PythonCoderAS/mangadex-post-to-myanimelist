import * as SimpleTSX from "simple-tsx";
import Modal from "../modal/modal";

export interface FormModalProps {
  onsubmit: (this: HTMLFormElement) => Promise<any>
  body: SimpleTSX.Element
  heading: string | SimpleTSX.Element
}


export function FormModal(props: FormModalProps){
  async function onsubmit(this: HTMLFormElement){
    const val = await props.onsubmit.bind(this)()
    return !!val;
  }
  const form = (
    <form onsubmit={onsubmit}>
      {props.body}
    </form>
  )
  return <Modal header={props.heading} body={form} dividingLine={true} />
}
