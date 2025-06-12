import "./OrbsV1SizeSmallStateCalmlyTunedIn.css";

export const OrbsV1SizeSmallStateCalmlyTunedIn = ({
  size = "small",
  state = "calmly-tuned-in",
  className,
  ...props
}) => {
  const variantsClassName = "size-" + size + " state-" + state;

  return (
    <div
      className={
        "orbs-v-1-size-small-state-calmly-tuned-in " +
        className +
        " " +
        variantsClassName
      }
    >
      <div className="ellipse-1"></div>
    </div>
  );
};
