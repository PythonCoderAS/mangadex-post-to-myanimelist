import { JSX, createContext } from "preact";

import Queue from "./queue";

export const QueueContext = createContext(new Queue());

export type AddModalModalType = JSX.Element | ((id: number) => JSX.Element);
export type AddModalSignature = (modal: AddModalModalType) => number;
export type RemoveModalSignature = (id: number) => void;

export const ModalContext = createContext<{
  addModal: AddModalSignature;
  removeModal: RemoveModalSignature;
}>({
  addModal: () => -1,
  removeModal() {},
});
