import React from "react";
import { Card, CardBody, CardTitle, CardSubtitle } from "reactstrap";
import { CloseButton } from "react-bootstrap";
import ExperimentDescription from "./ExperimentDescription.jsx";
import ExperimentPlatform from "./ExperimentPlatform.jsx";
import ExperimentContext from "./ExperimentContext.jsx";
import "../styles/experiment-card.css";

function UpcomingExperimentCard(props) {
  if (
    props.experiment.is_on_iOS === false &&
    props.experiment.is_on_Android === false
  ) {
    return (
      <div key={props.track} style={{ margin: "5%" }}>
        <Card className="experiment-card">
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <CloseButton
              className="close-card-button"
              onClick={props.onClose}
            />
          </div>
          <CardBody onClick={props.onClick}>
            <CardTitle className="experiment-title">
              {props.experiment.experiment_name}
            </CardTitle>
            <CardSubtitle className="experiment-subtitle">
              {props.experiment.experiment_track}
            </CardSubtitle>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <ExperimentPlatform />
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
  } else {
    let platform = props.experiment.is_on_iOS ? "iOS" : "Android";
    platform =
      platform === "iOS" && props.experiment.is_on_Android ? "Both" : platform;
    return (
      <div key={props.track} style={{ margin: "5%" }}>
        <Card className="experiment-card">
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <CloseButton
              className="close-card-button"
              onClick={props.onClose}
            />
          </div>
          <CardBody onClick={props.onClick}>
            <CardTitle className="experiment-title">
              {props.experiment.experiment_name}
            </CardTitle>
            <CardSubtitle className="experiment-subtitle">
              {props.experiment.experiment_track}
            </CardSubtitle>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <ExperimentPlatform platform={platform} />
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
}

export default UpcomingExperimentCard;
