import "./KeysIPhoneSpecialTypeDelete.css";
import { KeysIPhoneModeLightStateSecondary } from "../KeysIPhoneModeLightStateSecondary/KeysIPhoneModeLightStateSecondary.jsx";

export const KeysIPhoneSpecialTypeDelete = ({
  key = "S",
  type = "space",
  className,
  ...props
}) => {
  const variantsClassName = "type-" + type;

  return (
    <div
      className={
        "keys-i-phone-special-type-delete " +
        className +
        " " +
        variantsClassName
      }
    >
      <KeysIPhoneModeLightStateSecondary
        state="secondary"
        className="key-instance"
      ></KeysIPhoneModeLightStateSecondary>
      <div className="delete">􀆛 </div>
    </div>
  );
};
