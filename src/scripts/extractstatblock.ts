import cash, { Cash } from "cash-dom";
import { StatBlock } from "./StatBlock";
import { compileFunction } from "vm";

export const extractStatBlock = () => {
  const doc = cash(document);
  const statBlockElement = doc.find(".mon-stat-block");

  const statBlock: Partial<StatBlock> = {
    Source: doc.find(".monster-source").text(),
    Name: getName(statBlockElement),
    Type: getType(statBlockElement),
    HP: getHitPoints(statBlockElement),
    AC: getArmorClass(statBlockElement),
    Speed: getSpeeds(statBlockElement),
    // Abilities: AbilityScores,
    // InitiativeModifier?: number,
    // InitiativeSpecialRoll?: "advantage" | "disadvantage" | "take-ten",
    // InitiativeAdvantage?: boolean,
    // DamageVulnerabilities: string[],
    // DamageResistances: string[],
    // DamageImmunities: string[],
    // ConditionImmunities: string[],
    // Saves: NameAndModifier[],
    // Skills: NameAndModifier[],
    // Senses: string[],
    // Languages: string[],
    // Challenge: string,
    // Traits: NameAndContent[],
    // Actions: NameAndContent[],
    // Reactions: NameAndContent[],
    // LegendaryActions: NameAndContent[],
    // Description: string,
    // Player: string,
    // ImageURL: string,
  };

  return statBlock;
}

function getName(element: Cash) {
  return element.find(".mon-stat-block__name a").text().trim();
}

function getType(element: Cash) {
  return element.find(".mon-stat-block__meta").text().trim();
}

function getArmorClass(element: Cash) {
  return getAttribute(element, "Armor Class");
}

function getHitPoints(element: Cash) {
  return getAttribute(element, "Hit Points");
}

function getAttribute(element: Cash, attributeName: string) {
  const label = element.find(".mon-stat-block__attribute-label")
    .filter((_, e: Element) => e.innerHTML.trim() == attributeName).first();
  
  const value = parseInt(label.parent().find(".mon-stat-block__attribute-data-value").text().trim());
  const notes = label.parent().find(".mon-stat-block__attribute-data-extra").text().trim();
  return {
    Value: value,
    Notes: notes
  };
}

function getSpeeds(element: Cash) {
  const label = element.find(".mon-stat-block__attribute-label")
    .filter((_, e: Element) => e.innerHTML.trim() == "Speed").first();
  const commaSeparatedSpeeds = label.parent().find(".mon-stat-block__attribute-data-value").text().trim();
  return commaSeparatedSpeeds.split(",").map(s => s.trim());
}

