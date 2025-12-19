import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from "./Providers/AuthProvider";
import { DashboardProvider } from "./Providers/DashboardProvider";
import { Suspense } from "react";

import { Menu } from "./Pages/Pong/Menu"
import PongGame from "./Pages/Pong/PongGame";
import OnlineGame from "./Pages/Pong/onlineGame";
import PongTournament from "./Pages/Pong/Tournament/PongTournament"; import Login from "./Pages/Login";
import Dashboard from "./Pages/Dashboard.tsx";
import ProtectedRoute from "./Components/ProtectedRoute";
import Settings from "./Pages/Dashboard/Settings";
import Profil from "./Pages/Dashboard/Profil";
import Friend from "./Pages/Dashboard/Friend";
import Play from "./Pages/Dashboard/Play";
import Discussion from "./Components/Chat/Discussion";
import { ChatProvider } from "./Providers/ChatProvider.tsx";
import { FriendProvider } from "./Providers/FriendProvider.tsx";
import OnlineMulti from "./Pages/Pong/OnlineMulti.tsx";
import { SocketProvider } from "./Providers/SocketProvider.tsx";
import PongGameAI from "./Pong/AI/PongGameAI.tsx";
import Home from "./Pages/Dashboard/Home.tsx";

function App() {

  return (
    <>
      <AuthProvider>
        <DashboardProvider>
          <SocketProvider>
            <ChatProvider>
              <FriendProvider>
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
                      <Route index element={<Home
                        onViewAllAchievements={() => console.log('achievements')}
                      />} />
                      <Route path="profile" element={<Profil />} />
                      <Route path="settings" element={<Settings />} />
                      <Route path="play"
                        element={
                          <Play />
                        }>
                        <Route index element={< Menu />} />
                        <Route path="pong" element={<PongGame />} />
                        <Route path="tournament" element={<PongTournament />} />
                        <Route path="multiplayer" element={<OnlineMulti />} />
                        <Route path="ai" element={<PongGameAI />} />
                        <Route
                          path="online"
                          element={
                            <OnlineGame />
                          }
                        />
                      </Route>
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
              </FriendProvider>
            </ChatProvider>
          </SocketProvider>
        </DashboardProvider>
      </AuthProvider>
    </>
  )
}

export default App
