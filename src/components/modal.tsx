import React, { useEffect } from "preact/compat";

import { ModalClosedProps } from "../types";
import modalStyles from "./modal.module.css";

export type ModalProps = React.PropsWithChildren<{
  heading?: string | React.ReactNode;
  dividingLine?: boolean;
}>;

export default function Modal(props: ModalProps & ModalClosedProps) {
  const dialogRef = React.createRef<HTMLDialogElement>();
  useEffect(() => {
    if (dialogRef.current) {
      if (props.closed) {
        dialogRef.current.close();
      } else {
        dialogRef.current.showModal();
      }
    }
  }, [props.closed, dialogRef]);
  return (
    <dialog class={modalStyles.modal} ref={dialogRef}>
      <div class={modalStyles.content}>
        <div class={modalStyles.header}>
          <span>
            {typeof props.heading === "string" ? (
              <span class={modalStyles.stringHeader}>{props.heading}</span>
            ) : (
              props.heading
            )}
          </span>
          <span onClick={() => props.setClosed(true)} class={modalStyles.close}>
            &times;
          </span>
        </div>
        {props.dividingLine ? <hr /> : null}
        <div>{props.children}</div>
      </div>
    </dialog>
  );
}
