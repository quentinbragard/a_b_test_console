import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Row, CloseButton, Col } from "react-bootstrap";
import { Card, CardBody, CardTitle } from "reactstrap";
import ExperimentContext from "./ExperimentContext.jsx";
import NewActivationModal from "./NewActivationModal.jsx";
import ExpandedExperimentInfoCard from "./ExpandedExperimentInfoCard.jsx";
import ExpandedExperimentLinksCard from "./ExpandedExperimentLinksCard.jsx";
import "../styles/expanded-experiment.css";

const FirstActivationColumn = (props) => (
  <>
    <div
      style={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      <button
        onClick={props.handleActivation}
        className="enabled-experiment-btn"
      >
        {" "}
        Activate Experiment{" "}
      </button>
      <button
        onClick={props.handleUpdateStatus}
        className="enabled-experiment-btn"
      >
        {" "}
        Update Step{" "}
      </button>
    </div>
    <Card className="expanded-experiment-information-card">
      <CardBody>
        <CardTitle className="experiment-title">
          Experiment Information
        </CardTitle>
        <ExpandedExperimentInfoCard experiment={props.experiment} />
      </CardBody>
    </Card>
    <Card className="expanded-experiment-information-card">
      <CardBody>
        <CardTitle className="experiment-title">Useful Links</CardTitle>
        <ExpandedExperimentLinksCard experiment={props.experiment} />
      </CardBody>
    </Card>
  </>
);

const ExpandedExperimentCard = () => {
  const [showNewActivationModal, setShowNewActivationModal] = useState(false);
  const {
    selectedExperiment,
    setSelectedExperiment,
    updateExperiment,
    updateActivation,
  } = useContext(ExperimentContext);
  const updateStatus = async (experiment) => {
    if (typeof experiment.activation_id === "undefined") {
      let value = prompt("Please enter the new step for this experiment");
      if (value != null) {
        let updated_info = {
          experiment_track: experiment.experiment_track,
          step: value,
        };
        await updateExperiment(updated_info);
      }
    } else {
      let value = prompt("Please enter the new step for this activation");
      if (value != null) {
        let updated_info = {
          activation_id: experiment.activation_id,
          step: value,
        };
        await updateActivation(updated_info);
      }
    }
  };
  const toggleShowNewActivationModal = () => {
    setShowNewActivationModal(!showNewActivationModal);
  };

  const navigate = useNavigate();
  const handleClose = () => {
    setSelectedExperiment(null);
    navigate("/");
  };

  return (
    <>
      <h1 className="expanded-experiment-title">
        {selectedExperiment.experiment_name}
      </h1>
      <h2 className="expanded-experiment-subtitle">
        {selectedExperiment.experiment_track}
      </h2>
      <Row style={{ display: "flex", justifyContent: "center" }}>
        <Row className="expanded-experiment-container">
          <CloseButton
            style={{ marginTop: "0.8%", marginLeft: "0.8%" }}
            onClick={handleClose}
          />

          {showNewActivationModal ? (
            <Col className="expanded-experiment-information-card-column">
              <NewActivationModal handleClose={toggleShowNewActivationModal} />
            </Col>
          ) : (
            <>
              <Col className="expanded-experiment-information-card-column">
                <FirstActivationColumn
                  handleActivation={toggleShowNewActivationModal}
                  handleUpdateStatus={() => updateStatus(selectedExperiment)}
                  experiment={selectedExperiment}
                />
              </Col>
              <Col className="significant-results-column">
                <Row
                  style={{
                    height: "90%",
                    marginTop: "10%",
                    display: "flex",
                  }}
                >
                  <Col
                    style={{
                      borderRight: "1px solid",
                    }}
                  >
                    <img
                      src={require("../img/positive_metrics_emoji.png")}
                      className="emoji-img"
                      alt=""
                    />
                  </Col>
                  <Col>
                    {" "}
                    <img
                      src={require("../img/negative_metrics_emoji.png")}
                      className="emoji-img"
                      alt=""
                    />
                  </Col>
                </Row>
              </Col>
              <Col
                className="experiment-images-column"
                style={{ display: "flex", justifyContent: "center" }}
              >
                <img
                  src={require("../img/experiment_img.png")}
                  className="screen-img"
                  alt=""
                />
              </Col>
            </>
          )}
        </Row>
      </Row>
    </>
  );
};

export default ExpandedExperimentCard;
