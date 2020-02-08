import storage from "./utils/storage";
import { h, render, Fragment } from "preact";

enum Store {
  TargetUrl = "target-url",
  IncludePageNumberWithSource = "include-page-number-with-source"
}

type AllOptions = Record<Store, string>;

const options = document.getElementById("options");

storage.get(Object.values(Store), (values: AllOptions) => {
  render(<Options currentOptions={values} />, options);
});

function Options(props: { currentOptions: AllOptions }) {
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
                    props.currentOptions[Store.IncludePageNumberWithSource] ==
                    "on"
                  }
                  onChange={UpdateCheckbox(Store.IncludePageNumberWithSource)}
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
                value={props.currentOptions[Store.TargetUrl]}
                onChange={UpdateText(Store.TargetUrl)}
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

function UpdateCheckbox(optionName: Store) {
  return (e: Event) => {
    const input = e.target as HTMLInputElement;
    const newValue = input.checked ? "on" : "off";
    storage.set({
      [optionName]: newValue
    });
  };
}

function UpdateText(optionName: Store) {
  return (e: Event) => {
    const input = e.target as HTMLInputElement;
    const newValue = input.value;
    storage.set({
      [optionName]: newValue
    });
  };
}
