import { Options, AllOptions, OptionDefaults } from "@/utils/options";
import { ChangeEvent } from "react";
import { storage } from "wxt/storage";

export function OptionsEditor(props: {
  setShowOptions: (show: boolean) => void;
}) {
  return (
    <Container>
      <h1 className="text-brand font-bold text-lg">
        Import to Improved Initiative: Options
      </h1>
      <section className="flex flex-col gap-1">
        <Checkbox
          optionName={Options.IncludeDescription}
          label="Include description"
        />
        <Checkbox
          optionName={Options.IncludePageNumberWithSource}
          label="Include page number in source"
        />
        <Checkbox
          optionName={Options.IncludeLink}
          label="Include Link to Source in Description"
          hint="Includes a link back to the source URL at the end of the description block."
        />
        <TextInput
          optionName={Options.TargetUrl}
          label="Target URL"
          hint={`The URL that the data is sent to. Typically ${
            OptionDefaults[Options.TargetUrl]
          }`}
        />
        <button
          className="bg-brand p-2 text-white"
          onClick={() => props.setShowOptions(false)}
        >
          Done
        </button>
      </section>
      <footer className="self-end">&copy; Evan Bailey</footer>
    </Container>
  );
}

const Checkbox = (props: {
  optionName: Options;
  label: string;
  hint?: string;
}) => {
  const [option, setOption] = useState<string>("off");
  useEffect(() => {
    storage.getItem(props.optionName).then((value) => {
      if (typeof value === "string") {
        setOption(value);
      }
    });
  }, [props.optionName]);

  return (
    <div>
      <input
        type="checkbox"
        className="m-2"
        id={`checkbox-${props.optionName}`}
        checked={option === "on"}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          const input = e.target;
          const newValue = input.checked ? "on" : "off";
          storage.setItem(props.optionName, newValue);
          setOption(newValue);
        }}
        title={props.hint}
      />
      <label htmlFor={`checkbox-${props.optionName}`}>{props.label}</label>
    </div>
  );
};

const TextInput = (props: {
  optionName: Options;
  label: string;
  hint?: string;
}) => {
  const [option, setOption] = useState<string>("");
  useEffect(() => {
    storage.getItem(props.optionName).then((value) => {
      if (typeof value === "string") {
        setOption(value);
      }
    });
  }, [props.optionName]);

  return (
    <div className="flex flex-row items-center">
      <label htmlFor={`textinput-${props.optionName}`}>Target URL</label>
      <input
        id={`textinput-${props.optionName}`}
        className="m-2 p-1 border border-brand border-solid rounded-md flex-grow"
        type="text"
        value={option}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          const input = e.target;
          const newValue = input.value;
          storage.setItem(props.optionName, newValue);
        }}
        placeholder={OptionDefaults[props.optionName]}
        title={props.hint}
      />
    </div>
  );
};
