import { RemoveModalSignature } from "../context";
import Modal, { ModalProps } from "./modal";

export default function makeSelfMountingModal(
  props: ModalProps & { removeModal: RemoveModalSignature }
) {
  return function (id: number) {
    return (
      <Modal
        {...props}
        setClosed={() => {
          props.removeModal(id);
        }}
        closed={false}
      />
    );
  };
}
