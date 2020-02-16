import cash, { Cash } from "cash-dom";
import { StatBlock, AbilityScores } from "./statblock";
import { AllOptions } from "./options";
import { IsConditionImmunity } from "./IsConditionImmunity";

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
    Speed: [characterSheetElement.find(".ct-speed-box__box-value").text()],
    // InitiativeModifier?: number,
    // InitiativeSpecialRoll?: "advantage" | "disadvantage" | "take-ten",
    // InitiativeAdvantage?: boolean,
    DamageVulnerabilities: getDefenses(characterSheetElement, "Vulnerability"),
    DamageResistances: getDefenses(characterSheetElement, "Resistance"),
    DamageImmunities: getDefenses(characterSheetElement, "Immunity").filter(
      immunity => !IsConditionImmunity(immunity)
    ),
    ConditionImmunities: getDefenses(
      characterSheetElement,
      "Immunity"
    ).filter(immunity => IsConditionImmunity(immunity)),
    Saves: getSaves(characterSheetElement),
    Skills: getSkills(characterSheetElement),
    Senses: getSenses(characterSheetElement),
    Languages: getLanguages(characterSheetElement),
    Challenge: characterSheetElement
      .find(".ct-character-tidbits__classes")
      .text()
      .trim(),
    Traits: [],
    Actions: [],
    Reactions: [],
    LegendaryActions: [],
    ImageURL: getImageUrl(characterSheetElement),
    Description: "",
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
  const abilityScoreSelector = resolveAbilityScoreSelector(element);
  return {
    Str: getAbility(element, "str", abilityScoreSelector),
    Dex: getAbility(element, "dex", abilityScoreSelector),
    Con: getAbility(element, "con", abilityScoreSelector),
    Int: getAbility(element, "int", abilityScoreSelector),
    Wis: getAbility(element, "wis", abilityScoreSelector),
    Cha: getAbility(element, "cha", abilityScoreSelector)
  };
}

function resolveAbilityScoreSelector(element: Cash) {
  const modifiersRegex = /[\+\-]/g;
  if (
    modifiersRegex.test(element.find(".ct-ability-summary__secondary").text())
  ) {
    return ".ct-ability-summary__primary";
  } else {
    return ".ct-ability-summary__secondary";
  }
}

function getAbility(
  element: Cash,
  ability: string,
  abilityScoreSelector: string
) {
  let score = 10;
  const scoreLabel = element
    .find(".ct-ability-summary__abbr")
    .filter((_, element: Element) => element.textContent == ability);

  const scoreText = scoreLabel
    .parents(".ct-ability-summary")
    .find(abilityScoreSelector)
    .text();
  try {
    score = parseInt(scoreText);
  } catch (e) {}
  return score;
}

function getDefenses(element: Cash, defenseType: string) {
  return element
    .find(`[data-original-title=${defenseType}]`)
    .parents(".ct-defenses-summary__group")
    .find(".ct-defenses-summary__defense")
    .get()
    .map(el => cash(el).text());
}

function getSaves(element: Cash) {
  return element
    .find(`[data-original-title="Proficiency"]`)
    .parents(".ct-saving-throws-summary__ability")
    .get()
    .map(el => {
      const abilityName = cash(el)
        .find(".ct-saving-throws-summary__ability-name")
        .text();
      const titleCasedAbilityName =
        abilityName.substr(0, 1).toLocaleUpperCase() + abilityName.substr(1);
      return {
        Name: titleCasedAbilityName,
        Modifier: parseInt(
          cash(el)
            .find(".ct-saving-throws-summary__ability-modifier")
            .text()
        )
      };
    });
}

function getSkills(element: Cash) {
  return element
    .find(`[data-original-title="Proficiency"]`)
    .parents(".ct-skills__item")
    .get()
    .map(el => {
      return {
        Name: cash(el)
          .find(".ct-skills__col--skill")
          .text(),
        Modifier: parseInt(
          cash(el)
            .find(".ct-signed-number")
            .text()
        )
      };
    });
}

function getSenses(element: Cash) {
  return element
    .find(".ct-senses__summary")
    .text()
    .split(/,\s*/);
}

function getLanguages(element: Cash) {
  return element
    .find(".ct-proficiency-groups__group-label")
    .filter((_, el) => cash(el).text() == "Languages")
    .parents(".ct-proficiency-groups__group")
    .find(".ct-proficiency-groups__group-items")
    .text()
    .split(",")
    .map(s => s.trim());
}
