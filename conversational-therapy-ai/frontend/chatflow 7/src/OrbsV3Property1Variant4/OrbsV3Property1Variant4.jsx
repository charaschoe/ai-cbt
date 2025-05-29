import "./OrbsV3Property1Variant4.css";

export const OrbsV3Property1Variant4 = ({
  property1 = "component-2",
  className,
  ...props
}) => {
  const variantsClassName = "property-1-" + property1;

  return (
    <div
      className={
        "orbs-v-3-property-1-variant-4 " + className + " " + variantsClassName
      }
    >
      <div className="ellipse-3"></div>
    </div>
  );
};
