import { extractStatBlock } from "@/utils/extractstatblock";
import { convertCharacterSheetToStatBlock } from "@/utils/convert_sheet";
import { ScrapeStatBlockAction } from "@/utils/actions";
import { Options, AllOptions } from "@/utils/options";

export default defineContentScript({
  matches: ["<all_urls>", "*://*.dndbeyond.com/*"],
  main(ctx) {
    console.log("Content script loaded");

    const storage = browser.storage.sync
      ? browser.storage.sync
      : browser.storage.local;

    function onRequest(
      request: any,
      _sender: any,
      sendResponse: (response: any) => void
    ) {
      console.log("Request received", request);
      if (request.action == ScrapeStatBlockAction) {
        console.log("Getting storage");
        storage.get(Object.values(Options), (options: AllOptions) => {
          console.log("Scraping statblock");
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

          console.log("No statblock found");

          sendResponse(null);
        });
      }
      return true;
    }

    browser.runtime.onMessage.addListener(onRequest);
  },
});
