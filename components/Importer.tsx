import { ImportedItem } from "@/utils/imported_item";

export function Importer(props: {
  importedItem?: ImportedItem;
  setShowOptions: (show: boolean) => void;
}) {
  return (
    <Container>
      <h1 className="text-brand font-bold text-lg">
        Import to Improved Initiative
      </h1>
      {props.importedItem && (
        <div className="flex flex-col flex-grow min-h-0">
          <div className="flex flex-col flex-grow min-h-0">
            <h3>{props.importedItem.data.Name}</h3>
            <pre className="p-2 shadow-inner overflow-y-auto flex-grow min-h-0 bg-amber-50">
              {JSON.stringify(props.importedItem.data, null, 1)}
            </pre>
          </div>
          {renderPortraitWarningIfNeeded(props.importedItem)}
          <button
            className="bg-brand p-2 text-white"
            onClick={importItem(props.importedItem)}
          >
            Import
          </button>
        </div>
      )}
      <a
        href="#"
        className="self-end text-brand hover:underline"
        onClick={() => props.setShowOptions(true)}
      >
        Options
      </a>
    </Container>
  );
}

var renderPortraitWarningIfNeeded = (item: ImportedItem) => {
  if (item.type === "spell") {
    return "";
  }
  const data = item.data;
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

function importItem(item: ImportedItem) {
  return () =>
    browser.runtime.sendMessage(
      { action: "perform-save", importedItem: item },
      function (response) {
        if (response && response.action === "saved") {
          console.log("ok");
        } else {
          throw "Could not import statblock";
        }
      }
    );
}
