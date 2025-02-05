import cash, { Cash } from "cash-dom";
import { AllOptions, Options } from "./options";
import { AbilityScores, NameAndContent, StatBlock } from "./statblock";

export function get2024StatBlock(
  options: AllOptions,
  doc: Cash,
  statBlockElements: Cash
): StatBlock {
  console.log("Scraping 2024 Statblock");
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
      "Vulnerabilities"
    ),
    DamageResistances: getDelimitedStrings(statBlockElement, "Resistances"),
    DamageImmunities: getImmunities(statBlockElement).Damage,
    ConditionImmunities: getImmunities(statBlockElement).Condition,
    Saves: getDelimitedModifiers(statBlockElement, "Saving Throws"),
    Skills: getDelimitedModifiers(statBlockElement, "Skills"),
    Senses: getDelimitedStrings(statBlockElement, "Senses"),
    Languages: getDelimitedStrings(statBlockElement, "Languages"),
    Challenge: getChallenge(statBlockElement),
    Traits: getPowers(statBlockElement, "Traits"),
    Actions: getPowers(statBlockElement, "Actions"),
    Reactions: getPowers(statBlockElement, "Reactions"),
    LegendaryActions: getPowers(statBlockElement, "Legendary Actions"),
    BonusActions: getPowers(statBlockElement, "Bonus Actions"),
    MythicActions: getPowers(statBlockElement, "Mythic Actions"),
    ImageURL: doc.find(".details-aside .image a").attr("href") || "",
    Description: getDescription(doc, options), // twloveduck 2021.10.15 -- Moved to separate function.
    Player: "",
  };

  return statBlock;
}

function getSource(element: Cash, includePageNumber: boolean) {
  const source = element.text().replace(/\s+/g, " ").replace(" ,", ",").trim();
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
    retVal = doc
      .find(".mon-details__description-block-2024-content")
      .text()
      .trim()
      .replace(/([^\n])\n([^\n])/gm, "$1\n\n$2"); //replace single line breaks with double
  }
  // twloveduck 2021.10.14 -- If the user has set the option then include a link back to DDB in the description.
  if (options["include-link"] === "on")
    retVal += `\n\n[Link to DNDB Monster](${document.location.href})`;

  return retVal.trim();
}

function getName(element: Cash) {
  return element.find(".mon-stat-block-2024__name-link").text().trim();
}

function getType(element: Cash) {
  return element.find(".mon-stat-block-2024__meta").text().trim();
}

function getArmorClass(element: Cash) {
  return getAttribute(element, "AC");
}

function getHitPoints(element: Cash) {
  return getAttribute(element, "HP");
}

function getAttribute(element: Cash, attributeName: string) {
  const label = element
    .find(".mon-stat-block-2024__attribute-label")
    .filter((_, e: Element) => e.innerHTML.trim() == attributeName)
    .first();

  const value = parseInt(
    label
      .parent()
      .find(".mon-stat-block-2024__attribute-data-value")
      .text()
      .trim()
  );
  const notes = label
    .parent()
    .find(".mon-stat-block-2024__attribute-data-extra")
    .text()
    .trim();
  return {
    Value: value,
    Notes: notes,
  };
}

function getAbilities(element: Cash): AbilityScores {
  return {
    Str: getAbility(element, "str"),
    Dex: getAbility(element, "dex"),
    Con: getAbility(element, "con"),
    Int: getAbility(element, "int"),
    Wis: getAbility(element, "wis"),
    Cha: getAbility(element, "cha"),
  };
}

function getAbility(element: Cash, ability: string) {
  let score = 10;

  const scoreHeader = element
    .find(".mon-stat-block-2024__stats th")
    .filter(
      (_, e: Element) => e.innerHTML.trim().toLocaleLowerCase() == ability
    )
    .first();

  const scoreText = scoreHeader.siblings("td").first().text();

  try {
    score = parseInt(scoreText);
  } catch (e) {}
  return score;
}

function getImmunities(element: Cash) {
  const immunitiesListLabel = element
    .find(".mon-stat-block-2024__tidbit-label")
    .filter((_, e: Element) => e.innerHTML.trim() == "Immunities")
    .first();
  const immunitiesList = immunitiesListLabel
    .siblings(".mon-stat-block-2024__tidbit-data")
    .first();

  if (immunitiesList.text().includes(";")) {
    const [damage, condition] = immunitiesList.text().split(";");
    return {
      Damage: damage.split(",").map((i) => i.trim()),
      Condition: condition.split(",").map((i) => i.trim()),
    };
  }
  if (immunitiesList.has(".condition-tooltip").length > 0) {
    return {
      Damage: [],
      Condition: immunitiesList
        .text()
        .split(",")
        .map((i) => i.trim()),
    };
  } else {
    return {
      Damage: immunitiesList
        .text()
        .split(",")
        .map((i) => i.trim()),
      Condition: [],
    };
  }
}

function getDelimitedStrings(element: Cash, tidbitName: string) {
  const label = element
    .find(
      ".mon-stat-block-2024__attribute-label, .mon-stat-block-2024__tidbit-label"
    )
    .filter((_, e: Element) => e.innerHTML.trim() == tidbitName)
    .first();

  const delimitedString = label
    .parent()
    .find(
      ".mon-stat-block-2024__attribute-data-value, .mon-stat-block-2024__tidbit-data"
    )
    .text()
    .replace("--", "")
    .trim();

  if (delimitedString.length > 0) {
    const commaPattern = /, ?/;
    const semicolonPattern = /; ?/;
    const splitPattern = delimitedString.includes(";")
      ? semicolonPattern
      : commaPattern;

    return delimitedString.split(splitPattern).map((s) => s.trim());
  }
  return [];
}

function getDelimitedModifiers(element: Cash, tidbitName: string) {
  const entries = getDelimitedStrings(element, tidbitName);
  return entries.map((e) => {
    // Extract the last piece of the name/modifier, and parse an int from only that, ensuring the name can contain any manner of spacing.
    const nameAndModifier = e.split(" ");
    const modifierValue = parseInt(nameAndModifier.pop());

    // Join the remaining string name, and trim outside spacing just in case.
    return {
      Name: nameAndModifier.join(" ").trim(),
      Modifier: modifierValue,
    };
  });
}

function getChallenge(element: Cash) {
  const challengeText = getDelimitedStrings(element, "CR");
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
    .map((el) => {
      const contentNode = cash(el).clone();
      const powerName = contentNode.find("strong").first().remove();
      return {
        Name: powerName.text().trim().replace(/\.$/, ""),
        Content: contentNode.text().trim(),
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
        Content: fullPowerText,
      });
    }
    return p;
  }, []);
}

function getPowerSection(element: Cash, type: string) {
  if (type == "Traits") {
    return element
      .find(".mon-stat-block-2024__description-block-2024-content")
      .filter(
        (i, e) =>
          cash(e)
            .parent()
            .has(".mon-stat-block-2024__description-block-2024-heading")
            .length == 0 ||
          cash(e)
            .parent()
            .find(".mon-stat-block-2024__description-block-2024-heading")
            .text() == "Traits"
      );
  }

  return element
    .find(".mon-stat-block-2024__description-block-2024-content")
    .filter(
      (i, e) =>
        cash(e)
          .parent()
          .find(".mon-stat-block-2024__description-block-2024-heading")
          .text() == type
    );
}
