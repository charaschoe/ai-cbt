import React from "react";
import "./Screen2V4.css";

const imgBlob4 = "../screen neu 2v4/blob-40.svg";
const imgBlobMentalNegative = "../screen neu 2v4/blob-mental-negative0.svg";
const imgBlobNegativeBody = "../screen neu 2v4/blob-negative-body0.svg";

export default function Screen2V4({ onConnectionPageClick }) {
	return (
		<div className="screen-2-v-4">
			<img className="blob-4" src={imgBlob4} alt="Blob 4" />
			<div className="frame-79">
				<img
					className="blob-mental-negative"
					src={imgBlobMentalNegative}
					alt="Mental Negative"
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
					src={imgBlobNegativeBody}
					alt="Negative Body"
				/>
				<div className="frame-63">
					<div className="adaptive-insight-body">
						Low energy today
					</div>
				</div>
			</div>
			<div
				className="adaptive-insight-social"
				onClick={onConnectionPageClick}
				style={{ cursor: "pointer" }}
			>
				Craving connection
			</div>
		</div>
	);
}
