import React from "react";
import "../styles/experiment-card.css";

function ExperimentDescription(props) {
  const shorten = (description) => {
    const maxSize = 100;
    let shortDescription = description.slice(0, maxSize);
    let i = maxSize;
    while (i >= 1) {
      if (shortDescription.slice(-1) === " ") {
        shortDescription = description.slice(0, i);
        i = -1;
      } else {
        i = i - 1;
        shortDescription = description.slice(0, i);
      }
    }
    return shortDescription;
  };
  if (props.description.length > 100) {
    return (
      <div className="experiment-info-list experiment-description">
        {shorten(props.description)}
        <span>[...]</span>
      </div>
    );
  } else {
    return (
      <div className="experiment-info-list experiment-description">
        {props.description}
      </div>
    );
  }
}

export default ExperimentDescription;
