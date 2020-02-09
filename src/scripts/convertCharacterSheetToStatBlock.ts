import cash from "cash-dom";
import { StatBlock } from "./statblock";
import { AllOptions } from "./options";

export const convertCharacterSheetToStatBlock = (options: AllOptions) => {
  const doc = cash(document);
  const characterSheetElements = doc.find(".ct-character-sheet");
  const statBlock: Partial<StatBlock> = {
    Name: characterSheetElements
      .find(".ct-character-tidbits__name")
      .text()
      .trim(),
    ImageURL: ""
  };
  return statBlock;
};
