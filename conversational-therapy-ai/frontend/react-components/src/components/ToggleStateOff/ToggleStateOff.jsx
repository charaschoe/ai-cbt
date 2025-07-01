import React from "react";
import styles from "./ToggleStateOff.module.css";

export const ToggleStateOff = ({ state = "on", className, ...props }) => {
  const variantsClassName = styles["state-" + state];

  return (
    <div
      className={
        styles.toggleStateOff + " " + className + " " + variantsClassName
      }
    >
      <div className={styles.knob}></div>
    </div>
  );
};