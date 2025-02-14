export enum Options {
  TargetUrl = "sync:target-url",
  IncludePageNumberWithSource = "sync:include-page-number-with-source",
  IncludeDescription = "sync:include-description",
  IncludeLink = "sync:include-link",
}

export type AllOptions = Record<Options, string>;

export const OptionDefaults: AllOptions = {
  [Options.TargetUrl]: "https://improvedinitiative.app/e/",
  [Options.IncludePageNumberWithSource]: "on",
  [Options.IncludeDescription]: "on",
  [Options.IncludeLink]: "on",
};

export function initializeOptionsFromStoredValues(
  values: {
    key:
      | `local:${string}`
      | `session:${string}`
      | `sync:${string}`
      | `managed:${string}`;
    value: any;
  }[]
) {
  const options = OptionDefaults;
  if (values) {
    for (const key in options) {
      const storedOption = values.find((v) => v.key === key);
      if (storedOption) {
        options[key as Options] = storedOption.value;
      }
    }
  }
  return options;
}
