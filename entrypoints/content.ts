import { extractStatBlock } from "@/utils/extractstatblock";
import { convertCharacterSheetToStatBlock } from "@/utils/convert_sheet";
import { extractSpell } from "@/utils/extract_spell";
import { ScrapeStatBlockAction } from "@/utils/actions";
import { Options } from "@/utils/options";
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
          console.log("Scraping for statblock or spell");
          const options = initializeOptionsFromStoredValues(optionsFromStorage);
          if (document.getElementsByClassName("mon-stat-block").length > 0) {
            return sendResponse({
              type: "statblock",
              data: extractStatBlock(options),
            });
          }

          if (
            document.getElementsByClassName("mon-stat-block-2024").length > 0
          ) {
            return sendResponse({
              type: "statblock",
              data: extractStatBlock(options),
            });
          }

          if (
            document.getElementsByClassName("ct-character-sheet").length > 0
          ) {
            return sendResponse({
              type: "statblock",
              data: convertCharacterSheetToStatBlock(options),
            });
          }

          if (document.getElementsByClassName("spell-details").length > 0) {
            return sendResponse({ type: "spell", data: extractSpell(options) });
          }

          console.log("No importable items found");

          sendResponse(null);
        });
      }
      return true;
    }

    browser.runtime.onMessage.addListener(onRequest);
  },
});
