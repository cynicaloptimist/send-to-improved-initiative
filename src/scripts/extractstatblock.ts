import cash, { Cash } from "cash-dom";
import { StatBlock } from "./StatBlock";

function getNameFrom(element: Cash) {
  return element.find(".mon-stat-block__name a").text().trim();
}

function getHpFrom(element: Cash) {
  const label = element.find(".mon-stat-block__attribute-label")
    .filter((_, e: Element) => e.innerHTML.trim() == "Hit Points" ).first();
  const value = parseInt(label.parent().find(".mon-stat-block__attribute-data-value").text().trim());
  const notes = label.parent().find(".mon-stat-block__attribute-data-extra").text().trim();
  return {
    Value: value,
    Notes: notes
  };
}

export const extractStatBlock = () => {
  const doc = cash(document);
  const statBlockElement = doc.find(".mon-stat-block");

  const statBlock: Partial<StatBlock> = {
    Name: getNameFrom(statBlockElement),
    HP: getHpFrom(statBlockElement)
  };

  return statBlock;
}