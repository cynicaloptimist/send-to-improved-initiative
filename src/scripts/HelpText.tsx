import { h } from "preact";
import ext from "./utils/ext";

const tabs: typeof chrome.tabs = ext.tabs;

export function HelpText() {
  return (
    <div class="popup-content">
      <p class="message">
        Could not scrape a StatBlock or Character Sheet from this page. Please
        ensure that you are on a StatBlock <strong>Details</strong> page, or
        viewing a Character Sheet.
      </p>
      <Link url="https://www.dndbeyond.com/monsters">
        D&amp;D Beyond: Monsters
      </Link>
      <Link url="https://www.dndbeyond.com/my-characters">
        D&amp;D Beyond: My Characters
      </Link>
    </div>
  );
}

function Link(props: { url: string; children: React.ReactNode }) {
  return (
    <a
      href="#"
      onClick={() =>
        tabs.update({
          active: true,
          url: props.url
        })
      }
    >
      {props.children}
    </a>
  );
}
