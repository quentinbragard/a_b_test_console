import React from "react";
import { Card, CardBody, CardTitle, CardSubtitle } from "reactstrap";
import { CloseButton } from "react-bootstrap";
import ExperimentDescription from "./ExperimentDescription.jsx";
import ExperimentPlatform from "./ExperimentPlatform.jsx";
import "../styles/experiment-card.css";

function ReadyExperimentCard(props) {
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
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div className="experiment-card-info-tag">
              {props.experiment.step}
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <ExperimentPlatform platform={props.experiment.platform} />
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <ExperimentDescription
              description={props.experiment.experiment_description}
            />
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

export default ReadyExperimentCard;
