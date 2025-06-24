import React, { useState, useEffect } from 'react';
import './WidgetsLeft.css';

const WidgetsLeft = ({ onBackClick, className, ...props }) => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('W');
  const [animatedScore, setAnimatedScore] = useState(0);
  const [animatedWellBeingScore, setAnimatedWellBeingScore] = useState(0);
  
  // Widget data (could be props in real implementation)
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
      const increment = target / 60; // 60 frames for smooth animation
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          setter(target);
          clearInterval(timer);
        } else {
          setter(Math.floor(current));
        }
      }, 16); // ~60fps
    };

    animateScore(widgetData.mentalWellness.currentScore, setAnimatedScore);
    animateScore(widgetData.wellBeingIndex.currentScore, setAnimatedWellBeingScore);
  }, []);

  const handleTimeRangeChange = (range) => {
    setSelectedTimeRange(range);
    // Here you would typically fetch new data based on the time range
  };

  return (
    <div className={`overview-light-v-2 ${className || ''}`} {...props}>
      {/* Time Range Selector */}
      <div className="frame-10">
        <div className={`frame-9 ${selectedTimeRange === 'D' ? 'active' : ''}`} onClick={() => handleTimeRangeChange('D')}>
          <div className="d">D</div>
        </div>
        <div className={`frame-8 ${selectedTimeRange === 'W' ? 'active' : ''}`} onClick={() => handleTimeRangeChange('W')}>
          <div className="w">W</div>
        </div>
        <div className={`frame-7 ${selectedTimeRange === 'M' ? 'active' : ''}`} onClick={() => handleTimeRangeChange('M')}>
          <div className="m">M</div>
        </div>
        <div className={`frame-6 ${selectedTimeRange === '6M' ? 'active' : ''}`} onClick={() => handleTimeRangeChange('6M')}>
          <div className="_6-m">6M</div>
        </div>
        <div className={`frame-5 ${selectedTimeRange === 'Y' ? 'active' : ''}`} onClick={() => handleTimeRangeChange('Y')}>
          <div className="y">Y</div>
        </div>
      </div>

      {/* Header */}
      <div className="overview">Overview</div>
      <div className="frame-1">
        <div className="ellipse-5"></div>
        <div className="ellipse-6"></div>
        <div className="ellipse-7"></div>
      </div>

      {/* Mental Wellness Widget */}
      <div className="frame-3">
        <div className="rectangle-4"></div>
        <img className="lines" src="/lines0.svg" alt="Chart grid" />
        <img className="fluctuation-line" src="/fluctuation-line0.svg" alt="Wellness trend" />
        <img className="average" src="/average0.svg" alt="Average line" />
        
        <div className="_12-a">12A</div>
        <div className="_3">3</div>
        <div className="_6">6</div>
        <div className="_9">9</div>
        
        <div className="you-ve-felt-mostly-calm-with-occasional-stress-spikes">
          {widgetData.mentalWellness.description}
        </div>
        <div className="current-score">Current score</div>
        <div className="_86">{animatedScore}</div>
        
        <div className="frame-14">
          <div className="frame-13">
            <div className="div">✨</div>
          </div>
          <div className="mental-wellness-score">Mental Wellness Score</div>
        </div>
        
        <div className="frame-16">
          <div className="_7-points-from-last-week">
            +{widgetData.mentalWellness.weeklyChange} this week
          </div>
        </div>
        <div className="frame-17">
          <div className="div2">{widgetData.mentalWellness.emotion}</div>
        </div>
      </div>

      {/* Well-Being Index Widget */}
      <div className="frame-11">
        <div className="rectangle-4"></div>
        <div className="frame-14">
          <div className="frame-13">
            <div className="div">🌿</div>
          </div>
          <div className="well-being-score-index">Well-Being Score Index</div>
        </div>

        {/* Circular Charts */}
        <div className="elipse-groups">
          <div className="ellipse-30"></div>
          <div className="ellipse-28"></div>
        </div>
        <div className="elipse-groups2">
          <div className="ellipse-32"></div>
          <div className="ellipse-29"></div>
        </div>
        <div className="elipse-groups3">
          <div className="ellipse-31"></div>
          <div className="ellipse-27"></div>
        </div>

        {/* Score Display */}
        <div className="score">
          <div className="_67">{animatedWellBeingScore}</div>
          <div className="current-score2">Current score</div>
        </div>

        {/* Category Badges */}
        <div className="body">
          <div className="_10">+{widgetData.wellBeingIndex.categories.body.percentage}%</div>
          <div className="body2">{widgetData.wellBeingIndex.categories.body.label}</div>
        </div>
        <div className="environment-bubble">
          <div className="_16">{widgetData.wellBeingIndex.categories.lifestyle.percentage}%</div>
          <div className="environment">Lifestyle</div>
        </div>
        <div className="behavioral">
          <div className="_12">{widgetData.wellBeingIndex.categories.social.percentage}%</div>
          <div className="behavioral2">Social</div>
        </div>

        {/* Status Indicators */}
        <div className="frame-26">
          <div className="frame-18">
            <div className="div2">{widgetData.wellBeingIndex.emotion || '😊'}</div>
          </div>
          <div className="frame-162">
            <div className="_7-this-week">+{widgetData.wellBeingIndex.weeklyChange} this week</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WidgetsLeft;
