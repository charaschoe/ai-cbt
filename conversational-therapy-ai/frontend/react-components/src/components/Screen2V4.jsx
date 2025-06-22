import React from "react";
import "./Screen2V4.css";

export const Screen2V4 = ({ className, onLowEnergyClick, onBodyPageClick, onMindPageClick, ...props }) => {
  const handleLowEnergyClick = () => {
    if (onLowEnergyClick) {
      onLowEnergyClick();
    }
    // Also navigate to body page when clicking "Low energy today"
    if (onBodyPageClick) {
      onBodyPageClick();
    }
  };

  const handleMindNavigation = () => {
    if (onMindPageClick) {
      onMindPageClick();
    }
  };

  return (
    <div className={"screen-2-v-4 " + (className || "")}>
      <img className="blob-3" src="blob-30.svg" alt="Blob 3" />
      <img className="blob-1" src="blob-10.svg" alt="Blob 1" />
      <img className="blob-4" src="blob-40.svg" alt="Blob 4" />
      <img className="blob-2" src="blob-20.svg" alt="Blob 2" />
      <div className="adaptive-insight-mind" onClick={handleMindNavigation} style={{ cursor: 'pointer' }}>
        Mental Load
        <br />
        Detected{" "}
      </div>
      <div className="navigate-your-mind-life" onClick={handleMindNavigation} style={{ cursor: 'pointer' }}>
        Navigate Your Mind &amp; Life{" "}
      </div>
      <div className="frame-63" onClick={handleLowEnergyClick} style={{ cursor: 'pointer' }}>
        <div className="adaptive-insight-body">Low energy today </div>
      </div>
      <div className="adaptive-insight-lifestyle">In need of perspective </div>
      <div className="adaptive-insight-social">Craving connection </div>
    </div>
  );
};

export default Screen2V4;