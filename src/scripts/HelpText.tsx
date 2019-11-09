import { h } from "preact";
import ext from "./utils/ext";

const tabs: typeof chrome.tabs = ext.tabs;

export function HelpText() {
  return (
    <div class="popup-content">
      <p class="message">
        Could not scrape a StatBlock from this page. Please ensure that you are
        on a StatBlock <strong>Details</strong> page.
      </p>
      <a
        href="#"
        onClick={() =>
          tabs.update({
            active: true,
            url: "https://www.dndbeyond.com/monsters"
          })
        }
      >
        D&amp;D Beyond Monsters
      </a>
    </div>
  );
}
