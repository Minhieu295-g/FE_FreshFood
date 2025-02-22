import React, { useState } from "react";
import {ProductDefault} from "../../types/productDefault";
import {Product} from "../../types/product";

const ProductDetails = ({ product }: { product: Product }) => {
    const [activeTab, setActiveTab] = useState("details");

    return (
        <div className="mt-5">
            {/* Tabs Header */}
            <div className="flex border-b border-gray-300">
                <button
                    className={`py-2 px-4 text-sm font-medium focus:outline-none ${
                        activeTab === "details"
                            ? "border-b-2 border-green-500 text-green-600"
                            : "text-gray-600 hover:text-green-500"
                    }`}
                    onClick={() => setActiveTab("details")}
                >
                    Thông tin sản phẩm
                </button>
                <button
                    className={`py-2 px-4 text-sm font-medium focus:outline-none ${
                        activeTab === "reviews"
                            ? "border-b-2 border-green-500 text-green-600"
                            : "text-gray-600 hover:text-green-500"
                    }`}
                    onClick={() => setActiveTab("reviews")}
                >
                    Reviews
                </button>
                <button
                    className={`py-2 px-4 text-sm font-medium focus:outline-none ${
                        activeTab === "information"
                            ? "border-b-2 border-green-500 text-green-600"
                            : "text-gray-600 hover:text-green-500"
                    }`}
                    onClick={() => setActiveTab("information")}
                >
                    Storage Tips
                </button>
            </div>

            {/* Tab Content */}
            <div className="mt-4">
                {activeTab === "details" && (
                    <div>
                        <h5 className="text-lg font-semibold text-gray-800">{product.name}</h5>
                        <p className="text-gray-600">{product.description}</p>
                    </div>
                )}

                {activeTab === "reviews" && (
                    <div>
                        <h5 className="text-lg font-semibold text-gray-800">Reviews</h5>
                        <p className="text-gray-600">(30 reviews)</p>
                    </div>
                )}

                {activeTab === "information" && (
                    <div>
                        <h5 className="text-lg font-semibold text-gray-800">Storage Tips</h5>
                        <p className="text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductDetails;
