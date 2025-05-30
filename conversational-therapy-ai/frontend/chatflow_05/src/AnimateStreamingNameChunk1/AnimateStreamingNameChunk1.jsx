import "./AnimateStreamingNameChunk1.css";

export const AnimateStreamingNameChunk1 = ({
  name = "chunk-1",
  className,
  ...props
}) => {
  const variantsClassName = "name-" + name;

  return (
    <div
      className={
        "animate-streaming-name-chunk-1 " + className + " " + variantsClassName
      }
    >
      <div className="generated-text">Hi Ann </div>
      <img className="frame" src="frame0.svg" />
    </div>
  );
};
