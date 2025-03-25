"use client"

import React, { useState } from 'react'
import { Product } from "../../types/product"
import { ChevronLeft, ChevronRight, ZoomIn, Heart } from 'lucide-react'

const ProductImageGallery = ({ product }: { product: Product }) => {
    const [mainImage, setMainImage] = useState(product.thumbnailUrl)
    const [selectedImageIndex, setSelectedImageIndex] = useState(0)
    const [isZoomed, setIsZoomed] = useState(false)
    const [wishlist, setWishlist] = useState(false)

    const images = [{ imageUrl: product.thumbnailUrl }, ...product.productImages]

    const handleImageClick = (img: string, index: number) => {
        setMainImage(img)
        setSelectedImageIndex(index)
    }

    const handlePrevImage = () => {
        const newIndex = (selectedImageIndex - 1 + images.length) % images.length
        setMainImage(images[newIndex].imageUrl)
        setSelectedImageIndex(newIndex)
    }

    const handleNextImage = () => {
        const newIndex = (selectedImageIndex + 1) % images.length
        setMainImage(images[newIndex].imageUrl)
        setSelectedImageIndex(newIndex)
    }

    const toggleZoom = () => {
        setIsZoomed(!isZoomed)
    }

    const toggleWishlist = () => {
        setWishlist(!wishlist)
    }

    return (
        <div>
            {/* Main image container */}
            <div className="relative mb-4 rounded-lg overflow-hidden group">
                <div
                    className={`relative w-full h-[400px] bg-gray-50 flex items-center justify-center ${
                        isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'
                    }`}
                    onClick={toggleZoom}
                >
                    <img
                        src={mainImage || "/placeholder.svg"}
                        alt={product.name}
                        className={`${
                            isZoomed
                                ? 'absolute h-auto w-auto max-w-none scale-150 transition-transform duration-300'
                                : 'w-full h-full object-contain transition-transform duration-300'
                        }`}
                    />
                </div>

                {/* Image controls */}
                <div className="absolute top-4 right-4 flex space-x-2">
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            toggleZoom()
                        }}
                        className="p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors"
                        aria-label="Zoom image"
                    >
                        <ZoomIn className="h-5 w-5 text-gray-700" />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            toggleWishlist()
                        }}
                        className={`p-2 ${
                            wishlist
                                ? 'bg-red-50 text-red-500'
                                : 'bg-white/80 backdrop-blur-sm text-gray-700 hover:text-red-500'
                        } rounded-full shadow-sm transition-colors`}
                        aria-label="Add to wishlist"
                    >
                        <Heart className={`h-5 w-5 ${wishlist ? 'fill-red-500' : ''}`} />
                    </button>
                </div>

                {/* Navigation arrows */}
                <button
                    onClick={handlePrevImage}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 p-1.5 bg-white/80 backdrop-blur-sm rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Previous image"
                >
                    <ChevronLeft className="h-5 w-5 text-gray-700" />
                </button>
                <button
                    onClick={handleNextImage}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 bg-white/80 backdrop-blur-sm rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Next image"
                >
                    <ChevronRight className="h-5 w-5 text-gray-700" />
                </button>
            </div>

            {/* Thumbnails */}
            <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
                {images.map((img, index) => (
                    <div
                        key={index}
                        onClick={() => handleImageClick(img.imageUrl, index)}
                        className={`relative flex-shrink-0 w-20 h-20 rounded-md overflow-hidden cursor-pointer border-2 transition-all duration-200 ${
                            index === selectedImageIndex
                                ? 'border-green-500 shadow-sm'
                                : 'border-transparent hover:border-gray-300'
                        }`}
                    >
                        <img
                            src={img.imageUrl || "/placeholder.svg"}
                            alt={`Thumbnail ${index + 1}`}
                            className="w-full h-full object-cover"
                        />
                        {index === selectedImageIndex && (
                            <div className="absolute inset-0 border-2 border-white pointer-events-none"></div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ProductImageGallery
