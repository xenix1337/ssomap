import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Home";
import Guessr from "./Guessr";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/guessr" element={<Guessr />} />
      </Routes>
    </Router>
  );
}

export default App;
