import React from "react";
import "./Component15CategoryBodyMoreInfoFalse.css";

export const Component15CategoryBodyMoreInfoFalse = ({
  category = "body",
  moreInfo = "true",
  className,
  ...props
}) => {
  const variantsClassName = "category-" + category + " more-info-" + moreInfo;

  return (
    <div
      className={
        "component-15-category-body-more-info-false " +
        className +
        " " +
        variantsClassName
      }
    >
      <img className="frame-121" src="frame-1210.svg" />
      <div className="body">
        <div className="_10">+10% </div>
        <div className="body2">Body </div>
      </div>
    </div>
  );
};

export default Component15CategoryBodyMoreInfoFalse;