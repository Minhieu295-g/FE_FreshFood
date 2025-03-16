import React, {useContext, useEffect, useState} from "react";
import {fetchParentCategory} from "../../api/parentCategoryApi";
import {deleteCartItem, getCartById, updateCartItem} from "../../api/cartApi";
import {Cart, CartItem, mapCartItemToRequest} from "../../types/cart";
import {UserContext} from "../../contexts/UserContext";

const ShoppingCart: React.FC = () => {
    const [total, setTotal] = useState(84.0);
    const [shipping, setShipping] = useState("Free");
    const formatPriceVND = (price: number) =>
        price.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
    const{getQuantityCartItem} = useContext(UserContext)!;
    const[cart, setCart] = useState<Cart>();
    const[totalPrice, setTotalPrice] = useState(0)
    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (userData==null) return;
        const user = JSON.parse(userData);
        const getCart = async (id: number) => {
            try {
                const data = await getCartById(id);
                setCart(data)
            } catch (err: any) {

            }
        };
        getCart(user.cartId);
    }, []);
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const handleCheckboxChange = (id: number) => {
        setSelectedItems((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };
    const handleUpdateCartItem = async (type: string, id: number, cartItem: CartItem) => {
        try {
            let newQuantity = cartItem.quantity;

            if (type === "minus") {
                newQuantity = cartItem.quantity - 1;
                if (newQuantity === 0) {
                    await handleDeleteCartItem(id);
                    return;
                }
            } else if (type === "plus") {
                newQuantity = cartItem.quantity + 1;
            }

            const updatedCartItem: CartItem = { ...cartItem, quantity: newQuantity };
            const cartItemRequest = mapCartItemToRequest(updatedCartItem, id);

            const response = await updateCartItem(id, cartItemRequest);
            if (response.status === 200) {
                setCart((prevCart) => {
                    if (!prevCart) return prevCart;
                    return {
                        ...prevCart,
                        cartItem: prevCart.cartItem.map((item) =>
                            item.id === id ? { ...item, quantity: newQuantity } : item
                        ),
                    };
                });
            }
            getQuantityCartItem();
        } catch (error) {
            console.error("Lỗi khi cập nhật số lượng cartItem:", error);
        }
    };
    useEffect(() => {
        if (!cart?.cartItem) return;
        const newTotal = cart.cartItem
            .filter((item) => selectedItems.includes(item.id)) // Lọc ra các item được chọn
            .reduce((sum, item) => sum + item.productVariant.price * item.quantity, 0); // Tính tổng giá

        setTotalPrice(newTotal);
    }, [selectedItems, cart]);

    const handleDeleteCartItem = async (id: number) => {
        try {
            const response = await deleteCartItem(id);
            if (response.status === 200) {
                setCart((prevCart) => {
                    if (!prevCart) return prevCart;
                    return {
                        ...prevCart,
                        cartItem: prevCart.cartItem.filter((item) => item.id !== id),
                    };
                });
                getQuantityCartItem();
                setSelectedItems((prev) => prev.filter((itemId) => itemId !== id));
            }
        } catch (error) {
            console.error("Lỗi khi xóa cartItem:", error);
        }
    };

    return (
        <section className="w-full bg-white dark:bg-[#0A2025] py-9 px-8">
            <h1 className="text-center text-[#191919] dark:text-white text-[32px] font-semibold leading-[38px]">
                My Shopping Cart
            </h1>
            <div className="flex items-start mt-8 gap-6">
                <div className="bg-white p-4 w-[800px] rounded-xl">
                    <table className="w-full bg-white rounded-xl">
                        <thead>
                        <tr className="text-center border-b border-gray-400 w-full text-[#7f7f7f] text-sm font-medium uppercase leading-[14px] tracking-wide">
                            <th className="px-2 py-2">
                                <input
                                    type="checkbox"
                                    onChange={(e) => {
                                        setSelectedItems(e.target.checked ? (cart?.cartItem ? cart.cartItem.map((p) => p.id) : []) : []);
                                    }}
                                    checked={selectedItems.length === cart?.cartItem.length}
                                />
                            </th>
                            <th className="text-left px-2 py-2">Product</th>
                            <th className="px-2 py-2">Price</th>
                            <th className="px-2 py-2">Quantity</th>
                            <th className="px-2 py-2">Subtotal</th>
                            <th className="w-7 px-2 py-2"></th>
                        </tr>
                        </thead>
                        <tbody>
                        {cart?.cartItem.map((cartItem) => (
                            <tr key={cartItem.id} className="text-center">
                                <td className="px-2 py-2">
                                    <input
                                        type="checkbox"
                                        checked={selectedItems.includes(cartItem.id)}
                                        onChange={() => handleCheckboxChange(cartItem.id)}
                                    />
                                </td>
                                <td className="px-2 py-2 text-left align-top">
                                    <img src={cartItem.productVariant.thumbnailUrl} alt={cartItem.productVariant.name}
                                         className="w-[100px] mr-2 inline-block h-[100px]"/>
                                    <span>{cartItem.productVariant.name}</span>
                                </td>
                                <td className="px-2 py-2">
                                    {/*${cartItem.productVariant.price.toFixed(2)}*/}
                                    {formatPriceVND(cartItem.productVariant.price)}
                                </td>
                                <td className="p-2 mt-9 bg-white rounded-[170px] border border-[#a0a0a0] justify-around items-center flex">
                                    <span className="cursor-pointer"
                                          onClick={() => handleUpdateCartItem("minus", cartItem.id, cartItem)}>−</span>
                                    <span
                                        className="w-10 text-center text-[#191919] text-base font-normal leading-normal">
        {cartItem.quantity}
    </span>
                                    <span className="cursor-pointer"
                                          onClick={() => handleUpdateCartItem("plus", cartItem.id, cartItem)}>+</span>
                                </td>
                                <td className="px-2 py-2">
                                    {formatPriceVND(cartItem.productVariant.price * cartItem.quantity)}
                                </td>
                                <td className="px-2 py-2 cursor-pointer"
                                    onClick={() => handleDeleteCartItem(cartItem.id)}>X
                                </td>
                            </tr>
                        ))}
                        </tbody>
                        <tfoot>
                        <tr className="border-t border-gray-400">
                            <td className="px-2 py-2" colSpan={3}>
                                <button
                                    className="px-8 cursor-pointer py-3.5 bg-[#f2f2f2] rounded-[43px] text-[#4c4c4c] text-sm font-semibold leading-[16px]">
                                    Return to shop
                                </button>
                            </td>
                            <td className="px-2 py-2" colSpan={3}>
                                <button
                                    className="px-8 py-3.5 cursor-pointer bg-[#f2f2f2] rounded-[43px] text-[#4c4c4c] text-sm font-semibold leading-[16px]">
                                    Update Cart
                                </button>
                            </td>
                        </tr>
                        </tfoot>
                    </table>
                </div>
                <div className="w-[324px] bg-white rounded-lg p-6">
                    <h2 className="text-[#191919] mb-2 text-xl font-medium leading-[30px]">
                        Cart Total
                    </h2>

                    <div className="w-[276px] py-3 flex justify-between items-center">
                          <span className="text-[#4c4c4c] text-base font-normal leading-normal">
                            Total:
                          </span>
                          <span className="text-[#191919] text-base font-semibold leading-tight">
                            {formatPriceVND(totalPrice)}
                          </span>
                    </div>

                    <div className="w-[276px] py-3 border-t border-[#e5e5e5] flex justify-between items-center">
                          <span className="text-[#4c4c4c] text-sm font-normal leading-[21px]">
                            Shipping:
                          </span>
                          <span className="text-[#191919] text-sm font-medium leading-[21px]">
                            {shipping}
                          </span>
                    </div>

                    <div className="w-[276px] py-3 border-t border-[#e5e5e5] flex justify-between items-center">
                          <span className="text-[#4c4c4c] text-sm font-normal leading-[21px]">
                            Subtotal:
                          </span>
                          <span className="text-[#191919] text-sm font-medium leading-[21px]">
                            {formatPriceVND(totalPrice)}
                          </span>
                    </div>

                    <button
                        className="w-[276px] text-white mt-5 px-10 py-4 bg-[#00b206] rounded-[44px] text-base font-semibold leading-tight">
                        Proceed to checkout
                    </button>
                </div>
            </div>
        </section>
    )
        ;
};

export default ShoppingCart;
