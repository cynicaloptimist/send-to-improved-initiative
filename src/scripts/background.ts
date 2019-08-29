import ext from "./utils/ext";
const codec = require("json-url")("lzma");

const runtime: typeof chrome.runtime = ext.runtime;
const tabs: typeof chrome.tabs = ext.tabs;

runtime.onMessage.addListener(
  async function(request, sender, sendResponse) {
    if (request.action === "perform-save") {
      const compressed = await codec.compress(request.data);
      tabs.create({
        url: "http://localhost/e/?s=" + encodeURIComponent(compressed)
      });
      sendResponse({ action: "saved" });
    }
  }
);
