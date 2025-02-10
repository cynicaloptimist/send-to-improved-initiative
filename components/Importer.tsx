export function Importer(props: {
  importedStatBlock?: StatBlock;
  setShowOptions: (show: boolean) => void;
}) {
  return (
    <Container>
      <h1 className="text-brand font-bold text-lg">
        Import to Improved Initiative
      </h1>
      {props.importedStatBlock && (
        <div>
          <div>
            <h3>{props.importedStatBlock.Name}</h3>
            <pre className="overflow-y-auto max-h-[430px]">
              {JSON.stringify(props.importedStatBlock, null, 1)}
            </pre>
          </div>
          {renderPortraitWarningIfNeeded(props.importedStatBlock)}
          <button
            className="bg-brand p-2 text-white"
            onClick={importStatBlock(props.importedStatBlock)}
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
