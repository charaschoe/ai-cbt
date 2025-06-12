import "./Screen2V4.css";

export const Screen2V4 = ({ className, ...props }) => {
  return (
    <div className={"screen-2-v-4 " + className}>
      <img className="blob-3" src="blob-30.svg" />
      <img className="blob-1" src="blob-10.svg" />
      <img className="blob-4" src="blob-40.svg" />
      <img className="blob-2" src="blob-20.svg" />
      <div className="adaptive-insight-mind">
        Mental Load
        <br />
        Detected{" "}
      </div>
      <div className="navigate-your-mind-life">
        Navigate Your Mind &amp; Life{" "}
      </div>
      <div className="frame-63">
        <div className="adaptive-insight-body">Low energy today </div>
      </div>
      <div className="adaptive-insight-lifestyle">In need of perspective </div>
      <div className="adaptive-insight-social">Craving connection </div>
    </div>
  );
};
