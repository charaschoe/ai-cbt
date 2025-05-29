import "./ChatFlow07.css";
import { OrbsV3Property1Variant4 } from "../OrbsV3Property1Variant4/OrbsV3Property1Variant4.jsx";
import { KeyboardIPhoneTypeDefault } from "../KeyboardIPhoneTypeDefault/KeyboardIPhoneTypeDefault.jsx";

export const ChatFlow07 = ({ className, ...props }) => {
  return (
    <div className={"chat-flow-07 " + className}>
      <div className="check-in">Check In </div>
      <div className="home">
        <div className="ellipse-4"></div>
        <div className="ellipse-5"></div>
        <div className="ellipse-6"></div>
        <div className="ellipse-14"></div>
        <div className="ellipse-15"></div>
        <div className="ellipse-16"></div>
        <div className="ellipse-17"></div>
        <div className="ellipse-18"></div>
        <div className="ellipse-19"></div>
        <div className="ellipse-20"></div>
        <div className="ellipse-21"></div>
        <div className="ellipse-7"></div>
        <div className="ellipse-8"></div>
        <div className="ellipse-9"></div>
        <div className="ellipse-10"></div>
        <div className="ellipse-11"></div>
        <div className="ellipse-12"></div>
      </div>
      <img className="vector-1" src="vector-10.svg" />
      <div className="hi-anna-i-see-you-re-currently-in-a-very-busy-place-i-ve-enabled-chat-mode-so-that-you-can-talk-to-me-with-ease-privately">
        Hi Anna, I see you’re currently in a very busy place. I’ve enabled chat
        mode so that you can talk to me with ease, privately.{" "}
      </div>
      <div className="frame-1">
        <div className="ellipse-52"></div>
        <div className="ellipse-62"></div>
        <div className="ellipse-72"></div>
      </div>
      <div className="tell-me-what-s-on-your-mind">
        Tell me, what’s on your mind?{" "}
      </div>
      <OrbsV3Property1Variant4
        property1="variant-4"
        className="orbs-v-3-instance"
      ></OrbsV3Property1Variant4>
      <KeyboardIPhoneTypeDefault
        visibleComponent={false}
        visibleComponent2={false}
        visibleComponent3={false}
        className="keyboard-i-phone-instance"
      ></KeyboardIPhoneTypeDefault>
      <div className="keyboard-text-inputs">
        <div className="frame-14">
          <div className="frame-12">
            <div className="iconset-full-screen">
              <img className="iconset-add" src="iconset-add0.svg" />
            </div>
          </div>
          <div className="frame-10">
            <div className="div">| </div>
          </div>
          <div className="frame-142">
            <div className="iconset-full-screen2">
              <img
                className="voice-mail-mic-audio-mike-music-microphone"
                src="voice-mail-mic-audio-mike-music-microphone0.svg"
              />
            </div>
            <img className="iconset-arrow-up" src="iconset-arrow-up0.svg" />
          </div>
        </div>
      </div>
    </div>
  );
};
