import Candidates from "../../component/elections/CandidateCard";
import ResultChart from "../../component/elections/ElectionResultChart";

function ResultPage() {
  return (
    <div>
      <ResultChart votes={undefined}></ResultChart>
      <Candidates candidates={null} electionStatus={null} isCompleted={undefined} selectedID={undefined} votes={undefined}></Candidates>
    </div>
  );
}

export default ResultPage;
