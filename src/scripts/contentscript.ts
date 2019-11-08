import ext from "./utils/ext";
import { extractStatBlock } from "./extractstatblock";
import { ScrapeStatBlockAction } from "./actions";

function onRequest(request, sender, sendResponse) {
  if (request.action == ScrapeStatBlockAction) {
    sendResponse(extractStatBlock())
  }
}

ext.runtime.onMessage.addListener(onRequest);