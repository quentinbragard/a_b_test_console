import React, { useContext } from "react";
import { Row, CloseButton, Col } from "react-bootstrap";
import { Card, CardBody, CardTitle, CardSubtitle } from "reactstrap";
import { ExperimentExpandedCardContext } from "./App.jsx";
import "../styles/expanded-experiment.css";

function ExperimentExpandedCard(props) {
  const { experimentExpandedCard, setExperimentExpandedCard } = useContext(
    ExperimentExpandedCardContext
  );
  const handleClose = () => setExperimentExpandedCard(null);
  return (
    <Row className="expanded-experiment-container">
      <CloseButton onClick={handleClose} />
      <Col className="expanded-experiment-information-card-column">
        <Card className="expanded-experiment-information-card">
          <CardBody>
            <CardTitle className="experiment-title">
              {experimentExpandedCard.experiment_name}
            </CardTitle>
            <CardSubtitle className="experiment-subtitle">
              {experimentExpandedCard.experiment_track}
            </CardSubtitle>
            <Row>
              <Col>
                <div className="filled-info-tag">
                  {experimentExpandedCard.platform}
                </div>
                <div className="filled-info-tag">
                  {experimentExpandedCard.platform}
                </div>
                <div className="filled-info-tag">
                  {experimentExpandedCard.platform}
                </div>
                <div className="filled-info-tag">
                  {experimentExpandedCard.platform}
                </div>
              </Col>
              <Col>
                <div className="unfilled-info-tag">Version</div>
                <div className="unfilled-info-tag">Version</div>
                <div className="unfilled-info-tag">Version</div>
                <div className="unfilled-info-tag">Version</div>
                <div className="unfilled-info-tag">Version</div>
                <div className="unfilled-info-tag">Version</div>
              </Col>
            </Row>
          </CardBody>
        </Card>
        <Card className="expanded-experiment-information-card">
          <CardBody>
            <CardTitle className="experiment-title">
              {experimentExpandedCard.experiment_name}
            </CardTitle>
            <CardSubtitle className="experiment-subtitle">
              {experimentExpandedCard.experiment_track}
            </CardSubtitle>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div className="filled-info-tag">
                {experimentExpandedCard.platform}
              </div>
              <div className="unfilled-info-tag">Version</div>
            </div>
          </CardBody>
        </Card>
        <Card className="expanded-experiment-information-card">
          <CardBody>
            <CardTitle className="experiment-title">
              {experimentExpandedCard.experiment_name}
            </CardTitle>
            <CardSubtitle className="experiment-subtitle">
              {experimentExpandedCard.experiment_track}
            </CardSubtitle>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div className="filled-info-tag">
                {experimentExpandedCard.platform}
              </div>
              <div className="unfilled-info-tag">Version</div>
            </div>
          </CardBody>
        </Card>
      </Col>
      <Col className="significant-results-column">
        <h1>significant-results-column</h1>
      </Col>
      <Col className="experiment-images-column">
        <h1>experiment-images-column</h1>
      </Col>
    </Row>
  );
}

export default ExperimentExpandedCard;
