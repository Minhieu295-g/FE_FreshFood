import React from 'react';
import './App.css';
import {Outlet} from "react-router-dom";
import Layout from "./pages/Layout";
import {UserContextProvider} from "./contexts/UserContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function App() {
  return (

    <div>
            <ToastContainer
                position="top-center"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={true}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        <UserContextProvider>
            <Layout>
                <Outlet/>
            </Layout>
        </UserContextProvider>

    </div>
  );
}

export default App;
