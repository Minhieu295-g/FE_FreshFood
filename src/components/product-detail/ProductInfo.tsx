import React, { useState } from 'react';
import {Product} from "../../types/product";

const ProductInfo = ({ product } : {product: Product}) => {
    const formatPriceVND = (price: number) =>
        price.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
    const [quantity, setQuantity] = useState(1);

    const handleDecrease = () => setQuantity(prev => Math.max(1, prev - 1));
    const handleIncrease = () => setQuantity(prev => prev + 1);

    return (
        <div className="ml-5">
            {/* Danh mục */}
            <p className="text-green-600 font-medium">{product.category.name}</p>

            {/* Tên sản phẩm */}
            <h3 className="text-2xl font-semibold text-gray-800">{product.name}</h3>

            {/* Đánh giá */}
            <div className="flex items-center mt-2">
                <div className="text-yellow-400 text-lg">{'⭐'.repeat(5)}</div>
                <span className="text-green-600 text-sm ml-2">(245 reviews)</span>
            </div>

            {/* Giá + Giảm giá */}
            <h4 className="mt-4 mb-4 text-xl font-bold text-gray-800 flex items-center gap-2">
                100,000 đ
                <small className="text-gray-400 line-through">
                    110,000 đ
                </small>
                <span className="text-green-600 text-sm font-semibold">26% Off</span>
            </h4>
            <hr className="my-4" />

            {/* Chọn số lượng */}
            <div className="mt-4 w-32">
                <div className="flex items-center border rounded-lg">
                    <button
                        onClick={handleDecrease}
                        className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-l-lg"
                    >
                        -
                    </button>
                    <input
                        type="number"
                        value={quantity}
                        min={1}
                        onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                        className="w-12 text-center border-l border-r focus:outline-none"
                    />
                    <button
                        onClick={handleIncrease}
                        className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-r-lg"
                    >
                        +
                    </button>
                </div>
            </div>

            {/* Nút thêm vào giỏ */}
            <button className="bg-green-500 text-white py-2 px-6 rounded-lg mt-4 hover:bg-green-600 transition">
                Thêm vào giỏ
            </button>

            <hr className="my-5" />

            {/* Thông tin sản phẩm */}
            <table className="w-full text-sm text-left">
                <tbody>
                <tr className="border-t">
                    <td className="py-2 font-medium text-gray-700">Mã sản phẩm</td>
                    <td className="py-2 text-gray-600">SP0012</td>
                </tr>
                <tr className="border-t">
                    <td className="py-2 font-medium text-gray-700">Trạng thái</td>
                    <td className="py-2 text-green-600">Còn hàng</td>
                </tr>
                <tr className="border-t">
                    <td className="py-2 font-medium text-gray-700">Loại</td>
                    <td className="py-2 text-gray-600">Thịt</td>
                </tr>
                <tr className="border-t">
                    <td className="py-2 font-medium text-gray-700">Vận chuyển</td>
                    <td className="py-2 text-gray-600">Vận chuyển trong vòng 24h</td>
                </tr>
                </tbody>
            </table>
        </div>
    );
};

export default ProductInfo;
