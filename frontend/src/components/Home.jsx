import "../styles/app.css";
import React, { useState, useContext } from "react";
import { Col, Row } from "react-bootstrap";
import ExperimentPanel from "./ExperimentPanel.jsx";
import NewExperimentModal from "./NewExperimentModal";
import ExperimentContext from "./ExperimentContext.jsx";
import Popup from "reactjs-popup";

const ZenlyGlobe = () => (
  <img src={require("../img/zenly-globe.png")} className="zenly-globe" alt="" />
);

const AddNewExperimentButton = ({ onClick }) => (
  <>
    <button onClick={onClick} className="enabled-experiment-btn">
      {" "}
      + Add new experiment{" "}
    </button>
  </>
);

const Home = () => {
  const { fetchExperiments } = useContext(ExperimentContext);
  const [showNewExperimentModal, setShowNewExperimentModal] = useState(false);
  const toggleShowNewExperimentModal = () => {
    setShowNewExperimentModal(!showNewExperimentModal);
    console.log(showNewExperimentModal);
  };

  return (
    <Row>
      <Col style={{ position: "relative" }}>
        <Row className="controler-button-column">
          {!showNewExperimentModal ? (
            <>
              <AddNewExperimentButton onClick={toggleShowNewExperimentModal} />
              <ZenlyGlobe />
            </>
          ) : (
            <NewExperimentModal handleClose={toggleShowNewExperimentModal} />
          )}
        </Row>
      </Col>
      <Col style={{ flex: 5 }}>
        <ExperimentPanel />
      </Col>
    </Row>
  );
};

export default Home;
