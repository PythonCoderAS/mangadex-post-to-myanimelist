import { render } from "preact";
import {
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "preact/hooks";
import { JSX } from "preact/jsx-runtime";

import PostModal, { ForumPostProps } from "./components/postModal";
import { AddModalModalType, ModalContext, QueueContext } from "./context";
import worker from "./main";
import generateOnKeyDownHandler from "./onkeydown";
import validateCsrfToken from "./prompts";

function modalReducer(
  state: Map<number, JSX.Element>,
  action:
    | { type: "add"; modal: AddModalModalType }
    | { type: "remove"; id: number }
): Map<number, JSX.Element> {
  switch (action.type) {
    case "add":
      const id = Math.max(...state.keys(), 0) + 1;
      state.set(
        id,
        typeof action.modal === "function" ? action.modal(id) : action.modal
      );
    case "remove":
      if (id < 0) {
        throw new Error("Invalid ID");
      } else if (id === 0) {
        throw new Error("Cannot remove primary modal");
      }
      state.delete(id);
  }
  return state;
}

function App() {
  const queue = useContext(QueueContext);
  const [ready, setReady] = useState(false);
  const [primaryModalClosed, setPrimaryModalClosed] = useState(true);
  const [primaryModalData, setPrimaryModalData] = useState<ForumPostProps>({});
  const [modals, setModals] = useReducer(
    modalReducer,
    new Map<number, JSX.Element>([
      [
        0,
        <PostModal
          {...primaryModalData}
          setClosed={setPrimaryModalClosed}
          closed={primaryModalClosed}
        />,
      ],
    ])
  );

  console.log(modals);

  const addModal = useMemo(
    () => (modal: AddModalModalType) => {
      setModals({ type: "add", modal });
      return Math.max(...modals.keys());
    },
    []
  );
  const removeModal = useMemo(
    () => (id: number) => {
      setModals({ type: "remove", id });
    },
    []
  );

  const primaryDataHandler = useMemo(
    () => (data: ForumPostProps) => {
      setPrimaryModalClosed(false);
      setPrimaryModalData(data);
    },
    []
  );

  useEffect(() => {
    validateCsrfToken()
      .then(queue.loadQueue.bind(queue))
      .then(queue.loopSave.bind(queue))
      .then(() => worker(queue, addModal, removeModal, primaryDataHandler))
      .then(() => setReady(true));
  });

  useEffect(() => {
    if (ready) {
      const handler = generateOnKeyDownHandler(primaryDataHandler);
      window.addEventListener("keydown", handler);
      return () => window.removeEventListener("keydown", handler);
    }
  }, [ready]);

  return (
    <ModalContext.Provider
      value={{
        addModal,
        removeModal,
      }}
    >
      <>
        {Array.from(modals.entries()).map(([id, modal]) => (
          <div key={id}>{modal}</div>
        ))}
      </>
    </ModalContext.Provider>
  );
}

window.addEventListener("load", () => {
  const root = document.createElement("div");
  document.body.appendChild(root);
  render(<App />, root);
});
