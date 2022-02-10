import React from "react";
import "../styles/index.css";

function ConsoleControlerButton(props) {
  return (
    <button className="new-experiment-btn" onClick={props.handleClick}>
      + Add new experiment
    </button>
  );
}

export default ConsoleControlerButton;
