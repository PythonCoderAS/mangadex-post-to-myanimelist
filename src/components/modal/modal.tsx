import * as SimpleTSX from "simple-tsx";

import modalStyles from "./modal.module.css";

export interface ModalProps {
  header: string | SimpleTSX.Element;
  body: SimpleTSX.Element | SimpleTSX.Element[] | string | number;
  dividingLine?: boolean;
}

export default function Modal(props: ModalProps) {
  return (
    <div class={modalStyles.modal}>
      <div class={modalStyles.content}>
        <div class={modalStyles.header}>
          <span>
            {typeof props.header === "string" ? (
              <span class={modalStyles.stringHeader}>{props.header}</span>
            ) : (
              props.header
            )}
          </span>
          <span data-close="1" class={modalStyles.close}>
            &times;
          </span>
        </div>
        {props.dividingLine ? <hr /> : null}
        <div>{props.body}</div>
      </div>
    </div>
  );
}
