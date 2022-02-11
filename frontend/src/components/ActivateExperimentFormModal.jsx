import React, { useContext } from "react";
import { Form, Modal, Button } from "react-bootstrap";
import "../styles/experiment-form.css";
import { ModalContext, ExperimentContext } from "./App.jsx";

const validateForm = (values) => {
  const notCompulsoryKeys = ["included_countries", "excluded_countries"];
  if (
    Object.keys(values).some(
      (key) => !values[key] && !notCompulsoryKeys.includes(key)
    )
  ) {
    return false;
  }
  return true;
};

const ActivateExperimentFormModal = () => {
  const emptyExperiments = [{ experiment_name: null, experiment_track: null }];
  const { setShowModal } = useContext(ModalContext);
  const { setExperiments } = useContext(ExperimentContext);
  const handleClose = () => setShowModal(null);
  const handleSubmit = (event) => {
    event.preventDefault();
    const formValues = {};
    Array.from(event.target).forEach((item) => {
      if (!item.id) return;
      formValues[item.id] = item.value;
    });
    if (!validateForm(formValues)) return alert("form is not valid");

    fetch("/api/v0/activate/experiment/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formValues),
    });
    setExperiments({
      passedExperiments: emptyExperiments,
      runningExperiments: emptyExperiments,
      readyExperiments: emptyExperiments,
      upcomingExperiments: emptyExperiments,
      isLoading: true,
    });
  };

  const FormRow = ({ children, type = "text", name }) => (
    <Form.Group className="mb-3" controlId={name}>
      <Form.Label>{children}</Form.Label>
      <Form.Control className="new-experiment-form-secondary" type={type} />
    </Form.Group>
  );
  return (
    <Modal.Dialog>
      <Modal.Header
        className="new-experiment-form-border-style  new-experiment-form-secondary"
        closeButton
        onClick={handleClose}
      >
        <Modal.Title className="new-experiment-form-secondary">
          Activate Expriment
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="new-experiment-form-border-style new-experiment-form-background new-experiment-form-primary">
        <Form onSubmit={handleSubmit}>
          <FormRow name="experiment_track">Experiment Track</FormRow>
          <FormRow name="activation_number">Activation Number</FormRow>
          <FormRow name="platform">Platform</FormRow>
          <FormRow name="version">Version</FormRow>
          <FormRow name="start_date" type="date">
            Start date
          </FormRow>
          <FormRow name="end_date" type="date">
            End date
          </FormRow>
          <FormRow name="included_countries">Included Countries</FormRow>
          <FormRow name="excluded_countries">Excluded Countries</FormRow>
          <Button
            className="new-experiment-btn"
            variant="primary"
            type="submit"
            style={{ fontWeight: "bold" }}
          >
            Submit
          </Button>
        </Form>
      </Modal.Body>
    </Modal.Dialog>
  );
};

export default ActivateExperimentFormModal;
