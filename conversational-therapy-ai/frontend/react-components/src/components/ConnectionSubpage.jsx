import React from "react";
import "./ConnectionSubpage.css";

export const ConnectionSubpage = ({ className, onBackClick, ...props }) => {
  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    }
  };

  return (
    <div className={"connection-subpage " + (className || "")}>
      <img className="vector-2138" src="vector-21380.svg" alt="Background Vector 1" />
      <img className="vector-2139" src="vector-21390.svg" alt="Background Vector 2" />
      <img className="blob-4" src="blob-40.svg" alt="Background Blob" />
      <div className="ellipse-40"></div>
      
      <div className="connection-page-cards">
        <div className="card-your-social-orbit">
          <div className="title-your-social-orbit">
            <div className="icon-link">🌏</div>
            <div className="title">Your Social Orbit</div>
          </div>
          <div className="social-orbit-graphic">
            <div className="social-orbit-graphic2">
              <div className="social-circle-graph">
                <img
                  className="graphic-social-circle"
                  src="graphic-social-circle0.svg"
                  alt="Social Circle Graphic"
                />
                <div className="graphic-you">
                  <div className="you">You</div>
                  <div className="ellipse-43"></div>
                </div>
              </div>
              <div className="graphic-you2">
                <div className="frame-94">
                  <div className="friends">Friends</div>
                </div>
              </div>
              <div className="graphic-network">
                <div className="frame-94">
                  <div className="network">Network</div>
                </div>
              </div>
              <div className="graphic-partner">
                <div className="frame-94">
                  <div className="partner">Partner</div>
                </div>
              </div>
            </div>
          </div>
          <img className="divider-line" src="divider-line0.svg" alt="Divider" />
          <div className="body-copy">
            <div className="lots-of-energy-has-gone-into-your-outer-world-lately-no-pressure-but-a-small-check-in-with-close-ones-might-feel-grounding">
              <span>
                <span className="lots-of-energy-has-gone-into-your-outer-world-lately-no-pressure-but-a-small-check-in-with-close-ones-might-feel-grounding-span">
                  Lots of energy has gone into your outer world lately.
                  <br />
                  No pressure—but a small check-in with close ones might feel
                </span>
                <span className="lots-of-energy-has-gone-into-your-outer-world-lately-no-pressure-but-a-small-check-in-with-close-ones-might-feel-grounding-span2">
                  grounding
                </span>
                <span className="lots-of-energy-has-gone-into-your-outer-world-lately-no-pressure-but-a-small-check-in-with-close-ones-might-feel-grounding-span">
                  .
                </span>
              </span>
            </div>
          </div>
          <div className="timestamp">
            <div className="last-update-9-44">Last Update: 9:44</div>
          </div>
        </div>
        
        <div className="card-insight">
          <div className="icon-title">
            <div className="div">💌</div>
            <div className="suggested-connection-reset">Suggested Connection Reset</div>
          </div>
          <div className="suggestion-block">
            <div className="pill-label-ai">
              <img
                className="bard-line-streamline-remix-line"
                src="bard-line-streamline-remix-line0.svg"
                alt="AI Icon"
              />
              <div className="ai-suggestion">AI Suggestion</div>
            </div>
            <div className="suggestion-text">
              <div className="you-haven-t-spoken-to-partner-friend-in-a-while-want-help-drafting-a-gentle-check-in">
                You haven't spoken to [Partner/Friend] in a while. Want help
                drafting a gentle check-in?"
              </div>
            </div>
            <div className="frame-76">
              <div className="frame-74">
                <div className="frame-73">
                  <div className="draft">Draft</div>
                </div>
              </div>
              <div className="frame-75">
                <div className="frame-65">
                  <div className="hey-just-wanted-to-check-in-it-s-been-a-full-week-on-my-end-but-i-ve-been-thinking-of-you">
                    Hey, just wanted to check in — it's been a full week on my end,
                    but I've been thinking of you.
                  </div>
                </div>
              </div>
            </div>
            <div className="frame-100">
              <div className="frame-732">
                <img
                  className="edit-square-fill-streamline-rounded-fill-material-symbols"
                  src="edit-square-fill-streamline-rounded-fill-material-symbols0.svg"
                  alt="Edit"
                />
              </div>
              <div className="frame-77">
                <img
                  className="send-fill-streamline-rounded-fill-material-symbols"
                  src="send-fill-streamline-rounded-fill-material-symbols0.svg"
                  alt="Send"
                />
              </div>
            </div>
          </div>
          <img className="vector-27" src="vector-270.svg" alt="Vector" />
          <div className="memroy-label-ai">
            <div className="notebook-fill-streamline-outlined-fill-material-pro">
              <img className="notebook-fill" src="notebook-fill0.svg" alt="Notebook" />
            </div>
            <div className="you-ve-told-me-janet-makes-you-feel-more-like-yourself">
              You've told me Janet makes you feel more like yourself.
            </div>
          </div>
        </div>
        
        <div className="card-reflect">
          <div className="section-title">
            <div className="div">🎙️</div>
            <div className="leave-a-note-for-later">Leave a Note for Later</div>
          </div>
          <div className="insight-label">
            <div className="you-mentioned-missing-sam-three-days-ago-want-to-check-in-today">
              You mentioned missing Sam three days ago. Want to check in today?
            </div>
          </div>
          <div className="memroy-label-ai">
            <div className="notebook-fill-streamline-outlined-fill-material-pro">
              <img className="notebook-fill2" src="notebook-fill1.svg" alt="Notebook" />
            </div>
            <div className="orb-will-keep-your-response-in-mind-it-may-be-brought-up-when-relevant">
              Orb will keep your response in mind — it may be brought up when
              relevant.
            </div>
          </div>
          <div className="button-type-audio">
            <div className="button-type">
              <div className="voice-input">Voice Input</div>
            </div>
            <div className="button-voice">
              <img
                className="pencil-streamline-lucide-line"
                src="pencil-streamline-lucide-line0.svg"
                alt="Pencil"
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="frame-91">
        <img 
          className="frame-772" 
          src="frame-771.svg" 
          alt="Back"
          onClick={handleBackClick}
          style={{ cursor: 'pointer' }}
        />
        <div className="label-subpage-connection">
          <div className="connection">Connection</div>
        </div>
        <div className="button-more-options">
          <div className="ellipse-5"></div>
          <div className="ellipse-6"></div>
          <div className="ellipse-7"></div>
        </div>
      </div>
    </div>
  );
};

export default ConnectionSubpage;