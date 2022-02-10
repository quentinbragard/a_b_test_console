import "../styles/index.css";
import React, { useState, useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import ExperimentFormModal from "./ExperimentFormModal";
import ExperimentPanel from "./ExperimentPanel.jsx";
import ExperimentExpandedCard from "./ExperimentExpandedCard.jsx";
import ConsoleControlerButton from "./ConsoleControlerButton.jsx";

export const ModalContext = React.createContext();
export const ExperimentContext = React.createContext();
export const ExperimentExpandedCardContext = React.createContext();

function App() {
  const emptyExperiments = [{ experiment_name: null, experiment_track: null }];

  const [experiments, setExperiments] = useState({
    passedExperiments: emptyExperiments,
    runningExperiments: emptyExperiments,
    upcomingExperiments: emptyExperiments,
    isLoading: true,
  });
  const [showModal, setShowModal] = useState(false);
  const [experimentExpandedCard, setExperimentExpandedCard] = useState(null);

  const handleShow = () => setShowModal(true);

  const experimentsStatus = { experiments, setExperiments };
  const modalStatus = { showModal, setShowModal };
  const experimentExpandedCardStatus = {
    experimentExpandedCard,
    setExperimentExpandedCard,
  };

  useEffect(() => {
    document.title = "A/B Test Monitoring Console";
  }, []);

  useEffect(
    (experiments) => {
      const fetchData = async () => {
        const passedExepriments = await fetch(
          "api/v0/resources/experiments?status=passed"
        ).then((res) => res.json());
        console.log(passedExepriments);
        const runningExperiments = await fetch(
          "api/v0/resources/experiments?status=running"
        ).then((res) => res.json());
        const upcomingExperiments = await fetch(
          "api/v0/resources/experiments?status=upcoming"
        ).then((res) => res.json());
        setExperiments({
          passedExperiments: passedExepriments,
          runningExperiments: runningExperiments,
          upcomingExperiments: upcomingExperiments,
          isLoading: false,
        });
      };
      fetchData();
    },
    [experiments.isLoading]
  );

  if (experimentExpandedCard == null) {
    if (!showModal) {
      return (
        <ExperimentExpandedCardContext.Provider
          value={experimentExpandedCardStatus}
        >
          <ModalContext.Provider value={modalStatus}>
            <ExperimentContext.Provider value={experimentsStatus}>
              <Row>
                <Col style={{ position: "relative" }}>
                  <Row className="controler-button-column">
                    <ConsoleControlerButton
                      className="new-experiment-btn"
                      handleClick={() => handleShow()}
                    />
                    <img
                      src={require("../img/zenly-globe.png")}
                      className="zenly-globe"
                      alt=""
                    />
                  </Row>
                </Col>
                <Col style={{ flex: 2 }}>
                  <ExperimentPanel />
                </Col>
              </Row>
            </ExperimentContext.Provider>
          </ModalContext.Provider>
        </ExperimentExpandedCardContext.Provider>
      );
    } else {
      return (
        <ExperimentExpandedCardContext.Provider
          value={experimentExpandedCardStatus}
        >
          <ModalContext.Provider value={modalStatus}>
            <ExperimentContext.Provider value={experimentsStatus}>
              <Row>
                <Col>
                  <Row className="controler-button-column">
                    <ExperimentFormModal />
                  </Row>
                </Col>
                <Col style={{ flex: 2 }}>
                  <ExperimentPanel />
                </Col>
              </Row>
            </ExperimentContext.Provider>
          </ModalContext.Provider>
        </ExperimentExpandedCardContext.Provider>
      );
    }
  } else {
    return (
      <ExperimentExpandedCardContext.Provider
        value={experimentExpandedCardStatus}
      >
        <ExperimentExpandedCard />
      </ExperimentExpandedCardContext.Provider>
    );
  }
}

export default App;
