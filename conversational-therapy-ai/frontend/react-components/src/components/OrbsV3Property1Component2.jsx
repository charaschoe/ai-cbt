import React from 'react';
import "./OrbsV3Property1Component2.css";

export const OrbsV3Property1Component2 = ({
  property1 = "component-2",
  className,
  ...props
}) => {
  const variantsClassName = "property-1-" + property1;

  return (
    <div
      className={
        "orbs-v-3-property-1-component-2 " + className + " " + variantsClassName
      }
    >
      <div className="ellipse-2"></div>
    </div>
  );
};
