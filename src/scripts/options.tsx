export enum Options {
  TargetUrl = "target-url",
  IncludePageNumberWithSource = "include-page-number-with-source",
  IncludeDescription = "include-description",
  IncludeLink = "include-link"
}

export type AllOptions = Record<Options, string>;

export const OptionDefaults: AllOptions = {
  [Options.TargetUrl]: "https://improvedinitiative.app/e/",
  [Options.IncludePageNumberWithSource]: "on",
  [Options.IncludeDescription]: "on",
  [Options.IncludeLink]: "on"
};
