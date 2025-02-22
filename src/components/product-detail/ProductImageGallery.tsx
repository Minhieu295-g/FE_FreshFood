import React, { useState } from 'react';
import {Product} from "../../types/product";

const ProductImageGallery = ({ product } : {product : Product}) => {

    const [mainImage, setMainImage] = useState(product.thumbnailUrl);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    const images = [{ imageUrl: product.thumbnailUrl }, ...product.productImages];

    const handleImageClick = (img: string, index: number) => {
        setMainImage(img);
        setSelectedImageIndex(index);
    };

    return (
        <div>
            {/* Ảnh chính */}
            <img
                src={mainImage}
                alt="Product"
                className="w-full h-80 object-cover rounded-lg shadow-md mb-4"
            />

            {/* Thumbnails */}
            <div className="flex space-x-2">
                {images.map((img, index) => (
                    <img
                        key={index}
                        src={img.imageUrl}
                        alt={`Thumbnail ${index + 1}`}
                        onClick={() => handleImageClick(img.imageUrl, index)}
                        className={`w-20 h-20 object-cover rounded-lg cursor-pointer transition-transform duration-200 ${
                            index === selectedImageIndex
                                ? 'ring-2 ring-green-500 scale-105'
                                : 'hover:ring-2 hover:ring-gray-300'
                        }`}
                    />
                ))}
            </div>
        </div>
    );
};

export default ProductImageGallery;
