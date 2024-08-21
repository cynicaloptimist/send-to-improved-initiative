import cash, { Cash } from "cash-dom";
import { StatBlock, AbilityScores } from "./statblock";
import { AllOptions } from "./options";
import { IsConditionImmunity } from "./IsConditionImmunity";

export const convertCharacterSheetToStatBlock = (options: AllOptions) => {
  const doc = cash(document);
  const characterSheetElement = doc.find(prefix("character-sheet"));
  const statBlock: Partial<StatBlock> = {
    Source: "",
    Name: characterSheetElement.find(prefix("character-tidbits__heading h1")).text().trim(),
    Type: characterSheetElement
      .find(prefix("character-summary__race"))
      .text()
      .trim(),
    HP: getHitPoints(characterSheetElement),
    AC: getArmorClass(characterSheetElement),
    Abilities: getAbilities(characterSheetElement),
    Speed: [characterSheetElement.find(prefix("speed-box__box-value")).text()],
    InitiativeModifier: Number(
      characterSheetElement
        .find(prefix("initiative-box__value"))
        .text()
        .trim()
        .replace("+", "")
    ),
    // InitiativeSpecialRoll?: "advantage" | "disadvantage" | "take-ten",
    // InitiativeAdvantage?: boolean,
    DamageVulnerabilities: getDefenses(characterSheetElement, "Vulnerability"),
    DamageResistances: getDefenses(characterSheetElement, "Resistance"),
    DamageImmunities: getDefenses(characterSheetElement, "Immunity").filter(
      (immunity) => !IsConditionImmunity(immunity)
    ),
    ConditionImmunities: getDefenses(characterSheetElement, "Immunity").filter(
      (immunity) => IsConditionImmunity(immunity)
    ),
    Saves: getSaves(characterSheetElement),
    Skills: getSkills(characterSheetElement),
    Senses: getSenses(characterSheetElement),
    Languages: getLanguages(characterSheetElement),
    Challenge: characterSheetElement
      .find(prefix("character-tidbits__classes"))
      .text()
      .trim(),
    Traits: [],
    Actions: [],
    Reactions: [],
    LegendaryActions: [],
    ImageURL: getImageUrl(characterSheetElement),
    Description:
      options["include-link"] === "on"
        ? `[Link to DNDB Character](${document.location.href})`
        : "",
    Player: "player",
  };
  return statBlock;
};

function getHitPoints(element: Cash) {
  let maxHP = element
    .find(prefix("health-summary__hp-item-label"))
    .filter(
      (_, label) => cash(label).text().trim().toLocaleLowerCase() == "max"
    )
    .siblings(prefix("health-summary__hp-item-content"))
    .text()
    .trim();

  if (!maxHP?.length) {
    maxHP = element.find(".ct-status-summary-mobile__hp-max").text().trim();
  }

  return {
    Value: parseInt(maxHP),
    Notes: "",
  };
}

function getArmorClass(element: Cash) {
  return {
    Value: parseInt(
      element.find(prefix("armor-class-box__value")).text().trim()
    ),
    Notes: "",
  };
}

function getImageUrl(element: Cash) {
  const backgroundImageAttribute =
    element.find(prefix("character-avatar__portrait")).css("background-image") ||
    "";
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
    Cha: getAbility(element, "cha", abilityScoreSelector),
  };
}

function resolveAbilityScoreSelector(element: Cash) {
  const modifiersRegex = /[\+\-]/g;
  if (
    modifiersRegex.test(
      element.find(prefix("ability-summary__secondary")).text()
    )
  ) {
    return prefix("ability-summary__primary");
  } else {
    return prefix("ability-summary__secondary");
  }
}

function getAbility(
  element: Cash,
  ability: string,
  abilityScoreSelector: string
) {
  let score = 10;
  const scoreLabel = element
    .find(prefix("ability-summary__abbr"))
    .filter((_, element: Element) => element.textContent == ability);

  const scoreText = scoreLabel
    .parents(prefix("ability-summary"))
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
    .parents(prefix("defenses-summary__group"))
    .find(prefix("defenses-summary__defense"))
    .get()
    .map((el) => cash(el).text());
}

function getSaves(element: Cash) {
  return element
    .find(`[data-original-title="Proficiency"]`)
    .parents(prefix("saving-throws-summary__ability"))
    .get()
    .map((el) => {
      const abilityName = cash(el)
        .find(prefix("saving-throws-summary__ability-name"))
        .text();
      const titleCasedAbilityName =
        abilityName.substr(0, 1).toLocaleUpperCase() + abilityName.substr(1);
      return {
        Name: titleCasedAbilityName,
        Modifier: parseInt(
          cash(el)
            .find(prefix("saving-throws-summary__ability-modifier"))
            .text()
        ),
      };
    });
}

function getSkills(element: Cash) {
  return element
    .find(
      `[data-original-title="Proficiency"], [data-original-title="Half Proficiency"], [data-original-title="Expertise"]`
    )
    .parents(prefix("skills__item"))
    .get()
    .map((el) => {
      return {
        Name: cash(el).find(prefix("skills__col--skill")).text(),
        Modifier: parseInt(cash(el).find(prefix("skills__col--modifier")).text()),
      };
    });
}

function getSenses(element: Cash) {
  const sensesString = element
    .find(prefix("senses__summary"))
    .text()
    .replace("Additional Sense Types", "");
  if (sensesString.length == 0) {
    return [];
  }

  return sensesString.split(/,\s*/);
}

function getLanguages(element: Cash) {
  return element
    .find(prefix("proficiency-groups__group-label"))
    .filter((_, el) => cash(el).text() == "Languages")
    .parents(prefix("proficiency-groups__group"))
    .find(prefix("proficiency-groups__group-items"))
    .text()
    .split(",")
    .map((s) => s.trim());
}

function prefix(suffix: string) {
  return `.ct-${suffix}, .ddbc-${suffix}`;
}
