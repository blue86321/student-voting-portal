import {
  XYPlot,
  XAxis,
  VerticalBarSeries,
  LabelSeries,
} from "react-vis";
import Logger from "../utils/Logger";

function ResultChart({ position }) {
  Logger.debug("[ResultChart] position", position);
  let votesPercentage;
  if (position !== undefined) {
    votesPercentage = position.candidates.map((vote) => {
      Logger.debug("[ResultChart] candidates.map: ", vote);
      return {
        x: vote.candidateName,
        y: vote.votePercentage,
      };
    });
  }

  const labels = votesPercentage?.map((data) => ({
    x: data.x,
    y: data.y + 0.15 * data.y, // set the yOffset of the labels to the bars
    label: String(data.y + "%"),
    style: { textAnchor: "middle" },
  }));

  return (
    <div className="d-flex justify-content-center align-items-center vh-40">
      <XYPlot xType="ordinal" height={300} width={500}>
        <VerticalBarSeries data={votesPercentage} color="#E85B81" />
        <XAxis />
        <LabelSeries animation allowOffsetToBeReversed data={labels} />
      </XYPlot>
    </div>
  );
}

export default ResultChart;
