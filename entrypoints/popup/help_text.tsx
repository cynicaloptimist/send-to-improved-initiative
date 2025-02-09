import { Container } from "./Container";

export function HelpText() {
  return (
    <Container>
      <p>
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
    </Container>
  );
}

function Link(props: { url: string; children: any }) {
  return (
    <a
      className="underline cursor-pointer text-brand"
      href="#"
      onClick={() =>
        browser.tabs.update({
          active: true,
          url: props.url,
        })
      }
    >
      {props.children}
    </a>
  );
}
