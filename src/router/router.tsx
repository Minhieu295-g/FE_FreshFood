import {createBrowserRouter} from "react-router-dom";
import App from "../App";
import Home from "../layouts/Home";
import ProductDetailMain from "../components/product-detail/ProductDetailMain";
import {FetchProductById} from "../api/productApi";
import SidebarFilter from "../components/product-filter/SideBarFilter";
import ProductFilter from "../components/product-filter/ProductFilter";
import Login from "../components/login/Login";
import Footer from "../components/footer/Footer";
import Header from "../components/header/Header";

export const Router = createBrowserRouter([

    {
        path: '/',
        element: <App/>,
        children: [
            {
                element: <Home/>
            },
            {
                path: "product/:id",
                element: <ProductDetailMain/>,
                loader: FetchProductById,
            },{
                path: "product-filter",
                element: <ProductFilter/>,
            },{
                index: true,
                element: <Login/>,
            },{
                path: "footer",
                element: <Footer/>
            }, {
                path: "header",
                element: <Header/>
            }
        ]

    }

])