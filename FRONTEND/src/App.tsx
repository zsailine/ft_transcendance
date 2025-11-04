import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from "./Providers/AuthProvider";
import { DashboardProvider } from "./Providers/DashboardProvider";
import { Suspense } from "react";

import { Menu } from "./Pages/Menu"
import PongGame from "./Pages/PongGame";
import PongTournament from "./Pages/PongTournament"; import Login from "./Pages/Login";
import Dashboard from "./Pages/Dashboard";
import ProtectedRoute from "./Components/ProtectedRoute";
import Settings from "./Pages/Dashboard/Settings";
import Play from "./Pages/Dashboard/Play";
import Profil from "./Pages/Dashboard/Profil";
import Friend from "./Pages/Dashboard/Friend";
import Discussion from "./Components/Chat/Discussion";

"./Pages/PongTournament"

function App() {

  return (
    <>
      <AuthProvider>
        <DashboardProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Menu />} />
              <Route path="/pong" element={<PongGame />} />
              <Route path="/tournament" element={<PongTournament />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Login />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Suspense fallback={<div>Loading...</div>}>
                      <Dashboard />
                    </Suspense>
                  </ProtectedRoute>
                }>
                <Route index element={<Profil />} />
                <Route path="settings" element={<Settings />} />
                <Route path="play" element={<Play />} />
                <Route path="friends" element={<Friend />} />
                <Route path="discussion" element={<Discussion />} />
              </Route>

            </Routes>
          </Router>
          <ToastContainer
            position="top-right"       
            autoClose={3000}           
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            pauseOnHover
            draggable
            theme="colored"            
          />
        </DashboardProvider>
      </AuthProvider>
    </>
  )
}

export default App
