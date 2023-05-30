import logo from "./logo.svg";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Header from "./component/navigator/Header";
import Home from "./pages/user/Home";

import ElectionRouter from "./component/elections/Elections.router";
import CreateElectionPage from "./pages/admin/CreateElectionPage";
import ManageUsers from "./pages/admin/ManageUsers";

function App() {
  console.log('[Router] token', localStorage.getItem('token'));
  return (
    <div>
      <Header />
      <Routes>
        {/* <Route path="your_votes" element={<ResultPage />} /> */}
        <Route path="elections" element={<Home type={"onGoing"} />} />
        <Route path="elections/*" element={<ElectionRouter />} />
        
        <Route path="past_elections" element={<Home type={"past"} />} />
        <Route path="upcoming_elections" element={<Home type={"upComing"} />} />
        <Route path="manage_elections" element={<Home type={"admin"} />} />
        <Route path="/" element={<Home type={"onGoing"} />} />

        <Route path="/create" element={<CreateElectionPage />} />
        <Route path="/manage_users" element={<ManageUsers />} />
      </Routes>
      <p></p>
    </div>
  );
}

export default App;
