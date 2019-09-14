import ext from "./utils/ext";
import storage from "./utils/storage";
const codec = require("json-url")("lzma");

const runtime: typeof chrome.runtime = ext.runtime;
const tabs: typeof chrome.tabs = ext.tabs;

storage.get("target-url", values => {
  if (values["target-url"] == null) {
    storage.set({ "target-url": "https://www.improved-initiative.com/e/" })
  }
})

runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.action === "perform-save") {
      storage.get("target-url", async values => {
        const compressed = await codec.compress(JSON.stringify(request.importedStatBlock));
        tabs.create({
          url: values["target-url"] + "?s=" + encodeURIComponent(compressed)
        });
        sendResponse({ action: "saved" });
      });
      
    }
  }
);
