import React from 'react';
import logo from './logo.svg';
import './App.css';
import ParentCategory from "./components/parent-category/ParentCategory";
import PopularProduct from "./components/product/PopularProduct";
import {Outlet} from "react-router-dom";

function App() {
  return (
    <div>
     <Outlet/>
    </div>
  );
}

export default App;
