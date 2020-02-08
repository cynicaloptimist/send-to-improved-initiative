import ext from "./utils/ext";
import storage from "./utils/storage";
import { Options } from "./OptionsValues";
const codec = require("json-url")("lzma");

const runtime: typeof chrome.runtime = ext.runtime;
const tabs: typeof chrome.tabs = ext.tabs;

storage.get(Object.values(Options), values => {
  if (values[Options.TargetUrl] == null) {
    storage.set({
      [Options.TargetUrl]: "https://www.improved-initiative.com/e/"
    });
  }
  if (values[Options.IncludePageNumberWithSource] == null) {
    storage.set({
      [Options.IncludePageNumberWithSource]: "on"
    });
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
