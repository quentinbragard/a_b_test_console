import React, { useContext } from "react";
import { Row, Col } from "react-bootstrap";
import ReactHover, { Trigger, Hover } from "react-hover";
import ExperimentContext from "./ExperimentContext.jsx";
import "../styles/expanded-experiment.css";

function ExpandedExperimentInfoCard(props) {
  const { updateExperiment, selectedExperiment } =
    useContext(ExperimentContext);
  const infoTags = [
    "activation_id",
    "platform",
    "step",
    "start_date",
    "end_date",
    "version",
  ];
  const otherTags = [
    "experiment_track",
    "experiment_name",
    "specs_link",
    "activation_link",
  ];
  function formatInfoDate(infoDate) {
    let year = infoDate.getFullYear();
    let month = parseInt(infoDate.getMonth() + 1);
    if (month < 10) {
      month = "0" + month;
    }
    let day = infoDate.getDate();
    if (day < 10) {
      day = "0" + month;
    }
    return year + "-" + month + "-" + day;
  }
  function getFilledAndUnfilledInfo(experiment) {
    let filledInfo = {};
    let unfilledInfo = [];
    for (const info in experiment) {
      if (
        infoTags.includes(info) &&
        !["start_date", "end_date"].includes(info)
      ) {
        info !== "activation_id"
          ? (filledInfo[info] = experiment[info])
          : (filledInfo[info] = "activation " + experiment[info]);
      } else if (["start_date", "end_date"].includes(info)) {
        let infoDate = new Date(experiment[info]);
        filledInfo[info] = formatInfoDate(infoDate);
      }
    }
    infoTags.forEach((info) => {
      if (
        !Object.keys(experiment).includes(info) &&
        !otherTags.includes(info) &&
        !info.includes("_1")
      ) {
        unfilledInfo.push(info);
      }
    });
    return [filledInfo, unfilledInfo];
  }
  const handleUnfilledInfoClick = async (experiment_info, info) => {
    let value = prompt("Please the value for " + info);
    if (value != null) {
      let updated_info = {};
      updated_info["experiment_track"] = experiment_info.experiment_track;
      updated_info[info] = value;
      await updateExperiment(updated_info);
    }
  };
  const allInfo = getFilledAndUnfilledInfo(props.experiment);
  const filledInfo = allInfo[0];
  const unfilledInfo = allInfo[1];
  const optionsCursorTrueWithMargin = {
    followCursor: true,
    shiftX: -50,
    shiftY: -275,
  };
  return (
    <Row style={{ display: "flex", justifyContent: "center" }}>
      <Col>
        {Object.keys(filledInfo).map((info) => {
          return (
            <ReactHover
              options={optionsCursorTrueWithMargin}
              key={"filled_" + info}
            >
              <Trigger type="trigger">
                <div className="filled-info-tag" style={{ marginBottom: "5%" }}>
                  {filledInfo[info]}
                </div>
              </Trigger>
              <Hover type="hover">
                <div className="tag-hover">{info}</div>
              </Hover>
            </ReactHover>
          );
        })}
      </Col>
      <Col>
        {unfilledInfo.map((info) => {
          return (
            <div
              onClick={() => handleUnfilledInfoClick(selectedExperiment, info)}
              className="unfilled-info-tag"
              style={{ marginBottom: "5%" }}
              key={"unfilled_" + info}
            >
              {info}
            </div>
          );
        })}
      </Col>
    </Row>
  );
}

export default ExpandedExperimentInfoCard;
