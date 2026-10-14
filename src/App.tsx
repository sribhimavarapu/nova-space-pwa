import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import StartupPage from './pages/StartupPage';
import SignUpPage from './pages/SignUpPage';
import HomePage from './pages/HomePage';
import AvatarCreationPage from './pages/AvatarCreationPage';
import SpaceCreationPage from './pages/SpaceCreationPage';
import RoomInteriorPage from './pages/RoomInteriorPage';
import EnhancedRoomPage from './pages/EnhancedRoomPage';
import JoinSpacePage from './pages/JoinSpacePage';
import './styles/global.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StartupPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/avatar" element={<AvatarCreationPage />} />
        <Route path="/create-space" element={<SpaceCreationPage />} />
        <Route path="/join" element={<JoinSpacePage />} />
        <Route path="/join/:inviteCode" element={<JoinSpacePage />} />
        <Route path="/room/:spaceId" element={<EnhancedRoomPage />} />
        <Route path="/room-basic/:spaceId" element={<RoomInteriorPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
