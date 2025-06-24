import React from "react";
import "./Screen2V4.css";

export const Screen2V4 = ({
	className,
	onLowEnergyClick,
	onBodyPageClick,
	onMindPageClick,
	onConnectionPageClick,
	...props
}) => {
	const handleLowEnergyClick = () => {
		if (onLowEnergyClick) {
			onLowEnergyClick();
		}
		// Also navigate to body page when clicking "Low energy today"
		if (onBodyPageClick) {
			onBodyPageClick();
		}
	};

	const handleMindNavigation = () => {
		if (onMindPageClick) {
			onMindPageClick();
		}
	};

	const handleConnectionNavigation = () => {
		if (onConnectionPageClick) {
			onConnectionPageClick();
		}
	};

	return (
		<div className={"screen-2-v-4 " + (className || "")}>
			<img className="blob-4" src="blob-40.svg" alt="Blob 4" />
			<div
				className="frame-79"
				onClick={handleMindNavigation}
				style={{ cursor: "pointer" }}
			>
				<img
					className="blob-mental-negative"
					src="blob-mental-negative0.svg"
					alt="Mental Load Blob"
				/>
				<div className="adaptive-insight-mind">
					Mental Load
					<br />
					Detected
				</div>
			</div>
			<div
				className="label-subpage-navigatino"
				onClick={handleMindNavigation}
				style={{ cursor: "pointer" }}
			>
				<div className="what-s-surfacing-today">
					What's Surfacing Today
				</div>
			</div>
			<div
				className="frame-78"
				onClick={handleLowEnergyClick}
				style={{ cursor: "pointer" }}
			>
				<img
					className="blob-negative-body"
					src="blob-negative-body0.svg"
					alt="Body Blob"
				/>
				<div className="frame-63">
					<div className="adaptive-insight-body">
						Low energy today
					</div>
				</div>
			</div>
			<div
				className="adaptive-insight-social"
				onClick={handleConnectionNavigation}
				style={{ cursor: "pointer" }}
			>
				Craving connection
			</div>
		</div>
	);
};

export default Screen2V4;
