import {ProductDefault} from "../../types/productDefault";
import React from "react";
import ProductCardSearch from "./ProductCardSearch";

const ProductBySearch = ({products} :{products: ProductDefault[]}) => {
    return (
        <>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl font-semibold my-4">Popular Products</h2>
                <div className="flex flex-wrap ">
                    {products.map((product, index) => (
                        <ProductCardSearch key={index} product={product} />
                    ))}
                </div>
            </div>

        </>
    );
}
export default ProductBySearch;