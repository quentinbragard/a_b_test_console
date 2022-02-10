import React, { useContext } from "react";
import { Form, Modal, Button } from "react-bootstrap";
import "../styles/index.css";
import { ModalContext, ExperimentContext } from "./App.jsx";

const validateForm = (values) => {
  const notCompulsoryKeys = [
    "start_date",
    "end_date",
    "platform",
    "version",
    "included_countries",
    "excluded_countries",
  ];
  if (
    Object.keys(values).some(
      (key) => !values[key] && !notCompulsoryKeys.includes(key)
    )
  ) {
    return false;
  }
  return true;
};

const ExperimentFormModal = () => {
  const emptyExperiments = [{ experiment_name: null, experiment_track: null }];
  const { setShowModal } = useContext(ModalContext);
  const { setExperiments } = useContext(ExperimentContext);
  const handleClose = () => setShowModal(false);
  const handleSubmit = (event) => {
    event.preventDefault();
    const formValues = {};
    Array.from(event.target).forEach((item) => {
      if (!item.id) return;
      formValues[item.id] = item.value;
    });
    if (!validateForm(formValues)) return alert("form is not valid");

    fetch("/api/v0/add/experiment/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formValues),
    });
    setExperiments({
      passedExperiments: emptyExperiments,
      runningExperiments: emptyExperiments,
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
          Add New Expriment
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="new-experiment-form-border-style new-experiment-form-background new-experiment-form-primary">
        <Form onSubmit={handleSubmit}>
          <FormRow name="experiment_name">Experiment Name</FormRow>
          <FormRow name="experiment_track">Experiment Track</FormRow>
          <FormRow name="platform">Platform</FormRow>
          <FormRow name="start_date" type="date">
            Start date
          </FormRow>
          <FormRow name="end_date" type="date">
            End date
          </FormRow>
          <FormRow name="version">Version</FormRow>
          <FormRow name="included_countries">Included Countries</FormRow>
          <FormRow name="excluded_countries">Excluded Countries</FormRow>
          <FormRow name="status">Status</FormRow>
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

export default ExperimentFormModal;
