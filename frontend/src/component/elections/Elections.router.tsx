import { Routes, Route } from "react-router-dom";
import ElectionDetailsPage from "../../pages/user/ElectionDetailsPage";

function ElectionRouter() {
  return (
    <div>
      <Routes>
        <Route path=":electionID" element={<ElectionDetailsPage />} />
      </Routes>
    </div>
  );
}

export default ElectionRouter;
