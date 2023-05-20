import logo from "./logo.svg";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Header from "./component/navigator/Header";
import Home from "./pages/Home";
import ResultPage from "./pages/ResultPage";

import ElectionRouter from "./component/elections/Elections.router";

function App() {
  return (
    <div>
      <Header />
      <Routes>
          {/* <Route index element={<Home />} /> */}
        <Route path="your_votes" element={<ResultPage />} />
        {/* <Route path="past_elections" element={<Header />} /> */}
        <Route path="elections" element={<Home />} />
        <Route path="elections/*" element={<ElectionRouter />} />
        <Route path="/" element={<Home />}>
          {/* <Route path="*" element={<NoPage />} /> */}
        </Route>
      </Routes>
    </div>
  );
}

export default App;
