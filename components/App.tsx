import { HelpText } from "./help_text";
import { Importer } from "./Importer";
import { OptionsEditor } from "./optionseditor";

function App() {
  const [importedStatBlock, setImportedStatBlock] = useState<StatBlock>();
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
          setImportedStatBlock
        );
      }
    );
  }, [showOptions]);

  if (showOptions) {
    return <OptionsEditor setShowOptions={setShowOptions} />;
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
