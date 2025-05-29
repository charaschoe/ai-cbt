import "./KeysIPhoneModeLightStateNormal.css";

export const KeysIPhoneModeLightStateNormal = ({
  mode = "light",
  state = "normal",
  className,
  ...props
}) => {
  const variantsClassName = "mode-" + mode + " state-" + state;

  return (
    <div
      className={
        "keys-i-phone-mode-light-state-normal " +
        className +
        " " +
        variantsClassName
      }
    ></div>
  );
};
