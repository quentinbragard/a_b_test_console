import React from "react";
import "../styles/experiment-card.css";

function ExperimentPlatform(props) {
  console.log(props.platform);
  if (props.platform === "Android") {
    return (
      <img
        className="experiment-platform-logo"
        src={require("../img/android_logo.png")}
        alt={props.platform}
      />
    );
  } else if (props.platform === "iOS") {
    return (
      <img
        className="experiment-platform-logo"
        src={require("../img/ios_logo.png")}
        alt={props.platform}
      />
    );
  } else if (props.platform === "Both") {
    return (
      <div>
        <img
          className="experiment-platform-logo"
          src={require("../img/android_logo.png")}
          alt={props.platform}
        />
        <img
          className="experiment-platform-logo"
          src={require("../img/ios_logo.png")}
          alt={props.platform}
        />
      </div>
    );
  } else {
    return <div className="experiment-card-missing-info-tag">platform</div>;
  }
}

export default ExperimentPlatform;
