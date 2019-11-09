import { h } from "preact";

export function HelpText() {
  return (
    <div class="popup-content">
      <p class="message">
        Could not scrape a StatBlock from this page. Please ensure that you are
        on a StatBlock <strong>Details</strong> page.
      </p>
      <a href="https://www.dndbeyond.com/monsters">
        D&amp;D Beyond Monsters
      </a>
    </div>
  );
}
