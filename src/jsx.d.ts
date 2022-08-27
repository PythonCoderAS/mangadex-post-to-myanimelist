import * as SimpleTSX from "simple-tsx";

declare global {

  namespace JSX {
  interface IntrinsicElements {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [elemName: string]: SimpleTSX.Element;
  }
}
}
