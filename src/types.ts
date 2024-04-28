export interface Post {
  malId: number;
  chapNum: number;
  body: string;
}

export interface ModalClosedProps {
  closed: boolean;
  setClosed: (closed: boolean) => void;
}
