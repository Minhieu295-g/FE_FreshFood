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
import OrderConfirmation from "../components/order/OrderConfirm";
import OrderSuccessPage from "../components/order/OrderSuccessData";
import OrderHistory from "../components/order/OrderHistory";
import AdminDashboard from "../components/admin/AdminDashboard";
import ProductManagement from "../components/admin/product-management/ProductManagement";
import {CategoryManagement} from "../components/admin/category-magement/CategoryManagement";
import {UserManagement} from "../components/admin/user-management/UserManagement";
import AdminLayout from "../components/admin/AdminLayout";
import {OrderManagement} from "../components/admin/order-manegement/OrderManagement";

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
            }, {
                path: "order-confirm",
                element: <OrderConfirmation/>
            }, {
                path: "order-success",
                element: <OrderSuccessPage/>
            }, {
                path: "order-history",
                element: <OrderHistory/>
            }, {
                path: "admin-dashboard",
                element: <AdminDashboard/>
            }, {
                path: "product-management",
                element: <ProductManagement/>
            }, {
                path: "category-management",
                element: <CategoryManagement/>
            }, {
                path: "user-management",
                element: <UserManagement/>
            }, {
                path: "admin",
                element: <AdminLayout/>
            }, {
                path: "order-management",
                element: <OrderManagement/>
            }
        ]

    }

])