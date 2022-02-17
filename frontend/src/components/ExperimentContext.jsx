import "../styles/app.css";
import React, { useState } from "react";
import { useEffect } from "react";

const emptyExperiments = {
  passedExperiments: [],
  runningExperiments: [],
  readyExperiments: [],
  upcomingExperiments: [],
};
const ExperimentContext = React.createContext({
  ...emptyExperiments,
  isLoading: false,
});

export const ExperimentContextProvider = ({ children }) => {
  const [passedExperiments, setPassedExperiments] = useState([]);
  const [runningExperiments, setRunningExperiments] = useState([]);
  const [readyExperiments, setReadyExperiments] = useState([]);
  const [upcomingExperiments, setUpcomingExperiments] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedExperiment, setSelectedExperiment] = useState(null);

  const fetchExperiments = async () => {
    setLoading(true);
    const passedExperimentsPromise = fetch(
      "/api/v0/resources/experiments?status=passed"
    );
    const runningExperimentsPromise = fetch(
      "/api/v0/resources/experiments?status=running"
    );
    const readyExperimentsPromise = fetch(
      "/api/v0/resources/experiments?status=ready"
    );
    const upcomingExperimentsPromise = fetch(
      "/api/v0/resources/experiments?status=upcoming"
    );

    await Promise.all([
      passedExperimentsPromise,
      runningExperimentsPromise,
      readyExperimentsPromise,
      upcomingExperimentsPromise,
    ]).then((responses) => {
      responses.forEach(async (response) => {
        const experiments = await response.json();
        const status = experiments[0]?.status;
        switch (status) {
          case "passed":
            setPassedExperiments(experiments);
            break;
          case "ready":
            setReadyExperiments(experiments);
            break;
          case "running":
            setRunningExperiments(experiments);
            break;
          case "upcoming":
            setUpcomingExperiments(experiments);
            break;
          default:
            break;
        }
      });
    });
    setLoading(false);
  };
  useEffect(async () => fetchExperiments(), []);

  const addExperiment = async (formValues) => {
    setLoading(true);
    await fetch("/api/v0/experiment/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formValues),
    });
    fetchExperiments();
  };

  const deleteExperiment = async (experiment_track) => {
    setLoading(true);
    await fetch("/api/v0/experiment/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: experiment_track,
    });
    fetchExperiments();
  };

  const deleteActivation = async (activation_info) => {
    setLoading(true);
    await fetch("/api/v0/activation/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(activation_info),
    });
    fetchExperiments();
  };
  const updateExperiment = async (updated_info) => {
    console.log(updated_info);
    await fetch("/api/v0/experiment/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updated_info),
    });
    fetchExperiments();
  };
  const updateActivation = async (updated_info) => {
    console.log(updated_info);
    await fetch("/api/v0/activation/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updated_info),
    });
    fetchExperiments();
  };

  return (
    <ExperimentContext.Provider
      value={{
        passedExperiments,
        runningExperiments,
        readyExperiments,
        upcomingExperiments,
        loading,
        setLoading,
        selectedExperiment,
        setSelectedExperiment,
        fetchExperiments,
        addExperiment,
        deleteExperiment,
        deleteActivation,
        updateExperiment,
        updateActivation,
      }}
    >
      {children}
    </ExperimentContext.Provider>
  );
};

export default ExperimentContext;
