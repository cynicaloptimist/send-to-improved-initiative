import cash, { Cash } from "cash-dom";
import { StatBlock, AbilityScores } from "./statblock";
import { AllOptions } from "./options";

export const convertCharacterSheetToStatBlock = (options: AllOptions) => {
  const doc = cash(document);
  const characterSheetElement = doc.find(".ct-character-sheet");
  const statBlock: Partial<StatBlock> = {
    Source: "",
    Name: characterSheetElement
      .find(".ct-character-tidbits__name")
      .text()
      .trim(),
    Type: characterSheetElement
      .find(".ct-character-tidbits__race")
      .text()
      .trim(),
    HP: getHitPoints(characterSheetElement),
    AC: getArmorClass(characterSheetElement),
    Abilities: getAbilities(characterSheetElement),
    Speed: [
      characterSheetElement.find(".ct-speed-box__box-value").text()
    ],
    // InitiativeModifier?: number,
    // InitiativeSpecialRoll?: "advantage" | "disadvantage" | "take-ten",
    // InitiativeAdvantage?: boolean,
    // DamageVulnerabilities: getDelimitedStrings(
    //   characterSheetElement,
    //   "Damage Vulnerabilities"
    // ),
    // DamageResistances: getDelimitedStrings(
    //   characterSheetElement,
    //   "Damage Resistances"
    // ),
    // DamageImmunities: getDelimitedStrings(
    //   characterSheetElement,
    //   "Damage Immunities"
    // ),
    // ConditionImmunities: getDelimitedStrings(
    //   characterSheetElement,
    //   "Condition Immunities"
    // ),
    // Saves: getDelimitedModifiers(characterSheetElement, "Saving Throws"),
    // Skills: getDelimitedModifiers(characterSheetElement, "Skills"),
    // Senses: getDelimitedStrings(characterSheetElement, "Senses"),
    // Languages: getDelimitedStrings(characterSheetElement, "Languages"),
    // Challenge: getChallenge(characterSheetElement),
    // Traits: getPowers(characterSheetElement, "Traits"),
    // Actions: getPowers(characterSheetElement, "Actions"),
    // Reactions: [],
    // LegendaryActions: getPowers(characterSheetElement, "Legendary Actions"),
    ImageURL: getImageUrl(characterSheetElement),
    // Description: doc
    //   .find(".mon-details__description-block-content")
    //   .text()
    //   .trim()
    //   .replace(/([^\n])\n([^\n])/gm, "$1\n\n$2"), //replace single line breaks with double
    Player: "player"
  };
  return statBlock;
};

function getHitPoints(element: Cash) {
  const maxHP = element
    .find(".ct-health-summary__hp-item-label")
    .filter(
      (_, label) =>
        cash(label)
          .text()
          .trim()
          .toLocaleLowerCase() == "max"
    )
    .siblings(".ct-health-summary__hp-item-content")
    .text()
    .trim();

  return {
    Value: parseInt(maxHP),
    Notes: ""
  };
}

function getArmorClass(element: Cash) {
  return {
    Value: parseInt(
      element
        .find(".ct-armor-class-box__value")
        .text()
        .trim()
    ),
    Notes: ""
  };
}

function getImageUrl(element: Cash) {
  const backgroundImageAttribute =
    element.find(".ct-character-tidbits__avatar").css("background-image") || "";
  if (!backgroundImageAttribute.length) {
    return "";
  }
  return backgroundImageAttribute.split('"')[1];
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
  const scoreLabel = element
    .find(".ct-ability-summary__abbr")
    .filter((_, element: Element) => element.textContent == ability);

  const scoreText = scoreLabel
    .parents(".ct-ability-summary")
    .find(".ct-ability-summary__secondary")
    .text();
  try {
    score = parseInt(scoreText);
  } catch (e) {}
  return score;
}
