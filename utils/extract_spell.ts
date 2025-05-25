import cash from "cash-dom";
import { Spell } from "./spell";

const LevelsByString: Record<string, number> = {
  Cantrip: 0,
  "1st": 1,
  "2nd": 2,
  "3rd": 3,
  "4th": 4,
  "5th": 5,
  "6th": 6,
  "7th": 7,
  "8th": 8,
  "9th": 9,
};

export const extractSpell = (options: AllOptions) => {
  const doc = cash(document);
  const spellElements = doc.find(".spell-details");
  if (spellElements.length === 0) {
    return null;
  }

  const spellElement = spellElements.first();

  const spell: Spell = {
    Name: doc.find(".page-title").text().trim(),
    Source: doc.find(".spell-source").text().trim(),
    Level:
      LevelsByString[
        spellElement
          .find(".ddb-statblock-item-level .ddb-statblock-item-value")
          .text()
          .trim()
      ] ?? 1,
    School: spellElement
      .find(".ddb-statblock-item-school .ddb-statblock-item-value")
      .text()
      .trim(),
    CastingTime: spellElement
      .find(".ddb-statblock-item-casting-time .ddb-statblock-item-value")
      .text()
      .trim(),
    Range: spellElement
      .find(".ddb-statblock-item-range-area .ddb-statblock-item-value")
      .text()
      .trim()
      .replace(/\s{2,}/g, " "),
    Components: spellElement
      .find(".ddb-statblock-item-components .ddb-statblock-item-value")
      .text()
      .trim(),
    Duration: spellElement
      .find(".ddb-statblock-item-duration .ddb-statblock-item-value")
      .text()
      .trim(),
    Classes: spellElement
      .find(".available-for .class-tag")
      .get()
      .map((el) => cash(el).text().trim()),
    Description: spellElement.find(".more-info-content").text().trim(),
    Ritual:
      spellElement.find(".ddb-statblock-item-casting-time .i-ritual").length >
      0,
  };

  return spell;
};
