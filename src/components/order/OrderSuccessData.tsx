import OrderSuccess from "../../components/order/OrderSuccess";

export default function OrderSuccessPage() {
    // In a real application, you would fetch the order details from an API
    // based on the order ID from the URL or context

    const orderDetails = {
        orderNumber: "ORD-20240325-7812",
        orderDate: "25/03/2024, 15:30",
        deliveryDate: "28/03/2024",
        totalAmount: 245000,
        paymentMethod: "Thanh toán khi nhận hàng (COD)",
        shippingAddress: {
            name: "Lê Minh Hiếu",
            phone: "(+84) 345778312",
            address: "Trung Tâm Dạy Nghề & Giáo Dục Thường Xuyên Huyện An Phú",
            city: "An Giang",
            district: "Huyện An Phú",
            ward: "Thị Trấn An Phú",
        },
        items: [
            {
                id: 1,
                name: "Set 3 cuộn túi đựng rác tự phân hủy sinh học",
                price: 9500,
                quantity: 2,
                image: "https://res.cloudinary.com/digtjnoh3/image/upload/v1740147420/u72kxxkaiedgkvh4swbl.jpg",
                variant: "Set - 3 cuộn",
            },
            {
                id: 2,
                name: "Rau cải ngọt hữu cơ (500g)",
                price: 35000,
                quantity: 1,
                image: "/placeholder.svg?height=200&width=200",
                variant: "Gói 500g",
            },
            {
                id: 3,
                name: "Táo Envy New Zealand size 70-80 (1kg)",
                price: 185000,
                quantity: 1,
                image: "/placeholder.svg?height=200&width=200",
                variant: "Hộp 1kg",
            },
        ],
    }

    return <OrderSuccess {...orderDetails} />
}

