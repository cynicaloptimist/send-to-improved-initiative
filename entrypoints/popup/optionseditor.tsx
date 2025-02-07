import "../styles/options.scss";
import { Options, AllOptions, OptionDefaults } from "@/utils/options";
import { ChangeEvent } from "react";

const storage = browser.storage.sync
  ? browser.storage.sync
  : browser.storage.local;

export function OptionsEditor(props: { currentOptions: AllOptions }) {
  console.log(JSON.stringify(props.currentOptions));
  return (
    <>
      <div className="heading">
        <h1>Import to Improved Initiative: Options</h1>
      </div>
      <section className="options-content">
        <div className="option">
          <input
            type="checkbox"
            id="Include-Description"
            checked={props.currentOptions[Options.IncludeDescription] === "on"}
            onChange={UpdateCheckbox(Options.IncludeDescription)}
          />
          <label htmlFor="Include-Description">Include description</label>
        </div>
        <div className="option">
          <input
            type="checkbox"
            id="Options.IncludePageNumberWithSource"
            checked={
              props.currentOptions[Options.IncludePageNumberWithSource] === "on"
            }
            onChange={UpdateCheckbox(Options.IncludePageNumberWithSource)}
          />
          <label htmlFor="Options.IncludePageNumberWithSource">
            Include page number in source
          </label>
        </div>
        <div className="option">
          <input
            type="checkbox"
            id="Options.IncludeLink"
            checked={props.currentOptions[Options.IncludeLink] === "on"}
            onChange={UpdateCheckbox(Options.IncludeLink)}
            title="Includes a link back to the source URL at the end of the description block."
          />
          <label htmlFor="Options.IncludeLink">
            Include Link to Source in Description
          </label>
        </div>
        <div className="option">
          <label htmlFor="Options.TargetUrl">Target URL</label>
          <input
            id="Options.TargetUrl"
            className="js-text target-url"
            type="text"
            name="target-url"
            value={props.currentOptions[Options.TargetUrl]}
            onChange={UpdateText(Options.TargetUrl)}
            placeholder={OptionDefaults[Options.TargetUrl]}
            title={`The URL that the data is sent to. Typically ${
              OptionDefaults[Options.TargetUrl]
            }`}
          />
        </div>
      </section>
      <footer className="main-footer">
        <div className="unit whole center-on-mobiles">
          <p className="text-center text-muted">&copy; Evan Bailey</p>
        </div>
      </footer>
    </>
  );
}

function UpdateCheckbox(optionName: Options) {
  return (e: ChangeEvent) => {
    const input = e.target as HTMLInputElement;
    const newValue = input.checked ? "on" : "off";
    storage.set({
      [optionName]: newValue,
    });
  };
}

function UpdateText(optionName: Options) {
  return (e: ChangeEvent) => {
    const input = e.target as HTMLInputElement;
    const newValue = input.value;
    storage.set({
      [optionName]: newValue,
    });
  };
}
