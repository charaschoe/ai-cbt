import "./KeysIPhoneEnterBlueColorOff.css";
import { KeysIPhoneModeLightStateSecondary } from "../KeysIPhoneModeLightStateSecondary/KeysIPhoneModeLightStateSecondary.jsx";

export const KeysIPhoneEnterBlueColorOff = ({
  label = "return",
  blueColor = "off",
  className,
  ...props
}) => {
  const variantsClassName = "blue-color-" + blueColor;

  return (
    <div
      className={
        "keys-i-phone-enter-blue-color-off " +
        className +
        " " +
        variantsClassName
      }
    >
      <KeysIPhoneModeLightStateSecondary
        state="secondary"
        className="key-instance"
      ></KeysIPhoneModeLightStateSecondary>
      <div className="q">{label} </div>
    </div>
  );
};
