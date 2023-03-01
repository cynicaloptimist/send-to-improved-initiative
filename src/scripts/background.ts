import ext from "./utils/ext";
import storage from "./utils/storage";
import { Options, OptionDefaults } from "./options";
const codec = require("json-url")("lzma");

const runtime: typeof chrome.runtime = ext.runtime;
const tabs: typeof chrome.tabs = ext.tabs;
var CurrentTabId = undefined;

storage.get(Object.values(Options), (values) => {
  for (const option in OptionDefaults) {
    if (values[option] == null) {
      storage.set({
        [option]: OptionDefaults[option],
      });
    }
  }
});

storage.get(Options.TargetUrl, async (values) => {
  const url: string = values[Options.TargetUrl];
  if (!url) {
    return;
  }
  if (
    url.includes("improved-initiative.com") ||
    url.includes("www.improvedinitiative.app")
  ) {
    storage.set({ [Options.TargetUrl]: OptionDefaults[Options.TargetUrl] });
  }
});

function newIITab(url: string) {
  tabs.create({ url: url }, (tab) => {
    CurrentTabId = tab.id;
    console.log("New II tab id: ", CurrentTabId);
  });
}

// Handles if the II tab is closed.
tabs.onRemoved.addListener((tabId: number, remInfo: object) => {
  if (CurrentTabId === tabId) CurrentTabId = undefined;
});

runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "perform-save") {
    storage.get(Options.TargetUrl, async (values) => {
      const compressed = await codec.compress(
        JSON.stringify(request.importedStatBlock)
      );

      let iiUrl =
        values[Options.TargetUrl] + "?s=" + encodeURIComponent(compressed);
      if (CurrentTabId) {
        try {
          tabs.update(CurrentTabId, { url: iiUrl, active: true }, (tab) => {
            if (!tab || tab.id === tabs.TAB_ID_NONE) {
              console.error("Did not find tab");
              newIITab(iiUrl);
            } else console.log("Changed the existing tab url.");
          });
        } catch (error) {
          console.log("Err while getting tab.", error);
        }
      } else newIITab(iiUrl);

      sendResponse({ action: "saved" });
    });
  }
});
