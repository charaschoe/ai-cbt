import "./KeysIPhoneModeLightStateSecondary.css";

export const KeysIPhoneModeLightStateSecondary = ({
  mode = "light",
  state = "normal",
  className,
  ...props
}) => {
  const variantsClassName = "mode-" + mode + " state-" + state;

  return (
    <div
      className={
        "keys-i-phone-mode-light-state-secondary " +
        className +
        " " +
        variantsClassName
      }
    ></div>
  );
};
