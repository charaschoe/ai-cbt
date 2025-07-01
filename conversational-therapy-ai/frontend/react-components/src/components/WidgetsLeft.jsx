import React from 'react';
import EmotionalBlobsWidget from './EmotionalBlobsWidget';

const WidgetsLeft = ({
  onMindClick,
  onBodyClick,
  onConnectionClick,
  className,
  ...props
}) => {
  return (
    <EmotionalBlobsWidget
      className={className}
      onMindClick={onMindClick}
      onBodyClick={onBodyClick}
      onConnectionClick={onConnectionClick}
      {...props}
    />
  );
};

export default WidgetsLeft;
