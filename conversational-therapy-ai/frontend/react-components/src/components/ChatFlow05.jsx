import React from 'react';
import "./ChatFlow05.css";
import { AnimateStreamingNameChunk1 } from "./AnimateStreamingNameChunk1";
import { OrbsV3Property1Component2 } from "./OrbsV3Property1Component2";

export const ChatFlow05 = ({ className, onArrowClick, ...props }) => {
  const handleArrowClick = () => {
    if (onArrowClick) {
      onArrowClick();
    }
  };
  return (
    <div className={`chat-flow-05 ${className || ''}`}>
      <div className="check-in">Check In </div>
      <div className="home">
        <div className="ellipse-4"></div>
        <div className="ellipse-5"></div>
        <div className="ellipse-6"></div>
        <div className="ellipse-14"></div>
        <div className="ellipse-15"></div>
        <div className="ellipse-16"></div>
        <div className="ellipse-17"></div>
        <div className="ellipse-18"></div>
        <div className="ellipse-19"></div>
        <div className="ellipse-20"></div>
        <div className="ellipse-21"></div>
        <div className="ellipse-7"></div>
        <div className="ellipse-8"></div>
        <div className="ellipse-9"></div>
        <div className="ellipse-10"></div>
        <div className="ellipse-11"></div>
        <div className="ellipse-12"></div>
      </div>
      <img 
        className="vector-1" 
        src="vector-10.svg" 
        onClick={handleArrowClick}
        style={{ cursor: 'pointer' }}
      />
      <AnimateStreamingNameChunk1 className="animate-streaming-2-instance"></AnimateStreamingNameChunk1>
      <div className="frame-1">
        <div className="ellipse-52"></div>
        <div className="ellipse-62"></div>
        <div className="ellipse-72"></div>
      </div>
      <OrbsV3Property1Component2 className="orbs-v-3-instance"></OrbsV3Property1Component2>
    </div>
  );
};
