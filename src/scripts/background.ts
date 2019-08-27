import ext from "./utils/ext";
const runtime: typeof chrome.runtime = ext.runtime;
const tabs: typeof chrome.tabs = ext.tabs;

runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.action === "perform-save") {
      tabs.create({
        url: "http://localhost/e/?importStatBlock=" + encodeURIComponent(request.data)
      });
      sendResponse({ action: "saved" });
    }
  }
);