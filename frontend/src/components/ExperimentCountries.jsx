import React from "react";
import "../styles/experiment-card.css";

function ExperimentCountries(props) {
  console.log(props.included_countries.length);
  console.log(props.excluded_countries.length);
  if (
    props.included_countries.length === 0 &&
    props.excluded_countries.length === 0
  ) {
    return <div className="experiment-card-info-tag">all countries</div>;
  } else if (props.included_countries.length === 0) {
    return <div className="experiment-card-info-tag">excl. countries</div>;
  } else {
    return <div className="experiment-card-info-tag">incl. countries</div>;
  }
}

export default ExperimentCountries;
