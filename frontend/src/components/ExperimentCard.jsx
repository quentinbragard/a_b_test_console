import React, { useContext } from "react";
import { Card, CardBody, CardTitle, CardSubtitle } from "reactstrap";
import { ExperimentExpandedCardContext } from "./App.jsx";
import "../styles/experiment-card.css";

function ExperimentCard(props) {
  const { setExperimentExpandedCard } = useContext(
    ExperimentExpandedCardContext
  );
  const handleCick = (experiment) => {
    setExperimentExpandedCard(experiment);
    console.log(experiment);
  };
  const findRemainingDays = (experiment) => {
    const start_date = new Date(props.experiment.start_date);
    const end_date = new Date(props.experiment.end_date);
    var diff = new Date(end_date.getTime() - start_date.getTime());
    console.log(typeof diff);
    return diff.getUTCDate() - 1;
  };

  if (props.experiment.status === "running") {
    return (
      <div
        key={props.track}
        style={{ margin: "5%" }}
        onClick={() => handleCick(props.experiment)}
      >
        <Card className="experiment-card">
          <CardBody>
            <CardTitle className="experiment-title">
              {props.experiment.experiment_name}
            </CardTitle>
            <CardSubtitle className="experiment-subtitle">
              {props.experiment.experiment_track}
            </CardSubtitle>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: "5%",
              }}
            >
              <div className="experiment-card-info-tag">
                {props.experiment.step}
              </div>
              <div className="experiment-card-info-tag">
                {props.experiment.platform}
              </div>
              <div className="experiment-card-info-tag">
                {props.experiment.version}
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div className="experiment-card-positive-result-tag"></div>
              <div className="experiment-card-positive-result-tag"></div>
              <div className="experiment-card-positive-result-tag"></div>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: "5%",
              }}
            >
              <div className="experiment-card-negative-result-tag"></div>
              <div className="experiment-card-negative-result-tag"></div>
            </div>
            <div className="experiment-activation-info-list">
              {" "}
              Activation: {props.experiment.experiment_activation}
            </div>
            <div className="experiment-activation-info-list">
              {" "}
              Remaining Days: {findRemainingDays(props.experiment)}
            </div>
          </CardBody>
        </Card>
      </div>
    );
  } else {
    return (
      <div
        key={props.track}
        style={{ margin: "5%" }}
        onClick={() => handleCick(props.experiment)}
      >
        <Card className="experiment-card">
          <CardBody>
            <CardTitle className="experiment-title">
              {props.experiment.experiment_name}
            </CardTitle>
            <CardSubtitle className="experiment-subtitle">
              {props.experiment.experiment_track}
            </CardSubtitle>
            <div style={{ display: "flex", justifyContent: "center" }}></div>
          </CardBody>
        </Card>
      </div>
    );
  }
}

export default ExperimentCard;
