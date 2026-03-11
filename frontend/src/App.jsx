import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<h1>Prismora Dashboard</h1>} />
      </Routes>
    </Router>
  );
}

export default App;