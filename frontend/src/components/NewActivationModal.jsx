import React, { useContext } from "react";
import { Form, Modal, Button } from "react-bootstrap";
import "../styles/experiment-form.css";
import ExperimentContext from "./ExperimentContext.jsx";

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

function NewActivationModal(props) {
  const { selectedExperiment } = useContext(ExperimentContext);
  const addActivation = async (formValues) => {
    console.log(formValues);
    await fetch("/api/v0/activation/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formValues),
    });
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    const formValues = {
      experiment_track: selectedExperiment.experiment_track,
    };
    Array.from(event.target).forEach((item) => {
      if (!item.id) return;
      formValues[item.id] = item.value;
    });
    if (!validateForm(formValues)) return alert("form is not valid");
    addActivation(formValues);
    props.handleClose();
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
        onClick={props.handleClose}
      >
        <Modal.Title className="new-experiment-form-secondary">
          Activate Expriment
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="new-experiment-form-border-style new-experiment-form-background new-experiment-form-primary">
        <Form onSubmit={handleSubmit}>
          <FormRow name="activation_id">Activation Number</FormRow>
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
}

export default NewActivationModal;
