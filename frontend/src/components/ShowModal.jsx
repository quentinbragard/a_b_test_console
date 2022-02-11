import React from "react";
import { Col, Row } from "react-bootstrap";
import NewExperimentFormModal from "./NewExperimentFormModal";
import ActivateExperimentFormModal from "./ActivateExperimentFormModal";
import ExperimentPanel from "./ExperimentPanel.jsx";

function ShowModal(props) {
  if (props.type === "new") {
    return (
      <Row>
        <Col>
          <Row className="controler-button-column">
            <NewExperimentFormModal />
          </Row>
        </Col>
        <Col style={{ flex: 5 }}>
          <ExperimentPanel />
        </Col>
      </Row>
    );
  } else if (props.type === "activate")
    return (
      <Row>
        <Col>
          <Row className="controler-button-column">
            <ActivateExperimentFormModal />
          </Row>
        </Col>
        <Col style={{ flex: 5 }}>
          <ExperimentPanel />
        </Col>
      </Row>
    );
}

export default ShowModal;
