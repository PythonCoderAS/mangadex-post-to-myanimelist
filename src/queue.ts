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

  getItem(): Post | null {
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
    if (this.toBeDeleted.length > 0) {
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
          serverData.splice(foundIdx, 1);
        }
      }

      this.toBeDeleted = [];
    }

    if (this.toBeAdded.length > 0) {
      serverData.push(...this.toBeAdded);
      this.toBeAdded = [];
    }

    return serverData;
  }

  async save() {
    await navigator.locks.request("queue-save", async () => {
      const serverData: Post[] = JSON.parse(await GM.getValue("queue", "[]"));
      if (this.modified) {
        const merged = this.mergeData(serverData);
        await GM.setValue("queue", JSON.stringify(merged));
        this.data = merged;
      } else {
        this.data = serverData;
      }
    });
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
