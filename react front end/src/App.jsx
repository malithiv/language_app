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
import SubscriptionPage from './Components/Subscription';
import PaymentForm from './Components/PaymentGateway';

function App() {
  

  return (
    <BrowserRouter >
    <Routes>
    <Route path="/" element={<Home/>}> </Route>
    <Route path="/quizes" element={<QuizComponent/>}> </Route>
    <Route path="/subscription" element={<SubscriptionPage/>}> </Route>
    <Route path="/payment" element={<PaymentForm/>}> </Route>
    </Routes>
    </BrowserRouter>
  )
}

export default App
