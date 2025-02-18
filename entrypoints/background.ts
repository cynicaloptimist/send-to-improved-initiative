import { OptionDefaults, Options } from "@/utils/options";
import lzString from "lz-string";
import { storage } from "wxt/storage";

export default defineBackground(() => {
  console.log("Hello background!", { id: browser.runtime.id });

  const tabs = browser.tabs;
  const runtime = browser.runtime;

  storage.getItems(Object.values(Options)).then((values) => {
    if (values) {
      for (const key in OptionDefaults) {
        const storedOption = values.find((v) => v.key === key);
        if (!storedOption) {
          storage.setItem(key as Options, OptionDefaults[key as Options]);
        }
      }
    } else {
      for (const key in OptionDefaults) {
        storage.setItem(key as Options, OptionDefaults[key as Options]);
      }
    }
  });

  function newIITab(url: string) {
    tabs.create({ url: url }, (tab) => {
      storage.setItem("session:tabId", tab.id);
      console.log("New II tab id: ", tab.id);
    });
  }

  // Handles if the II tab is closed.
  tabs.onRemoved.addListener(async (tabId: number) => {
    const current = await storage.getItem("session:tabId");

    if (current === tabId) {
      storage.removeItem("session:tabId");
    }
  });

  runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === "perform-save") {
      storage.getItem(Options.TargetUrl).then(async (targetUrlStored) => {
        const current = await storage.getItem("session:tabId");

        let targetUrl = OptionDefaults[Options.TargetUrl];
        if (typeof targetUrlStored === "string" && targetUrlStored.length > 0) {
          targetUrl = targetUrlStored;
        }

        const compressed = lzString.compressToEncodedURIComponent(
          JSON.stringify(request.importedStatBlock)
        );

        let iiUrl = targetUrl + "?i=" + compressed;
        if (current && typeof current === "number") {
          try {
            tabs.update(current, { url: iiUrl, active: true }, (tab) => {
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
});
