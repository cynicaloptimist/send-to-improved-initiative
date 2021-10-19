import storage from "./utils/storage";
import { h, render, Fragment } from "preact";
import { Options, AllOptions } from "./options";

const options = document.getElementById("options");

storage.get(Object.values(Options), (values: AllOptions) => {
  render(<OptionsEditor currentOptions={values} />, options);
});

function OptionsEditor(props: { currentOptions: AllOptions }) {
  console.log(JSON.stringify(props.currentOptions));
  return (
    <Fragment>
      <div class="grid">
        <div class="unit whole center-on-mobiles">
          <div class="heading">
            <h1>Import to Improved Initiative: Options</h1>
          </div>
        </div>
      </div>
      <section class="content">
        <div class="grid" id="main">
          <div class="unit whole center-on-mobiles">
            <div class="option">
              
            <input type="checkbox" id="Include-Description" checked={
              props.currentOptions[Options.IncludeDescription] === "on"
            }
              onChange={UpdateCheckbox(Options.IncludeDescription)} />
            <label for="Include-Description">Include description</label>
          </div>
          <div class="option">
            <input
              type="checkbox"
              id="Options.IncludePageNumberWithSource"
              checked={
                props.currentOptions[Options.IncludePageNumberWithSource] === "on"
              }
              onChange={UpdateCheckbox(Options.IncludePageNumberWithSource)}
            />
            <label for="Options.IncludePageNumberWithSource">Include page number in source</label>
          </div>
          <div class="option">
            <input 
              type="checkbox" 
              id="Options.IncludeLink"
              checked={
                props.currentOptions[Options.IncludeLink] === "on"
              }
              onChange={UpdateCheckbox(Options.IncludeLink)}
              title="Includes a link back to the source URL at the end of the description block."
              />
            <label for="Options.IncludeLink">Include Link to Source in Description</label>
          </div>
          <div class="option">
            <label for="Options.TargetUrl">Target URL</label>
            <input
              id="Options.TargetUrl"
              class="js-text target-url"
              type="text"
              name="target-url"
              value={props.currentOptions[Options.TargetUrl]}
              onChange={UpdateText(Options.TargetUrl)}
              placeholder="https://www.improved-initiative.com/e/"
              title="The URL that the data is sent to. Typically https://www.improved-initiative.com/e/"
            />
            </div>
          </div>
        </div>
      </section>
      <footer class="main-footer">
        <div class="grid">
          <div class="unit whole center-on-mobiles">
            <p class="text-center text-muted">&copy; Evan Bailey</p>
          </div>
        </div>
      </footer>
    </Fragment>
  );
}

function UpdateCheckbox(optionName: Options) {
  return (e: Event) => {
    const input = e.target as HTMLInputElement;
    const newValue = input.checked ? "on" : "off";
    storage.set({
      [optionName]: newValue
    });
  };
}

function UpdateText(optionName: Options) {
  return (e: Event) => {
    const input = e.target as HTMLInputElement;
    const newValue = input.value;
    storage.set({
      [optionName]: newValue
    });
  };
}
