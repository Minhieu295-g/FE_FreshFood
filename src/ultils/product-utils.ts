import {Product} from "../types/product";
import {Category} from "../types/category";

export const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
        maximumFractionDigits: 0,
    }).format(amount)
}

export const sampleCategories : Category[]  = [
    { id: 1, name: "Rau củ" },
    { id: 2, name: "Trái cây" },
    { id: 3, name: "Thịt" },
    { id: 4, name: "Đồ khô" },
    { id: 5, name: "Đồ uống" },
    { id: 6, name: "Đồ đông lạnh" },
    { id: 7, name: "Gia vị" },
]
const imageLink = "https://cdn.tgdd.vn/Files/2021/08/17/1375798/tong-hop-cac-loai-thit-bo-ngon-va-duoc-ua-chuong-nhat-o-viet-nam-202108171624038253.jpg";
// Sample data for demonstration
export const sampleProducts: Product[]
    = [
    {
        id: 1,
        name: "Táo Envy New Zealand",
        description:
            "Táo Envy New Zealand có vỏ màu đỏ đậm, thịt giòn, ngọt và ít chua. Táo giàu chất xơ, vitamin và khoáng chất.",
        thumbnailUrl: imageLink,
        category: sampleCategories[1],
        productImages: [
            { id: 1, imageUrl: imageLink, altText: "" },
            { id: 2, imageUrl: imageLink, altText: "" },
        ],
        productVariants: [
            {
                id: 1,
                name: "Hộp 1kg",
                price: 185000,
                discountPercentage: 0,
                thumbnailUrl: imageLink,
                unit: "hộp",
                expiredDate: "2024-06-30",
                status: "active",
            },
            {
                id: 2,
                name: "Hộp 2kg",
                price: 350000,
                discountPercentage: 5,
                thumbnailUrl: imageLink,
                unit: "hộp",
                expiredDate: "2024-06-30",
                status: "active",
            },
        ],
    },
    {
        id: 2,
        name: "Thịt heo hữu cơ",
        description: "Thịt heo hữu cơ được nuôi theo tiêu chuẩn organic, không sử dụng kháng sinh và hormone tăng trưởng.",
        thumbnailUrl: imageLink,
        category: sampleCategories[2],
        productImages: [
            { id: 1, imageUrl: imageLink, altText: "" },
            { id: 2, imageUrl: imageLink, altText: "" },
        ],        productVariants: [
            {
                id: 3,
                name: "Gói 500g",
                price: 89000,
                discountPercentage: 0,
                thumbnailUrl: imageLink,
                unit: "gói",
                expiredDate: "2024-04-15",
                status: "active",
            },
        ],
    },
    // Add more sample products as needed
]

