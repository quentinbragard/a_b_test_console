import React, { useContext, useEffect } from "react";
import { Col, Row, Spinner } from "react-bootstrap";
import ExperimentCard from "./ExperimentCard.jsx";
import "../styles/index.css";
import ExperimentContext from "./ExperimentContext.jsx";

const ExperimentPanel = () => {
  const {
    passedExperiments,
    runningExperiments,
    readyExperiments,
    upcomingExperiments,
    loading,
  } = useContext(ExperimentContext);

  if (loading)
    return (
      <div>
        <Row style={{ height: "100vh" }} className="justify-content-md-center">
          <Spinner
            animation="border"
            variant="light"
            style={{ marginTop: "auto", marginBottom: "auto" }}
          />
        </Row>
      </div>
    );

  return (
    <div>
      <Row style={{ height: "100vh" }} className="justify-content-md-center">
        <Col className="experiment-column">
          <div className="column-title">Passed Experiments</div>
          {passedExperiments.map((experiment) => {
            return (
              <ExperimentCard
                key={experiment.experiment_track}
                experiment={experiment}
              />
            );
          })}
        </Col>
        <Col className="experiment-column">
          <div className="column-title">Running Experiments</div>
          {runningExperiments.map((experiment) => {
            return (
              <ExperimentCard
                key={experiment.experiment_track}
                experiment={experiment}
              />
            );
          })}
        </Col>
        <Col className="experiment-column">
          <div className="column-title">Ready Experiments</div>
          {readyExperiments.map((experiment) => {
            return (
              <ExperimentCard
                key={experiment.experiment_track}
                experiment={experiment}
              />
            );
          })}
        </Col>
        <Col className="experiment-column">
          <div className="column-title">Upcoming Experiments</div>
          {upcomingExperiments.map((experiment) => {
            return (
              <ExperimentCard
                key={experiment.experiment_track}
                experiment={experiment}
              />
            );
          })}
        </Col>
      </Row>
    </div>
  );
};

export default ExperimentPanel;
