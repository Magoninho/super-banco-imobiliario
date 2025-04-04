import { useState } from 'react'
import { Route, Routes } from 'react-router'
import Home from './pages/Home'
import CreateRoom from './pages/CreateRoom'
import JoinRoom from './pages/JoinRoom'
import 'beercss'
import './App.css'
import Room from './pages/Room'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  document.body.className = localStorage.getItem("theme") || "light";
  document.title = "Super Banco Imobiliario";

  return (
    <Routes>
      <Route path='/' element={
        <Home />
      } />
      <Route path='/create' element={
        <CreateRoom />
      } />
      <Route path='/join' element={
        <JoinRoom />
      } />


      
      <Route path='/room/:roomCode' element={
        <ProtectedRoute>
          <Room />
        </ProtectedRoute>
      } />
    </Routes>
  )
}

export default App
