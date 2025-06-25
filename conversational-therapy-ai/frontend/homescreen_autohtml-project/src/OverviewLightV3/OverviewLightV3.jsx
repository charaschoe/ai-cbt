import "./OverviewLightV3.css";
import { Component15CategoryBodyMoreInfoFalse } from "../Component15CategoryBodyMoreInfoFalse/Component15CategoryBodyMoreInfoFalse.jsx";
import { Component15CategorySocialMoreInfoFalse } from "../Component15CategorySocialMoreInfoFalse/Component15CategorySocialMoreInfoFalse.jsx";
import { Component15CategoryLifestyleMoreInfoFalse } from "../Component15CategoryLifestyleMoreInfoFalse/Component15CategoryLifestyleMoreInfoFalse.jsx";

export const OverviewLightV3 = ({ className, ...props }) => {
  return (
    <div className={"overview-light-v-3 " + className}>
      <img className="vector-2139" src="vector-21390.svg" />
      <img className="vector-2140" src="vector-21400.svg" />
      <div className="frame-118">
        <div className="timeframe">
          <div className="time-day">
            <div className="d">D </div>
          </div>
          <div className="time-week">
            <div className="w">W </div>
          </div>
          <div className="time-month">
            <div className="m">M </div>
          </div>
          <div className="time-6-months">
            <div className="_6-m">6M </div>
          </div>
          <div className="time-year">
            <div className="y">Y </div>
          </div>
        </div>
        <div className="frame-37">
          <div className="card-title">
            <div className="icon">
              <div className="div">✨ </div>
            </div>
            <div className="title">Mental Wellness Score </div>
          </div>
          <div className="graph">
            <div className="graph-lines">
              <img className="lines" src="lines0.svg" />
              <div className="numbers">
                <div className="_12-a">12A </div>
                <div className="_3">3 </div>
                <div className="_6">6 </div>
                <div className="_9">9 </div>
              </div>
            </div>
            <img className="fluctuation-line" src="fluctuation-line0.svg" />
            <img className="average" src="average0.svg" />
          </div>
          <div className="frame-36">
            <div className="frame-35">
              <div className="score">
                <div className="_67">67 </div>
                <div className="current-score">Current score </div>
              </div>
              <div className="frame-26">
                <div className="frame-18">
                  <div className="div2">😊 </div>
                </div>
                <div className="frame-16">
                  <div className="_7-this-week">+7 this week </div>
                </div>
              </div>
            </div>
            <div className="frame-34">
              <div className="summary">
                You’ve felt calm with occasional stress spikes.{" "}
              </div>
            </div>
          </div>
        </div>
        <div className="card-well-being-score-index">
          <div className="label-well-being-score-index">
            <div className="icon">
              <div className="div">🌿 </div>
            </div>
            <div className="well-being-score-index">
              Well-Being Score Index{" "}
            </div>
          </div>
          <div className="well-being-graphic">
            <Component15CategoryBodyMoreInfoFalse
              category="body"
              moreInfo="false"
              className="component-15-instance"
            ></Component15CategoryBodyMoreInfoFalse>
            <Component15CategorySocialMoreInfoFalse
              category="social"
              moreInfo="false"
              className="component-15-instance2"
            ></Component15CategorySocialMoreInfoFalse>
            <Component15CategoryLifestyleMoreInfoFalse
              category="lifestyle"
              moreInfo="false"
              className="component-15-instance3"
            ></Component15CategoryLifestyleMoreInfoFalse>
          </div>
          <div className="score2">
            <div className="score">
              <div className="_67">67 </div>
              <div className="current-score">Current score </div>
            </div>
            <div className="frame-26">
              <div className="frame-18">
                <div className="div2">😊 </div>
              </div>
              <div className="frame-16">
                <div className="_7-this-week">+7 this week </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="frame-87">
        <img className="frame-77" src="frame-770.svg" />
        <div className="label-subpage-body">
          <div className="overview">Overview </div>
        </div>
        <div className="button-more-options">
          <div className="ellipse-5"></div>
          <div className="ellipse-6"></div>
          <div className="ellipse-7"></div>
        </div>
      </div>
    </div>
  );
};
