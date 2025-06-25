import React from "react";
import "./Component15CategoryLifestyleMoreInfoFalse.css";

export const Component15CategoryLifestyleMoreInfoFalse = ({
  category = "body",
  moreInfo = "true",
  className,
  ...props
}) => {
  const variantsClassName = "category-" + category + " more-info-" + moreInfo;

  return (
    <div
      className={
        "component-15-category-lifestyle-more-info-false " +
        className +
        " " +
        variantsClassName
      }
    >
      <img className="frame-126" src="frame-1260.svg" />
      <div className="well-being-index">
        <div className="_16">-16% </div>
        <div className="lifestyle">Lifestyle </div>
      </div>
    </div>
  );
};

export default Component15CategoryLifestyleMoreInfoFalse;