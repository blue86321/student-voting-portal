import Candidates from "../Component/candidates";
import ResultChart from "../Component/resultChart";

function ResultPage( {navigate} ) {

    return (
        <div>
            <ResultChart></ResultChart>
            <Candidates></Candidates>
        </div>
    )

}

export default ResultPage;