import React from 'react';
import "./AnimateStreamingNameChunk1.css";

export const AnimateStreamingNameChunk1 = ({
  name = "chunk-1",
  className,
  text = "Hi Ann",
  ...props
}) => {
  const variantsClassName = "name-" + name;

  return (
    <div
      className={
        "animate-streaming-name-chunk-1 " + className + " " + variantsClassName
      }
    >
      <div className="generated-text">{text}</div>
      <img className="frame" src="frame0.svg" />
    </div>
  );
};
