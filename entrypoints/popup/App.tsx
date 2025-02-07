import "../styles/popup.scss";
import { HelpText } from "./help_text";
import { OptionsEditor } from "./optionseditor";

const storage = browser.storage.sync
  ? browser.storage.sync
  : browser.storage.local;

function App() {
  const [importedStatBlock, setImportedStatBlock] = useState<StatBlock>();
  const [showOptions, setShowOptions] = useState(false);
  const [options, setOptions] = useState<AllOptions>();

  useEffect(() => {
    browser.tabs.query(
      { active: true, currentWindow: true },
      function (browserTabs) {
        var activeTabId = browserTabs[0]?.id;
        if (!activeTabId) {
          return;
        }

        browser.tabs.sendMessage(
          activeTabId,
          { action: ScrapeStatBlockAction },
          setImportedStatBlock
        );
      }
    );
  }, []);

  useEffect(() => {
    storage.get(Object.values(Options), (values: AllOptions) => {
      setOptions(values);
    });
  });

  if (showOptions && options) {
    return (
      <OptionsEditor currentOptions={options} setShowOptions={setShowOptions} />
    );
  }

  if (!importedStatBlock) {
    return <HelpText />;
  }

  return (
    <Importer
      importedStatBlock={importedStatBlock}
      setShowOptions={setShowOptions}
    />
  );
}

function Importer(props: {
  importedStatBlock?: StatBlock;
  setShowOptions: (show: boolean) => void;
}) {
  return (
    <div className="popup-content">
      <h1 className="app-name">Import to Improved Initiative</h1>
      {props.importedStatBlock && (
        <div id="display-container">
          <div className="statblock-preview">
            <h3>{props.importedStatBlock.Name}</h3>
            <pre className="statblock-preview__json">
              {JSON.stringify(props.importedStatBlock, null, 1)}
            </pre>
          </div>
          {renderPortraitWarningIfNeeded(props.importedStatBlock)}
          <div className="action-container">
            <button
              id="save-btn"
              className="btn btn-primary"
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
            <a
              href="#"
              className="js-options"
              onClick={() => props.setShowOptions(true)}
            >
              Options
            </a>
          </small>
        </p>
      </footer>
    </div>
  );
}

var renderPortraitWarningIfNeeded = (data: StatBlock) => {
  if (data && data.ImageURL && data.ImageURL.length > 0) {
    return "";
  }
  return (
    <span className="warning">
      No portrait was found. Visit a Monster Details page to get the whole
      picture.
    </span>
  );
};

function importStatBlock(statBlock: StatBlock) {
  return () =>
    browser.runtime.sendMessage(
      { action: "perform-save", importedStatBlock: statBlock },
      function (response) {
        if (response && response.action === "saved") {
          console.log("ok");
        } else {
          throw "Could not import statblock";
        }
      }
    );
}

export default App;
