import React from "react";
import { Row, Col } from "react-bootstrap";

import "../styles/expanded-experiment.css";

function ExpandedExperimentLinksCard(props) {
  const expectedLinks = [
    "specs_link",
    "activation_link",
    "monitoring_dashboard_link",
    "tableau_metrics_link",
    "full_analysis_link",
  ];
  function getFilledAndUnfilledLinks(experiment) {
    let filledLinks = {};
    let unfilledLinks = [];
    for (const info in experiment) {
      if (expectedLinks.includes(info)) {
        filledLinks[info] = experiment[info];
      }
    }
    expectedLinks.forEach((link) => {
      if (!Object.keys(experiment).includes(link) && !link.includes("_1")) {
        unfilledLinks.push(link);
      }
    });
    return [filledLinks, unfilledLinks];
  }
  const allLinks = getFilledAndUnfilledLinks(props.experiment);
  const filledLinks = allLinks[0];
  const unfilledLinks = allLinks[1];

  return (
    <Row style={{ display: "flex", justifyContent: "center" }}>
      <Col style={{ display: "flex", flexDirection: "column" }}>
        {Object.keys(filledLinks).map((link) => {
          return (
            <a
              className="filled-info-tag"
              style={{ marginBottom: "5%" }}
              href="{filledLinks[link]}"
              key={"filled_" + link}
            >
              {link.replace(/_/g, " ")}
            </a>
          );
        })}
      </Col>
      <Col>
        {unfilledLinks.map((link) => {
          return (
            <div
              className="unfilled-info-tag"
              style={{ marginBottom: "5%" }}
              key={"unfilled_" + link}
            >
              {link.replace(/_/g, " ")}
            </div>
          );
        })}
      </Col>
    </Row>
  );
}

export default ExpandedExperimentLinksCard;
