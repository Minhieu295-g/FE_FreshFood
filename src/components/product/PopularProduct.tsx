import React, {useState, useEffect} from "react";
import {fetchProductDefault} from "../../api/productApi";
import {ProductDefault} from "../../types/productDefault";
import ProductCard from "./ProductCard";

const PopularProduct = () => {
    const [productDefaults, setProductDefaults] = useState<ProductDefault[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const getProductDefaults = async () => {
            try {
                const data = await fetchProductDefault();
                setProductDefaults(data);
            } catch (err: any) {
                setError(err.message || 'Có lỗi xảy ra');
            } finally {
                setLoading(false);
            }
        };
        getProductDefaults();
    }, []);

    return (
        <>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <h2 className="text-2xl font-semibold my-4">Popular Products</h2>
                <div className="flex flex-wrap ">
                    {productDefaults.map((product, index) => (
                        <ProductCard key={index} product={product} />
                    ))}
                </div>


            </div>

        </>
    );
}

export default PopularProduct