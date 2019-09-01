import cash, { Cash } from "cash-dom";
import { StatBlock, AbilityScores, NameAndContent } from "./StatBlock";

export const extractStatBlock = () => {
  const doc = cash(document);
  const statBlockElement = doc.find(".mon-stat-block");

  const statBlock: Partial<StatBlock> = {
    Source: doc
      .find(".monster-source")
      .text()
      .replace(/\s+/g, " ")
      .replace(" ,", ",")
      .trim(),
    Name: getName(statBlockElement),
    Type: getType(statBlockElement),
    HP: getHitPoints(statBlockElement),
    AC: getArmorClass(statBlockElement),
    Abilities: getAbilities(statBlockElement),
    Speed: getCommaSeparatedStrings(statBlockElement, "Speed"),
    // InitiativeModifier?: number,
    // InitiativeSpecialRoll?: "advantage" | "disadvantage" | "take-ten",
    // InitiativeAdvantage?: boolean,
    DamageVulnerabilities: getCommaSeparatedStrings(
      statBlockElement,
      "Damage Vulnerabilities"
    ),
    DamageResistances: getCommaSeparatedStrings(
      statBlockElement,
      "Damage Resistances"
    ),
    DamageImmunities: getCommaSeparatedStrings(
      statBlockElement,
      "Damage Immunities"
    ),
    ConditionImmunities: getCommaSeparatedStrings(
      statBlockElement,
      "Condition Immunities"
    ),
    Saves: getCommaSeparatedModifiers(statBlockElement, "Saving Throws"),
    Skills: getCommaSeparatedModifiers(statBlockElement, "Saving Throws"),
    Senses: getCommaSeparatedStrings(statBlockElement, "Senses"),
    Languages: getCommaSeparatedStrings(statBlockElement, "Languages"),
    Challenge: getChallenge(statBlockElement),
    Traits: getPowers(statBlockElement, "Traits"),
    Actions: getPowers(statBlockElement, "Actions"),
    LegendaryActions: getPowers(statBlockElement, "Legendary Actions"),
    ImageURL: doc.find(".details-aside .image a").attr("href")
  };

  return statBlock;
};

function getName(element: Cash) {
  return element
    .find(".mon-stat-block__name a")
    .text()
    .trim();
}

function getType(element: Cash) {
  return element
    .find(".mon-stat-block__meta")
    .text()
    .trim();
}

function getArmorClass(element: Cash) {
  return getAttribute(element, "Armor Class");
}

function getHitPoints(element: Cash) {
  return getAttribute(element, "Hit Points");
}

function getAttribute(element: Cash, attributeName: string) {
  const label = element
    .find(".mon-stat-block__attribute-label")
    .filter((_, e: Element) => e.innerHTML.trim() == attributeName)
    .first();

  const value = parseInt(
    label
      .parent()
      .find(".mon-stat-block__attribute-data-value")
      .text()
      .trim()
  );
  const notes = label
    .parent()
    .find(".mon-stat-block__attribute-data-extra")
    .text()
    .trim();
  return {
    Value: value,
    Notes: notes
  };
}

function getAbilities(element: Cash): AbilityScores {
  return {
    Str: getAbility(element, "str"),
    Dex: getAbility(element, "dex"),
    Con: getAbility(element, "con"),
    Int: getAbility(element, "int"),
    Wis: getAbility(element, "wis"),
    Cha: getAbility(element, "cha")
  };
}

function getAbility(element: Cash, ability: string) {
  let score = 10;
  const scoreText = element
    .find(`.ability-block__stat--${ability} .ability-block__score`)
    .text();
  try {
    score = parseInt(scoreText);
  } catch (e) {}
  return score;
}

function getCommaSeparatedStrings(element: Cash, tidbitName: string) {
  const label = element
    .find(".mon-stat-block__tidbit-label")
    .filter((_, e: Element) => e.innerHTML.trim() == tidbitName)
    .first();

  const commaDelimitedString = label
    .parent()
    .find(".mon-stat-block__tidbit-data")
    .text()
    .trim();
  if (commaDelimitedString.length > 0) {
    return commaDelimitedString.split(/, ?/).map(s => s.trim());
  }
  return [];
}

function getCommaSeparatedModifiers(element: Cash, tidbitName: string) {
  const entries = getCommaSeparatedStrings(element, tidbitName);
  return entries.map(e => {
    // Extract the last piece of the name/modifier, and parse an int from only that, ensuring the name can contain any manner of spacing.
    const nameAndModifier = e.split(" ");
    const modifierValue = parseInt(nameAndModifier.pop());

    // Join the remaining string name, and trim outside spacing just in case.
    return {
      Name: nameAndModifier.join(" ").trim(),
      Modifier: modifierValue
    };
  });
}

function getChallenge(element: Cash) {
  const challengeText = getCommaSeparatedStrings(element, "Challenge");
  if (challengeText.length == 0) {
    return "0";
  }
  const matches = challengeText[0].match(/\d{1,2}/);
  return matches[0] || "0";
}

function getPowers(element: Cash, type: string): NameAndContent[] {
  const section = getPowerSection(element, type);
  return section
    .children("p")
    .get()
    .map(el => {
      const contentNode = cash(el).clone();
      contentNode.children("em").remove();
      return {
        Name: cash(el)
          .find("em strong")
          .text()
          .trim()
          .replace(/\.$/, ""),
        Content: contentNode.text().trim()
      };
    });
}

function getPowerSection(element: Cash, type: string) {
  if (type == "Traits") {
    return element.find(".mon-stat-block__description-block-content").filter(
      (i, e) =>
        cash(e)
          .parent()
          .has(".mon-stat-block__description-block-heading").length == 0
    );
  }

  return element.find(".mon-stat-block__description-block-content").filter(
    (i, e) =>
      cash(e)
        .parent()
        .find(".mon-stat-block__description-block-heading")
        .text() == type
  );
}
