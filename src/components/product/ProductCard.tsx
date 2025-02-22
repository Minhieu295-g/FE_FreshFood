import React, {useState} from "react";
import { ProductDefault } from "../../types/productDefault";
import { ShoppingCart, Heart } from "lucide-react";

const ProductCard = ({ product }: { product: ProductDefault }) => {
    const formatPriceVND = (price: number) =>
        price.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
    const [isFavorite, setIsFavorite] = useState(false);

    const toggleFavorite = (e: any) => {
        e.stopPropagation(); // Ngăn chặn sự kiện click lan ra ngoài
        setIsFavorite(!isFavorite);
    };
    return (
        <div className="w-full sm:w-1/2 md:w-1/5 px-2 mb-4">
            <div className="bg-white rounded-2xl shadow-lg h-full border border-gray-300 hover:border-green-400 transition">
                <div className="relative group">
                    <img
                        src={product.thumbnailUrl}
                        alt={product.name}
                        className="w-full h-[150px] object-cover rounded-t-2xl"
                    />
                    {/* Hiển thị badge giảm giá nếu discountPercentage > 0 */}
                    {product.discountPercentage > 0 && (
                        <div className="w-15 absolute top-2 right-2 bg-red-500 text-white text-xs font-bold py-1 px-2 rounded-lg shadow-md">
                            -{product.discountPercentage}%
                        </div>
                    )}
                    {/* Icon trái tim hiển thị khi hover */}
                    <button
                        onClick={toggleFavorite}
                        className={`absolute bottom-2 right-2 p-1 rounded-full transition ${
                            isFavorite ? "text-pink-500" : "text-gray-400"
                        } opacity-0 group-hover:opacity-100 bg-white shadow-md`}
                    >
                        <Heart size={20} fill={isFavorite ? "pink" : "none"} />
                    </button>
                </div>

                <div className="p-4">
                    <h5 className="text-lg font-semibold text-gray-800 text-left">{product.name}</h5>

                    <div className="flex items-center my-2 text-left">
                        <div className="text-yellow-400 text-base">{'⭐'.repeat(5)}</div>
                        <span className="text-gray-500 text-sm ml-2">(245)</span>
                    </div>

                    <div className="mb-3 ml-1 text-left">
                        <span className="font-bold text-green-600">{formatPriceVND(product.price - (product.price * product.discountPercentage)/100)}</span>
                        {product.discountPercentage > 0 && (
                            <span className="text-gray-400 line-through ml-2">
                {formatPriceVND(product.price)}
              </span>
                        )}
                    </div>

                    <button className="bg-green-500 text-white py-2 px-4 w-full rounded-lg hover:bg-green-600 transition flex items-center justify-center gap-2">
                        Thêm vào
                        <ShoppingCart size={20} />
                    </button>
                </div>
            </div>
        </div>
    );

};

export default ProductCard;
