import React from "react";
import styles from "./BodySubpage.module.css";
import { SuggestionBlockProperty1Default } from "./SuggestionBlockProperty1Default/SuggestionBlockProperty1Default.jsx";
import { ToggleStateOff } from "./ToggleStateOff/ToggleStateOff.jsx";

export const BodySubpage = ({ className, ...props }) => {
  return (
    <div className={styles.bodySubpage + " " + className}>
      <img className={styles.vector2138} src="vector-21380.svg" />
      <img className={styles.vector2139} src="vector-21390.svg" />
      <img className={styles.blob4} src="blob-40.svg" />
      <div className={styles.ellipse40}></div>
      <div className={styles.frame91}>
        <div className={styles.cardEnergyBlock}>
          <div className={styles.titlePhysiologicalReadiness}>
            <div className={styles.iconLink}>👤 </div>
            <div className={styles.title}>Physiological Readiness </div>
          </div>
          <div className={styles.label}>
            <div className={styles.energy}>Energy </div>
            <div className={styles.seven6Moderate}>76% - Moderate </div>
          </div>
          <div className={styles.energyBar}>
            <div className={styles.barEmpty}></div>
            <div className={styles.barFill}></div>
          </div>
          <img className={styles.dividerLine} src="divider-line0.svg" />
          <div className={styles.bodyCopy}>
            <div
              className={
                styles.todayYouMentionedLowMotivationAndFogginessYourBodyIsUnderResourcedToday
              }
            >
              Today you mentioned low motivation and fogginess. Your body is
              under-resourced today.{" "}
            </div>
          </div>
          <div className={styles.tImestamp}>
            <div className={styles.lastUpdate944}>Last Update: 9:44 </div>
          </div>
        </div>
        <div className={styles.cardRegulationMoment}>
          <div className={styles.title2}>
            <div className={styles.icon}>🧘🏼‍♀️ </div>
            <div className={styles.yourRegulationMoment}>
              Your Regulation Moment{" "}
            </div>
          </div>
          <div className={styles.exerciseHeader}>
            <div className={styles.four68Breathing}>4-6-8 Breathing </div>
            <div className={styles.frame86}>
              <div className={styles.completed1132Am}>Completed 11:32 am </div>
              <div className={styles.aiSuggestedExercise}>
                AI Suggested Exercise{" "}
              </div>
            </div>
          </div>
          <div className={styles.breathGraph}>
            <img
              className={styles.timingGuidelines}
              src="timing-guidelines0.svg"
            />
            <img className={styles.waveformGraph} src="waveform-graph0.svg" />
            <div className={styles.labelInhale}>4 sec in </div>
            <div className={styles.labelHold}>6 sec hold </div>
            <div className={styles.labelExhale}>8 sec out </div>
          </div>
          <div className={styles.reflectionCopy}>
            <div
              className={
                styles.yourBreathSlowedAndTensionDroppedYourBodyRememberedHowToFeelSafe
              }
            >
              <span>
                <span
                  className={
                    styles.yourBreathSlowedAndTensionDroppedYourBodyRememberedHowToFeelSafeSpan
                  }
                >
                  Your breath slowed and tension dropped. <br />
                  Your body remembered how to feel
                </span>
                <span
                  className={
                    styles.yourBreathSlowedAndTensionDroppedYourBodyRememberedHowToFeelSafeSpan2
                  }
                >
                  safe
                </span>
                <span
                  className={
                    styles.yourBreathSlowedAndTensionDroppedYourBodyRememberedHowToFeelSafeSpan
                  }
                >
                  .
                </span>
              </span>{" "}
            </div>
          </div>
        </div>
        <div className={styles.cardInsight}>
          <div className={styles.iconTitle}>
            <div className={styles.div}>🔮 </div>
            <div className={styles.ambientInsight}>Ambient Insight </div>
          </div>
          <div className={styles.insightTitle}>
            <div className={styles.div2}>🔥 </div>
            <div className={styles.increasedLibido}>Increased Libido </div>
          </div>
          <div className={styles.cycleInfo}>
            <div className={styles.day18FollicularPhase}>
              Day 18: Follicular Phase{" "}
            </div>
            <div className={styles.ovulationIn2Days}>
              <span>
                <span className={styles.ovulationIn2DaysSpan}>
                  Ovulation in
                </span>
                <span className={styles.ovulationIn2DaysSpan2}>2 days</span>
              </span>{" "}
            </div>
          </div>
          <img className={styles.dividerLine2} src="divider-line1.svg" />
          <SuggestionBlockProperty1Default
            className={styles.suggestionBlockInstance}
          ></SuggestionBlockProperty1Default>
        </div>
        <div className={styles.cardReflect}>
          <div className={styles.sectionTitle}>
            <div className={styles.div3}>🔗 </div>
            <div className={styles.leaveANoteForLater}>
              Leave a Note for Later{" "}
            </div>
          </div>
          <div className={styles.insightLabel}>
            <div
              className={
                styles.youReInANewPlaceHowSYourBodyRespondingToTheShift
              }
            >
              You're in a new place. How's your body responding to the shift?{" "}
            </div>
          </div>
          <div className={styles.memroyLabelAi}>
            <div
              className={
                styles.notebookFillStreamlineOutlinedFillMaterialPro
              }
            >
              <img className={styles.notebookFill} src="notebook-fill0.svg" />
            </div>
            <div
              className={
                styles.blobWillKeepYourResponseInMindItMayBeBroughtUpWhenRelevant
              }
            >
              Blob will keep your response in mind — it may be brought up when
              relevant.{" "}
            </div>
          </div>
          <div className={styles.buttonTypeAudio}>
            <div className={styles.buttonType}>
              <div className={styles.voiceInput}>Voice Input </div>
            </div>
            <div className={styles.buttonVoice}>
              <img
                className={styles.pencilStreamlineLucideLine}
                src="pencil-streamline-lucide-line0.svg"
              />
            </div>
          </div>
        </div>
      </div>
      <div className={styles.frame92}>
        <img className={styles.frame77} src="frame-770.svg" />
        <div className={styles.labelSubpageMind}>
          <div className={styles.body}>Body </div>
        </div>
        <img
          className={
            styles.accountCircleFillStreamlineRoundedFillMaterialSymbols
          }
          src="account-circle-fill-streamline-rounded-fill-material-symbols0.svg"
        />
      </div>
      <div className={styles.frame102}>
        <div className={styles.frame117}>
          <img className={styles.ellipse58} src="ellipse-580.png" />
          <div className={styles.frame103}>
            <div className={styles.annaAirbus}>Anna Airbus </div>
            <div className={styles.activeSince2017}>Active Since 2017 </div>
          </div>
        </div>
        <div className={styles.frame115}>
          <div className={styles.frame114}>
            <div className={styles.settings}>Settings </div>
            <div className={styles.frame116}>
              <div className={styles.frame106}>
                <div className={styles.frame104}>
                  <div className={styles.healthInsurance}>
                    Health Insurance{" "}
                  </div>
                  <img className={styles.frame772} src="frame-771.svg" />
                </div>
                <img className={styles.dividerLine3} src="divider-line2.svg" />
                <div className={styles.frame105}>
                  <div className={styles.medicalId}>Medical ID </div>
                  <img className={styles.frame773} src="frame-772.svg" />
                </div>
              </div>
              <div className={styles.frame109}>
                <div className={styles.frame108}>
                  <div className={styles.smartNotifications}>
                    Smart Notifications{" "}
                  </div>
                  <ToggleStateOff
                    state="off"
                    className={styles.toggleInstance}
                  ></ToggleStateOff>
                </div>
                <img className={styles.dividerLine4} src="divider-line3.svg" />
                <div className={styles.frame107}>
                  <div className={styles.darkMode}>Dark Mode </div>
                  <ToggleStateOff
                    state="off"
                    className={styles.toggleInstance}
                  ></ToggleStateOff>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.frame113}>
            <div className={styles.knob}>Knob </div>
            <div className={styles.frame111}>
              <div className={styles.frame108}>
                <div className={styles.connectYourKnob}>Connect Your Knob </div>
                <img className={styles.frame774} src="frame-773.svg" />
              </div>
            </div>
          </div>
          <div className={styles.frame112}>
            <div className={styles.inputsPrivacy}>Inputs &amp; Privacy </div>
            <div className={styles.frame110}>
              <div className={styles.frame104}>
                <div className={styles.appsDevices}>Apps &amp; Devices </div>
                <img className={styles.frame775} src="frame-774.svg" />
              </div>
              <img className={styles.dividerLine5} src="divider-line4.svg" />
              <div className={styles.frame107}>
                <div className={styles.devicePermissions}>
                  Device Permissions{" "}
                </div>
                <img className={styles.frame776} src="frame-775.svg" />
              </div>
              <img className={styles.dividerLine6} src="divider-line5.svg" />
              <div className={styles.frame105}>
                <div className={styles.dataAndPrivacy}>Data and Privacy </div>
                <img className={styles.frame777} src="frame-776.svg" />
              </div>
            </div>
          </div>
        </div>
        <img className={styles.exit} src="exit0.svg" />
      </div>
    </div>
  );
};

export default BodySubpage;
