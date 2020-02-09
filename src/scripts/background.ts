import ext from "./utils/ext";
import storage from "./utils/storage";
import { Options, OptionDefaults } from "./options";
const codec = require("json-url")("lzma");

const runtime: typeof chrome.runtime = ext.runtime;
const tabs: typeof chrome.tabs = ext.tabs;

storage.get(Object.values(Options), values => {
  for (const option in OptionDefaults) {
    if (values[option] == null) {
      storage.set({
        [option]: OptionDefaults[option]
      });
    }
  }
});

runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "perform-save") {
    storage.get(Options.TargetUrl, async values => {
      const compressed = await codec.compress(
        JSON.stringify(request.importedStatBlock)
      );
      tabs.create({
        url: values[Options.TargetUrl] + "?s=" + encodeURIComponent(compressed)
      });
      sendResponse({ action: "saved" });
    });
  }
});
