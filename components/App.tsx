import { ImportedItem } from "@/utils/imported_item";
import { HelpText } from "./help_text";
import { Importer } from "./Importer";
import { OptionsEditor } from "./optionseditor";

function App() {
  const [importedItem, setImportedItem] = useState<ImportedItem>();
  const [showOptions, setShowOptions] = useState(false);

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
          setImportedItem
        );
      }
    );
  }, [showOptions]);

  if (showOptions) {
    return <OptionsEditor setShowOptions={setShowOptions} />;
  }

  if (!importedItem) {
    return <HelpText setShowOptions={setShowOptions} />;
  }

  return (
    <Importer
      importedItem={importedItem}
      setShowOptions={setShowOptions}
    />
  );
}

export default App;
