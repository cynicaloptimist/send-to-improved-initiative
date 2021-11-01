export interface AbilityScores {
  Str: number;
  Dex: number;
  Con: number;
  Cha: number;
  Int: number;
  Wis: number;
}

export interface NameAndModifier {
  Name: string;
  Modifier: number;
}

export interface ValueAndNotes {
  Value: number;
  Notes: string;
}

export interface NameAndContent {
  Name: string;
  Content: string;
  Usage?: string;
}

export interface StatBlock {
  Name: string;
  Source: string;
  Type: string;
  HP: ValueAndNotes;
  AC: ValueAndNotes;
  Speed: string[];
  Abilities: AbilityScores;
  InitiativeModifier?: number;
  InitiativeSpecialRoll?: "advantage" | "disadvantage" | "take-ten";
  InitiativeAdvantage?: boolean;
  DamageVulnerabilities: string[];
  DamageResistances: string[];
  DamageImmunities: string[];
  ConditionImmunities: string[];
  Saves: NameAndModifier[];
  Skills: NameAndModifier[];
  Senses: string[];
  Languages: string[];
  Challenge: string;
  Traits: NameAndContent[];
  Actions: NameAndContent[];
  Reactions: NameAndContent[];
  LegendaryActions: NameAndContent[];
  BonusActions?: NameAndContent[];
  MythicActions?: NameAndContent[];
  Description: string;
  Player: string;
  ImageURL: string;
}
