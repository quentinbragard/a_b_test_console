import React from "react";
import { Card, CardBody, CardTitle, CardSubtitle } from "reactstrap";
import { CloseButton } from "react-bootstrap";
import ExperimentDescription from "./ExperimentDescription.jsx";
import ExperimentPlatform from "./ExperimentPlatform.jsx";
import "../styles/experiment-card.css";

function ReadyExperimentCard(props) {
  function getFilledAndUnfilledInfo(experiment) {
    console.log(experiment);
    const infoTags = ["step"];
    const otherTags = [
      "experiment_track",
      "experiment_name",
      "status",
      "specs_link",
      "activation_link",
      "monitoring_dashboard_link",
      "metrics_dashboard_link",
      "number_of_activation",
      "is_on_iOS",
      "is_on_Android",
    ];
    let filledInfo = {};
    let unfilledInfo = [];
    for (const info in experiment) {
      if (infoTags.includes(info) && !["platform"].includes(info)) {
        filledInfo[info] = experiment[info];
      }
    }
    infoTags.forEach((info) => {
      if (
        !Object.keys(experiment).includes(info) &&
        !otherTags.includes(info) &&
        !info.includes("_1")
      ) {
        unfilledInfo.push(info);
      }
    });
    if (experiment.is_on_Android === false && experiment.is_on_iOS === false) {
      unfilledInfo.push("platform");
    } else {
      if (
        experiment.is_on_iOS === true &&
        experiment.planned_iOS_version == null
      ) {
        unfilledInfo.push("planned_iOS_version");
      }
      if (
        experiment.is_on_Android === true &&
        experiment.planned_Android_version == null
      ) {
        unfilledInfo.push("planned_Android_version");
      }
    }
    console.log(unfilledInfo);
    return [filledInfo, unfilledInfo];
  }

  const allInfo = getFilledAndUnfilledInfo(props.experiment);
  const filledInfo = allInfo[0];
  const unfilledInfo = allInfo[1];

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
          <div style={{ marginBottom: "5%" }}>
            {props.experiment.is_on_iOS === true &&
            props.experiment.is_on_Android === false ? (
              <ExperimentPlatform platform="iOS" />
            ) : props.experiment.is_on_iOS === false &&
              props.experiment.is_on_Android === true ? (
              <ExperimentPlatform platform="Android" />
            ) : props.experiment.is_on_iOS === true &&
              props.experiment.is_on_Android === true ? (
              <ExperimentPlatform platform="Both" />
            ) : (
              <></>
            )}
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            {Object.keys(filledInfo).map((info) => {
              return (
                <div
                  className="experiment-card-info-tag"
                  key={"filled_" + info}
                >
                  {filledInfo[info]}
                </div>
              );
            })}
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
