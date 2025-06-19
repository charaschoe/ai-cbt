import React from "react";
import "./MindSubpage.css";

export const MindSubpage = ({ className, onBackClick, ...props }) => {
  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    }
  };

  return (
    <div className={"mind-subpage " + (className || "")}>
      {/* Header with back button */}
      <div className="frame-87">
        <div className="frame-77" onClick={handleBackClick} style={{ cursor: 'pointer' }}>
          <img src="frame-770.svg" alt="Back" />
        </div>
        <div className="mind-readiness">Mind Readiness</div>
      </div>

      {/* Scrollable content */}
      <div className="frame-91">
        {/* Mental Load Section */}
        <div className="frame-80">
          <div className="mental-load">Mental Load</div>
          <div className="mental-bar">
            <div className="bar-empty"></div>
            <div className="bar-fill"></div>
          </div>
          <div className="percent-82">82%</div>
        </div>

        {/* Focus Enhancement Section */}
        <div className="frame-83">
          <div className="focus-moment">Focus Moment</div>
          <div className="minute-4-7-8-focus">4-7-8 Focus</div>
          <div className="focus-graph">
            <img className="timing-guidelines" src="timing-guidelines0.svg" alt="Timing Guidelines" />
            <img className="waveform-graph" src="waveform-graph0.svg" alt="Waveform Graph" />
            <div className="label-inhale">Inhale</div>
            <div className="label-hold">Hold</div>
            <div className="label-exhale">Exhale</div>
          </div>
        </div>

        {/* Cognitive Insight Section */}
        <div className="frame-85">
          <div className="cognitive-insight">Cognitive Insight</div>
          <div className="concentration-patterns">
            <div className="concentration-info">
              <div className="focus-span">Focus Span</div>
              <div className="minutes-12">12 min</div>
            </div>
            <div className="cognitive-load-info">
              <div className="cognitive-load">Cognitive Load</div>
              <div className="task-switching">High task switching detected</div>
            </div>
          </div>
          <div className="mental-clarity-score">
            <div className="clarity-label">Mental Clarity</div>
            <div className="clarity-percentage">74%</div>
          </div>
        </div>

        {/* Mind Notes Section */}
        <div className="frame-86">
          <div className="leave-a-mind-note">Leave a Mind Note</div>
          <div className="voice-input-mental">
            <img className="pencil-icon" src="pencil-streamline-lucide-line0.svg" alt="Write" />
            <div className="mental-thoughts">Capture your thoughts...</div>
            <img className="voice-icon" src="voice-mail-mic-audio-mike-music-microphone0.svg" alt="Voice" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MindSubpage;