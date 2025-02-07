import { extractStatBlock } from "@/utils/extractstatblock";
import { convertCharacterSheetToStatBlock } from "@/utils/convert_sheet";
import { ScrapeStatBlockAction } from "@/utils/actions";
import { Options, AllOptions } from "@/utils/options";

export default defineContentScript({
  matches: ["*://*.dndbeyond.com/*"],
  main() {
    console.log("Content script loaded");

    const storage = browser.storage.sync
      ? browser.storage.sync
      : browser.storage.local;

    function onRequest(
      request: any,
      _sender: any,
      sendResponse: (response: any) => void
    ) {
      if (request.action == ScrapeStatBlockAction) {
        storage.get(Object.values(Options), (options: AllOptions) => {
          if (document.getElementsByClassName("mon-stat-block").length > 0) {
            return sendResponse(extractStatBlock(options));
          }

          if (
            document.getElementsByClassName("mon-stat-block-2024").length > 0
          ) {
            return sendResponse(extractStatBlock(options));
          }

          if (
            document.getElementsByClassName("ct-character-sheet").length > 0
          ) {
            return sendResponse(convertCharacterSheetToStatBlock(options));
          }

          sendResponse(null);
        });
      }
      return true;
    }

    browser.runtime.onMessage.addListener(onRequest);
  },
});
