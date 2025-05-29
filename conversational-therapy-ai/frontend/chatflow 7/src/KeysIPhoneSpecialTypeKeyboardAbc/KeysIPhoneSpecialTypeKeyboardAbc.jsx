import "./KeysIPhoneSpecialTypeKeyboardAbc.css";
import { KeysIPhoneModeLightStateSecondary } from "../KeysIPhoneModeLightStateSecondary/KeysIPhoneModeLightStateSecondary.jsx";

export const KeysIPhoneSpecialTypeKeyboardAbc = ({
  key = "S",
  type = "space",
  className,
  ...props
}) => {
  const variantsClassName = "type-" + type;

  return (
    <div
      className={
        "keys-i-phone-special-type-keyboard-abc " +
        className +
        " " +
        variantsClassName
      }
    >
      <KeysIPhoneModeLightStateSecondary
        state="secondary"
        className="key-instance"
      ></KeysIPhoneModeLightStateSecondary>
      <div className="abc">ABC </div>
    </div>
  );
};
