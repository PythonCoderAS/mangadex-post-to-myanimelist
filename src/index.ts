import { openWorkerIfNeeded, queueBackupMonitor, worker } from "./main";
import assignHandler from "./onkeydown";
import validateCsrfToken from "./prompts";
import queue from "./queue";

validateCsrfToken()
  .then(queue.loadQueue.bind(queue))
  .then(openWorkerIfNeeded)
  .then(worker)
  .then(assignHandler)
  .then(queue.loopSave.bind(queue))
  .then(queueBackupMonitor);
