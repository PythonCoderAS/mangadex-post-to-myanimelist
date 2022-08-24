declare module "*.css" {
  const content: Record<string, string>;
  export default content;
}

declare namespace JSX {
  interface IntrinsicElements {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [elemName: string]: any;
  }
}
