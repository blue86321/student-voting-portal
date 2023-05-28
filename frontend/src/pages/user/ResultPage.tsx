import Candidates from "../../component/elections/CandidateCard";
import ResultChart from "../../component/elections/ElectionResultChart";

function ResultPage() {
  return (
    <div>
      <ResultChart></ResultChart>
      <Candidates candidates={null} electionStatus={null}></Candidates>
    </div>
  );
}

export default ResultPage;
