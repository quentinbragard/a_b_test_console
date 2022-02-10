import React, { useContext } from "react";
import { Col, Row, Spinner } from "react-bootstrap";
import ExperimentCard from "./ExperimentCard.jsx";
import "../styles/index.css";
import { ExperimentContext } from "./App.jsx";

function ExperimentPanel(props) {
  const { experiments } = useContext(ExperimentContext);

  if (experiments.isLoading) {
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
  } else {
    return (
      <div>
        <Row style={{ height: "100vh" }} className="justify-content-md-center">
          <Col className="experiment-column">
            <div className="column-title">Passed Experiments</div>
            {experiments.passedExperiments.map((experiment) => {
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
            {experiments.runningExperiments.map((experiment) => {
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
            {experiments.upcomingExperiments.map((experiment) => {
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
  }
}

export default ExperimentPanel;
