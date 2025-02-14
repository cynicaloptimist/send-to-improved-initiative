import { AllOptions } from "@/utils/options";
import { HelpText } from "./help_text";
import { Importer } from "./Importer";
import { OptionsEditor } from "./optionseditor";
import { storage } from "wxt/storage";

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
    storage.getItems(Object.values(Options)).then((values) => {
      const options = initializeOptionsFromStoredValues(values);
      setOptions(options);
    });
  }, []);

  if (showOptions && options) {
    return (
      <OptionsEditor setShowOptions={setShowOptions} />
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
