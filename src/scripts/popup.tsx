import ext from "./utils/ext";
import { StatBlock } from "./StatBlock";
import { ScrapeStatBlockAction } from "./actions";
import { h, render } from "preact";
import { HelpText } from "./HelpText";

const tabs: typeof chrome.tabs = ext.tabs;
const runtime: typeof chrome.runtime = ext.runtime;

const popup = document.getElementById("app");

render(<Importer />, popup);

tabs.query({ active: true, currentWindow: true }, function(browserTabs) {
  var activeTab = browserTabs[0];
  tabs.sendMessage(
    activeTab.id,
    { action: ScrapeStatBlockAction },
    handleScrapedStatBlock
  );
});

function handleScrapedStatBlock(data: StatBlock) {
  if (data) {
    render(<Importer importedStatBlock={data} />, popup);
  } else {
    render(<HelpText />, popup);
  }
}

function Importer(props: { importedStatBlock?: StatBlock }) {
  return (
    <div class="popup-content">
      <h1 class="app-name">Import to Improved Initiative</h1>
      {props.importedStatBlock && (
        <div id="display-container">
          <div class="statblock-preview">
            <h3>{props.importedStatBlock.Name}</h3>
            <pre class="statblock-preview__json">
              {JSON.stringify(props.importedStatBlock, null, 1)}
            </pre>
          </div>
          {renderPortraitWarningIfNeeded(props.importedStatBlock)}
          <div class="action-container">
            <button
              id="save-btn"
              class="btn btn-primary"
              onClick={importStatBlock(props.importedStatBlock)}
            >
              Import
            </button>
          </div>
        </div>
      )}
      <footer>
        <p>
          <small>
            <a href="#" class="js-options" onClick={openOptions}>
              Options
            </a>
          </small>
        </p>
      </footer>
    </div>
  );
}

var renderPortraitWarningIfNeeded = (data: StatBlock) => {
  if (data.ImageURL.length > 0) {
    return "";
  }
  return (
    <span class="warning">
      No portrait was found. Visit a Monster Details page to get the whole
      picture.
    </span>
  );
};

function importStatBlock(statBlock: StatBlock) {
  return () =>
    runtime.sendMessage(
      { action: "perform-save", importedStatBlock: statBlock },
      function(response) {
        if (response && response.action === "saved") {
          console.log("ok");
        } else {
          throw "Could not import statblock";
        }
      }
    );
}

function openOptions() {
  tabs.create({ url: ext.extension.getURL("options.html") });
}
