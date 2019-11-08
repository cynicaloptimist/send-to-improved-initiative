import ext from "./utils/ext";
import { extractStatBlock } from "./extractstatblock";
import { ScrapeStatBlockAction } from "./actions";

function onRequest(request: any, sender, sendResponse: (response: any) => void) {
  if (request.action == ScrapeStatBlockAction) {
    sendResponse(extractStatBlock())
  }
}

const runtime: typeof chrome.runtime = ext.runtime;

runtime.onMessage.addListener(onRequest);