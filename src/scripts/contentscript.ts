import ext from "./utils/ext";
import {
  extractStatBlock} from "./extractstatblock";
import { convertCharacterSheetToStatBlock } from "./convert_sheet";
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
      if (document.getElementsByClassName("mon-stat-block").length > 0) {
        return sendResponse(extractStatBlock(options));
      }
      if (document.getElementsByClassName("ct-character-sheet").length > 0) {
        return sendResponse(convertCharacterSheetToStatBlock(options));
      }

      sendResponse(null);
    });
  }
  return true;
}

const runtime: typeof chrome.runtime = ext.runtime;

runtime.onMessage.addListener(onRequest);
