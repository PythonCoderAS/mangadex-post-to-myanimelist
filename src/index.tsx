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
import "./gm";
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
    case "add": {
      const id = Math.max(...state.keys(), 0) + 1;
      state.set(
        id,
        typeof action.modal === "function" ? action.modal(id) : action.modal
      );
      break;
    }

    case "remove": {
      if (action.id <= 0) {
        throw new Error("Invalid ID");
      }

      state.delete(action.id);
      break;
    }

    default:
      throw new Error(`Invalid action type.`);
  }

  return new Map(state);
}

function App() {
  const queue = useContext(QueueContext);
  const [ready, setReady] = useState(false);
  const [primaryModalClosed, setPrimaryModalClosed] = useState(true);
  const [primaryModalData, setPrimaryModalData] = useState<ForumPostProps>({});
  const [primaryModelLoading, setPrimaryModalLoading] = useState(false);
  const [modals, setModals] = useReducer(
    modalReducer,
    new Map<number, JSX.Element>()
  );

  console.log(modals);
  console.log({ primaryModalClosed, primaryModalData });

  const addModal = useMemo(
    () => (modal: AddModalModalType) => {
      setModals({ type: "add", modal });
      return Math.max(...modals.keys());
    },
    [modals]
  );
  const removeModal = useMemo(
    () => (id: number) => {
      setModals({ type: "remove", id });
    },
    []
  );

  const primaryDataHandler = useMemo(
    () => (data: ForumPostProps) => {
      console.log(data);
      setPrimaryModalClosed(false);
      setPrimaryModalData(data);
    },
    []
  );

  const primaryDataLoadingHandler = useMemo(
    () => (loading: boolean) => {
      setPrimaryModalLoading(loading);
      setPrimaryModalClosed(false);
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

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    console.log(`Effect called. Ready: ${ready}`);
    if (ready || import.meta.env.DEV) {
      console.log("Attaching handler.");
      const handler = generateOnKeyDownHandler(
        primaryDataHandler,
        primaryDataLoadingHandler,
        primaryModalClosed
      );
      window.addEventListener("keydown", handler);
      return () => window.removeEventListener("keydown", handler);
    }
  }, [
    ready,
    primaryDataHandler,
    primaryDataLoadingHandler,
    primaryModalClosed,
  ]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        const maxModalId = Math.max(...modals.keys(), 0);
        if (maxModalId > 0) {
          removeModal(maxModalId);
        } else if (!primaryModalClosed) {
          setPrimaryModalClosed(true);
        }
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [modals, primaryModalClosed, removeModal]);

  return (
    <ModalContext.Provider
      value={{
        addModal,
        removeModal,
      }}
    >
      <>
        <PostModal
          key={0}
          {...primaryModalData}
          setClosed={setPrimaryModalClosed}
          closed={primaryModalClosed}
          loading={primaryModelLoading}
        />
        ,
        {Array.from(modals.entries()).map(([id, modal]) => (
          <div key={id}>{modal}</div>
        ))}
      </>
    </ModalContext.Provider>
  );
}

let done = false;

function onLoad() {
  if (!done) {
    done = true;
  }

  const root = document.createElement("div");
  document.body.appendChild(root);
  render(<App />, root);
}

window.addEventListener("load", onLoad);
onLoad();
