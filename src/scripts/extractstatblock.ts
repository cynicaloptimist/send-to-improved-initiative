import cash, { Cash } from "cash-dom";
import { StatBlock, AbilityScores, NameAndContent } from "./statblock";
import { AllOptions, Options } from "./options";

export const extractStatBlock = (options: AllOptions) => {
  const doc = cash(document);
  const statBlockElements = doc.find(".mon-stat-block");

  if (statBlockElements.length == 0) {
    return null;
  }

  const statBlockElement = statBlockElements.first();
  const statBlock: StatBlock = {
    Source: getSource(
      doc.find(".monster-source"),
      options[Options.IncludePageNumberWithSource] == "on"
    ),
    Name: getName(statBlockElement),
    Type: getType(statBlockElement),
    HP: getHitPoints(statBlockElement),
    AC: getArmorClass(statBlockElement),
    Abilities: getAbilities(statBlockElement),
    Speed: getDelimitedStrings(statBlockElement, "Speed"),
    // InitiativeModifier?: number,
    // InitiativeSpecialRoll?: "advantage" | "disadvantage" | "take-ten",
    // InitiativeAdvantage?: boolean,
    DamageVulnerabilities: getDelimitedStrings(
      statBlockElement,
      "Damage Vulnerabilities"
    ),
    DamageResistances: getDelimitedStrings(
      statBlockElement,
      "Damage Resistances"
    ),
    DamageImmunities: getDelimitedStrings(
      statBlockElement,
      "Damage Immunities"
    ),
    ConditionImmunities: getDelimitedStrings(
      statBlockElement,
      "Condition Immunities"
    ),
    Saves: getDelimitedModifiers(statBlockElement, "Saving Throws"),
    Skills: getDelimitedModifiers(statBlockElement, "Skills"),
    Senses: getDelimitedStrings(statBlockElement, "Senses"),
    Languages: getDelimitedStrings(statBlockElement, "Languages"),
    Challenge: getChallenge(statBlockElement),
    Traits: getPowers(statBlockElement, "Traits"),
    Actions: getPowers(statBlockElement, "Actions"),
    Reactions: getPowers(statBlockElement, "Reactions"),
    LegendaryActions: getPowers(statBlockElement, "Legendary Actions"),
    ImageURL: doc.find(".details-aside .image a").attr("href") || "",
    Description: getDescription(doc, options), // twloveduck 2021.10.15 -- Moved to separate function.
    Player: ""
  };

  return statBlock;
};

function getSource(element: Cash, includePageNumber: boolean) {
  const source = element
    .text()
    .replace(/\s+/g, " ")
    .replace(" ,", ",")
    .trim();
  if (includePageNumber) {
    return source;
  } else {
    return source.split(",")[0];
  }
}

/**
 * Parse the HTML element to extract the description text.
 * 
 * twloveduck 2021.10.14 -- Moved from inline in the extract to a separate function to add a link back to DDB in the description.
 * @param {Cash} doc The document element to parse for the description content.
 * @param {AllOptions} options The user's chosen options.
 * @returns {string} The monster description string. 
 */
function getDescription(doc: Cash, options: AllOptions) {
  let retVal = "";
  if (options[Options.IncludeDescription] === "on") {
    retVal = doc.find(".mon-details__description-block-content")
      .text()
      .trim()
      .replace(/([^\n])\n([^\n])/gm, "$1\n\n$2")//replace single line breaks with double
  }
  // twloveduck 2021.10.14 -- If the user has set the option then include a link back to DDB in the description.
  if (options["include-link"] === "on")
    retVal += `\n\n[Link to DNDB Monster](${document.location.href})`

  return retVal.trim()
}

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

function getDelimitedStrings(element: Cash, tidbitName: string) {
  const label = element
    .find(".mon-stat-block__attribute-label, .mon-stat-block__tidbit-label")
    .filter((_, e: Element) => e.innerHTML.trim() == tidbitName)
    .first();

  const delimitedString = label
    .parent()
    .find(".mon-stat-block__attribute-data-value, .mon-stat-block__tidbit-data")
    .text()
    .replace("--", "")
    .trim();

  if (delimitedString.length > 0) {
    const commaPattern = /, ?/;
    const semicolonPattern = /; ?/;
    const splitPattern = delimitedString.includes(";")
      ? semicolonPattern
      : commaPattern;

    const bpsString = "Bludgeoning, Piercing, and Slashing";
    const bpsPlaceholder = "BPS_PLACEHOLDER";
    const stringWithPlaceholder = delimitedString.replace(
      bpsString,
      bpsPlaceholder
    );

    const itemsWithPlaceholder = stringWithPlaceholder
      .split(splitPattern)
      .map(s => s.trim());
    return itemsWithPlaceholder.map(i => i.replace(bpsPlaceholder, bpsString));
  }
  return [];
}

function getDelimitedModifiers(element: Cash, tidbitName: string) {
  const entries = getDelimitedStrings(element, tidbitName);
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
  const challengeText = getDelimitedStrings(element, "Challenge");
  if (challengeText.length == 0) {
    return "0";
  }
  const matches = challengeText[0].match(/(\d|\/){1,4}/);
  return matches[0] || "0";
}

function getPowers(element: Cash, type: string): NameAndContent[] {
  const section = getPowerSection(element, type);

  const powerEntries = section
    .children("p")
    .get()
    .map(el => {
      const contentNode = cash(el).clone();
      const powerName = contentNode.find("strong").first().remove();
      return {
        Name: powerName
          .text()
          .trim()
          .replace(/\.$/, ""),
        Content: contentNode.text().trim()
      };
    });

  return collapsePowerDescriptions(powerEntries);
}

function collapsePowerDescriptions(powerEntries: NameAndContent[]) {
  return powerEntries.reduce((p, c, i) => {
    const isFirstParagraph = i == 0 || c.Name.length > 0;
    let fullPowerText = c.Content;

    let lookAhead = i;
    if (isFirstParagraph) {
      while (
        powerEntries[++lookAhead] &&
        powerEntries[lookAhead].Name.length == 0
      ) {
        fullPowerText += "\n\n" + powerEntries[lookAhead].Content;
      }
      return p.concat({
        Name: c.Name,
        Content: fullPowerText
      });
    }
    return p;
  }, []);
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
