import * as SimpleTSX from "simple-tsx";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: Omit<SimpleTSX.Element, "element">;
    }
  }
}
