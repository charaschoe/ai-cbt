import "./KeyboardIPhoneTypeDefault.css";
import { BackgroundModeLightStyleDefaultTypeDefault } from "../BackgroundModeLightStyleDefaultTypeDefault/BackgroundModeLightStyleDefaultTypeDefault.jsx";
import { AccessoryBarAutocorrectionSelection1 } from "../AccessoryBarAutocorrectionSelection1/AccessoryBarAutocorrectionSelection1.jsx";
import { KeyboardIPhoneLayoutsTypeLettersLowercase } from "../KeyboardIPhoneLayoutsTypeLettersLowercase/KeyboardIPhoneLayoutsTypeLettersLowercase.jsx";
import { HomeIndicatorDeviceIPhoneOrientationPortrait } from "../HomeIndicatorDeviceIPhoneOrientationPortrait/HomeIndicatorDeviceIPhoneOrientationPortrait.jsx";

export const KeyboardIPhoneTypeDefault = ({
  showReplace = true,
  email1 = "name@email.com",
  email2 = "Hide My Email",
  type = "default",
  visibleComponent = undefined,
  visibleComponent2 = undefined,
  visibleComponent3 = undefined,
  className,
  ...props
}) => {
  const variantsClassName = "type-" + type;

  return (
    <div
      className={
        "keyboard-i-phone-type-default " + className + " " + variantsClassName
      }
    >
      <BackgroundModeLightStyleDefaultTypeDefault className="background-instance"></BackgroundModeLightStyleDefaultTypeDefault>
      <div className="accessory-bar">
        <AccessoryBarAutocorrectionSelection1
          selection="1"
          className="autocorrection-instance"
        ></AccessoryBarAutocorrectionSelection1>
      </div>
      <div className="spacer"></div>
      <KeyboardIPhoneLayoutsTypeLettersLowercase className="keyboard-layouts-instance"></KeyboardIPhoneLayoutsTypeLettersLowercase>
      <img className="emoji-and-mic" src="emoji-and-mic0.svg" />
      <HomeIndicatorDeviceIPhoneOrientationPortrait className="home-indicator-instance"></HomeIndicatorDeviceIPhoneOrientationPortrait>
    </div>
  );
};
