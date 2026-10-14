import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import StartupPage from './pages/StartupPage';
import SignUpPage from './pages/SignUpPage';
import HomePage from './pages/HomePage';
import AvatarCreationPage from './pages/AvatarCreationPage';
import SpaceCreationPage from './pages/SpaceCreationPage';
import RoomInteriorPage from './pages/RoomInteriorPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <StartupPage />,
  },
  {
    path: '/signup',
    element: <SignUpPage />,
  },
  {
    path: '/home',
    element: <HomePage />,
  },
  {
    path: '/avatar',
    element: <AvatarCreationPage />,
  },
  {
    path: '/space-creation',
    element: <SpaceCreationPage />,
  },
  {
    path: '/room',
    element: <RoomInteriorPage />,
  },
]);
