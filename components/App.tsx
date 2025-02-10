import { HelpText } from "./help_text";
import { Importer } from "./Importer";
import { OptionsEditor } from "./optionseditor";

const storage = browser.storage.sync
  ? browser.storage.sync
  : browser.storage.local;

function App() {
  const [importedStatBlock, setImportedStatBlock] = useState<StatBlock>();
  const [showOptions, setShowOptions] = useState(false);
  const [options, setOptions] = useState<AllOptions>();

  useEffect(() => {
    console.log("Sending message to content script");
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
    return <HelpText setShowOptions={setShowOptions} />;
  }

  return (
    <Importer
      importedStatBlock={importedStatBlock}
      setShowOptions={setShowOptions}
    />
  );
}

export default App;
