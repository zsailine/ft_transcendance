import { Menu } from "./Pages/Menu"
import PongGame from "./Pages/PongGame";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PongTournament from "./Pages/PongTournament";import Login from "./Pages/Login";
import { AuthProvider } from "./Providers/AuthProvider";
import Dashboard from "./Pages/Dashboard";
import ProtectedRoute from "./Components/ProtectedRoute";
 "./Pages/PongTournament"
function App() {

  return (
    <>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Menu />} />
            <Route path="/pong" element={<PongGame />} />
            <Route path="/tournament" element={<PongTournament />} />
            <Route path="/login" element={<Login/>}/>
            
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          </Routes>
        </Router>
      </AuthProvider>
    </>
  )
}

export default App
