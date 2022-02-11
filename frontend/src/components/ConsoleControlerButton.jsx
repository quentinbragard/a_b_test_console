import React from "react";
import "../styles/controler-button.css";

function ConsoleControlerButton(props) {
  return (
    <button className="new-experiment-btn" onClick={props.handleClick}>
      {props.buttonName}
    </button>
  );
}

export default ConsoleControlerButton;
