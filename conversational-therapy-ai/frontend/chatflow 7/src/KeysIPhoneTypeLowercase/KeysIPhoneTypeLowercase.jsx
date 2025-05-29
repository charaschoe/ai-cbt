import "./KeysIPhoneTypeLowercase.css";
import { KeysIPhoneModeLightStateNormal } from "../KeysIPhoneModeLightStateNormal/KeysIPhoneModeLightStateNormal.jsx";

export const KeysIPhoneTypeLowercase = ({
  key = "q",
  type = "lowercase",
  className,
  ...props
}) => {
  const variantsClassName = "type-" + type;

  return (
    <div
      className={
        "keys-i-phone-type-lowercase " + className + " " + variantsClassName
      }
    >
      <KeysIPhoneModeLightStateNormal className="key-instance"></KeysIPhoneModeLightStateNormal>
      <div className="q">{key} </div>
    </div>
  );
};
