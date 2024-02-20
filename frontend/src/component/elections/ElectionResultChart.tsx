import { Bar, BarChart, XAxis, YAxis } from 'recharts';
import Logger from "../utils/Logger";

const CustomizedLabel = ({ x, y, value, width }) => {
  return (
    <text
      x={x + width / 2}
      y={y}
      dy={-16}
      textAnchor="middle"
    >
      {value}%
    </text>
  )
};

function ResultChart({ position }) {
  Logger.debug("[ResultChart] position", position);
  const nonNan = position?.candidates.every((vote) => !isNaN(vote.votePercentage))
  const votesData = position?.candidates.map((vote) => {
    Logger.debug("[ResultChart] candidates.map: ", vote);
    return {
      candidateName: vote.candidateName,
      votePercentage: vote.votePercentage,
    };
  });

  return (
    <div className="d-flex justify-content-center align-items-center vh-40">
      {
        nonNan && (
          <BarChart width={500} height={400} data={votesData} margin={{ top: 30, bottom: 10 }}>
            <XAxis dataKey="candidateName" />
            <YAxis hide />
            <Bar dataKey="votePercentage" fill="#E85B81" label={CustomizedLabel} />
          </BarChart>
        )
      }
    </div>
  );
}

export default ResultChart;
