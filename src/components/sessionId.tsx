import { useContext } from "preact/hooks";

import { ModalContext } from "../context";
import Form from "./form";
import Modal from "./modal";
import makeSelfMountingModal from "./selfMountingModal";

export default function SessionID(props: { modalId: number }) {
  const modalContext = useContext(ModalContext);
  return (
    <Modal
      heading="Input MAL Session ID"
      closed={false}
      setClosed={() => modalContext.removeModal(props.modalId)}
    >
      <Form
        formmethod="dialog"
        onSubmit={async function (this: HTMLFormElement) {
          const token = this.querySelector("input")!.value;
          if (!token) {
            modalContext.addModal(
              makeSelfMountingModal({
                heading: "Empty Session ID",
                children: <p>Session ID cannot be empty.</p>,
                removeModal: modalContext.removeModal,
              })
            );
            return false;
          }

          await GM.setValue("MALSESSIONID", token);

        }}
      >
        <div>
          <div>
            <input type="text" id="mal-session-id" name="mal-session-id" />
            <label for="mal-session-id">MAL Session ID</label>
          </div>
          <input type="submit">Post</input>
        </div>
      </Form>
    </Modal>
  );
}
