import React, { useState, useEffect } from "react";
import "./OverviewLightV3.css";
import { Component15CategoryBodyMoreInfoFalse } from "./Component15CategoryBodyMoreInfoFalse";
import { Component15CategorySocialMoreInfoFalse } from "./Component15CategorySocialMoreInfoFalse";
import { Component15CategoryLifestyleMoreInfoFalse } from "./Component15CategoryLifestyleMoreInfoFalse";

export const OverviewLightV3 = ({ className, ...props }) => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('W');
  const [animatedScore, setAnimatedScore] = useState(0);
  const [animatedWellBeingScore, setAnimatedWellBeingScore] = useState(0);
  
  // Widget data
  const widgetData = {
    mentalWellness: {
      currentScore: 67,
      weeklyChange: 7,
      description: "You've felt calm with occasional stress spikes.",
      emotion: '😊'
    },
    wellBeingIndex: {
      currentScore: 67,
      weeklyChange: 7,
      categories: {
        body: { percentage: 10, color: '#4189f0', label: 'Body' },
        social: { percentage: -12, color: '#ef8194', label: 'Social' },
        lifestyle: { percentage: -16, color: '#8cc16e', label: 'Lifestyle' }
      }
    }
  };

  // Animate scores on mount
  useEffect(() => {
    const animateScore = (target, setter) => {
      let current = 0;
      const increment = target / 60;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          setter(target);
          clearInterval(timer);
        } else {
          setter(Math.floor(current));
        }
      }, 16);
    };

    animateScore(widgetData.mentalWellness.currentScore, setAnimatedScore);
    animateScore(widgetData.wellBeingIndex.currentScore, setAnimatedWellBeingScore);
  }, []);

  const handleTimeRangeChange = (range) => {
    setSelectedTimeRange(range);
  };

  return (
    <div className={"overview-light-v-3 " + (className || "")}>
      <div className="frame-118">
        <div className="timeframe">
          <div className={`time-day ${selectedTimeRange === 'D' ? 'active' : ''}`} onClick={() => handleTimeRangeChange('D')}>
            <div className="d">D </div>
          </div>
          <div className={`time-week ${selectedTimeRange === 'W' ? 'active' : ''}`} onClick={() => handleTimeRangeChange('W')}>
            <div className="w">W </div>
          </div>
          <div className={`time-month ${selectedTimeRange === 'M' ? 'active' : ''}`} onClick={() => handleTimeRangeChange('M')}>
            <div className="m">M </div>
          </div>
          <div className={`time-6-months ${selectedTimeRange === '6M' ? 'active' : ''}`} onClick={() => handleTimeRangeChange('6M')}>
            <div className="_6-m">6M </div>
          </div>
          <div className={`time-year ${selectedTimeRange === 'Y' ? 'active' : ''}`} onClick={() => handleTimeRangeChange('Y')}>
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
              <svg className="lines" width="306" height="113" viewBox="0 0 306 113" fill="none">
                <defs>
                  <linearGradient id="gridGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#e5e5e5" stopOpacity="0.5"/>
                    <stop offset="100%" stopColor="#e5e5e5" stopOpacity="0.1"/>
                  </linearGradient>
                </defs>
                {/* Grid lines */}
                {[0, 1, 2, 3, 4].map(i => (
                  <line key={i} x1="0" y1={i * 28} x2="306" y2={i * 28} stroke="url(#gridGradient)" strokeWidth="1"/>
                ))}
              </svg>
              <div className="numbers">
                <div className="_12-a">12A </div>
                <div className="_3">3 </div>
                <div className="_6">6 </div>
                <div className="_9">9 </div>
              </div>
            </div>
            <svg className="fluctuation-line" width="305" height="35" viewBox="0 0 305 35" fill="none">
              <path d="M0 20 Q76 10, 152 15 T 305 18" stroke="#4189f0" strokeWidth="2" fill="none"/>
            </svg>
            <svg className="average" width="305" height="1" viewBox="0 0 305 1" fill="none">
              <line x1="0" y1="0.5" x2="305" y2="0.5" stroke="#c79ea0" strokeWidth="1" strokeDasharray="5,5"/>
            </svg>
          </div>
          <div className="frame-36">
            <div className="frame-35">
              <div className="score">
                <div className="_67">{animatedScore} </div>
                <div className="current-score">Current score </div>
              </div>
              <div className="frame-26">
                <div className="frame-18">
                  <div className="div2">{widgetData.mentalWellness.emotion} </div>
                </div>
                <div className="frame-16">
                  <div className="_7-this-week">+{widgetData.mentalWellness.weeklyChange} this week </div>
                </div>
              </div>
            </div>
            <div className="frame-34">
              <div className="summary">
                {widgetData.mentalWellness.description}{" "}
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
            />
            <Component15CategorySocialMoreInfoFalse
              category="social"
              moreInfo="false"
              className="component-15-instance2"
            />
            <Component15CategoryLifestyleMoreInfoFalse
              category="lifestyle"
              moreInfo="false"
              className="component-15-instance3"
            />
          </div>
          <div className="score2">
            <div className="score">
              <div className="_67">{animatedWellBeingScore} </div>
              <div className="current-score">Current score </div>
            </div>
            <div className="frame-26">
              <div className="frame-18">
                <div className="div2">😊 </div>
              </div>
              <div className="frame-16">
                <div className="_7-this-week">+{widgetData.wellBeingIndex.weeklyChange} this week </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewLightV3;