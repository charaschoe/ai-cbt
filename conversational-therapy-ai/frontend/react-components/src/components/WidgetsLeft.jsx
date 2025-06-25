import React from 'react';
import { OverviewLightV3 } from './OverviewLightV3';

const WidgetsLeft = ({ onBackClick, className, ...props }) => {
  return (
    <OverviewLightV3 className={className} {...props} />
  );
};

export default WidgetsLeft;
