import {createBrowserRouter} from "react-router-dom";
import App from "../App";
import Home from "../layouts/Home";
import ProductDetailMain from "../components/product-detail/ProductDetailMain";
import {FetchProductById} from "../api/productApi";

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
            }
        ]

    }

])