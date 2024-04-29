if (import.meta.env.DEV) {
  const valueStore = new Map<string, GM.Value>();

  const getValue: typeof GM.getValue = async (
    key: string,
    defaultValue?: GM.Value
  ): Promise<GM.Value | undefined> => valueStore.get(key) ?? defaultValue;
  const setValue: typeof GM.setValue = async (
    key: string,
    value: GM.Value
  ): Promise<void> => {
    valueStore.set(key, value);
  };

  const deleteValue: typeof GM.deleteValue = async (
    key: string
  ): Promise<void> => {
    valueStore.delete(key);
  };

  const listValues: typeof GM.listValues = async (): Promise<string[]> =>
    Array.from(valueStore.keys());

  window.GM = {
    getValue,
    setValue,
    deleteValue,
    listValues,
    info: {
      script: {
        description: "GM4 polyfill for development",
        excludes: [],
        includes: [],
        matches: [],
        name: "GM4 polyfill",
        namespace: "",
        resources: {},
        version: "1.0.0",
        runAt: "start",
        uuid: "00000000-0000-0000-0000-000000000000",
      },
      scriptMetaStr: "",
      scriptHandler: "Tampermonkey",
      version: "1.0.0",
    },
    async getResourceUrl(resourceName) {
      return new URL(resourceName, import.meta.url).href;
    },
    notification(text, title, image, onClick) {
      console.log({ text, title, image, onClick });
    },
    openInTab() {
      throw new Error("Not implemented");
    },
    registerMenuCommand() {
      throw new Error("Not implemented");
    },
    setClipboard(text) {
      console.log("Clipboard: %s", text);
    },
    xmlHttpRequest(details) {
      console.log("XMLHttpRequest: %o", details);
    },
  };
}
