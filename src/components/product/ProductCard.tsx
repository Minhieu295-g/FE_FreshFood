import React, {useContext, useState} from "react";
import { ProductDefault } from "../../types/productDefault";
import { ShoppingCart, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { addCartItemToCart } from "../../api/cartApi";
import { toast } from "react-toastify";
import {UserContext} from "../../contexts/UserContext";

const ProductCard = ({ product }: { product: ProductDefault }) => {
    const [isFavorite, setIsFavorite] = useState(false);
    const [isAdding, setIsAdding] = useState(false); // Trạng thái thêm vào giỏ hàng
    const {getQuantityCartItem} = useContext(UserContext)!;
    const formatPriceVND = (price: number) =>
        price.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

    const toggleFavorite = (e: any) => {
        e.stopPropagation(); // Ngăn chặn sự kiện click lan ra ngoài
        setIsFavorite(!isFavorite);
    };

    const handleAddToCart = async () => {
        if (isAdding) return; // Ngăn chặn spam click

        const userData = localStorage.getItem("user");
        if (!userData) {
            toast.error("Bạn cần đăng nhập để thêm vào giỏ hàng!");
            return;
        }

        const user = JSON.parse(userData);
        const cartId = user.cartId;

        if (!cartId) {
            toast.error("Không tìm thấy giỏ hàng của bạn!");
            return;
        }

        const cartItem = {
            cartId: cartId,
            productVariantId: product.productVariantId,
            quantity: 1,
        };

        try {
            setIsAdding(true);
            await addCartItemToCart(cartItem);
            toast.success("Thêm vào giỏ hàng thành công!");
            getQuantityCartItem();
        } catch (error) {
            toast.error("Thêm vào giỏ hàng thất bại!");
        } finally {
            setIsAdding(false);
        }
    };

    return (
        <div className="w-full sm:w-1/2 md:w-1/5 px-2 mb-4">
            <div className="bg-white rounded-2xl shadow-lg h-full border border-gray-300 hover:border-green-400 transition">
                <div className="relative group">
                    <Link to={`/product/${product.id}`}>
                        <img
                            src={product.thumbnailUrl}
                            alt={product.name}
                            className="w-full h-[150px] object-cover rounded-t-2xl"
                        />
                    </Link>
                    {product.discountPercentage > 0 && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold py-1 px-2 rounded-lg shadow-md">
                            -{product.discountPercentage}%
                        </div>
                    )}
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
                    <Link to={`/product/${product.id}`}>
                        <h5 className="text-lg font-semibold text-gray-800 text-left">{product.name}</h5>
                    </Link>
                    <div className="flex items-center my-2 text-left">
                        <div className="text-yellow-400 text-base">{'⭐'.repeat(5)}</div>
                        <span className="text-gray-500 text-sm ml-2">(245)</span>
                    </div>

                    <div className="mb-3 ml-1 text-left">
                        <span className="font-bold text-green-600">
                            {formatPriceVND(product.price - (product.price * product.discountPercentage) / 100)}
                        </span>
                        {product.discountPercentage > 0 && (
                            <span className="text-gray-400 line-through ml-2">
                                {formatPriceVND(product.price)}
                            </span>
                        )}
                    </div>

                    <button
                        onClick={handleAddToCart}
                        disabled={isAdding}
                        className="bg-green-500 text-white py-2 px-4 w-full rounded-lg hover:bg-green-600 transition flex items-center justify-center gap-2"
                    >
                        {isAdding ? "Đang thêm..." : "Thêm vào"}
                        <ShoppingCart size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
