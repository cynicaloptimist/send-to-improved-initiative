import storage from "./utils/storage";
import { h, render, Fragment } from "preact";

export enum Options {
  TargetUrl = "target-url",
  IncludePageNumberWithSource = "include-page-number-with-source"
}

type AllOptions = Record<Options, string>;

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
        <div class="grid">
          <div class="unit whole center-on-mobiles">
            <div class="option">
              <label>
                <input
                  type="checkbox"
                  checked={
                    props.currentOptions[Options.IncludePageNumberWithSource] ==
                    "on"
                  }
                  onChange={UpdateCheckbox(Options.IncludePageNumberWithSource)}
                />{" "}
                Include page number in source
              </label>
            </div>
            <div class="option">
              <h5>Target URL</h5>
              <input
                class="js-text target-url"
                type="text"
                name="target-url"
                value={props.currentOptions[Options.TargetUrl]}
                onChange={UpdateText(Options.TargetUrl)}
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
