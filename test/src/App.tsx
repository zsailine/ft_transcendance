import { Menu } from "./Pages/Menu"
import PongGame from "./Pages/PongGame";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PongTournament from "./Pages/PongTournament"; "./Pages/PongTournament"
function App() {

  return (
    <>
        <Router>
          <Routes>
            <Route path="/" element={<Menu />} />
            <Route path="/pong" element={<PongGame />} />
            <Route path="/tournament" element={<PongTournament />} />
          </Routes>
        </Router>
    </>
  )
}

export default App
