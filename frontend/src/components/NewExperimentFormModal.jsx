import React, { useContext } from "react";
import { Form, Modal, Button } from "react-bootstrap";
import "../styles/experiment-form.css";
import { ModalContext, ExperimentContext } from "./App.jsx";

const validateForm = (values) => {
  const notCompulsoryKeys = [];
  if (
    Object.keys(values).some(
      (key) => !values[key] && !notCompulsoryKeys.includes(key)
    )
  ) {
    return false;
  }
  return true;
};

const NewExperimentFormModal = () => {
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
          Add New Expriment
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="new-experiment-form-border-style new-experiment-form-background new-experiment-form-primary">
        <Form onSubmit={handleSubmit}>
          <FormRow name="experiment_name">Experiment Name</FormRow>
          <FormRow name="experiment_track">Experiment Track</FormRow>
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

export default NewExperimentFormModal;
