import logo from "./logo.svg";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Header from "./component/navigator/Header";
import Home from "./pages/user/Home";
import ResultPage from "./pages/user/ResultPage";

import ElectionRouter from "./component/elections/Elections.router";
import CreateElectionPage from "./pages/admin/CreateElectionPage";

function App() {
  return (
    <div>
      <Header />
      <Routes>
        {/* <Route path="your_votes" element={<ResultPage />} /> */}
        <Route path="elections" element={<Home type={"onGoing"} />} />
        <Route path="elections/*" element={<ElectionRouter />} />
        <Route path="past_elections" element={<Home type={"past"} />} />
        <Route path="upcoming_elections" element={<Home type={"upComing"} />} />
        <Route path="/" element={<Home type={"onGoing"} />} />

        <Route path="/create_new_elections" element={<CreateElectionPage />} />
        {/* <Route path="elections" element={<Home type={"onGoing"}/>} />
        <Route path="elections/*" element={<ElectionRouter />} />
        <Route path="past_elections" element={<Home type={"past"}/>} />
        <Route path="upcoming_elections" element={<Home type={"upComing"}/>} />
        <Route path="/" element={<Home type={"onGoing"}/>}>
        </Route> */}
      </Routes>
    </div>
  );
}

export default App;
