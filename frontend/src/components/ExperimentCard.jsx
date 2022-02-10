import React, { useContext } from "react";
import { Card, CardBody, CardTitle, CardSubtitle } from "reactstrap";
import { ExperimentExpandedCardContext } from "./App.jsx";

function ExperimentCard(props) {
  const { setExperimentExpandedCard } = useContext(
    ExperimentExpandedCardContext
  );
  const handleCick = (experiment) => {
    setExperimentExpandedCard(experiment);
    console.log(experiment);
  };
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
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div className="experiment-platform">
              {props.experiment.platform}
            </div>
            <div className="experiment-version">{props.experiment.version}</div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

export default ExperimentCard;
