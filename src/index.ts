import { worker } from "./main"
import {specifySessionToken, validateCsrfToken} from "./prompts";

validateCsrfToken().then(specifySessionToken).then(worker)
