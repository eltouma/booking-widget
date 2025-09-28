import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Home from './pages/Home'
import ListBooking from './pages/ListBooking'

function App() {
return (
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<Home/>} />
      <Route path='/booking' element={<ListBooking/>} />
    </Routes>
  </BrowserRouter>
)
}

export default App
