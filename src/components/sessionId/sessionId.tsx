import * as SimpleTSX from "simple-tsx";

import { mountModal } from "../../utils";
import { ErrorModal } from "../errorModal/errorModal";
import { FormModal } from "../formModal/formModal";

export default function SessionID() {
  const body = (
    <div>
      <input type="text" id="mal-session-id" name="mal-session-id" />
      <label for="mal-session-id">MAL Session ID</label>
    </div>
  );
  return (
    <FormModal
      heading="Input MAL Session ID"
      body={body}
      onsubmit={async function (this: HTMLFormElement) {
        const token = this.querySelector("input")!.value;
        if (!token) {
          mountModal(<ErrorModal body="Token needs to be provided!" />);
          return false;
        } else {
          await GM.setValue("MALSESSIONID", token);
        }
      }}
    />
  );
}
