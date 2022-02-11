import "../styles/app.css";
import React, { useState, useEffect } from "react";
import Home from "./Home.jsx";
import ExperimentExpandedCard from "./ExperimentExpandedCard.jsx";
import ShowModal from "./ShowModal.jsx";

export const ModalContext = React.createContext();
export const ExperimentContext = React.createContext();
export const ExperimentExpandedCardContext = React.createContext();

function App() {
  const emptyExperiments = [{ experiment_name: null, experiment_track: null }];

  const [experiments, setExperiments] = useState({
    passedExperiments: emptyExperiments,
    runningExperiments: emptyExperiments,
    readyExperiments: emptyExperiments,
    upcomingExperiments: emptyExperiments,
    isLoading: true,
  });
  const [showModal, setShowModal] = useState(null);
  const [experimentExpandedCard, setExperimentExpandedCard] = useState(null);

  const handleShow = (type) => {
    setShowModal(type);
  };

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
        const runningExperiments = await fetch(
          "api/v0/resources/experiments?status=running"
        ).then((res) => res.json());
        const readyExperiments = await fetch(
          "api/v0/resources/experiments?status=ready"
        ).then((res) => res.json());
        const upcomingExperiments = await fetch(
          "api/v0/resources/experiments?status=upcoming"
        ).then((res) => res.json());
        setExperiments({
          passedExperiments: passedExepriments,
          runningExperiments: runningExperiments,
          readyExperiments: readyExperiments,
          upcomingExperiments: upcomingExperiments,
          isLoading: false,
        });
        console.log(experiments);
      };
      fetchData();
    },
    [experiments.isLoading]
  );

  if (experimentExpandedCard == null) {
    if (showModal == null) {
      return (
        <ExperimentExpandedCardContext.Provider
          value={experimentExpandedCardStatus}
        >
          <ModalContext.Provider value={modalStatus}>
            <ExperimentContext.Provider value={experimentsStatus}>
              <Home onClick={(type) => handleShow(type)} />
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
              <ShowModal type={showModal} />
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
