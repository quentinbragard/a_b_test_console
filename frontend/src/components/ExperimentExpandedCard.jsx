import React, { useContext } from "react";
import { Row, CloseButton } from "react-bootstrap";
import { Card, CardBody, CardTitle, CardSubtitle } from "reactstrap";
import { ExperimentExpandedCardContext } from "./App.jsx";

function ExperimentExpandedCard(props) {
  const { experimentExpandedCard, setExperimentExpandedCard } = useContext(
    ExperimentExpandedCardContext
  );
  const handleClose = () => setExperimentExpandedCard(null);
  return (
    <Row>
      <Card className="experiment-card">
        <CloseButton onClick={handleClose} />
        <CardBody>
          <CardTitle className="experiment-title">
            {experimentExpandedCard.experiment_name}
          </CardTitle>
          <CardSubtitle className="experiment-subtitle">
            {experimentExpandedCard.experiment_track}
          </CardSubtitle>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div className="experiment-platform">
              {experimentExpandedCard.platform}
            </div>
            <div className="experiment-version">
              {experimentExpandedCard.version}
            </div>
          </div>
        </CardBody>
      </Card>
    </Row>
  );
}

export default ExperimentExpandedCard;
