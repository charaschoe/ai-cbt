import "./KeyboardIPhoneLayoutsTypeLettersLowercase.css";
import { KeysIPhoneSpaceConfigDefault } from "../KeysIPhoneSpaceConfigDefault/KeysIPhoneSpaceConfigDefault.jsx";
import { KeysIPhoneEnterBlueColorOff } from "../KeysIPhoneEnterBlueColorOff/KeysIPhoneEnterBlueColorOff.jsx";
import { KeysIPhoneSpecialTypeKeyboardAbc } from "../KeysIPhoneSpecialTypeKeyboardAbc/KeysIPhoneSpecialTypeKeyboardAbc.jsx";
import { KeysIPhoneTypeLowercase } from "../KeysIPhoneTypeLowercase/KeysIPhoneTypeLowercase.jsx";
import { KeysIPhoneSpecialTypeDelete } from "../KeysIPhoneSpecialTypeDelete/KeysIPhoneSpecialTypeDelete.jsx";
import { KeysIPhoneSpecialTypeShift } from "../KeysIPhoneSpecialTypeShift/KeysIPhoneSpecialTypeShift.jsx";

export const KeyboardIPhoneLayoutsTypeLettersLowercase = ({
  type = "letters-lowercase",
  className,
  ...props
}) => {
  const variantsClassName = "type-" + type;

  return (
    <div
      className={
        "keyboard-i-phone-layouts-type-letters-lowercase " +
        className +
        " " +
        variantsClassName
      }
    >
      <div className="row-4">
        <KeysIPhoneSpaceConfigDefault className="space-instance"></KeysIPhoneSpaceConfigDefault>
      </div>
      <KeysIPhoneEnterBlueColorOff className="return-instance"></KeysIPhoneEnterBlueColorOff>
      <KeysIPhoneSpecialTypeKeyboardAbc
        key="123"
        type="keyboard-abc"
        className="keyboard-switch-instance"
      ></KeysIPhoneSpecialTypeKeyboardAbc>
      <div className="row-3">
        <KeysIPhoneTypeLowercase
          key="z"
          className="key-instance"
        ></KeysIPhoneTypeLowercase>
        <KeysIPhoneTypeLowercase
          key="x"
          className="key-instance"
        ></KeysIPhoneTypeLowercase>
        <KeysIPhoneTypeLowercase
          key="c"
          className="key-instance"
        ></KeysIPhoneTypeLowercase>
        <KeysIPhoneTypeLowercase
          key="v"
          className="key-instance"
        ></KeysIPhoneTypeLowercase>
        <KeysIPhoneTypeLowercase
          key="b"
          className="key-instance"
        ></KeysIPhoneTypeLowercase>
        <KeysIPhoneTypeLowercase
          key="n"
          className="key-instance"
        ></KeysIPhoneTypeLowercase>
        <KeysIPhoneTypeLowercase
          key="m"
          className="key-instance"
        ></KeysIPhoneTypeLowercase>
      </div>
      <KeysIPhoneSpecialTypeDelete
        key="􀆛"
        type="delete"
        className="delete-key-instance"
      ></KeysIPhoneSpecialTypeDelete>
      <KeysIPhoneSpecialTypeShift
        type="shift"
        className="shift-key-instance"
      ></KeysIPhoneSpecialTypeShift>
      <div className="row-2">
        <KeysIPhoneTypeLowercase
          key="a"
          className="key-instance"
        ></KeysIPhoneTypeLowercase>
        <KeysIPhoneTypeLowercase
          key="s"
          className="key-instance"
        ></KeysIPhoneTypeLowercase>
        <KeysIPhoneTypeLowercase
          key="d"
          className="key-instance"
        ></KeysIPhoneTypeLowercase>
        <KeysIPhoneTypeLowercase
          key="f"
          className="key-instance"
        ></KeysIPhoneTypeLowercase>
        <KeysIPhoneTypeLowercase
          key="g"
          className="key-instance"
        ></KeysIPhoneTypeLowercase>
        <KeysIPhoneTypeLowercase
          key="h"
          className="key-instance"
        ></KeysIPhoneTypeLowercase>
        <KeysIPhoneTypeLowercase
          key="j"
          className="key-instance"
        ></KeysIPhoneTypeLowercase>
        <KeysIPhoneTypeLowercase
          key="k"
          className="key-instance"
        ></KeysIPhoneTypeLowercase>
        <KeysIPhoneTypeLowercase
          key="l"
          className="key-instance"
        ></KeysIPhoneTypeLowercase>
      </div>
      <div className="row-1">
        <KeysIPhoneTypeLowercase className="key-instance"></KeysIPhoneTypeLowercase>
        <KeysIPhoneTypeLowercase
          key="w"
          className="key-instance"
        ></KeysIPhoneTypeLowercase>
        <KeysIPhoneTypeLowercase
          key="e"
          className="key-instance"
        ></KeysIPhoneTypeLowercase>
        <KeysIPhoneTypeLowercase
          key="r"
          className="key-instance"
        ></KeysIPhoneTypeLowercase>
        <KeysIPhoneTypeLowercase
          key="t"
          className="key-instance"
        ></KeysIPhoneTypeLowercase>
        <KeysIPhoneTypeLowercase
          key="y"
          className="key-instance"
        ></KeysIPhoneTypeLowercase>
        <KeysIPhoneTypeLowercase
          key="u"
          className="key-instance"
        ></KeysIPhoneTypeLowercase>
        <KeysIPhoneTypeLowercase
          key="i"
          className="key-instance"
        ></KeysIPhoneTypeLowercase>
        <KeysIPhoneTypeLowercase
          key="o"
          className="key-instance"
        ></KeysIPhoneTypeLowercase>
        <KeysIPhoneTypeLowercase
          key="p"
          className="key-instance"
        ></KeysIPhoneTypeLowercase>
      </div>
    </div>
  );
};
