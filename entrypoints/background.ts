import { OptionDefaults, Options } from "@/utils/options";
import lzString from "lz-string";

export default defineBackground(() => {
  console.log("Hello background!", { id: browser.runtime.id });

  const storage = browser.storage.sync
    ? browser.storage.sync
    : browser.storage.local;
  const tabs = browser.tabs;
  const runtime = browser.runtime;

  storage.get(Object.values(Options), (values) => {
    if (!values) {
      values = {};
    }
    for (const option in OptionDefaults) {
      if (values[option] == null) {
        storage.set({
          [option]: OptionDefaults[option as Options],
        });
      }
    }
  });

  browser.storage.local.get(Options.TargetUrl, async (values) => {
    if (!values) {
      values = {};
    }
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
      chrome.storage.local.set({ tabId: tab.id });
      console.log("New II tab id: ", tab.id);
    });
  }

  // Handles if the II tab is closed.
  tabs.onRemoved.addListener(async (tabId: number, remInfo: object) => {
    const current = await chrome.storage.local.get(["tabId"]);

    if (current["tabId"] === tabId) {
      chrome.storage.local.remove("tabId");
    }
  });

  runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === "perform-save") {
      storage.get(Options.TargetUrl, async (values) => {
        const current = await chrome.storage.local.get(["tabId"]);

        const compressed = lzString.compressToEncodedURIComponent(
          JSON.stringify(request.importedStatBlock)
        );

        let iiUrl = values[Options.TargetUrl] + "?i=" + compressed;
        if (current["tabId"]) {
          try {
            tabs.update(
              current["tabId"],
              { url: iiUrl, active: true },
              (tab) => {
                if (!tab || tab.id === tabs.TAB_ID_NONE) {
                  console.error("Did not find tab");
                  newIITab(iiUrl);
                } else console.log("Changed the existing tab url.");
              }
            );
          } catch (error) {
            console.log("Err while getting tab.", error);
          }
        } else newIITab(iiUrl);

        sendResponse({ action: "saved" });
      });
    }
  });
});
