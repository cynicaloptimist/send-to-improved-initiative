import ext from "./utils/ext";
import storage from "./utils/storage";

const tabs: typeof chrome.tabs = ext.tabs;
const runtime: typeof chrome.runtime = ext.runtime;

let importedStatBlock = {};

var popup = document.getElementById("app");
storage.get('color', function(resp) {
  var color = resp.color;
  if(color) {
    popup.style.backgroundColor = color
  }
});

var template = (data) => {
  return (`
  <div class="statblock-preview">
    <h3>${data.Name}</h3>
    <pre class="statblock-preview__json">
    ${JSON.stringify(data, null, 1)}
    </pre>
  </div>
  <div class="action-container">
    <button id="save-btn" class="btn btn-primary">Save</button>
  </div>
  `);
}
var renderMessage = (message) => {
  var displayContainer = document.getElementById("display-container");
  displayContainer.innerHTML = `<p class='message'>${message}</p>`;
}

var renderBookmark = (data) => {
  var displayContainer = document.getElementById("display-container")
  if(data) {
    var tmpl = template(data);
    displayContainer.innerHTML = tmpl;  
    importedStatBlock = data;
  } else {
    renderMessage("Could not scrape a StatBlock from this page. Please ensure that you are on a StatBlock detail page.")
  }
}

tabs.query({active: true, currentWindow: true}, function(tabs) {
  var activeTab = tabs[0];
  chrome.tabs.sendMessage(activeTab.id, { action: 'process-page' }, renderBookmark);
});

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
