import "./AccessoryBarAutocorrectionSelection1.css";

export const AccessoryBarAutocorrectionSelection1 = ({
  option1 = "“The”",
  option2 = "the",
  option3 = "to",
  selection = "none",
  className,
  ...props
}) => {
  const variantsClassName = "selection-" + selection;

  return (
    <div
      className={
        "accessory-bar-autocorrection-selection-1 " +
        className +
        " " +
        variantsClassName
      }
    >
      <div className="autocomplete-suggestion">
        <div className="the">{option1} </div>
      </div>
      <div className="separator-clear">
        <div className="separator"></div>
      </div>
      <div className="autocomplete-suggestion2">
        <div className="the">{option2} </div>
      </div>
      <div className="separator2">
        <div className="separator3"></div>
      </div>
      <div className="autocomplete-suggestion2">
        <div className="to">{option3} </div>
      </div>
    </div>
  );
};
