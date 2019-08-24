import ext from "./utils/ext";
import { extractStatBlock } from "./extractstatblock";

function onRequest(request, sender, sendResponse) {
  if (request.action === 'process-page') {
    sendResponse(extractStatBlock())
  }
}

ext.runtime.onMessage.addListener(onRequest);