import { Route, Routes, useLocation } from 'react-router-dom'
import React from 'react'
import Register from './Forms/Register'
import Login from './Forms/Login'
import Home from './Forms/Home'



export default function App() {


  return (
    <Routes key={location.pathname} location={location}>
    <Route path='/' element={<Register />}/>
    <Route path='/login' element={<Login />}/>
    <Route path='/home' element={<Home />}/>
  </Routes>
    
  )
}