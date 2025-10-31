import { Menu } from "./Pages/Menu"
import PongGame from "./Pages/PongGame";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PongTournament from "./Pages/PongTournament"; "./Pages/PongTournament"
import OnlineGame from "./Pages/onlineGame";

function App() {

  return (
    <>
        <Router>
          <Routes>
            <Route path="/" element={<Menu />} />
            <Route path="/pong" element={<PongGame />} />
            <Route path="/tournament" element={<PongTournament />} />
            <Route path="/online" element={<OnlineGame />} />
          </Routes>
        </Router>
    </>
  )
}

export default App
