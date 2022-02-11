import React from "react";
import { Col, Row } from "react-bootstrap";
import ConsoleControlerButton from "./ConsoleControlerButton.jsx";
import ExperimentPanel from "./ExperimentPanel.jsx";
import "../styles/controler-button.css";

function Home(props) {
  return (
    <Row>
      <Col style={{ position: "relative" }}>
        <Row className="controler-button-column">
          <ConsoleControlerButton
            className="new-experiment-btn"
            buttonName="+ Add new experiment"
            handleClick={() => props.onClick("new")}
          />
          <ConsoleControlerButton
            className="new-experiment-btn"
            buttonName="Activate existing experiment"
            handleClick={() => props.onClick("activate")}
          />
          <img
            src={require("../img/zenly-globe.png")}
            className="zenly-globe"
            alt=""
          />
        </Row>
      </Col>
      <Col style={{ flex: 5 }}>
        <ExperimentPanel />
      </Col>
    </Row>
  );
}

export default Home;
