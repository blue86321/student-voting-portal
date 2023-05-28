import React from "react";
import { Container } from "react-bootstrap";
import {
  XYPlot,
  XAxis,
  YAxis,
  VerticalBarSeries,
  LabelSeries,
} from "react-vis";

function ResultChart() {
  // TODO: get vote results from backend

  const votesPercentage = [
    { x: "Candidate 1", y: 0.9, label: "50%" },
    { x: "Candidate 2", y: 0.1, label: "10%" },
    { x: "Candidate 3", y: 0.4, label: "40%" },
  ];

  const labelOffset = 0.05;

  const labels = votesPercentage.map((data) => ({
    x: data.x,
    y: data.y + 0.15 * data.y, // set the yOffset of the labels to the bars
    label: String(data.y * 100 + "%"),
    style: { textAnchor: "middle" },
  }));

  return (
    <div className="d-flex justify-content-center align-items-center vh-40">
      <XYPlot xType="ordinal" height={300} width={500}>
        {/* TODO: change the bar color according to the theme */}
        <VerticalBarSeries data={votesPercentage} color="#E85B81" />
        <XAxis />
        {/* <YAxis /> */}
        <LabelSeries animation allowOffsetToBeReversed data={labels} />
      </XYPlot>
    </div>
  );
}

export default ResultChart;
