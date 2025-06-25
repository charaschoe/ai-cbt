import React from "react";
import "./BodySubpage.css";

export const BodySubpage = ({ className, onBackClick, ...props }) => {
  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    }
  };

  return (
    <div className={"body-subpage " + (className || "")}>  
      <img className="vector-2138" src="vector-21380.svg" />
      <img className="vector-2139" src="vector-21390.svg" />
      <img className="blob-4" src="blob-40.svg" />
      <div className="ellipse-40"></div>
      <div className="frame-91">
        <div className="physiological-readiness">
          <div className="card-energy-block">
            <div className="title-physiological-readiness">
              <div className="icon-link">👤</div>
              <div className="title">Physiological Readiness</div>
            </div>
            <div className="label">
              <div className="energy">Energy</div>
              <div className="_76-moderate">76% - Moderate</div>
            </div>
            <div className="energy-bar">
              <div className="bar-empty"></div>
              <div className="bar-fill"></div>
            </div>
            <div className="divider-line"></div>
            <div className="body-copy">
              <div className="today-you-mentioned-low-motivation-and-fogginess-your-body-is-under-resourced-today">
                Today you mentioned low motivation and fogginess. Your body is under-resourced today.
              </div>
            </div>
            <div className="t-imestamp">
              <div className="last-update-9-44">Last Update: 9:44</div>
            </div>
          </div>
        </div>
        <div className="your-regulation-moment">
          <div className="card-regulation-moment">
            <div className="title2">
              <div className="icon">👁️</div>
              <div className="your-regulation-moment2">Your Regulation Moment</div>
            </div>
            <div className="exercise-header">
              <div className="_4-6-8-breathing">4-6-8 Breathing</div>
              <div className="frame-86">
                <div className="completed-11-32-am">Completed 11:32 am</div>
                <div className="ai-suggested-exercise">AI Suggested Exercise</div>
              </div>
            </div>
            <div className="breath-graph">
              <img className="timing-guidelines" src="timing-guidelines0.svg" />
              <img className="waveform-graph" src="waveform-graph0.svg" />
              <div className="label-inhale">Inhale</div>
              <div className="label-hold">Hold</div>
              <div className="label-exhale">Exhale</div>
            </div>
            <div className="reflection-copy">
              <div className="your-breath-slowed-and-tension-dropped-your-body-remembered-how-to-feel-safe">
                <span>
                  <span className="your-breath-slowed-and-tension-dropped-your-body-remembered-how-to-feel-safe-span">
                    Your breath slowed and tension dropped. <br />Your body remembered how to feel
                  </span>
                  <span className="your-breath-slowed-and-tension-dropped-your-body-remembered-how-to-feel-safe-span2">safe</span>
                  <span className="your-breath-slowed-and-tension-dropped-your-body-remembered-how-to-feel-safe-span">.</span>
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="card-ambient-insight">
          <div className="card-insight">
            <div className="icon-title">
              <div className="div">🔮</div>
              <div className="ambient-insight">Ambient Insight</div>
            </div>
            <div className="cycle-info">
              <div className="day-18-follicular-phase">Day 18, Follicular Phase</div>
              <div className="ovulation-in-2-days">
                <span className="ovulation-in-2-days-span">Ovulation in </span>
                <span className="ovulation-in-2-days-span2">2 days</span>
                <span className="ovulation-in-2-days-span">.</span>
              </div>
            </div>
            <div className="divider-line2"></div>
            <div className="suggestion-block">
              <div className="pill-label-ai">
                <img className="bard-line-streamline-remix-line" src="bard-line-streamline-remix-line0.svg" />
                <div className="ai-suggestion">AI Suggestion</div>
              </div>
              <div className="suggestion-text">
                <div className="this-evening-is-free-and-your-mood-and-desire-is-elevated-this-could-be-a-wonderful-night-for-something-sweet-with-johnny">
                  <span>
                    <span className="this-evening-is-free-and-your-mood-and-desire-is-elevated-this-could-be-a-wonderful-night-for-something-sweet-with-johnny-span">This evening is free and your mood and desire is elevated. This could be a wonderful night for something sweet with </span>
                    <span className="this-evening-is-free-and-your-mood-and-desire-is-elevated-this-could-be-a-wonderful-night-for-something-sweet-with-johnny-span2">Johnny</span>
                    <span className="this-evening-is-free-and-your-mood-and-desire-is-elevated-this-could-be-a-wonderful-night-for-something-sweet-with-johnny-span">.</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="card-reflect">
          <div className="card-reflect2">
            <div className="section-title">
              <div className="div3">🔗</div>
              <div className="leave-a-note-for-later">Leave a Note for Later</div>
            </div>
            <div className="insight-label">
              <div className="you-re-in-a-new-place-how-s-your-body-responding-to-the-shift">You’re in a new place. How’s your body responding to the shift?</div>
            </div>
            <div className="memroy-label-ai">
              <div className="notebook-fill-streamline-outlined-fill-material-pro">
                <img className="notebook-fill" src="notebook-fill0.svg" />
              </div>
              <div className="blob-will-keep-your-response-in-mind-it-may-be-brought-up-when-relevant">Blob will keep your response in mind — it may be brought up when relevant.</div>
            </div>
            <div className="button-type-audio">
              <div className="button-type">
                <div className="voice-input">Voice Input</div>
              </div>
              <div className="button-voice">
                <img className="pencil-streamline-lucide-line" src="pencil-streamline-lucide-line0.svg" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="frame-87">
        <img className="frame-77" src="frame-770.svg" alt="Back" onClick={handleBackClick} style={{ cursor: "pointer" }} />
        <div className="label-subpage-body">
          <div className="body">Body</div>
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

export default BodySubpage;