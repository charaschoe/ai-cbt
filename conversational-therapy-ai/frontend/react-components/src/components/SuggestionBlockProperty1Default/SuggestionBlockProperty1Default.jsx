import React from "react";
import styles from "./SuggestionBlockProperty1Default.module.css";

export const SuggestionBlockProperty1Default = ({ className, ...props }) => {
  return (
    <div className={styles.suggestionBlockProperty1Default + " " + className}>
      <div className={styles.pillLabelAi}>
        <img
          className={styles.bardLineStreamlineRemixLine}
          src="bard-line-streamline-remix-line0.svg"
        />
        <div className={styles.aiSuggestion}>AI Suggestion </div>
      </div>
      <div className={styles.suggestionText}>
        <div
          className={
            styles.thisEveningIsFreeAndYourMoodAndDesireIsElevatedThisCouldBeAWonderfulNightForSomethingSweetWithJohnny
          }
        >
          <span>
            <span
              className={
                styles.thisEveningIsFreeAndYourMoodAndDesireIsElevatedThisCouldBeAWonderfulNightForSomethingSweetWithJohnnySpan
              }
            >
              This evening is free, and your mood and desire is elevated. This
              could be a wonderful night for something sweet
            </span>
            <span
              className={
                styles.thisEveningIsFreeAndYourMoodAndDesireIsElevatedThisCouldBeAWonderfulNightForSomethingSweetWithJohnnySpan2
              }
            >
              with Johnny
            </span>
            <span
              className={
                styles.thisEveningIsFreeAndYourMoodAndDesireIsElevatedThisCouldBeAWonderfulNightForSomethingSweetWithJohnnySpan
              }
            >
              .
            </span>
          </span>{" "}
        </div>
      </div>
    </div>
  );
};