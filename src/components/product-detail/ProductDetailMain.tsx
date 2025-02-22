import React, {useEffect, useState} from 'react';
import { useLoaderData } from 'react-router-dom';
import ProductImageGallery from './ProductImageGallery';
import ProductInfo from './ProductInfo';
import ProductDetails from './ProductDetail';
import {Product} from "../../types/product";

const ProductDetailsMain = () => {
    const product = useLoaderData() as Product;
    console.log(product);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (product) setLoading(false); // Khi product có dữ liệu, tắt loading
    }, [product]);

    if (loading) {
        return <div className="text-center mt-10 text-gray-500">Đang tải dữ liệu sản phẩm...</div>;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
            {/* Grid chia 2 cột */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <ProductImageGallery product={product} />
                <ProductInfo product={product} />
            </div>

            {/* Chi tiết sản phẩm */}
            <div className="mt-12">
                <ProductDetails product={product} />
            </div>
        </div>
    );
};
export default ProductDetailsMain;
