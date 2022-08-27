import * as SimpleTSX from "simple-tsx";

import Modal from "../modal/modal";

export interface ErrorModalProps {
  body: string | SimpleTSX.Element;
}

export function ErrorModal(props: ErrorModalProps) {
  return <Modal header="Error" body={props.body} />;
}
