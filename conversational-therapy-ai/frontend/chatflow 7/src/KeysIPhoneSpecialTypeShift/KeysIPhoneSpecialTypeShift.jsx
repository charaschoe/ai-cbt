import "./KeysIPhoneSpecialTypeShift.css";
import { KeysIPhoneModeLightStateSecondary } from "../KeysIPhoneModeLightStateSecondary/KeysIPhoneModeLightStateSecondary.jsx";

export const KeysIPhoneSpecialTypeShift = ({
  key = "S",
  type = "space",
  className,
  ...props
}) => {
  const variantsClassName = "type-" + type;

  return (
    <div
      className={
        "keys-i-phone-special-type-shift " + className + " " + variantsClassName
      }
    >
      <KeysIPhoneModeLightStateSecondary
        state="secondary"
        className="key-instance"
      ></KeysIPhoneModeLightStateSecondary>
      <div className="div">􀆝 </div>
    </div>
  );
};
