import { isEqual } from "lodash";

import { Post } from "./types";

export default class Queue {
  private data: Post[] = [];

  private toBeDeleted: Post[] = [];

  private toBeAdded: Post[] = [];

  private modified = false;

  async loadQueue() {
    this.data = JSON.parse((await GM.getValue("queue", "[]")) as string);
    console.log(`Loaded queue with ${this.data.length} items.`);
  }

  popItem(): Post | null {
    const item = this.data[0];
    if (item) {
      this.data = this.data.splice(0, 1);
      this.toBeDeleted.push(item);
      this.modified = true;
      return item;
    }

    return null;
  }

  addItem(item: Post) {
    this.data.push(item);
    this.toBeAdded.push(item);
    this.modified = true;
  }

  /**
   * Merges the current queue's data with the "server" queue (the queue stored in setValue)
   */
  mergeData(serverData: Post[]): Post[] {
    console.groupCollapsed("Merging server data with local data");
    console.debug("Server data:");
    console.debug(serverData);
    if (this.toBeDeleted.length > 0) {
      console.groupCollapsed("Processing deletions");
      console.debug("Items to be deleted:");
      console.debug(this.toBeDeleted);
      for (const item of this.toBeDeleted) {
        let foundIdx: number | null = null;
        // We loop through the server data array to see if there is an identical object to something that this tab/thread deleted.
        // If there is a match, we delete it. Otherwise, assume it has already been deleted and ignore.
        serverData.find((existingItem, index) => {
          if (isEqual(item, existingItem)) {
            foundIdx = index;
            return true;
          }

          return false;
        });
        if (foundIdx !== null) {
          console.debug(`Deleting item at index ${foundIdx}`);
          serverData.splice(foundIdx, 1);
        }
      }

      this.toBeDeleted = [];
      console.groupEnd();
    }

    if (this.toBeAdded.length > 0) {
      console.groupCollapsed("Processing additions");
      console.debug("Items to be added:");
      console.debug(this.toBeAdded);
      console.groupEnd();
      serverData.push(...this.toBeAdded);
      this.toBeAdded = [];
    }

    console.debug("Merged data:");
    console.debug(serverData);
    console.groupEnd();

    return serverData;
  }

  async save() {
    await navigator.locks.request("queue-save", async () => {
      console.groupCollapsed("Saving queue");
      const serverData: Post[] = JSON.parse(await GM.getValue("queue", "[]"));
      console.debug("Server data:");
      console.debug(serverData);

      if (this.modified) {
        console.debug("Queue has been modified, merging the two.");
        const merged = this.mergeData(serverData);
        await GM.setValue("queue", JSON.stringify(merged));
        this.data = merged;
        console.debug("Saved queue.");
      } else {
        console.debug(
          "Queue has not been modified, skipping save and replacing with server version."
        );
        this.data = serverData;
      }

      console.groupEnd();

      this.modified = false;
    });
  }

  getPost(index: number): Post | null {
    return this.data[index] || null;
  }

  deletePost(index: number) {
    this.toBeDeleted.push(this.data[index]);
    this.data.splice(index, 1);
    this.modified = true;
  }

  setPost(index: number, post: Partial<Post>) {
    this.data[index] = { ...this.data[index], ...post };
    this.modified = true;
  }

  async loopSave() {
    await this.save();
    setTimeout(this.loopSave.bind(this), 5 * 1000);
  }

  get length(): number {
    return this.data.length;
  }

  get posts(): Post[] {
    return [...this.data];
  }
}
