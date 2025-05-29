import "./HomeIndicatorDeviceIPhoneOrientationPortrait.css";

export const HomeIndicatorDeviceIPhoneOrientationPortrait = ({
  device = "i-phone",
  orientation = "portrait",
  className,
  ...props
}) => {
  const variantsClassName = "device-" + device + " orientation-" + orientation;

  return (
    <div
      className={
        "home-indicator-device-i-phone-orientation-portrait " +
        className +
        " " +
        variantsClassName
      }
    >
      <div className="home-indicator"></div>
    </div>
  );
};
