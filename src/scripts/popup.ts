import ext from "./utils/ext";
import { StatBlock } from "./StatBlock";
import { ScrapeStatBlockAction } from "./actions";

const tabs: typeof chrome.tabs = ext.tabs;
const runtime: typeof chrome.runtime = ext.runtime;

let importedStatBlock = {};

var popup = document.getElementById("app");

tabs.query({active: true, currentWindow: true}, function(tabs) {
  var activeTab = tabs[0];
  chrome.tabs.sendMessage(activeTab.id, { action: ScrapeStatBlockAction }, handleScrapedStatBlock);
});

var template = (data: StatBlock) => {
  return (`
  <div class="statblock-preview">
    <h3>${data.Name}</h3>
    <pre class="statblock-preview__json">${JSON.stringify(data, null, 1)}</pre>
  </div>
  ${verifyOrWarnPortrait(data)}
  <div class="action-container">
    <button id="save-btn" class="btn btn-primary">Import</button>
  </div>
  `);
}

var verifyOrWarnPortrait = (data: StatBlock) => {
  if (data.ImageURL.length > 0) {
    return "";
  }
  return `<span class="warning">No portrait was found. Visit a Monster Details page to get the whole picture.</span>`;
}

var renderMessage = (message) => {
  var displayContainer = document.getElementById("display-container");
  displayContainer.innerHTML = `<p class='message'>${message}</p>`;
}

var handleScrapedStatBlock = (data: StatBlock) => {
  var displayContainer = document.getElementById("display-container")
  if(data) {
    var tmpl = template(data);
    displayContainer.innerHTML = tmpl;  
    importedStatBlock = data;
  } else {
    renderMessage("Could not scrape a StatBlock from this page. Please ensure that you are on a StatBlock <strong>Details</strong> page. " +
                  `<a href="https://www.dndbeyond.com/monsters">D&D Beyond Monsters</a>`)
  }
}

popup.addEventListener("click", function (e) {
  const target: Element = e.target as Element;
  if(target && target.matches("#save-btn")) {
    e.preventDefault();
    runtime.sendMessage({ action: "perform-save", importedStatBlock: importedStatBlock }, function(response) {
      if(response && response.action === "saved") {
        renderMessage("Your StatBlock was imported successfully!");
      } else {
        renderMessage("Sorry, there was an error while importing this StatBlock.");
      }
    })
  }
});

var optionsLink = document.querySelector(".js-options");
optionsLink.addEventListener("click", function(e) {
  e.preventDefault();
  tabs.create({'url': ext.extension.getURL('options.html')});
})
