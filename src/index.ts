import worker from "./main";
import assignHandler from "./onkeydown";
import validateCsrfToken from "./prompts";
import queue from "./queue";

validateCsrfToken()
  .then(queue.loadQueue.bind(queue))
  .then(queue.loopSave.bind(queue))
  .then(worker)
  .then(assignHandler);
