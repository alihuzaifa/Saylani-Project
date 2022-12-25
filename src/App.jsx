import React from 'react';
import Login from './Components/Login';
import ResponsiveAppBar from "./Components/Navbar";
import Slider from "./Components/Slider";
import News from "./Components/News"
import AdminPanel from "./Components/AdminPanel";
import Certificate from "./Components/Certificate";
import AddCourse from "./Components/AddCourse"
import { Route, Routes } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

const App = () => {
  return (
    <>
      <Routes>
        <Route path='/' element={<AdminPanel />} />
        <Route path='/login' element={<Login />} />
        <Route path='/news' element={<News />} />
        <Route path='/certificate' element={<Certificate />} />
        <Route path='/course' element={<AddCourse />} />
      </Routes>
    </>
  )
}

export default App
