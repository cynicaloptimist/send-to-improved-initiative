import storage from "./utils/storage";
import { h, render, Fragment } from "preact";

enum Store {
  TargetUrl = "target-url"
}

type AllOptions = Record<Store, string>;

const options = document.getElementById("options");

storage.get(Store.TargetUrl, (values: AllOptions) => {
  render(<Options currentOptions={values} />, options);
});

function Options(props: { currentOptions: AllOptions }) {
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
              <h5>Target URL</h5>
              <input
                class="js-text target-url"
                type="text"
                name="target-url"
                value={props.currentOptions[Store.TargetUrl]}
                onChange={Update(Store.TargetUrl)}
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

function Update(optionName: Store) {
  return (e: Event) => {
    const input = e.target as HTMLInputElement;
    const newTargetUrl = input.value;
    storage.set({
      [optionName]: newTargetUrl
    });
  };
}
