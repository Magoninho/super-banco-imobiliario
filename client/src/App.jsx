import { useState } from 'react'
import { Route, Routes } from 'react-router'
import Home from './pages/Home'
import CreateRoom from './pages/CreateRoom'
import JoinRoom from './pages/JoinRoom'
import 'beercss'
import './App.css'
import Room from './pages/Room'

function App() {
  document.body.className = localStorage.getItem("theme") || "light";

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


      {/* TODO: protect this route */}
      <Route path='/room' element={
        <Room />
      } />
    </Routes>
  )
}

export default App
