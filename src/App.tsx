import React from 'react';
import './App.css';
import {Outlet} from "react-router-dom";
import Layout from "./pages/Layout";
import {UserContextProvider} from "./contexts/UserContext";

function App() {
  return (
    <div>
        <UserContextProvider>
            <Layout>
                <Outlet/>
            </Layout>
        </UserContextProvider>

    </div>
  );
}

export default App;
