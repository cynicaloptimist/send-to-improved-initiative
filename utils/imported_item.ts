export type ImportedItem =
  | {
      type: "statblock";
      data: StatBlock;
    }
  | {
      type: "spell";
      data: Spell;
    };
