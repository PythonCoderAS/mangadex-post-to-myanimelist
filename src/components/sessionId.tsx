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
        method="dialog"
        onSubmit={function (this: HTMLFormElement) {
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

          GM.setValue("MALSESSIONID", token);
          return true;
        }}
      >
        <div>
          <div>
            <input type="text" id="mal-session-id" name="mal-session-id" />
            <label for="mal-session-id">MAL Session ID</label>
          </div>
          <input type="submit" formmethod="dialog">
            Post
          </input>
        </div>
      </Form>
    </Modal>
  );
}
