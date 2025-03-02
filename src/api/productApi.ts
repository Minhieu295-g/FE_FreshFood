import axios from "axios";
import {ProductDefault} from "../types/productDefault";
import {Product} from "../types/product";
import {LoaderFunctionArgs} from "react-router-dom";
import {ApiResponse, PaginatedResponse, SearchParams} from "../types/api";

export const fetchProductDefault = async (): Promise<ProductDefault[]> => {
    const response = await axios.get(`http://localhost:80/product/list-default`);
    if (response.status === 200) {
        return response.data.data.items;
    }
    throw new Error(response.data.message || "Lỗi không xác định từ API");
}
export const FetchProductById = async ({ params }: LoaderFunctionArgs): Promise<Product> => {
    const { id } = params;

    if (!id) throw new Error('ID sản phẩm không hợp lệ.');

    const response = await axios.get(`http://localhost:80/product/${id}`);

    if (response.status === 200) {
        console.log(response.data);
        return response.data.data; // Đảm bảo trả về đúng Product
    }

    throw new Error('Không tìm thấy sản phẩm.');
};

export const fetchProductsBySearch = async (
    params: SearchParams
): Promise<ApiResponse<PaginatedResponse<ProductDefault>>> => {

    // Chuyển đổi params thành URLSearchParams để xử lý mảng
    const queryParams = new URLSearchParams();

    // Xử lý mảng product[]
    params.product?.forEach((product) => queryParams.append('product', product));

    // Xử lý mảng category[]
    params.category?.forEach((category) => queryParams.append('category', category));

    // Xử lý mảng productVariant[]
    params.productVariant?.forEach((variant) => queryParams.append('productVariant', variant));

    // Xử lý các tham số đơn lẻ
    if (params.sort) queryParams.append('sort', params.sort);
    if (params.size) queryParams.append('size', params.size.toString());
    if (params.page) queryParams.append('page', params.page.toString());
    console.log("params: " + params.product + params.productVariant + params.category);
    try {
        const response = await axios.get<ApiResponse<PaginatedResponse<ProductDefault>>>(
            `http://localhost:80/product/list-with-search-product?${queryParams.toString()}`
        );

        console.log(response.data); // Xem phản hồi từ server
        return response.data;
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error; // Đảm bảo bắt lỗi ở nơi gọi hàm
    }
};
