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
import Carousel from "../components/carousel/Carousel";
import Register from "../components/register/Register";
import AuthCallback from "../contexts/ AuthCallback";
import ShoppingCart from "../components/cart/ShoppingCart";
import DeliveryAddress from "../components/delivery-address/DeliverAddress";

export const Router = createBrowserRouter([

    {
        path: '/',
        element: <App/>,
        children: [
            {
                index: true,
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
                path:"login",
                element: <Login/>,
            },{
                path: "footer",
                element: <Footer/>
            }, {
                path: "register",
                element: <Register/>
            }, {
                path: "auth/callback",
                element:<AuthCallback/>
            }, {
                path: "cart",
                element: <ShoppingCart/>
            }, {
                path: "delivery-address",
                element: <DeliveryAddress/>
            }
        ]

    }

])