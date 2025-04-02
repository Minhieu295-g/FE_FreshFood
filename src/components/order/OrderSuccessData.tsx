import OrderSuccess from "../../components/order/OrderSuccess";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import {OrderSuccessProps} from "../../types/order";

export default function OrderSuccessPage() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const orderCode = queryParams.get("orderCode") || "";

    const initialOrderDetails: OrderSuccessProps = location.state?.orderDetails || JSON.parse(sessionStorage.getItem("orderDetails") || "{}");
    const [orderDetails, setOrderDetails] = useState<OrderSuccessProps>(initialOrderDetails);

    useEffect(() => {
        if (orderCode) {
            setOrderDetails((prevDetails) => ({
                ...(prevDetails as OrderSuccessProps), // Ép kiểu tránh lỗi TS
                orderNumber: orderCode,
            }));
        }
    }, [orderCode]);

    return <OrderSuccess {...orderDetails} />;
}
