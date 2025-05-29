import "./KeysIPhoneSpaceConfigDefault.css";
import { KeysIPhoneModeLightStateNormal } from "../KeysIPhoneModeLightStateNormal/KeysIPhoneModeLightStateNormal.jsx";

export const KeysIPhoneSpaceConfigDefault = ({
  config = "default",
  className,
  ...props
}) => {
  const variantsClassName = "config-" + config;

  return (
    <div
      className={
        "keys-i-phone-space-config-default " +
        className +
        " " +
        variantsClassName
      }
    >
      <KeysIPhoneModeLightStateNormal className="key-instance"></KeysIPhoneModeLightStateNormal>
      <div className="q">space </div>
    </div>
  );
};
