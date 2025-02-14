import { extractStatBlock } from "@/utils/extractstatblock";
import { convertCharacterSheetToStatBlock } from "@/utils/convert_sheet";
import { ScrapeStatBlockAction } from "@/utils/actions";
import { Options, AllOptions } from "@/utils/options";
import { storage } from "wxt/storage";

export default defineContentScript({
  matches: ["*://*.dndbeyond.com/*"],
  main() {
    console.log("Content Script Loaded.");

    function onRequest(
      request: any,
      _sender: any,
      sendResponse: (response: any) => void
    ) {
      console.log("Request received", request);
      if (request.action == ScrapeStatBlockAction) {
        console.log("Getting storage");
        storage.getItems(Object.values(Options)).then((optionsFromStorage) => {
          console.log("Scraping statblock");
          const options = initializeOptionsFromStoredValues(optionsFromStorage);
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
