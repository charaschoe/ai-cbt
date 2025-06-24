import "./Screen2V4.css";

export const Screen2V4 = ({ className, ...props }) => {
	return (
		<div className={"screen-2-v-4 " + className}>
			<img className="blob-4" src="blob-40.svg" />
			<div className="frame-79">
				<img
					className="blob-mental-negative"
					src="blob-mental-negative0.svg"
				/>
				<div className="adaptive-insight-mind">
					Mental Load
					<br />
					Detected
				</div>
			</div>
			<div className="label-subpage-navigatino">
				<div className="what-s-surfacing-today">
					What's Surfacing Today
				</div>
			</div>
			<div className="frame-78">
				<img
					className="blob-negative-body"
					src="blob-negative-body0.svg"
				/>
				<div className="frame-63">
					<div className="adaptive-insight-body">
						Low energy today
					</div>
				</div>
			</div>
			<div className="adaptive-insight-social">Craving connection</div>
		</div>
	);
};
