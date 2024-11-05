import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
//import Home from './Components/homepage'
// import Signup from './Components/signup'
// import Login from './Components/login'
import { BrowserRouter ,Route , Routes } from 'react-router-dom';
import Home from './Components/homepage'
import QuizComponent from './Components/quize';

function App() {
  

  return (
    <BrowserRouter >
    <Routes>
    <Route path="/" element={<Home/>}> </Route>
    <Route path="/quizes" element={<QuizComponent/>}> </Route>
    </Routes>
    </BrowserRouter>
  )
}

export default App
