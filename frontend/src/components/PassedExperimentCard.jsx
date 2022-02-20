import React from "react";
import { Card, CardBody, CardTitle, CardSubtitle } from "reactstrap";
import { CloseButton } from "react-bootstrap";
import ExperimentPlatform from "./ExperimentPlatform.jsx";
import "../styles/experiment-card.css";

function PassedExperimentCard(props) {
  const findRemainingDays = (experiment) => {
    const start_date = new Date(props.experiment.start_date);
    const end_date = new Date(props.experiment.end_date);
    var diff = new Date(end_date.getTime() - start_date.getTime());
    console.log(typeof diff);
    return diff.getUTCDate() - 1;
  };
  return (
    <div key={props.track} style={{ margin: "5%" }}>
      <Card className="experiment-card">
        <CloseButton className="close-card-button" onClick={props.onClose} />
        <CardBody onClick={props.onClick}>
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
            <div className="experiment-activation-info-tag">
              Activation {props.experiment.activation_id}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "5%",
            }}
          >
            {" "}
            <ExperimentPlatform platform={props.experiment.platform} />
          </div>
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
          <div className="experiment-info-list">
            {" "}
            Remaining Days: {findRemainingDays(props.experiment)}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

export default PassedExperimentCard;
