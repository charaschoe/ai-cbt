import "./BackgroundModeLightStyleDefaultTypeDefault.css";

export const BackgroundModeLightStyleDefaultTypeDefault = ({
  mode = "light",
  styleVariant = "default",
  type = "default",
  className,
  ...props
}) => {
  const variantsClassName =
    "mode-" + mode + " style-variant-" + styleVariant + " type-" + type;

  return (
    <div
      className={
        "background-mode-light-style-default-type-default " +
        className +
        " " +
        variantsClassName
      }
    ></div>
  );
};
