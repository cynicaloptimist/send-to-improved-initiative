import ext from "./utils/ext";
import { extractStatBlock } from "./extractstatblock";
import { ScrapeStatBlockAction } from "./actions";
import storage from "./utils/storage";
import { Options, AllOptions } from "./options";

function onRequest(
  request: any,
  sender,
  sendResponse: (response: any) => void
) {
  if (request.action == ScrapeStatBlockAction) {
    storage.get(Object.values(Options), (options: AllOptions) => {
      sendResponse(extractStatBlock(options));
    });
  }
  return true;
}

const runtime: typeof chrome.runtime = ext.runtime;

runtime.onMessage.addListener(onRequest);
