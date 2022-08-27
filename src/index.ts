import { worker } from "./main";
import assignHandler from "./onkeydown";
import { specifySessionToken, validateCsrfToken } from "./prompts";

validateCsrfToken().then(specifySessionToken).then(worker).then(assignHandler);
