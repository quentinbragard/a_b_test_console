import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import PassedExperimentCard from "./PassedExperimentCard.jsx";
import RunningExperimentCard from "./RunningExperimentCard.jsx";
import ReadyExperimentCard from "./ReadyExperimentCard.jsx";
import UpcomingExperimentCard from "./UpcomingExperimentCard.jsx";
import ExperimentContext from "./ExperimentContext.jsx";
import "../styles/experiment-card.css";

const getExperimentCardComponent = (experiment) => {
  switch (experiment.status) {
    case "passed":
      return PassedExperimentCard;
    case "running":
      return RunningExperimentCard;
    case "ready":
      return ReadyExperimentCard;
    case "upcoming":
      return UpcomingExperimentCard;
  }
};

const ExperimentCard = ({ experiment, track }) => {
  const ExperimentCardComponent = getExperimentCardComponent(experiment);
  const { setSelectedExperiment, deleteExperiment, deleteActivation } =
    useContext(ExperimentContext);
  const navigate = useNavigate();

  const handleCloseExperiment = async (experiment) => {
    const confirmBox = window.confirm(
      "Do you really want to delete this Experiment?"
    );
    if (confirmBox === true) {
      deleteExperiment(experiment.experiment_track);
    }
  };

  const handleCloseActivation = async (experiment) => {
    const confirmBox = window.confirm(
      "Do you really want to delete this Activation?"
    );
    if (confirmBox === true) {
      deleteActivation({
        activation_id: experiment.activation_id,
        experiment_track: experiment.experiment_track,
      });
    }
  };

  const handleClick = () => {
    setSelectedExperiment(experiment);
    navigate(
      `/experiments/${experiment.experiment_track}-${experiment.activation_id}`
    );
  };

  return (
    <ExperimentCardComponent
      track={track}
      experiment={experiment}
      onClick={handleClick}
      onClose={
        experiment.status === "running" || experiment.status === "passed"
          ? () => handleCloseActivation(experiment)
          : () => handleCloseExperiment(experiment)
      }
    />
  );
};

export default ExperimentCard;
