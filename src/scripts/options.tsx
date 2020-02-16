export enum Options {
  TargetUrl = "target-url",
  IncludePageNumberWithSource = "include-page-number-with-source",
  IncludeDescription = "include-description"
}

export type AllOptions = Record<Options, string>;

export const OptionDefaults: AllOptions = {
  [Options.TargetUrl]: "https://www.improved-initiative.com/e/",
  [Options.IncludePageNumberWithSource]: "on",
  [Options.IncludeDescription]: "on"
};
