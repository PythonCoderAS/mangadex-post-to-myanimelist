import { RemoveModalSignature } from "../context";
import Modal, { ModalProps } from "./modal";

export default function makeSelfMountingModal(
  props: ModalProps & { removeModal: RemoveModalSignature }
) {
  // eslint-disable-next-line react/display-name
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
